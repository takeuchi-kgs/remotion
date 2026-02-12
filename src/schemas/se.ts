import { z } from "zod";

export const SESchema = z.object({
  path: z.string(),
  volume: z.number().min(0).max(1).default(0.3),
});

export type SE = z.infer<typeof SESchema>;
