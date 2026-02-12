import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { parseMarkdown } from "../../../lib/md-converter/parser";

const fixturePath = path.resolve("data/input/meeting_20260220.md");
const fixtureContent = fs.readFileSync(fixturePath, "utf-8");

describe("parseMarkdown", () => {
  const doc = parseMarkdown(fixtureContent);

  it("extracts the document title", () => {
    expect(doc.title).toBe("niro勉強会 プレゼン資料（2026年2月20日）");
  });

  it("extracts metadata", () => {
    expect(doc.metadata["日時"]).toBe("2026年2月20日");
    expect(doc.metadata["テーマ"]).toContain("答えられるAI社員");
  });

  it("extracts multiple blocks", () => {
    expect(doc.blocks.length).toBeGreaterThanOrEqual(10);
  });

  it("assigns part titles to blocks", () => {
    const block1 = doc.blocks.find((b) => b.blockTitle.includes("会社紹介"));
    expect(block1).toBeDefined();
    expect(block1!.partTitle).toContain("導入");
  });

  it("extracts blockquotes as monologue", () => {
    const selfIntro = doc.blocks.find((b) =>
      b.blockTitle.includes("自己紹介"),
    );
    expect(selfIntro).toBeDefined();
    expect(selfIntro!.monologue).toBeTruthy();
    expect(selfIntro!.monologue).toContain("綱業商会");
  });

  it("removes 「」 from monologue", () => {
    const blocksWithMonologue = doc.blocks.filter((b) => b.monologue);
    for (const block of blocksWithMonologue) {
      expect(block.monologue).not.toContain("「");
      expect(block.monologue).not.toContain("」");
    }
  });

  it("extracts tables", () => {
    const companyBlock = doc.blocks.find((b) =>
      b.blockTitle.includes("会社紹介"),
    );
    expect(companyBlock).toBeDefined();
    const table = companyBlock!.elements.find((el) => el.kind === "table");
    expect(table).toBeDefined();
    if (table && table.kind === "table") {
      expect(table.headers).toContain("項目");
      expect(table.headers).toContain("内容");
      expect(table.rows.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("extracts list items", () => {
    const hasLists = doc.blocks.some((b) =>
      b.elements.some((el) => el.kind === "list"),
    );
    expect(hasLists).toBe(true);
  });

  it("extracts demo directives", () => {
    const hasDemos = doc.blocks.some((b) =>
      b.elements.some((el) => el.kind === "demo"),
    );
    expect(hasDemos).toBe(true);
  });

  it("ignores 次のステップ section", () => {
    const nextSteps = doc.blocks.find((b) =>
      b.blockTitle.includes("次のステップ"),
    );
    expect(nextSteps).toBeUndefined();
  });

  it("handles blocks without monologue", () => {
    const companyBlock = doc.blocks.find((b) =>
      b.blockTitle.includes("会社紹介"),
    );
    // 会社紹介 has a table but no blockquote
    if (companyBlock && !companyBlock.monologue) {
      expect(companyBlock.monologue).toBeNull();
    }
  });
});

describe("parseMarkdown with minimal input", () => {
  it("handles empty content", () => {
    const doc = parseMarkdown("");
    expect(doc.title).toBe("");
    expect(doc.blocks).toEqual([]);
  });

  it("handles simple structure", () => {
    const md = `# テスト

## 概要
- **日時：** 2026年1月1日

# 第1部：導入

## ブロック1：紹介

> 「こんにちは。テストです。」

---
`;
    const doc = parseMarkdown(md);
    expect(doc.title).toBe("テスト");
    expect(doc.metadata["日時"]).toBe("2026年1月1日");
    expect(doc.blocks.length).toBe(1);
    expect(doc.blocks[0].blockTitle).toBe("ブロック1：紹介");
    expect(doc.blocks[0].monologue).toBe("こんにちは。テストです。");
    expect(doc.blocks[0].partTitle).toContain("導入");
  });
});
