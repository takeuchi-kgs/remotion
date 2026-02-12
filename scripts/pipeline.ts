import { execSync } from "node:child_process";

const skipConvert = process.argv.includes("--skip-convert");
const skipImages = process.argv.includes("--skip-images");
const skipAudio = process.argv.includes("--skip-audio");
const skipRender = process.argv.includes("--skip-render");

// .md ファイル引数があればStep 0の入力として使う
const mdInput = process.argv.find((a) => a.endsWith(".md"));

function run(label: string, command: string) {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Running: ${label}`);
  console.log(`${"=".repeat(50)}\n`);
  execSync(command, { stdio: "inherit" });
}

function main() {
  console.log("=== Remotion Explainer Video Pipeline ===\n");

  if (mdInput && !skipConvert) {
    run(
      "Step 0: Convert Markdown to Script",
      `npx tsx scripts/00-convert-md.ts ${mdInput}`,
    );
  } else if (!mdInput) {
    console.log("No .md input provided, skipping Step 0 (convert-md)\n");
  } else {
    console.log("Skipping markdown conversion (--skip-convert)\n");
  }

  run("Step 1: Extract Slides", "npx tsx scripts/01-extract-slides.ts");

  if (!skipImages) {
    run("Step 2: Generate Images", "npx tsx scripts/02-generate-images.ts");
  } else {
    console.log("\nSkipping image generation (--skip-images)");
  }

  if (!skipAudio) {
    run("Step 3: Generate Audio", "npx tsx scripts/03-generate-audio.ts");
  } else {
    console.log("\nSkipping audio generation (--skip-audio)");
  }

  if (!skipRender) {
    run("Step 4: Render Video", "npx tsx scripts/04-render-video.ts");
  } else {
    console.log("\nSkipping video render (--skip-render)");
  }

  console.log("\n=== Pipeline Complete ===");
}

main();
