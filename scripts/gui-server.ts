import "dotenv/config";
import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawn } from "node:child_process";
import {
  genericParse,
  flattenSections,
} from "../lib/md-converter/generic-parser";
import { planScenes } from "../lib/md-converter/scene-planner";
import {
  buildScenePrompt,
  getSystemInstruction,
} from "../lib/md-converter/prompt";
import { assembleScriptFromGeneric } from "../lib/md-converter/assembler";
import { generateJSON } from "../lib/gemini/text";
import { getLLMConfig, setLLMConfig } from "../lib/llm/provider";
import type { LLMConfig } from "../lib/llm/provider";
import type { BlockConversion } from "../lib/md-converter/types";
import { DEFAULT_SPEAKERS } from "../lib/voicevox/speaker";
import type { SpeakerMapping } from "../lib/voicevox/speaker";

const PORT = Number(process.env.PORT) || 3456;

// Speaker config (mutable at runtime)
let speakerConfig: SpeakerMapping = { ...DEFAULT_SPEAKERS };
const PROJECT_ROOT = path.resolve(import.meta.dirname, "..");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sendSSE(
  res: http.ServerResponse,
  event: string,
  data: unknown,
): void {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

function setCorsHeaders(res: http.ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function jsonResponse(
  res: http.ServerResponse,
  statusCode: number,
  data: unknown,
): void {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function sseHeaders(res: http.ServerResponse): void {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
}

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

/** GET / — serve gui/index.html */
function handleIndex(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  const htmlPath = path.join(PROJECT_ROOT, "gui", "index.html");
  if (!fs.existsSync(htmlPath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("gui/index.html not found");
    return;
  }
  const html = fs.readFileSync(htmlPath, "utf-8");
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

/** GET /api/files — list files in data/input/ */
function handleGetFiles(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  const inputDir = path.join(PROJECT_ROOT, "data", "input");
  if (!fs.existsSync(inputDir)) {
    jsonResponse(res, 200, { files: [] });
    return;
  }

  const entries = fs.readdirSync(inputDir);
  const files = entries.map((name) => {
    const filePath = path.join(inputDir, name);
    const stat = fs.statSync(filePath);
    return {
      name,
      size: stat.size,
      modified: stat.mtime.toISOString(),
    };
  });

  jsonResponse(res, 200, { files });
}

/** GET /api/script — read data/input/script.json */
function handleGetScript(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  const scriptPath = path.join(PROJECT_ROOT, "data", "input", "script.json");
  if (!fs.existsSync(scriptPath)) {
    jsonResponse(res, 404, { error: "script.json not found" });
    return;
  }
  const content = fs.readFileSync(scriptPath, "utf-8");
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(content);
}

/** POST /api/script — save body as data/input/script.json */
async function handlePostScript(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const body = await readBody(req);
  const scriptPath = path.join(PROJECT_ROOT, "data", "input", "script.json");
  const dir = path.dirname(scriptPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(scriptPath, body);

  // Sync to public/data/ for Remotion Studio preview
  const publicDataDir = path.join(PROJECT_ROOT, "public", "data");
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }
  fs.copyFileSync(scriptPath, path.join(publicDataDir, "script.json"));

  jsonResponse(res, 200, { success: true });
}

/** POST /api/convert — SSE stream for markdown conversion */
async function handleConvert(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  setCorsHeaders(res);
  sseHeaders(res);

  try {
    const body = await readBody(req);
    const { content, title } = JSON.parse(body) as {
      content: string;
      title?: string;
    };

    // Step 1: Parse markdown
    const doc = genericParse(content);
    if (title) {
      doc.title = title;
    }
    sendSSE(res, "progress", {
      step: "parsing",
      message: `パース完了: ${doc.sections.length} セクション`,
    });

    // Step 2: Plan scenes
    const scenePlans = await planScenes(doc);
    sendSSE(res, "progress", {
      step: "planning",
      message: `シーン計画完了: ${scenePlans.length} シーン`,
    });

    // Step 3: Convert each scene
    const systemInstruction = getSystemInstruction();
    const flat = flattenSections(doc.sections);
    const flatSections = flat.map(({ section }) => section);
    const conversions: BlockConversion[] = [];

    for (let i = 0; i < scenePlans.length; i++) {
      const plan = scenePlans[i];
      sendSSE(res, "progress", {
        step: "converting",
        message: `[${i + 1}/${scenePlans.length}] ${plan.sceneTitle}`,
        current: i + 1,
        total: scenePlans.length,
      });

      const prompt = buildScenePrompt(flatSections, plan, {
        documentTitle: doc.title,
        totalScenes: scenePlans.length,
        scenePosition: i,
      });

      const result = await generateJSON<BlockConversion>(
        prompt,
        systemInstruction,
      );
      if (!result || typeof result !== "object") {
        console.error(`  Scene ${i + 1}: invalid LLM response`, result);
        throw new Error(`シーン ${i + 1} の変換結果が不正です`);
      }
      // lines がない場合はデフォルト空配列を付与
      if (!result.lines) {
        result.lines = [];
      }
      conversions.push(result);
    }

    // Step 4: Assemble script
    const script = assembleScriptFromGeneric(doc, conversions);

    // Step 5: Save to file
    const scriptPath = path.join(PROJECT_ROOT, "data", "input", "script.json");
    const dir = path.dirname(scriptPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2));

    // Sync to public/data/ for Remotion Studio preview
    const publicDataDir = path.join(PROJECT_ROOT, "public", "data");
    if (!fs.existsSync(publicDataDir)) {
      fs.mkdirSync(publicDataDir, { recursive: true });
    }
    fs.copyFileSync(scriptPath, path.join(publicDataDir, "script.json"));

    // Step 6: Send complete
    sendSSE(res, "progress", {
      step: "complete",
      script,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Convert error:", error);
    sendSSE(res, "progress", {
      step: "error",
      message,
    });
  }

  res.end();
}

/**
 * Sync pipeline outputs to public/ so Remotion Studio can preview them.
 * Called after each successful pipeline step.
 */
function syncToPublic(
  stepNumber: number,
  res: http.ServerResponse,
): void {
  try {
    const publicData = path.join(PROJECT_ROOT, "public", "data");
    if (!fs.existsSync(publicData)) fs.mkdirSync(publicData, { recursive: true });

    // Always sync script.json and config files if they exist
    const scriptSrc = path.join(PROJECT_ROOT, "data", "input", "script.json");
    if (fs.existsSync(scriptSrc)) {
      fs.copyFileSync(scriptSrc, path.join(publicData, "script.json"));
    }
    const avatarConfigSrc = path.join(PROJECT_ROOT, "data", "input", "avatar-config.json");
    if (fs.existsSync(avatarConfigSrc)) {
      fs.copyFileSync(avatarConfigSrc, path.join(publicData, "avatar-config.json"));
    }
    const timingConfigSrc = path.join(PROJECT_ROOT, "data", "input", "timing-config.json");
    if (fs.existsSync(timingConfigSrc)) {
      fs.copyFileSync(timingConfigSrc, path.join(publicData, "timing-config.json"));
    }

    // After step 3 (audio): sync manifest + audio files
    if (stepNumber >= 3) {
      const audioOutputDir = path.join(PROJECT_ROOT, "data", "output", "audio");
      const manifestSrc = path.join(audioOutputDir, "manifest.json");
      if (fs.existsSync(manifestSrc)) {
        fs.copyFileSync(manifestSrc, path.join(publicData, "manifest.json"));
      }

      // Copy WAV files to public/audio/
      const publicAudio = path.join(PROJECT_ROOT, "public", "audio");
      if (fs.existsSync(audioOutputDir)) {
        if (!fs.existsSync(publicAudio)) fs.mkdirSync(publicAudio, { recursive: true });
        const wavFiles = fs.readdirSync(audioOutputDir).filter((f) => f.endsWith(".wav"));
        for (const file of wavFiles) {
          fs.copyFileSync(path.join(audioOutputDir, file), path.join(publicAudio, file));
        }
        if (wavFiles.length > 0) {
          sendSSE(res, "progress", {
            step: "log",
            message: `[Sync] ${wavFiles.length}個の音声ファイルをpublic/audio/へ同期しました`,
          });
        }
      }
    }

    sendSSE(res, "progress", {
      step: "log",
      message: "[Sync] Remotion Studioプレビュー用にpublic/へ同期しました",
    });
  } catch (err) {
    sendSSE(res, "progress", {
      step: "log",
      message: `[Sync] 同期中にエラー: ${(err as Error).message}`,
    });
  }
}

/** POST /api/pipeline/:step — SSE stream for pipeline step execution */
async function handlePipeline(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  stepNumber: number,
): Promise<void> {
  setCorsHeaders(res);
  sseHeaders(res);

  const stepScripts: Record<number, string> = {
    1: "scripts/01-extract-slides.ts",
    2: "scripts/02-generate-images.ts",
    3: "scripts/03-generate-audio.ts",
    4: "scripts/04-render-video.ts",
  };

  const scriptFile = stepScripts[stepNumber];
  if (!scriptFile) {
    sendSSE(res, "progress", {
      step: "error",
      message: `Invalid step number: ${stepNumber}. Must be 1-4.`,
    });
    res.end();
    return;
  }

  const child = spawn("npx", ["tsx", scriptFile], {
    cwd: PROJECT_ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      SPEAKER_LEFT: String(speakerConfig.left),
      SPEAKER_RIGHT: String(speakerConfig.right),
    },
  });

  let stdoutBuffer = "";
  child.stdout.on("data", (data: Buffer) => {
    stdoutBuffer += data.toString();
    const lines = stdoutBuffer.split("\n");
    stdoutBuffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.trim()) {
        sendSSE(res, "progress", { step: "log", message: line });
      }
    }
  });

  let stderrBuffer = "";
  child.stderr.on("data", (data: Buffer) => {
    stderrBuffer += data.toString();
    const lines = stderrBuffer.split("\n");
    stderrBuffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.trim()) {
        sendSSE(res, "progress", { step: "log", message: line });
      }
    }
  });

  child.on("close", (code) => {
    // Flush remaining buffered content
    if (stdoutBuffer.trim()) {
      sendSSE(res, "progress", { step: "log", message: stdoutBuffer });
    }
    if (stderrBuffer.trim()) {
      sendSSE(res, "progress", { step: "log", message: stderrBuffer });
    }

    if (code === 0) {
      // Sync outputs to public/ for Remotion Studio preview
      syncToPublic(stepNumber, res);
      sendSSE(res, "progress", { step: "complete" });
    } else {
      sendSSE(res, "progress", {
        step: "error",
        message: `Process exited with code ${code}`,
      });
    }
    res.end();
  });

  child.on("error", (err) => {
    sendSSE(res, "progress", {
      step: "error",
      message: err.message,
    });
    res.end();
  });
}

// ---------------------------------------------------------------------------
// Request handler
// ---------------------------------------------------------------------------

const server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    setCorsHeaders(res);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
    const pathname = url.pathname;

    try {
      // GET /
      if (req.method === "GET" && pathname === "/") {
        handleIndex(req, res);
        return;
      }

      // GET /api/files
      if (req.method === "GET" && pathname === "/api/files") {
        handleGetFiles(req, res);
        return;
      }

      // GET /api/script
      if (req.method === "GET" && pathname === "/api/script") {
        handleGetScript(req, res);
        return;
      }

      // POST /api/script
      if (req.method === "POST" && pathname === "/api/script") {
        await handlePostScript(req, res);
        return;
      }

      // GET /api/llm-config
      if (req.method === "GET" && pathname === "/api/llm-config") {
        jsonResponse(res, 200, getLLMConfig());
        return;
      }

      // POST /api/llm-config
      if (req.method === "POST" && pathname === "/api/llm-config") {
        const body = await readBody(req);
        const config = JSON.parse(body) as Partial<LLMConfig>;
        setLLMConfig(config);
        jsonResponse(res, 200, { success: true, config: getLLMConfig() });
        return;
      }

      // GET /api/speakers — fetch available speakers from VOICEVOX
      if (req.method === "GET" && pathname === "/api/speakers") {
        try {
          const vvUrl = process.env.VOICEVOX_BASE_URL || "http://127.0.0.1:50021";
          const speakersRes = await fetch(`${vvUrl}/speakers`);
          if (!speakersRes.ok) throw new Error("VOICEVOX not reachable");
          const speakers = await speakersRes.json();
          jsonResponse(res, 200, { speakers, config: speakerConfig });
        } catch {
          jsonResponse(res, 200, { speakers: [], config: speakerConfig, error: "VOICEVOX未接続" });
        }
        return;
      }

      // POST /api/speakers — save speaker config
      if (req.method === "POST" && pathname === "/api/speakers") {
        const body = await readBody(req);
        const parsed = JSON.parse(body) as Partial<SpeakerMapping>;
        if (parsed.left !== undefined) speakerConfig.left = parsed.left;
        if (parsed.right !== undefined) speakerConfig.right = parsed.right;
        jsonResponse(res, 200, { success: true, config: speakerConfig });
        return;
      }

      // GET /api/timing — load timing config
      if (req.method === "GET" && pathname === "/api/timing") {
        const configPath = path.resolve("public/data/timing-config.json");
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
          jsonResponse(res, 200, config);
        } else {
          jsonResponse(res, 200, { lineGapFrames: 0, sceneBufferFrames: 15 });
        }
        return;
      }

      // POST /api/timing — save timing config
      if (req.method === "POST" && pathname === "/api/timing") {
        const body = await readBody(req);
        const config = JSON.parse(body);
        const dataDir = path.resolve("public/data");
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(
          path.resolve(dataDir, "timing-config.json"),
          JSON.stringify(config, null, 2),
        );
        // Also save to data/input for render script
        const inputDir = path.resolve("data/input");
        if (!fs.existsSync(inputDir)) fs.mkdirSync(inputDir, { recursive: true });
        fs.writeFileSync(
          path.resolve(inputDir, "timing-config.json"),
          JSON.stringify(config, null, 2),
        );
        jsonResponse(res, 200, { success: true, config });
        return;
      }

      // GET /api/avatars — list available avatars + current config
      if (req.method === "GET" && pathname === "/api/avatars") {
        const avatarsDir = path.resolve(PROJECT_ROOT, "public/images/characters/avatars");
        const avatars: { id: string; name: string }[] = [];
        if (fs.existsSync(avatarsDir)) {
          for (const entry of fs.readdirSync(avatarsDir, { withFileTypes: true })) {
            if (!entry.isDirectory()) continue;
            const metaPath = path.join(avatarsDir, entry.name, "meta.json");
            if (fs.existsSync(metaPath)) {
              try {
                const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
                avatars.push({ id: meta.id || entry.name, name: meta.name || entry.name });
              } catch {
                avatars.push({ id: entry.name, name: entry.name });
              }
            } else {
              avatars.push({ id: entry.name, name: entry.name });
            }
          }
        }
        const configPath = path.resolve(PROJECT_ROOT, "public/data/avatar-config.json");
        let config: { left?: string; right?: string } = {};
        if (fs.existsSync(configPath)) {
          try { config = JSON.parse(fs.readFileSync(configPath, "utf-8")); } catch { /* ignore */ }
        }
        jsonResponse(res, 200, { avatars, config });
        return;
      }

      // POST /api/avatars — save avatar config
      if (req.method === "POST" && pathname === "/api/avatars") {
        const body = await readBody(req);
        const config = JSON.parse(body) as { left?: string; right?: string };
        const dataDir = path.resolve(PROJECT_ROOT, "public/data");
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(
          path.resolve(dataDir, "avatar-config.json"),
          JSON.stringify(config, null, 2),
        );
        // Also save to data/input for render script
        const inputDir = path.resolve(PROJECT_ROOT, "data/input");
        if (!fs.existsSync(inputDir)) fs.mkdirSync(inputDir, { recursive: true });
        fs.writeFileSync(
          path.resolve(inputDir, "avatar-config.json"),
          JSON.stringify(config, null, 2),
        );
        jsonResponse(res, 200, { success: true, config });
        return;
      }

      // Serve avatar preview images
      if (req.method === "GET" && pathname.startsWith("/avatars/")) {
        const imgPath = path.join(PROJECT_ROOT, "public/images/characters", pathname);
        if (fs.existsSync(imgPath)) {
          const ext = path.extname(imgPath).toLowerCase();
          const mime = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "application/octet-stream";
          res.writeHead(200, { "Content-Type": mime });
          fs.createReadStream(imgPath).pipe(res);
        } else {
          res.writeHead(404);
          res.end("Not found");
        }
        return;
      }

      // POST /api/convert
      if (req.method === "POST" && pathname === "/api/convert") {
        await handleConvert(req, res);
        return;
      }

      // POST /api/pipeline/:step
      const pipelineMatch = pathname.match(/^\/api\/pipeline\/(\d+)$/);
      if (req.method === "POST" && pipelineMatch) {
        const stepNumber = Number(pipelineMatch[1]);
        await handlePipeline(req, res, stepNumber);
        return;
      }

      // 404
      jsonResponse(res, 404, { error: "Not found" });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error handling ${req.method} ${pathname}:`, message);
      jsonResponse(res, 500, { error: message });
    }
  },
);

server.listen(PORT, () => {
  console.log(`GUI server running at http://localhost:${PORT}`);
});
