import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type TreeChild = {
  label: string;
  children?: Array<{ label: string }>;
};

type TreeDiagramProps = {
  root: string;
  children: TreeChild[];
};

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

type LayoutNode = {
  label: string;
  x: number;
  y: number;
  level: number;
  parentX?: number;
  parentY?: number;
  colorIndex: number;
};

function computeLayout(
  root: string,
  children: TreeChild[],
  w: number,
  h: number,
): LayoutNode[] {
  const nodes: LayoutNode[] = [];
  const levelHeight = h / 4;
  const rootX = w / 2;
  const rootY = levelHeight * 0.8;

  // Root node
  nodes.push({ label: root, x: rootX, y: rootY, level: 0, colorIndex: 0 });

  // Level 1: direct children of root
  const l1Count = children.length;
  const l1Spacing = w / (l1Count + 1);

  children.forEach((child, i) => {
    const cx = l1Spacing * (i + 1);
    const cy = rootY + levelHeight;
    nodes.push({
      label: child.label,
      x: cx,
      y: cy,
      level: 1,
      parentX: rootX,
      parentY: rootY,
      colorIndex: i,
    });

    // Level 2: grandchildren
    if (child.children && child.children.length > 0) {
      const gcCount = child.children.length;
      const gcTotalWidth = Math.min(l1Spacing * 0.9, gcCount * 120);
      const gcStart = cx - gcTotalWidth / 2;
      const gcStep = gcCount > 1 ? gcTotalWidth / (gcCount - 1) : 0;

      child.children.forEach((gc, j) => {
        const gx = gcCount === 1 ? cx : gcStart + j * gcStep;
        const gy = cy + levelHeight;
        nodes.push({
          label: gc.label,
          x: gx,
          y: gy,
          level: 2,
          parentX: cx,
          parentY: cy,
          colorIndex: i,
        });
      });
    }
  });

  return nodes;
}

export const TreeDiagram: React.FC<TreeDiagramProps> = ({
  root,
  children: treeChildren,
}) => {
  const frame = useCurrentFrame();
  const w = 1200;
  const h = 600;
  const nodeRadius = 30;

  const layoutNodes = computeLayout(root, treeChildren, w, h);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Draw connecting lines first (behind nodes) */}
        {layoutNodes.map((node, i) => {
          if (node.parentX === undefined || node.parentY === undefined)
            return null;

          const levelDelay = node.level * 15;
          const lineOpacity = interpolate(
            frame,
            [levelDelay, levelDelay + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <line
              key={`line-${i}`}
              x1={node.parentX}
              y1={node.parentY + nodeRadius}
              x2={node.x}
              y2={node.y - nodeRadius}
              stroke="#CBD5E1"
              strokeWidth={2}
              opacity={lineOpacity}
            />
          );
        })}

        {/* Draw nodes */}
        {layoutNodes.map((node, i) => {
          const levelDelay = node.level * 15 + 5;
          const scale = interpolate(
            frame,
            [levelDelay, levelDelay + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const opacity = interpolate(
            frame,
            [levelDelay, levelDelay + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const color = COLORS[node.colorIndex % COLORS.length];

          return (
            <g key={`node-${i}`} opacity={opacity}>
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius * scale}
                fill={node.level === 0 ? tokens.colors.primary : color}
                stroke={tokens.colors.surface}
                strokeWidth={2}
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={node.level === 0 ? 16 : 13}
                fontWeight={node.level === 0 ? 700 : 600}
                fill={tokens.colors.text.inverse}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
