import type { ContentElement, ParsedBlock, ParsedDocument } from "./types";

/**
 * 台本マークダウンを構造化ブロックにパースする（ルールベース、AI不使用）
 */
export function parseMarkdown(content: string): ParsedDocument {
  const lines = content.split("\n");

  let title = "";
  const metadata: Record<string, string> = {};
  const blocks: ParsedBlock[] = [];

  let currentPartTitle = "";
  let currentBlock: ParsedBlock | null = null;
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeLines: string[] = [];
  let inMetadataSection = false;
  let reachedNextSteps = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 「次のステップ」以降は無視
    if (/^#\s+次のステップ/.test(line)) {
      reachedNextSteps = true;
    }
    if (reachedNextSteps) continue;

    // コードブロック処理
    if (line.trimStart().startsWith("```")) {
      if (inCodeBlock) {
        // コードブロック終了
        if (currentBlock) {
          currentBlock.elements.push({
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
        // コードブロック開始
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

    // # レベル1見出し: タイトルまたはパート
    if (/^#\s+/.test(line) && !line.startsWith("##")) {
      const heading = line.replace(/^#\s+/, "").trim();

      if (!title) {
        // 最初の # はドキュメントタイトル
        title = heading;
        continue;
      }

      // # 第N部：... はパート境界
      if (/第\d+部/.test(heading)) {
        // 前のブロックを保存
        if (currentBlock) {
          finalizeBlock(currentBlock);
          blocks.push(currentBlock);
          currentBlock = null;
        }
        currentPartTitle = heading;
        continue;
      }

      continue;
    }

    // ## レベル2見出し: ブロック境界またはメタデータセクション
    if (/^##\s+/.test(line)) {
      const heading = line.replace(/^##\s+/, "").trim();

      // 概要セクション
      if (heading === "概要") {
        inMetadataSection = true;
        continue;
      }

      // 全体構成セクションはスキップ
      if (heading === "全体構成") {
        inMetadataSection = false;
        continue;
      }

      inMetadataSection = false;

      // 前のブロックを保存
      if (currentBlock) {
        finalizeBlock(currentBlock);
        blocks.push(currentBlock);
      }

      // 新しいブロック開始
      currentBlock = {
        partTitle: currentPartTitle,
        blockTitle: heading,
        elements: [],
        monologue: null,
      };
      continue;
    }

    // メタデータセクション内
    if (inMetadataSection) {
      const metaMatch = line.match(/^-\s+\*\*(.+?)(?:：|:)\*\*\s*(.+)$/);
      if (metaMatch) {
        metadata[metaMatch[1].trim()] = metaMatch[2].trim();
      }
      continue;
    }

    // 以下はブロック内の要素パース
    if (!currentBlock) continue;

    // 空行・区切り線
    if (line.trim() === "" || line.trim() === "---") continue;

    // ラベル行（**話す内容：** 等）はスキップ
    if (/^\*\*.*(?:：|:)\*\*\s*$/.test(line.trim())) continue;

    // blockquote
    if (line.startsWith("> ") || line === ">") {
      const quoteText = line.replace(/^>\s?/, "");
      // 連続するblockquote行を結合
      const lastEl = currentBlock.elements[currentBlock.elements.length - 1];
      if (lastEl && lastEl.kind === "blockquote") {
        lastEl.text += "\n" + quoteText;
      } else {
        currentBlock.elements.push({ kind: "blockquote", text: quoteText });
      }
      continue;
    }

    // テーブル行
    if (line.startsWith("|")) {
      // テーブルセパレータ行はスキップ
      if (/^\|[\s-:|]+\|$/.test(line.trim())) continue;

      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());

      const lastEl = currentBlock.elements[currentBlock.elements.length - 1];
      if (lastEl && lastEl.kind === "table") {
        lastEl.rows.push(cells);
      } else {
        // 最初の行はヘッダー
        currentBlock.elements.push({
          kind: "table",
          headers: cells,
          rows: [],
        });
        // 次の行がセパレータなら、その次からデータ行
      }
      continue;
    }

    // リストアイテム
    if (/^[-*]\s+/.test(line)) {
      const item = line.replace(/^[-*]\s+/, "").trim();
      const lastEl = currentBlock.elements[currentBlock.elements.length - 1];
      if (lastEl && lastEl.kind === "list") {
        lastEl.items.push(item);
      } else {
        currentBlock.elements.push({ kind: "list", items: [item] });
      }
      continue;
    }

    // デモ指示
    if (line.startsWith("→ ") || line.startsWith("→")) {
      const text = line.replace(/^→\s*/, "").trim();
      currentBlock.elements.push({ kind: "demo", text });
      continue;
    }

    // その他のテキスト行（paragraph）
    const trimmed = line.trim();
    if (trimmed) {
      // **bold** ラベル付きテキスト行はparagraphとして処理
      const lastEl = currentBlock.elements[currentBlock.elements.length - 1];
      if (lastEl && lastEl.kind === "paragraph") {
        lastEl.text += "\n" + trimmed;
      } else {
        currentBlock.elements.push({ kind: "paragraph", text: trimmed });
      }
    }
  }

  // 最後のブロックを保存
  if (currentBlock) {
    finalizeBlock(currentBlock);
    blocks.push(currentBlock);
  }

  return { title, metadata, blocks };
}

/** ブロックのmonologueを抽出する */
function finalizeBlock(block: ParsedBlock): void {
  const quotes = block.elements
    .filter((el): el is ContentElement & { kind: "blockquote" } => el.kind === "blockquote")
    .map((el) => el.text);

  if (quotes.length > 0) {
    // 「」を除去してテキストを結合
    block.monologue = quotes
      .join("\n\n")
      .replace(/[「」]/g, "")
      .trim();
  }
}
