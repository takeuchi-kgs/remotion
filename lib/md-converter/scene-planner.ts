import type { GenericDocument, GenericSection, ScenePlan } from "./types";
import { flattenSections, summarizeSection } from "./generic-parser";
import { generateJSON } from "../gemini/text.js";

const SYSTEM_INSTRUCTION = `あなたはドキュメントを動画のシーンに分割する専門家です。

## 入力
ドキュメントのセクション一覧（インデックス、タイトル、内容サマリー）

## 出力形式
{
  "scenes": [
    {
      "sceneTitle": "シーンのタイトル",
      "sectionIndices": [0, 1],
      "slideTypeHint": "title",
      "notes": "変換時の注意点"
    }
  ]
}

## ルール
- 1動画は5〜20シーンが目安
- 小さいセクション（概要等）はまとめて1シーンに
- 大きいセクション（手順が10項目等）は適切に分割
- 最初のシーンは "title" タイプを推奨
- 最後のシーンは "ending" タイプを推奨
- FAQ、Q&Aセクションは "qa" タイプでまとめる
- 空のセクション（タイトルのみ）はスキップ

## スライドタイプ一覧（26種）
title, list, steps, image-text, table, summary, ending, bridge, quote, definition, highlight, tips, warning, comparison, stat, checklist, before-after, code, qa, two-column, agenda, gallery, process, profile, metrics, icon-list

## ダイアグラムタイプ一覧（15種、オプション）
各シーンにはオプションでダイアグラム（図表）を付与できます。数値データ、プロセス、関係性を視覚的に見せる場合にnotesに「ダイアグラム推奨: bar」等と記載してください。
timeline, cycle, pie, matrix, venn, funnel, pyramid, bar, line, flow, tree, radar, gantt, area, network

使い分け:
- 数値の推移・比較 → bar, line, area
- 割合 → pie
- 時系列 → timeline, gantt
- 循環 → cycle
- フロー・条件分岐 → flow
- 階層・組織 → tree, pyramid
- 評価比較 → radar
- 分類・優先度 → matrix
- 集合関係 → venn
- 絞り込み → funnel
- ネットワーク構成 → network`;

/**
 * ドキュメントをGemini AIを使って動画シーンに分割する計画を立てる
 */
export async function planScenes(
  doc: GenericDocument,
): Promise<ScenePlan[]> {
  const flat = flattenSections(doc.sections);

  // セクション一覧を組み立て
  const sectionLines = flat.map(({ index, section }) => {
    const levelLabel = section.level > 0 ? `H${section.level}` : "H0";
    const title = section.title || "(無題)";
    const summary = summarizeSection(section);
    return `[${index}] (${levelLabel}) ${title} → ${summary}`;
  });

  const overviewPrompt = [
    `ドキュメント: ${doc.title}`,
    `サマリー: ${doc.summary || "(なし)"}`,
    "",
    "セクション一覧:",
    ...sectionLines,
  ].join("\n");

  const result = await generateJSON<{ scenes: ScenePlan[] } | ScenePlan[]>(
    overviewPrompt,
    SYSTEM_INSTRUCTION,
  );

  // LLMが配列を直接返す場合とオブジェクトで返す場合の両方に対応
  const scenes = Array.isArray(result)
    ? result
    : result?.scenes;

  if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
    throw new Error(
      `シーン分割の結果が不正です。LLMレスポンス: ${JSON.stringify(result).slice(0, 200)}`,
    );
  }

  return scenes;
}
