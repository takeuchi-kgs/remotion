import type { ParsedBlock, GenericSection, ScenePlan } from "./types";

/**
 * システムインストラクション（全ブロック共通）
 */
export function getSystemInstruction(): string {
  return `あなたは、プレゼンテーション台本をAI解説動画の台本(script.json)に変換する専門家です。

## あなたの役割
台本のブロック（セクション）を受け取り、以下を決定します：
1. 最適なスライドタイプの選択（26種類から）
2. スライドの構造化データの生成
3. モノローグ（独白）を2人の掛け合い対話に変換

## スライドタイプ選択ガイド

### テーブルがある場合
- "table": 比較表、一覧表がある場合。slideDataに tableHeaders(string[]) と tableRows(string[][]) を設定

### 箇条書きがある場合
- "list": 一般的な箇条書き。slideDataに items(string[]) を設定
- "steps": 手順・プロセスの説明。slideDataに items(string[]) を設定
- "checklist": チェックリスト形式。slideDataに items(string[]) を設定
- "tips": ヒント・コツの紹介。slideDataに items(string[]) を設定
- "warning": 注意事項・警告。slideDataに items(string[]) を設定
- "agenda": 全体構成・目次。slideDataに items(string[]) を設定

### セクション区切り
- "bridge": 第N部の開始（パート区切り）。slideDataに title と subtitle を設定
- "title": プレゼンテーション全体のタイトル。slideDataに title と subtitle を設定
- "ending": 最後のまとめ・締め。slideDataに title, subtitle, ctaText を設定

### 特殊コンテンツ
- "quote": 引用文がメインの場合。slideDataに quote と attribution を設定
- "definition": 用語定義がメインの場合。slideDataに title と definition を設定
- "stat": 統計データ・大きな数値がメインの場合。slideDataに title, statValue, statLabel を設定
- "code": コード例がある場合。slideDataに title, code, language を設定
- "qa": 質問と回答の形式。slideDataに question と answer を設定
- "comparison": 2つの概念の対比。slideDataに title, leftColumn({title,items}), rightColumn({title,items}) を設定
- "two-column": 2列レイアウト。slideDataに title, leftColumn({title,items}), rightColumn({title,items}) を設定
- "before-after": ビフォーアフター比較。slideDataに title, leftColumn({title,items}), rightColumn({title,items}) を設定
- "highlight": 1つの重要ポイントを強調。slideDataに title と subtitle を設定
- "summary": まとめ。slideDataに title と items(string[]) を設定
- "process": 複数ステップのプロセス図。slideDataに title と items(string[]) を設定
- "profile": 人物・会社紹介。slideDataに title, profileName, profileRole, items(string[]) を設定
- "metrics": 複数の指標・KPI。slideDataに title と metrics([{label,value,change?}]) を設定
- "icon-list": アイコン付きリスト。slideDataに title と iconItems([{icon,text}]) を設定
- "image-text": 画像とテキストの組み合わせ。slideDataに title と items(string[]) を設定
- "gallery": 複数画像。slideDataに title を設定

## ダイアグラム（オプション）

スライドには任意で **diagram** フィールドを追加できます。数値データ、プロセス、関係性等を視覚的に表現する場合に活用してください。
slideDataの中に "diagram": { "type": "...", ... } として含めます。

### ダイアグラムタイプ一覧（15種）

- "timeline": 時系列イベント。{ type: "timeline", events: [{ label, description? }] }
- "cycle": 循環プロセス（PDCA等）。{ type: "cycle", steps: string[] }
- "pie": 円グラフ（割合）。{ type: "pie", slices: [{ label, value }] }
- "matrix": 4象限マトリクス。{ type: "matrix", axisX, axisY, quadrants: [{ label, items }] }（必ず4個）
- "venn": ベン図（2-3セット）。{ type: "venn", sets: [{ label, items? }], intersection? }
- "funnel": ファネル図。{ type: "funnel", stages: [{ label, value? }] }
- "pyramid": ピラミッド図。{ type: "pyramid", levels: [{ label, description? }] }
- "bar": 棒グラフ。{ type: "bar", bars: [{ label, value }], orientation?: "vertical"|"horizontal" }
- "line": 折れ線グラフ。{ type: "line", series: [{ label, data: number[] }], xLabels?: string[] }
- "flow": フローチャート。{ type: "flow", nodes: [{ id, label, shape?: "rect"|"diamond"|"oval" }], edges: [{ from, to, label? }] }
- "tree": ツリー図。{ type: "tree", root: string, children: [{ label, children?: [{ label }] }] }
- "radar": レーダーチャート。{ type: "radar", axes: [{ label, value }] }
- "gantt": ガントチャート。{ type: "gantt", tasks: [{ label, start, end }] }
- "area": エリアチャート。{ type: "area", series: [{ label, data: number[] }], xLabels?: string[] }
- "network": ネットワーク図。{ type: "network", nodes: [{ id, label }], links: [{ source, target, label? }] }

### ダイアグラム選択ガイド
- 数値の推移・比較 → bar, line, area
- 割合の表示 → pie
- 時系列のイベント → timeline, gantt
- 循環プロセス → cycle
- 条件分岐・フロー → flow
- 階層構造 → tree, pyramid
- 評価・能力比較 → radar
- 優先度・分類 → matrix
- 集合の関係 → venn
- 段階的な絞り込み → funnel
- システム・構成図 → network

ダイアグラムが不要な場合は diagram フィールドを省略してください。テキストだけで十分な場合は無理に追加しないでください。

## 対話変換ルール
- left = プレゼンター（発表者）: 内容を説明する側
- right = アシスタント: 質問したり、感想を述べたり、要約する側
- モノローグの内容を自然な2人の掛け合いに分割
- 1つのブロックにつき2〜8行の対話（元の内容量に応じて調整）
- rightは「なるほど」「それは面白いですね」等のあいづちだけでなく、内容に即した具体的な質問や要約も行う
- 敬語は使うが堅すぎない口調
- 必ずleftから始める

## モノローグがない場合
- blockquoteによる話す内容（モノローグ）がない場合は、セクションの内容から自然な対話を生成してください
- テキスト、リスト、テーブル等のコンテンツを元に、プレゼンターが説明しアシスタントが質問・要約する形式にしてください

## 出力形式
以下のJSON構造を返してください：
{
  "sceneTitle": "シーンのタイトル（簡潔に）",
  "slideType": "26種類のいずれか",
  "slideData": { "title": "...", "diagram": { "type": "...", ... }, ... },
  "lines": [
    { "speaker": "left", "text": "..." },
    { "speaker": "right", "text": "..." }
  ],
  "transition": "fade"
}

slideDataにはslideTypeに応じたフィールドのみを含めてください。typeフィールドは含めないでください。
diagramフィールドは任意です。数値データや構造的な情報がある場合のみ含めてください。
transitionは基本的に "fade" を使用してください。`;
}

