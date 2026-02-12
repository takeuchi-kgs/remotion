import * as path from "node:path";
import * as fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { calculateTimings } from "../src/utils/timing";
import type { AudioManifest } from "../src/utils/timing";
import type { Script } from "../src/schemas/script";

const outputPath = process.argv[2] || "data/output/video/output.mp4";

async function main() {
  console.log("=== Step 4: Render Video ===");

  // Load actual production data
  const scriptPath = path.resolve("data/input/script.json");
  const manifestPath = path.resolve("data/output/audio/manifest.json");

  if (!fs.existsSync(scriptPath)) {
    throw new Error(`script.json not found: ${scriptPath}`);
  }

  const script: Script = JSON.parse(fs.readFileSync(scriptPath, "utf-8"));

  let audioManifest: AudioManifest | undefined;
  if (fs.existsSync(manifestPath)) {
    audioManifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  } else {
    console.warn("Warning: audio manifest not found, using default durations");
  }

  // Load timing config if available
  const timingConfigPath = path.resolve("data/input/timing-config.json");
  let timingConfig: { lineGapFrames?: number; sceneBufferFrames?: number } = {};
  if (fs.existsSync(timingConfigPath)) {
    timingConfig = JSON.parse(fs.readFileSync(timingConfigPath, "utf-8"));
  }

  // Load avatar config if available
  const avatarConfigPath = path.resolve("data/input/avatar-config.json");
  let avatarConfig: { left?: string; right?: string } = {};
  if (fs.existsSync(avatarConfigPath)) {
    avatarConfig = JSON.parse(fs.readFileSync(avatarConfigPath, "utf-8"));
  }

  // Calculate actual duration from real data
  const linesPerScene = script.scenes.map((s) => s.lines.length);
  const { totalFrames } = calculateTimings(
    script.scenes.length,
    linesPerScene,
    audioManifest,
    timingConfig,
  );

  console.log(
    `Script: ${script.scenes.length} scenes, ${linesPerScene.reduce((a, b) => a + b, 0)} lines`,
  );
  console.log(`Duration: ${totalFrames} frames (${(totalFrames / 30).toFixed(1)}s)`);

  // Copy audio files to public/audio/ so Remotion can access them via staticFile()
  const audioSrc = path.resolve("data/output/audio");
  const audioDest = path.resolve("public/audio");
  if (fs.existsSync(audioSrc)) {
    if (!fs.existsSync(audioDest)) {
      fs.mkdirSync(audioDest, { recursive: true });
    }
    const audioFiles = fs.readdirSync(audioSrc).filter((f) => f.endsWith(".wav"));
    console.log(`Copying ${audioFiles.length} audio files to public/audio/`);
    for (const file of audioFiles) {
      fs.copyFileSync(path.join(audioSrc, file), path.join(audioDest, file));
    }
  }

  const entryPoint = path.resolve("src/index.ts");
  console.log("Bundling...");
  const bundleLocation = await bundle({
    entryPoint,
    onProgress: (progress) => {
      if (progress % 25 === 0) {
        console.log(`  Bundle progress: ${progress}%`);
      }
    },
  });

  const inputProps = {
    script,
    audioManifest: audioManifest || { fps: 30, files: [] },
    lineGapFrames: timingConfig.lineGapFrames,
    sceneBufferFrames: timingConfig.sceneBufferFrames,
    avatarLeft: avatarConfig.left,
    avatarRight: avatarConfig.right,
  };

  console.log("Selecting composition...");
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "ExplainerVideo",
    inputProps,
  });

  // Override duration with actual calculated value
  composition.durationInFrames = totalFrames;

  console.log(
    `Rendering: ${composition.durationInFrames} frames at ${composition.fps}fps`,
  );
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct % 10 === 0) {
        process.stdout.write(`\r  Render progress: ${pct}%`);
      }
    },
  });

  console.log(`\nOutput: ${outputPath}`);
  console.log("Done.\n");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
