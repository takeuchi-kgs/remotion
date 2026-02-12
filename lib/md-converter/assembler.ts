import { ScriptSchema } from "../../src/schemas/script";
import { SlideTypeSchema } from "../../src/schemas/slide";
import { DiagramTypeSchema } from "../../src/schemas/diagram";
import type { Script } from "../../src/schemas/script";
import type { ParsedDocument, BlockConversion, GenericDocument } from "./types";

const VALID_SLIDE_TYPES = new Set(SlideTypeSchema.options);
const VALID_DIAGRAM_TYPES = new Set(DiagramTypeSchema.options);

/**
 * LLM出力のシーンデータを修復する
 */
function sanitizeConversion(
  conv: BlockConversion,
  index: number,
): BlockConversion {
  // sceneTitle が未定義の場合フォールバック
  const rawTitle = conv.sceneTitle || conv.slideData?.title;
  const sceneTitle =
    typeof rawTitle === "string" && rawTitle ? rawTitle : `シーン ${index + 1}`;

  // slideType が未定義または不正な場合フォールバック
  let slideType = conv.slideType;
  if (!slideType || !VALID_SLIDE_TYPES.has(slideType as any)) {
    console.warn(
      `[Scene ${index}] Invalid slideType "${slideType}", falling back to "list"`,
    );
    slideType = "list";
  }

  // slideData 内の diagram.type が不正な場合は diagram を除去
  const slideData = { ...(conv.slideData as Record<string, unknown>) };
  if (slideData.diagram && typeof slideData.diagram === "object") {
    const diag = slideData.diagram as Record<string, unknown>;
    if (!diag.type || !VALID_DIAGRAM_TYPES.has(diag.type as any)) {
      console.warn(
        `[Scene ${index}] Invalid diagram type "${diag.type}", removing diagram`,
      );
      delete slideData.diagram;
    }
  }

  // lines が空の場合フォールバック
  const lines =
    conv.lines && conv.lines.length > 0
      ? conv.lines
      : [{ speaker: "left" as const, text: sceneTitle }];

  return { ...conv, sceneTitle, slideType, slideData, lines };
}

/**
 * パース結果とGemini変換結果からScript(script.json)を組み立て、Zodで検証する
 */
export function assembleScript(
  doc: ParsedDocument,
  conversions: BlockConversion[],
): Script {
  const script = {
    title: doc.title,
    description: doc.metadata["テーマ"] || undefined,
    scenes: conversions.map((conv, i) => {
      const fixed = sanitizeConversion(conv, i);
      return {
        title: fixed.sceneTitle,
        slide: {
          type: fixed.slideType,
          ...(fixed.slideData as Record<string, unknown>),
        },
        lines: (fixed.lines || []).map((line) => ({
          speaker: line.speaker,
          text: line.text,
        })),
        transition: fixed.transition,
      };
    }),
  };

  return ScriptSchema.parse(script);
}

/**
 * 汎用パース結果とGemini変換結果からScript(script.json)を組み立て、Zodで検証する
 */
export function assembleScriptFromGeneric(
  doc: GenericDocument,
  conversions: BlockConversion[],
): Script {
  const script = {
    title: doc.title,
    description: doc.summary || doc.frontmatter.description || undefined,
    scenes: conversions.map((conv, i) => {
      const fixed = sanitizeConversion(conv, i);
      return {
        title: fixed.sceneTitle,
        slide: {
          type: fixed.slideType,
          ...(fixed.slideData as Record<string, unknown>),
        },
        lines: (fixed.lines || []).map((line) => ({
          speaker: line.speaker,
          text: line.text,
        })),
        transition: fixed.transition,
      };
    }),
  };

  return ScriptSchema.parse(script);
}
