import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  genericParse,
  flattenSections,
  summarizeSection,
} from "../../../lib/md-converter/generic-parser";

// フィクスチャ読み込み
const meetingPath = path.resolve("data/input/meeting_20260220.md");
const fundoshiPath = path.resolve("data/input/ふんどし.md");
const meetingContent = fs.readFileSync(meetingPath, "utf-8");
const fundoshiContent = fs.readFileSync(fundoshiPath, "utf-8");

describe("genericParse with meeting_20260220.md", () => {
  const doc = genericParse(meetingContent);

  it("extracts the document title from first H1", () => {
    expect(doc.title).toContain("プレゼン資料");
  });

  it("has empty frontmatter for this format", () => {
    expect(Object.keys(doc.frontmatter).length).toBe(0);
  });

  it("extracts multiple sections", () => {
    expect(doc.sections.length).toBeGreaterThanOrEqual(2);
  });

  it("preserves raw text", () => {
    expect(doc.rawText).toBe(meetingContent);
  });

  it("detects blockquote elements", () => {
    const flat = flattenSections(doc.sections);
    const hasBlockquote = flat.some((f) =>
      f.section.content.some((el) => el.kind === "blockquote"),
    );
    expect(hasBlockquote).toBe(true);
  });

  it("detects table elements", () => {
    const flat = flattenSections(doc.sections);
    const hasTable = flat.some((f) =>
      f.section.content.some((el) => el.kind === "table"),
    );
    expect(hasTable).toBe(true);
  });

  it("detects list elements", () => {
    const flat = flattenSections(doc.sections);
    const hasList = flat.some((f) =>
      f.section.content.some((el) => el.kind === "list"),
    );
    expect(hasList).toBe(true);
  });

  it("detects demo directives", () => {
    const flat = flattenSections(doc.sections);
    const hasDemo = flat.some((f) =>
      f.section.content.some((el) => el.kind === "demo"),
    );
    expect(hasDemo).toBe(true);
  });
});

describe("genericParse with ふんどし.md", () => {
  const doc = genericParse(fundoshiContent);

  it("extracts title from frontmatter", () => {
    expect(doc.title).toContain("ふんどし");
  });

  it("extracts summary from frontmatter", () => {
    expect(doc.summary).toContain("落下防止");
  });

  it("extracts frontmatter fields", () => {
    expect(doc.frontmatter.template).toBe("作業手順書");
    expect(doc.frontmatter.source).toBe("WisdomCraft");
  });

  it("extracts keywords from frontmatter", () => {
    expect(doc.frontmatter.keywords).toContain("ビニロン");
  });

  it("extracts main sections", () => {
    const flat = flattenSections(doc.sections);
    const titles = flat.map((f) => f.section.title);
    expect(titles).toContain("概要");
    expect(titles).toContain("準備物");
    expect(titles).toContain("作業手順");
  });

  it("detects numbered lists in 作業手順", () => {
    const flat = flattenSections(doc.sections);
    const procedureSection = flat.find(
      (f) => f.section.title === "作業手順",
    );
    expect(procedureSection).toBeDefined();
    const lists = procedureSection!.section.content.filter(
      (el) => el.kind === "list",
    );
    expect(lists.length).toBeGreaterThanOrEqual(1);
    // 10 numbered items + sub-items are spread across multiple list elements
    // (due to interspersed 💡 paragraphs breaking list continuity)
    const totalItems = lists.reduce(
      (sum, el) => sum + (el.kind === "list" ? el.items.length : 0),
      0,
    );
    expect(totalItems).toBeGreaterThanOrEqual(10);
  });

  it("preserves emoji markers in paragraphs", () => {
    const flat = flattenSections(doc.sections);
    const keyPoints = flat.find((f) =>
      f.section.title.includes("重要ポイント"),
    );
    expect(keyPoints).toBeDefined();
    const hasTipEmoji = keyPoints!.section.content.some(
      (el) => el.kind === "paragraph" && el.text.includes("💡"),
    );
    expect(hasTipEmoji).toBe(true);
  });

  it("detects FAQ subsections", () => {
    const flat = flattenSections(doc.sections);
    const faqSections = flat.filter((f) =>
      f.section.title.startsWith("Q:"),
    );
    expect(faqSections.length).toBeGreaterThanOrEqual(5);
  });

  it("detects nested list items (準備物)", () => {
    const flat = flattenSections(doc.sections);
    const prepSection = flat.find((f) =>
      f.section.title.includes("準備物"),
    );
    expect(prepSection).toBeDefined();
    const lists = prepSection!.section.content.filter(
      (el) => el.kind === "list",
    );
    expect(lists.length).toBeGreaterThanOrEqual(1);
    if (lists[0] && lists[0].kind === "list") {
      // 道具 + 材料のサブアイテムも含む
      expect(lists[0].items.length).toBeGreaterThanOrEqual(5);
    }
  });
});