/**
 * ブロック別のユーザープロンプトを構築
 */
export function buildBlockPrompt(
  block: ParsedBlock,
  context: {
    documentTitle: string;
    totalBlocks: number;
    blockPosition: number;
    marpSlideContent?: string;
  },
): string {
  let prompt = `## 変換対象ブロック\n\n`;
  prompt += `ドキュメント: ${context.documentTitle}\n`;
  prompt += `全${context.totalBlocks}ブロック中 ${context.blockPosition + 1}番目\n`;
  prompt += `パート: ${block.partTitle}\n`;
  prompt += `ブロック: ${block.blockTitle}\n\n`;

  prompt += `### コンテンツ\n\n`;

  for (const el of block.elements) {
    switch (el.kind) {
      case "blockquote":
        prompt += `【話す内容】\n${el.text}\n\n`;
        break;
      case "table":
        prompt += `【テーブル】\n`;
        prompt += `ヘッダー: ${el.headers.join(" | ")}\n`;
        for (const row of el.rows) {
          prompt += `  ${row.join(" | ")}\n`;
        }
        prompt += "\n";
        break;
      case "list":
        prompt += `【箇条書き】\n${el.items.map((item) => `- ${item}`).join("\n")}\n\n`;
        break;
      case "demo":
        prompt += `【デモ指示】${el.text}\n\n`;
        break;
      case "code":
        prompt += `【コードブロック】(${el.language})\n${el.text}\n\n`;
        break;
      case "paragraph":
        prompt += `${el.text}\n\n`;
        break;
    }
  }

  // 位置ヒント
  if (context.blockPosition === 0) {
    prompt += `\n注意: プレゼンテーションの最初のブロックです。slideType "title" を検討してください。\n`;
  }
  if (context.blockPosition === context.totalBlocks - 1) {
    prompt += `\n注意: プレゼンテーションの最後のブロックです。slideType "ending" を検討してください。\n`;
  }

  // Marpスライド補助コンテキスト
  if (context.marpSlideContent) {
    prompt += `\n### 参考：対応するMarpスライドの内容\n\n${context.marpSlideContent}\n`;
  }

  return prompt;
}

/**
 * 汎用セクション用のユーザープロンプトを構築
 */
export function buildScenePrompt(
  sections: GenericSection[],
  plan: ScenePlan,
  context: {
    documentTitle: string;
    totalScenes: number;
    scenePosition: number;
  },
): string {
  let prompt = `## 変換対象シーン\n\n`;
  prompt += `ドキュメント: ${context.documentTitle}\n`;
  prompt += `全${context.totalScenes}シーン中 ${context.scenePosition + 1}番目\n\n`;

  prompt += `推奨スライドタイプ: ${plan.slideTypeHint}\n`;
  if (plan.notes) {
    prompt += `補足: ${plan.notes}\n`;
  }
  prompt += `\n`;

  // 各セクションのコンテンツを出力
  for (const idx of plan.sectionIndices) {
    const section = sections[idx];
    if (!section) continue;

    prompt += `### ${section.title}\n\n`;

    for (const el of section.content) {
      switch (el.kind) {
        case "blockquote":
          prompt += `【話す内容】\n${el.text}\n\n`;
          break;
        case "table":
          prompt += `【テーブル】\n`;
          prompt += `ヘッダー: ${el.headers.join(" | ")}\n`;
          for (const row of el.rows) {
            prompt += `  ${row.join(" | ")}\n`;
          }
          prompt += "\n";
          break;
        case "list":
          prompt += `【箇条書き】\n${el.items.map((item) => `- ${item}`).join("\n")}\n\n`;
          break;
        case "demo":
          prompt += `【デモ指示】${el.text}\n\n`;
          break;
        case "code":
          prompt += `【コードブロック】(${el.language})\n${el.text}\n\n`;
          break;
        case "paragraph":
          prompt += `${el.text}\n\n`;
          break;
      }
    }
  }

  // 位置ヒント
  if (context.scenePosition === 0) {
    prompt += `\n注意: プレゼンテーションの最初のシーンです。slideType "title" を検討してください。\n`;
  }
  if (context.scenePosition === context.totalScenes - 1) {
    prompt += `\n注意: プレゼンテーションの最後のシーンです。slideType "ending" を検討してください。\n`;
  }

  return prompt;
}
