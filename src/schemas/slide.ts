import { z } from "zod";
import { SESchema } from "./se";
import { DiagramDataSchema } from "./diagram";

export const SlideTypeSchema = z.enum([
  // Original 7
  "title",
  "list",
  "steps",
  "image-text",
  "table",
  "summary",
  "ending",
  // Phase 1: Simple
  "bridge",
  "quote",
  "definition",
  "highlight",
  "tips",
  "warning",
  // Phase 2: Medium
  "comparison",
  "stat",
  "checklist",
  "before-after",
  "code",
  "qa",
  "two-column",
  "agenda",
  // Phase 3: Complex
  "gallery",
  "process",
  "profile",
  "metrics",
  "icon-list",
]);

export const ImageSourceSchema = z.discriminatedUnion("source", [
  z.object({ source: z.literal("generate"), prompt: z.string() }),
  z.object({ source: z.literal("static"), path: z.string() }),
]);

export const SlideDefinitionSchema = z.object({
  sceneIndex: z.number(),
  type: SlideTypeSchema,
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z.array(z.string()).optional(),
  image: ImageSourceSchema.optional(),
  tableHeaders: z.array(z.string()).optional(),
  tableRows: z.array(z.array(z.string())).optional(),
  diagram: DiagramDataSchema.optional(),
  se: SESchema.optional(),
  ctaText: z.string().optional(),
});

export const SlidesFileSchema = z.object({
  generatedAt: z.string(),
  scriptHash: z.string(),
  slides: z.array(SlideDefinitionSchema),
});

export type SlideType = z.infer<typeof SlideTypeSchema>;
export type SlideDefinition = z.infer<typeof SlideDefinitionSchema>;
export type SlidesFile = z.infer<typeof SlidesFileSchema>;
