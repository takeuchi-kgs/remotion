/** マークダウンから抽出するコンテンツ要素 */
export type ContentElement =
  | { kind: "paragraph"; text: string }
  | { kind: "blockquote"; text: string }
  | { kind: "table"; headers: string[]; rows: string[][] }
  | { kind: "list"; items: string[] }
  | { kind: "demo"; text: string }
  | { kind: "code"; language: string; text: string };

/** パースされた1ブロック（## セクション） */
export type ParsedBlock = {
  partTitle: string;
  blockTitle: string;
  elements: ContentElement[];
  monologue: string | null;
};

/** パース結果全体 */
export type ParsedDocument = {
  title: string;
  metadata: Record<string, string>;
  blocks: ParsedBlock[];
};

/** Gemini出力（1ブロック分） */
export type BlockConversion = {
  sceneTitle: string;
  slideType: string;
  slideData: Record<string, unknown>;
  lines: { speaker: "left" | "right"; text: string }[];
  transition?: string;
};

// === 汎用パーサー用型 ===

/** 汎用パーサーのセクション（heading単位） */
export type GenericSection = {
  level: number;
  title: string;
  content: ContentElement[];
  children: GenericSection[];
};

/** 汎用パース結果 */
export type GenericDocument = {
  frontmatter: Record<string, string>;
  title: string;
  summary: string;
  sections: GenericSection[];
  rawText: string;
};

/** Geminiのシーン分割計画 */
export type ScenePlan = {
  sceneTitle: string;
  sectionIndices: number[];
  slideTypeHint: string;
  notes: string;
};
