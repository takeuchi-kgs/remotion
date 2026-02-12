import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { ScriptSchema } from "../src/schemas/script.js";
import { SlidesFileSchema } from "../src/schemas/slide.js";

const inputPath = process.argv[2] || "data/input/script.json";
const outputPath = process.argv[3] || "data/output/slides.json";

function main() {
  console.log("=== Step 1: Extract Slides ===");
  console.log(`Input: ${inputPath}`);

  const raw = fs.readFileSync(inputPath, "utf-8");
  const script = ScriptSchema.parse(JSON.parse(raw));

  const scriptHash = crypto.createHash("md5").update(raw).digest("hex").slice(0, 8);

  const slides = script.scenes.map((scene, i) => ({
    sceneIndex: i,
    ...scene.slide,
  }));

  const slidesFile = {
    generatedAt: new Date().toISOString(),
    scriptHash,
    slides,
  };

  // Validate output
  SlidesFileSchema.parse(slidesFile);

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(slidesFile, null, 2));
  console.log(`Output: ${outputPath} (${slides.length} slides, hash: ${scriptHash})`);
  console.log("Done.\n");
}

main();
