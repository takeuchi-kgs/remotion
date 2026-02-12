import type { ContentElement, GenericSection, GenericDocument } from "./types";

/**
 * 汎用マークダウンパーサー
 * フォーマットに依存せず、任意のmarkdown/テキストをセクションツリーに変換する
 */
export function genericParse(content: string): GenericDocument {
  const rawText = content;
  const { frontmatter, body } = extractFrontmatter(content);
  const lines = body.split("\n");

  const title =
    frontmatter.title || extractFirstHeading(lines) || "";
  const summary =
    frontmatter.summary || frontmatter.description || "";

  const sections = buildSectionTree(lines);

  return { frontmatter, title, summary, sections, rawText };
}

/**
 * YAML frontmatter を抽出する（複数ブロック対応）
 */
function extractFrontmatter(content: string): {
  frontmatter: Record<string, string>;
  body: string;
} {
  const frontmatter: Record<string, string> = {};
  let remaining = content;

  // 複数の --- ブロックを処理
  while (remaining.startsWith("---")) {
    const endIdx = remaining.indexOf("---", 3);
    if (endIdx === -1) break;

    const block = remaining.substring(3, endIdx).trim();
    parseYamlBlock(block, frontmatter);

    remaining = remaining.substring(endIdx + 3).trimStart();
  }

  return { frontmatter, body: remaining };
}

/**
 * 簡易YAMLパーサー（フラットなkey: value形式）
 */
function parseYamlBlock(
  block: string,
  target: Record<string, string>,
): void {
  const lines = block.split("\n");
  let currentKey = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // key: value 形式
    const kvMatch = trimmed.match(/^([a-zA-Z_]\w*):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      if (value && !value.startsWith("-")) {
        // 既存の値があれば上書き（後のブロック優先）
        target[currentKey] = value;
      }
      continue;
    }

    // リスト項目（- value）→ カンマ区切りで結合
    if (trimmed.startsWith("- ") && currentKey) {
      const item = trimmed.slice(2).trim();
      if (target[currentKey]) {
        target[currentKey] += ", " + item;
      } else {
        target[currentKey] = item;
      }
    }
  }
}

/** 最初のH1見出しを取得 */
function extractFirstHeading(lines: string[]): string | null {
  for (const line of lines) {
    if (/^#\s+/.test(line) && !line.startsWith("##")) {
      return line.replace(/^#\s+/, "").trim();
    }
  }
  return null;
}

/**
 * heading階層に基づいてセクションツリーを構築
 */
function buildSectionTree(lines: string[]): GenericSection[] {
  // まずフラットなセクションリストを作成
  const flatSections: GenericSection[] = [];
  let currentSection: GenericSection | null = null;
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // コードブロック処理
    if (line.trimStart().startsWith("```")) {
      if (inCodeBlock) {
        if (currentSection) {
          currentSection.content.push({
            kind: "code",
            language: codeLanguage,
            text: codeLines.join("\n"),
          });
        }
        inCodeBlock = false;
        codeLines = [];
        codeLanguage = "";
        continue;
      } else {
        inCodeBlock = true;
        codeLanguage = line.trimStart().slice(3).trim();
        codeLines = [];
        continue;
      }
    }
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // heading検出
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      // 前のセクションを保存
      if (currentSection) {
        flatSections.push(currentSection);
      }

      currentSection = {
        level,
        title,
        content: [],
        children: [],
      };
      continue;
    }

    // セクション外のコンテンツ → level 0のルートセクションに
    if (!currentSection) {
      currentSection = {
        level: 0,
        title: "",
        content: [],
        children: [],
      };
    }

    // コンテンツ要素のパース
    parseContentLine(line, currentSection);
  }

  // 最後のセクションを保存
  if (currentSection) {
    flatSections.push(currentSection);
  }

  // 空のlevel-0セクションを除去
  const nonEmpty = flatSections.filter(
    (s) => s.level > 0 || s.content.length > 0,
  );

  // フラットリスト → ツリー構造に変換
  return nestSections(nonEmpty);
}

/**
 * 1行をパースしてセクションのcontent配列に追加
 */
