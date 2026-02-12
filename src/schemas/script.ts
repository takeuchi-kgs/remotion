import { z } from "zod";
import { SESchema } from "./se";
import { SlideTypeSchema, ImageSourceSchema } from "./slide";
import { DiagramDataSchema } from "./diagram";
import { AnnotationSchema } from "./annotation";

export const SpeakerSchema = z.enum(["left", "right"]);

export const LineSchema = z.object({
  speaker: SpeakerSchema,
  text: z.string(),
  expression: z.string().optional(),
  se: SESchema.optional(),
});

export const SceneSlideSchema = z.object({
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
  annotations: z.array(AnnotationSchema).optional(),
  // Phase 1-3 new fields
  definition: z.string().optional(),
  quote: z.string().optional(),
  attribution: z.string().optional(),
  code: z.string().optional(),
  language: z.string().optional(),
  statValue: z.string().optional(),
  statLabel: z.string().optional(),
  leftColumn: z.object({ title: z.string(), items: z.array(z.string()) }).optional(),
  rightColumn: z.object({ title: z.string(), items: z.array(z.string()) }).optional(),
  question: z.string().optional(),
  answer: z.string().optional(),
  images: z.array(ImageSourceSchema).optional(),
  profileImage: ImageSourceSchema.optional(),
  profileName: z.string().optional(),
  profileRole: z.string().optional(),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
    change: z.string().optional(),
  })).optional(),
  iconItems: z.array(z.object({
    icon: z.string(),
    text: z.string(),
  })).optional(),
});

export const TransitionTypeSchema = z.enum(["fade", "wipe", "slide", "zoom", "none"]);

export const SceneSchema = z.object({
  title: z.string(),
  slide: SceneSlideSchema,
  lines: z.array(LineSchema),
  transition: TransitionTypeSchema.optional(),
});

export const ScriptSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  scenes: z.array(SceneSchema),
});

export type Speaker = z.infer<typeof SpeakerSchema>;
export type Line = z.infer<typeof LineSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Script = z.infer<typeof ScriptSchema>;
