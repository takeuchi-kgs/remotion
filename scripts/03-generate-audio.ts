import * as fs from "node:fs";
import * as path from "node:path";
import { ScriptSchema } from "../src/schemas/script.js";
import { checkHealth, generateVoice } from "../lib/voicevox/client.js";
import { getSpeakerId, DEFAULT_SPEAKERS } from "../lib/voicevox/speaker.js";

const inputPath = process.argv[2] || "data/input/script.json";
const outputDir = "data/output/audio";
const manifestPath = path.join(outputDir, "manifest.json");

type ManifestEntry = {
  scene: number;
  line: number;
  speaker: string;
  text: string;
  path: string;
  durationSeconds: number;
  durationFrames: number;
};

const FPS = 30;

// Support speaker override via env vars (set by GUI server)
const speakers = {
  left: process.env.SPEAKER_LEFT ? Number(process.env.SPEAKER_LEFT) : DEFAULT_SPEAKERS.left,
  right: process.env.SPEAKER_RIGHT ? Number(process.env.SPEAKER_RIGHT) : DEFAULT_SPEAKERS.right,
};

async function main() {
  console.log("=== Step 3: Generate Audio ===");
  console.log(`Input: ${inputPath}`);
  console.log(`Speakers: left=${speakers.left}, right=${speakers.right}`);

  // Health check
  const healthy = await checkHealth();
  if (!healthy) {
    console.error("VOICEVOX Engine is not running at http://127.0.0.1:50021");
    console.error("Please start VOICEVOX Engine and try again.");
    process.exit(1);
  }
  console.log("VOICEVOX Engine: OK");

  const raw = fs.readFileSync(inputPath, "utf-8");
  const script = ScriptSchema.parse(JSON.parse(raw));

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const manifest: ManifestEntry[] = [];

  for (let sceneIdx = 0; sceneIdx < script.scenes.length; sceneIdx++) {
    const scene = script.scenes[sceneIdx];
    console.log(`Scene ${sceneIdx}: ${scene.title}`);

    for (let lineIdx = 0; lineIdx < scene.lines.length; lineIdx++) {
      const line = scene.lines[lineIdx];
      const filename = `scene-${String(sceneIdx).padStart(3, "0")}-line-${String(lineIdx).padStart(3, "0")}.wav`;
      const filePath = path.join(outputDir, filename);
      const speakerId = getSpeakerId(line.speaker, speakers);

      const durationSeconds = await generateVoice(line.text, speakerId, filePath);
      const durationFrames = Math.ceil(durationSeconds * FPS);

      manifest.push({
        scene: sceneIdx,
        line: lineIdx,
        speaker: line.speaker,
        text: line.text,
        path: `audio/${filename}`,
        durationSeconds,
        durationFrames,
      });
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify({ fps: FPS, files: manifest }, null, 2));

  // Sync to public/data/ for Remotion Studio preview
  const publicDataDir = "public/data";
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }
  fs.copyFileSync(manifestPath, path.join(publicDataDir, "manifest.json"));

  console.log(`\nManifest: ${manifestPath} (${manifest.length} entries)`);
  console.log("Done.\n");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
