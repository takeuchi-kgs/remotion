import { z } from "zod";
import { SESchema } from "./se";

export const AnnotationTypeSchema = z.enum([
  "arrow",
  "circle",
  "highlight",
  "underline",
  "box",
]);

export const AnnotationSchema = z.object({
  type: AnnotationTypeSchema,
  x: z.number(),
  y: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  targetX: z.number().optional(),
  targetY: z.number().optional(),
  color: z.string().optional(),
  label: z.string().optional(),
  triggerFrame: z.number().optional(),
  se: SESchema.optional(),
});

export type AnnotationType = z.infer<typeof AnnotationTypeSchema>;
export type Annotation = z.infer<typeof AnnotationSchema>;
