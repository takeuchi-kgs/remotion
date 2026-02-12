import { describe, it, expect } from "vitest";
import { ScriptSchema } from "../../src/schemas/script";
import { SlidesFileSchema } from "../../src/schemas/slide";
import fixture from "../fixtures/script.json";

describe("extract-slides logic", () => {
  it("extracts slides from valid script", () => {
    const script = ScriptSchema.parse(fixture);
    const slides = script.scenes.map((scene, i) => ({
      sceneIndex: i,
      ...scene.slide,
    }));

    expect(slides).toHaveLength(3);
    expect(slides[0].type).toBe("title");
    expect(slides[0].sceneIndex).toBe(0);
    expect(slides[1].type).toBe("steps");
    expect(slides[2].type).toBe("summary");
  });

  it("produces valid SlidesFile output", () => {
    const script = ScriptSchema.parse(fixture);
    const slides = script.scenes.map((scene, i) => ({
      sceneIndex: i,
      ...scene.slide,
    }));

    const output = {
      generatedAt: new Date().toISOString(),
      scriptHash: "test-hash",
      slides,
    };

    const result = SlidesFileSchema.safeParse(output);
    expect(result.success).toBe(true);
  });

  it("preserves slide properties correctly", () => {
    const script = ScriptSchema.parse(fixture);
    const titleScene = script.scenes[0];
    expect(titleScene.slide.type).toBe("title");
    expect(titleScene.slide.title).toBe("AIで解説動画を作る方法");
    expect(titleScene.slide.subtitle).toBe("メモから動画まで全自動");

    const stepsScene = script.scenes[1];
    expect(stepsScene.slide.items).toEqual([
      "メモを書く",
      "台本を生成",
      "画像・音声を生成",
      "動画をレンダリング",
    ]);
  });
});