describe("genericParse edge cases", () => {
  it("handles empty content", () => {
    const doc = genericParse("");
    expect(doc.title).toBe("");
    expect(doc.sections).toEqual([]);
    expect(doc.frontmatter).toEqual({});
  });

  it("handles frontmatter only", () => {
    const md = `---
title: テスト
summary: テストサマリー
---
`;
    const doc = genericParse(md);
    expect(doc.title).toBe("テスト");
    expect(doc.summary).toBe("テストサマリー");
    expect(doc.sections).toEqual([]);
  });

  it("handles plain text without headings", () => {
    const doc = genericParse("これはプレーンテキストです。\n2行目。");
    expect(doc.title).toBe("");
    expect(doc.sections.length).toBe(1);
    expect(doc.sections[0].level).toBe(0);
    expect(doc.sections[0].content[0].kind).toBe("paragraph");
  });

  it("handles single section", () => {
    const md = `# テスト\n\n段落テキスト。`;
    const doc = genericParse(md);
    expect(doc.title).toBe("テスト");
    expect(doc.sections.length).toBe(1);
    expect(doc.sections[0].title).toBe("テスト");
  });

  it("handles code blocks without breaking", () => {
    const md = `# コード例\n\n\`\`\`typescript\nconst x = 1;\n\`\`\`\n`;
    const doc = genericParse(md);
    const codeEl = doc.sections[0].content.find((el) => el.kind === "code");
    expect(codeEl).toBeDefined();
    if (codeEl && codeEl.kind === "code") {
      expect(codeEl.language).toBe("typescript");
      expect(codeEl.text).toContain("const x = 1");
    }
  });

  it("nests H3 under H2", () => {
    const md = `## 親セクション\n\n親テキスト\n\n### 子セクション\n\n子テキスト\n`;
    const doc = genericParse(md);
    expect(doc.sections.length).toBe(1);
    expect(doc.sections[0].title).toBe("親セクション");
    expect(doc.sections[0].children.length).toBe(1);
    expect(doc.sections[0].children[0].title).toBe("子セクション");
  });
});

describe("flattenSections", () => {
  it("flattens nested sections with indices", () => {
    const doc = genericParse(fundoshiContent);
    const flat = flattenSections(doc.sections);
    expect(flat.length).toBeGreaterThan(doc.sections.length);
    // indices should be sequential
    for (let i = 0; i < flat.length; i++) {
      expect(flat[i].index).toBe(i);
    }
  });
});

describe("summarizeSection", () => {
  it("summarizes a section with mixed content", () => {
    const doc = genericParse(fundoshiContent);
    const flat = flattenSections(doc.sections);
    const prepSection = flat.find((f) =>
      f.section.title.includes("準備物"),
    );
    expect(prepSection).toBeDefined();
    const summary = summarizeSection(prepSection!.section);
    expect(summary).toContain("リスト");
  });
});
