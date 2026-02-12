import { z } from "zod";

export const DiagramTypeSchema = z.enum([
  // Original 7
  "timeline",
  "cycle",
  "pie",
  "matrix",
  "venn",
  "funnel",
  "pyramid",
  // Phase 4: New 8
  "bar",
  "line",
  "flow",
  "tree",
  "radar",
  "gantt",
  "area",
  "network",
]);

export const TimelineDataSchema = z.object({
  type: z.literal("timeline"),
  events: z.array(
    z.object({
      label: z.string(),
      description: z.string().optional(),
    }),
  ),
});

export const CycleDataSchema = z.object({
  type: z.literal("cycle"),
  steps: z.array(z.string()),
});

export const PieDataSchema = z.object({
  type: z.literal("pie"),
  slices: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      color: z.string().optional(),
    }),
  ),
});

export const MatrixDataSchema = z.object({
  type: z.literal("matrix"),
  axisX: z.string(),
  axisY: z.string(),
  quadrants: z
    .array(
      z.object({
        label: z.string(),
        items: z.array(z.string()),
      }),
    )
    .length(4),
});

export const VennDataSchema = z.object({
  type: z.literal("venn"),
  sets: z
    .array(
      z.object({
        label: z.string(),
        items: z.array(z.string()).optional(),
      }),
    )
    .min(2)
    .max(3),
  intersection: z.string().optional(),
});

export const FunnelDataSchema = z.object({
  type: z.literal("funnel"),
  stages: z.array(
    z.object({
      label: z.string(),
      value: z.number().optional(),
    }),
  ),
});

export const PyramidDataSchema = z.object({
  type: z.literal("pyramid"),
  levels: z.array(
    z.object({
      label: z.string(),
      description: z.string().optional(),
    }),
  ),
});

export const BarChartDataSchema = z.object({
  type: z.literal("bar"),
  orientation: z.enum(["vertical", "horizontal"]).optional(),
  bars: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      color: z.string().optional(),
    }),
  ),
});

export const LineChartDataSchema = z.object({
  type: z.literal("line"),
  series: z.array(
    z.object({
      label: z.string(),
      data: z.array(z.number()),
      color: z.string().optional(),
    }),
  ),
  xLabels: z.array(z.string()).optional(),
});

export const FlowChartDataSchema = z.object({
  type: z.literal("flow"),
  nodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      shape: z.enum(["rect", "diamond", "oval"]).optional(),
    }),
  ),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      label: z.string().optional(),
    }),
  ),
});

export const TreeDataSchema = z.object({
  type: z.literal("tree"),
  root: z.string(),
  children: z.array(
    z.object({
      label: z.string(),
      children: z
        .array(z.object({ label: z.string() }))
        .optional(),
    }),
  ),
});

export const RadarChartDataSchema = z.object({
  type: z.literal("radar"),
  axes: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
    }),
  ),
});

export const GanttChartDataSchema = z.object({
  type: z.literal("gantt"),
  tasks: z.array(
    z.object({
      label: z.string(),
      start: z.number(),
      end: z.number(),
      color: z.string().optional(),
    }),
  ),
});

export const AreaChartDataSchema = z.object({
  type: z.literal("area"),
  series: z.array(
    z.object({
      label: z.string(),
      data: z.array(z.number()),
      color: z.string().optional(),
    }),
  ),
  xLabels: z.array(z.string()).optional(),
});

export const NetworkDataSchema = z.object({
  type: z.literal("network"),
  nodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      size: z.number().optional(),
    }),
  ),
  links: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      label: z.string().optional(),
    }),
  ),
});

export const DiagramDataSchema = z.discriminatedUnion("type", [
  TimelineDataSchema,
  CycleDataSchema,
  PieDataSchema,
  MatrixDataSchema,
  VennDataSchema,
  FunnelDataSchema,
  PyramidDataSchema,
  BarChartDataSchema,
  LineChartDataSchema,
  FlowChartDataSchema,
  TreeDataSchema,
  RadarChartDataSchema,
  GanttChartDataSchema,
  AreaChartDataSchema,
  NetworkDataSchema,
]);

export type DiagramType = z.infer<typeof DiagramTypeSchema>;
export type DiagramData = z.infer<typeof DiagramDataSchema>;
