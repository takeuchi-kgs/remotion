import { describe, it, expect } from "vitest";
import { SlideDefinitionSchema, SlidesFileSchema, ImageSourceSchema } from "../../../src/schemas/slide";

describe("SlideDefinitionSchema", () => {
  it("validates a title slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 0,
      type: "title",
      title: "テスト",
      subtitle: "サブタイトル",
    });
    expect(result.success).toBe(true);
  });

  it("validates a list slide with items", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 1,
      type: "list",
      title: "一覧",
      items: ["項目1", "項目2"],
    });
    expect(result.success).toBe(true);
  });

  it("validates a table slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 2,
      type: "table",
      title: "比較",
      tableHeaders: ["A", "B"],
      tableRows: [["1", "2"]],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid slide type", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 0,
      type: "unknown",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing sceneIndex", () => {
    const result = SlideDefinitionSchema.safeParse({
      type: "title",
    });
    expect(result.success).toBe(false);
  });

  it("validates a bridge slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 3,
      type: "bridge",
      title: "橋渡し",
    });
    expect(result.success).toBe(true);
  });

  it("validates a quote slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 4,
      type: "quote",
      title: "引用",
    });
    expect(result.success).toBe(true);
  });

  it("validates a definition slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 5,
      type: "definition",
      title: "定義",
    });
    expect(result.success).toBe(true);
  });

  it("validates a highlight slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 6,
      type: "highlight",
      title: "ハイライト",
    });
    expect(result.success).toBe(true);
  });

  it("validates a tips slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 7,
      type: "tips",
      title: "ヒント",
      items: ["ヒント1", "ヒント2"],
    });
    expect(result.success).toBe(true);
  });

  it("validates a warning slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 8,
      type: "warning",
      title: "警告",
    });
    expect(result.success).toBe(true);
  });

  it("validates a comparison slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 9,
      type: "comparison",
      title: "比較",
    });
    expect(result.success).toBe(true);
  });

  it("validates a stat slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 10,
      type: "stat",
      title: "統計",
    });
    expect(result.success).toBe(true);
  });

  it("validates a checklist slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 11,
      type: "checklist",
      title: "チェックリスト",
      items: ["項目1", "項目2"],
    });
    expect(result.success).toBe(true);
  });

  it("validates a before-after slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 12,
      type: "before-after",
      title: "前後比較",
    });
    expect(result.success).toBe(true);
  });

  it("validates a code slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 13,
      type: "code",
      title: "コード",
    });
    expect(result.success).toBe(true);
  });

  it("validates a qa slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 14,
      type: "qa",
      title: "Q&A",
    });
    expect(result.success).toBe(true);
  });

  it("validates a two-column slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 15,
      type: "two-column",
      title: "2列",
    });
    expect(result.success).toBe(true);
  });

  it("validates an agenda slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 16,
      type: "agenda",
      title: "アジェンダ",
      items: ["トピック1", "トピック2"],
    });
    expect(result.success).toBe(true);
  });

  it("validates a gallery slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 17,
      type: "gallery",
      title: "ギャラリー",
    });
    expect(result.success).toBe(true);
  });

  it("validates a process slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 18,
      type: "process",
      title: "プロセス",
      items: ["ステップ1", "ステップ2"],
    });
    expect(result.success).toBe(true);
  });

  it("validates a profile slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 19,
      type: "profile",
      title: "プロフィール",
    });
    expect(result.success).toBe(true);
  });

  it("validates a metrics slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 20,
      type: "metrics",
      title: "メトリクス",
    });
    expect(result.success).toBe(true);
  });

  it("validates an icon-list slide", () => {
    const result = SlideDefinitionSchema.safeParse({
      sceneIndex: 21,
      type: "icon-list",
      title: "アイコンリスト",
    });
    expect(result.success).toBe(true);
  });
});

describe("ImageSourceSchema", () => {
  it("validates generate source", () => {
    const result = ImageSourceSchema.safeParse({
      source: "generate",
      prompt: "猫のイラスト",
    });
    expect(result.success).toBe(true);
  });

  it("validates static source", () => {
    const result = ImageSourceSchema.safeParse({
      source: "static",
      path: "/images/cat.png",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid source type", () => {
    const result = ImageSourceSchema.safeParse({
      source: "url",
      url: "https://example.com",
    });
    expect(result.success).toBe(false);
  });
});

describe("SlidesFileSchema", () => {
  it("validates a complete slides file", () => {
    const result = SlidesFileSchema.safeParse({
      generatedAt: "2026-01-01T00:00:00Z",
      scriptHash: "abc123",
      slides: [
        { sceneIndex: 0, type: "title", title: "Test" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing generatedAt", () => {
    const result = SlidesFileSchema.safeParse({
      scriptHash: "abc",
      slides: [],
    });
    expect(result.success).toBe(false);
  });
});
