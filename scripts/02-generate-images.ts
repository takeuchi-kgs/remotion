import "dotenv/config";
import * as fs from "node:fs";
import { SlidesFileSchema } from "../src/schemas/slide.js";
import { generateSlideImage } from "../lib/gemini/imagen.js";

const slidesPath = process.argv[2] || "data/output/slides.json";
const force = process.argv.includes("--force");

async function main() {
  console.log("=== Step 2: Generate Images ===");
  console.log(`Slides: ${slidesPath}`);

  const raw = fs.readFileSync(slidesPath, "utf-8");
  const slidesFile = SlidesFileSchema.parse(JSON.parse(raw));

  const toGenerate = slidesFile.slides.filter(
    (s) => s.image?.source === "generate",
  );

  if (toGenerate.length === 0) {
    console.log("No images to generate.");
    return;
  }

  console.log(`Found ${toGenerate.length} image(s) to generate.`);

  for (const slide of toGenerate) {
    if (slide.image?.source !== "generate") continue;

    const outputPath = `data/output/images/scene-${String(slide.sceneIndex).padStart(3, "0")}-slide.png`;

    if (!force && fs.existsSync(outputPath)) {
      console.log(`  Skipping (exists): ${outputPath}`);
      continue;
    }

    console.log(`  Generating image for scene ${slide.sceneIndex}: "${slide.image.prompt}"`);
    await generateSlideImage(slide.image.prompt, outputPath);
  }

  console.log("Done.\n");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
