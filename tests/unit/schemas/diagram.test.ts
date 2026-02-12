import { describe, it, expect } from "vitest";
import { DiagramDataSchema } from "../../../src/schemas/diagram";

describe("DiagramDataSchema", () => {
  it("validates timeline diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "timeline",
      events: [{ label: "開始", description: "2024年" }],
    });
    expect(result.success).toBe(true);
  });

  it("validates cycle diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "cycle",
      steps: ["Plan", "Do", "Check", "Act"],
    });
    expect(result.success).toBe(true);
  });

  it("validates pie diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "pie",
      slices: [
        { label: "A", value: 60 },
        { label: "B", value: 40 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("validates matrix diagram with exactly 4 quadrants", () => {
    const result = DiagramDataSchema.safeParse({
      type: "matrix",
      axisX: "緊急度",
      axisY: "重要度",
      quadrants: [
        { label: "Q1", items: ["a"] },
        { label: "Q2", items: ["b"] },
        { label: "Q3", items: ["c"] },
        { label: "Q4", items: ["d"] },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects matrix with wrong quadrant count", () => {
    const result = DiagramDataSchema.safeParse({
      type: "matrix",
      axisX: "X",
      axisY: "Y",
      quadrants: [
        { label: "Q1", items: [] },
        { label: "Q2", items: [] },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("validates venn diagram with 2 sets", () => {
    const result = DiagramDataSchema.safeParse({
      type: "venn",
      sets: [
        { label: "A", items: ["1"] },
        { label: "B", items: ["2"] },
      ],
      intersection: "共通",
    });
    expect(result.success).toBe(true);
  });

  it("validates venn diagram with 3 sets", () => {
    const result = DiagramDataSchema.safeParse({
      type: "venn",
      sets: [
        { label: "A" },
        { label: "B" },
        { label: "C" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects venn diagram with 1 set", () => {
    const result = DiagramDataSchema.safeParse({
      type: "venn",
      sets: [{ label: "A" }],
    });
    expect(result.success).toBe(false);
  });

  it("validates funnel diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "funnel",
      stages: [
        { label: "認知", value: 100 },
        { label: "購入", value: 10 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("validates pyramid diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "pyramid",
      levels: [
        { label: "自己実現", description: "創造性" },
        { label: "安全", description: "安定" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("validates bar diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "bar",
      bars: [
        { label: "A", value: 10 },
        { label: "B", value: 20, color: "#ff0000" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("validates line diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "line",
      series: [
        { label: "Series 1", data: [1, 2, 3, 4] },
        { label: "Series 2", data: [2, 4, 6, 8], color: "#00ff00" },
      ],
      xLabels: ["Q1", "Q2", "Q3", "Q4"],
    });
    expect(result.success).toBe(true);
  });

  it("validates flow diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "flow",
      nodes: [
        { id: "1", label: "Start", shape: "oval" },
        { id: "2", label: "Process", shape: "rect" },
        { id: "3", label: "Decision", shape: "diamond" },
      ],
      edges: [
        { from: "1", to: "2" },
        { from: "2", to: "3", label: "Yes" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("validates tree diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "tree",
      root: "Company",
      children: [
        { label: "Dept A", children: [{ label: "Team 1" }] },
        { label: "Dept B" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("validates radar diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "radar",
      axes: [
        { label: "Speed", value: 8 },
        { label: "Power", value: 6 },
        { label: "Technique", value: 7 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("validates gantt diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "gantt",
      tasks: [
        { label: "Task 1", start: 0, end: 5 },
        { label: "Task 2", start: 3, end: 8, color: "#0000ff" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("validates area diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "area",
      series: [
        { label: "Area 1", data: [10, 20, 15, 30] },
        { label: "Area 2", data: [5, 15, 10, 20], color: "#ff00ff" },
      ],
      xLabels: ["Jan", "Feb", "Mar", "Apr"],
    });
    expect(result.success).toBe(true);
  });

  it("validates network diagram", () => {
    const result = DiagramDataSchema.safeParse({
      type: "network",
      nodes: [
        { id: "1", label: "Node A", size: 10 },
        { id: "2", label: "Node B" },
        { id: "3", label: "Node C", size: 15 },
      ],
      links: [
        { source: "1", target: "2" },
        { source: "2", target: "3", label: "Connection" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown diagram type", () => {
    const result = DiagramDataSchema.safeParse({
      type: "scatter",
      data: [],
    });
    expect(result.success).toBe(false);
  });
});