function parseContentLine(line: string, section: GenericSection): void {
  const trimmed = line.trim();

  // 空行・水平線はスキップ
  if (trimmed === "" || trimmed === "---") return;

  // blockquote
  if (line.startsWith("> ") || line === ">") {
    const text = line.replace(/^>\s?/, "");
    const last = section.content[section.content.length - 1];
    if (last && last.kind === "blockquote") {
      last.text += "\n" + text;
    } else {
      section.content.push({ kind: "blockquote", text });
    }
    return;
  }

  // テーブル行
  if (trimmed.startsWith("|")) {
    // セパレータ行はスキップ
    if (/^\|[\s\-:|]+\|$/.test(trimmed)) return;

    const cells = trimmed
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());

    const last = section.content[section.content.length - 1];
    if (last && last.kind === "table") {
      last.rows.push(cells);
    } else {
      section.content.push({ kind: "table", headers: cells, rows: [] });
    }
    return;
  }

  // 番号付きリスト
  if (/^\d+\.\s+/.test(trimmed)) {
    const item = trimmed.replace(/^\d+\.\s+/, "").trim();
    const last = section.content[section.content.length - 1];
    if (last && last.kind === "list") {
      last.items.push(item);
    } else {
      section.content.push({ kind: "list", items: [item] });
    }
    return;
  }

  // 箇条書き（インデント付きサブリストも結合）
  if (/^[-*]\s+/.test(trimmed) || /^\s{2,}[-*]\s+/.test(line)) {
    const item = trimmed.replace(/^[-*]\s+/, "").trim();
    const last = section.content[section.content.length - 1];
    if (last && last.kind === "list") {
      last.items.push(item);
    } else {
      section.content.push({ kind: "list", items: [item] });
    }
    return;
  }

  // デモ指示
  if (trimmed.startsWith("→ ") || trimmed.startsWith("→")) {
    const text = trimmed.replace(/^→\s*/, "").trim();
    section.content.push({ kind: "demo", text });
    return;
  }

  // 段落テキスト
  if (trimmed) {
    const last = section.content[section.content.length - 1];
    if (last && last.kind === "paragraph") {
      last.text += "\n" + trimmed;
    } else {
      section.content.push({ kind: "paragraph", text: trimmed });
    }
  }
}

/**
 * フラットなセクションリストをheadingレベルに基づいてネストする
 */
function nestSections(flat: GenericSection[]): GenericSection[] {
  const result: GenericSection[] = [];
  const stack: GenericSection[] = [];

  for (const section of flat) {
    // level 0（heading前のコンテンツ）はルートに直接追加
    if (section.level === 0) {
      result.push(section);
      continue;
    }

    // スタックからより高い/同じレベルのセクションをpop
    while (
      stack.length > 0 &&
      stack[stack.length - 1].level >= section.level
    ) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(section);
    } else {
      stack[stack.length - 1].children.push(section);
    }

    stack.push(section);
  }

  return result;
}

/**
 * セクションツリーをフラット化（インデックス付き）
 * シーンプランナーで使用
 */
export function flattenSections(
  sections: GenericSection[],
): { index: number; section: GenericSection }[] {
  const result: { index: number; section: GenericSection }[] = [];
  let idx = 0;

  function walk(sections: GenericSection[]): void {
    for (const s of sections) {
      result.push({ index: idx++, section: s });
      walk(s.children);
    }
  }

  walk(sections);
  return result;
}

/**
 * セクションのコンテンツを要約文字列にする（シーンプランナー用）
 */
export function summarizeSection(section: GenericSection): string {
  const parts: string[] = [];

  for (const el of section.content) {
    switch (el.kind) {
      case "paragraph":
        parts.push(el.text.slice(0, 80));
        break;
      case "blockquote":
        parts.push(`[引用] ${el.text.slice(0, 60)}`);
        break;
      case "table":
        parts.push(
          `[テーブル] ${el.headers.join(", ")} (${el.rows.length}行)`,
        );
        break;
      case "list":
        parts.push(`[リスト] ${el.items.length}項目`);
        break;
      case "demo":
        parts.push(`[デモ] ${el.text}`);
        break;
      case "code":
        parts.push(`[コード] ${el.language}`);
        break;
    }
  }

  if (section.children.length > 0) {
    parts.push(`(サブセクション ${section.children.length}件)`);
  }

  return parts.join(" / ") || "(空)";
}
