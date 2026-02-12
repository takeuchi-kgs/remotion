import "dotenv/config";
import * as fs from "node:fs";
import { genericParse, flattenSections } from "../lib/md-converter/generic-parser";
import { planScenes } from "../lib/md-converter/scene-planner";
import { buildScenePrompt, getSystemInstruction } from "../lib/md-converter/prompt";
import { assembleScriptFromGeneric } from "../lib/md-converter/assembler";
import { generateJSON } from "../lib/gemini/text";
import type { BlockConversion, ScenePlan } from "../lib/md-converter/types";

const inputPath = process.argv[2] || "data/input/meeting_20260220.md";
const outputPath = process.argv[3] || "data/input/script.json";

async function main() {
  console.log("=== Step 0: Convert Markdown to Script ===\n");
  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}\n`);

  // ファイル存在確認
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  // Phase A: パース
  const mdContent = fs.readFileSync(inputPath, "utf-8");
  const doc = genericParse(mdContent);
  console.log(`Parsed: "${doc.title}" — ${doc.sections.length} sections found`);
  if (doc.summary) {
    console.log(`Summary: ${doc.summary.slice(0, 100)}${doc.summary.length > 100 ? "..." : ""}`);
  }
  console.log();

  // Phase B: シーン分割計画
  console.log("Planning scenes...");
  const scenePlans: ScenePlan[] = await planScenes(doc);
  console.log(`Planned: ${scenePlans.length} scenes`);
  for (const plan of scenePlans) {
    console.log(`  - ${plan.sceneTitle} [${plan.slideTypeHint}] (sections: ${plan.sectionIndices.join(", ")})`);
  }
  console.log();

  if (scenePlans.length === 0) {
    throw new Error("No scenes planned from the document");
  }

  // Phase C: 各シーンをGemini APIで変換
  const systemInstruction = getSystemInstruction();
  const flat = flattenSections(doc.sections);
  const flatSections = flat.map(({ section }) => section);
  const conversions: BlockConversion[] = [];

  for (let i = 0; i < scenePlans.length; i++) {
    const plan = scenePlans[i];
    console.log(
      `  [${i + 1}/${scenePlans.length}] Converting: ${plan.sceneTitle}`,
    );

    const prompt = buildScenePrompt(flatSections, plan, {
      documentTitle: doc.title,
      totalScenes: scenePlans.length,
      scenePosition: i,
    });

    try {
      const result = await generateJSON<BlockConversion>(
        prompt,
        systemInstruction,
      );
      conversions.push(result);
      console.log(
        `    -> ${result.slideType}: "${result.sceneTitle}" (${result.lines.length} lines)`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`    x Failed: ${message}`);
      // フォールバック: シンプルなlistスライドとして処理
      console.log(`    -> Using fallback (list slide)`);
      conversions.push({
        sceneTitle: plan.sceneTitle,
        slideType: "list",
        slideData: {
          title: plan.sceneTitle,
          items: ["（内容を手動で追加してください）"],
        },
        lines: [
          {
            speaker: "left" as const,
            text: plan.sceneTitle,
          },
        ],
        transition: "fade",
      });
    }
  }

  // Phase D: Script組立 + Zod検証
  console.log("\nAssembling script...");
  const script = assembleScriptFromGeneric(doc, conversions);

  // 出力ディレクトリ確認
  const outputDir = outputPath.substring(0, outputPath.lastIndexOf("/"));
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(script, null, 2));

  // Sync to public/data/ for Remotion Studio preview
  const publicDataDir = "public/data";
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }
  fs.copyFileSync(outputPath, `${publicDataDir}/script.json`);

  console.log(
    `\nOutput: ${outputPath} (${script.scenes.length} scenes)`,
  );
  console.log("Done.\n");
}

main().catch((err) => {
  console.error("\nError:", err instanceof Error ? err.message : err);
  process.exit(1);
});
