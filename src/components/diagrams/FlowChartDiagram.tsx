import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type FlowNode = {
  id: string;
  label: string;
  shape?: "rect" | "diamond" | "oval";
};

type FlowEdge = {
  from: string;
  to: string;
  label?: string;
};

type FlowChartDiagramProps = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

// Auto-layout: organize nodes in rows top-to-bottom using BFS from root nodes
function layoutNodes(nodes: FlowNode[], edges: FlowEdge[]) {
  const nodeMap = new Map<string, FlowNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  // Find root nodes (no incoming edges)
  const hasIncoming = new Set(edges.map((e) => e.to));
  const roots = nodes.filter((n) => !hasIncoming.has(n.id));
  if (roots.length === 0 && nodes.length > 0) {
    roots.push(nodes[0]);
  }

  // BFS to assign levels
  const levels = new Map<string, number>();
  const queue: string[] = [];
  roots.forEach((r) => {
    levels.set(r.id, 0);
    queue.push(r.id);
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLevel = levels.get(current)!;
    const children = edges
      .filter((e) => e.from === current)
      .map((e) => e.to);
    for (const child of children) {
      if (!levels.has(child) || levels.get(child)! < currentLevel + 1) {
        levels.set(child, currentLevel + 1);
        queue.push(child);
      }
    }
  }

  // Assign default level to unconnected nodes
  nodes.forEach((n) => {
    if (!levels.has(n.id)) {
      levels.set(n.id, 0);
    }
  });

  // Group nodes by level
  const maxLevel = Math.max(...Array.from(levels.values()), 0);
  const rows: FlowNode[][] = [];
  for (let l = 0; l <= maxLevel; l++) {
    rows.push(nodes.filter((n) => levels.get(n.id) === l));
  }

  // Compute positions
  const w = 1200;
  const h = 600;
  const rowHeight = h / (maxLevel + 2);
  const positions = new Map<string, { x: number; y: number }>();

  rows.forEach((row, level) => {
    const y = rowHeight * (level + 0.8);
    const colWidth = w / (row.length + 1);
    row.forEach((node, col) => {
      positions.set(node.id, { x: colWidth * (col + 1), y });
    });
  });

  return { positions, order: nodes };
}

function renderShape(
  shape: "rect" | "diamond" | "oval",
  x: number,
  y: number,
  label: string,
  color: string,
  scale: number,
  opacity: number,
) {
  const nodeWidth = 140;
  const nodeHeight = 60;

  if (shape === "diamond") {
    const size = 50;
    return (
      <g opacity={opacity}>
        <polygon
          points={`${x},${y - size * scale} ${x + size * scale},${y} ${x},${y + size * scale} ${x - size * scale},${y}`}
          fill={color}
          stroke={tokens.colors.surface}
          strokeWidth={2}
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight={600}
          fill={tokens.colors.text.inverse}
        >
          {label}
        </text>
      </g>
    );
  }

  if (shape === "oval") {
    return (
      <g opacity={opacity}>
        <ellipse
          cx={x}
          cy={y}
          rx={(nodeWidth / 2) * scale}
          ry={(nodeHeight / 2) * scale}
          fill={color}
          stroke={tokens.colors.surface}
          strokeWidth={2}
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          fontWeight={600}
          fill={tokens.colors.text.inverse}
        >
          {label}
        </text>
      </g>
    );
  }

  // Default: rect
  return (
    <g opacity={opacity}>
      <rect
        x={x - (nodeWidth / 2) * scale}
        y={y - (nodeHeight / 2) * scale}
        width={nodeWidth * scale}
        height={nodeHeight * scale}
        fill={color}
        stroke={tokens.colors.surface}
        strokeWidth={2}
        rx={8}
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={14}
        fontWeight={600}
        fill={tokens.colors.text.inverse}
      >
        {label}
      </text>
    </g>
  );
}

export const FlowChartDiagram: React.FC<FlowChartDiagramProps> = ({
  nodes,
  edges,
}) => {
  const frame = useCurrentFrame();
  const w = 1200;
  const h = 600;
  const { positions } = layoutNodes(nodes, edges);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Arrowhead marker */}
        <defs>
          <marker
            id="flowchart-arrow"
            viewBox="0 0 10 10"
            refX={10}
            refY={5}
            markerWidth={8}
            markerHeight={8}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#94A3B8" />
          </marker>
        </defs>

        {/* Edges (drawn first, behind nodes) */}
        {edges.map((edge, i) => {
          const fromPos = positions.get(edge.from);
          const toPos = positions.get(edge.to);
          if (!fromPos || !toPos) return null;

          const edgeDelay = nodes.length * 8 + i * 6 + 5;
          const edgeOpacity = interpolate(
            frame,
            [edgeDelay, edgeDelay + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          // Offset line to account for node shape
          const dy = toPos.y - fromPos.y;
          const dx = toPos.x - fromPos.x;
          const angle = Math.atan2(dy, dx);
          const offsetFrom = 35;
          const offsetTo = 35;

          const x1 = fromPos.x + Math.cos(angle) * offsetFrom;
          const y1 = fromPos.y + Math.sin(angle) * offsetFrom;
          const x2 = toPos.x - Math.cos(angle) * offsetTo;
          const y2 = toPos.y - Math.sin(angle) * offsetTo;

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <g key={`edge-${i}`} opacity={edgeOpacity}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#94A3B8"
                strokeWidth={2}
                markerEnd="url(#flowchart-arrow)"
              />
              {edge.label && (
                <text
                  x={midX}
                  y={midY - 8}
                  textAnchor="middle"
                  fontSize={12}
                  fill={tokens.colors.text.secondary}
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = positions.get(node.id);
          if (!pos) return null;

          const delay = i * 8 + 5;
          const scale = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const color = COLORS[i % COLORS.length];
          const shape = node.shape || "rect";

          return (
            <g key={`node-${node.id}`}>
              {renderShape(shape, pos.x, pos.y, node.label, color, scale, opacity)}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
