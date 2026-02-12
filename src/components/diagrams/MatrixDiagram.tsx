import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type Quadrant = {
  label: string;
  items: string[];
};

type MatrixDiagramProps = {
  axisX: string;
  axisY: string;
  quadrants: [Quadrant, Quadrant, Quadrant, Quadrant];
};

const QUADRANT_COLORS = [
  "rgba(37, 99, 235, 0.1)",
  "rgba(124, 58, 237, 0.1)",
  "rgba(5, 150, 105, 0.1)",
  "rgba(245, 158, 11, 0.1)",
];

const QUADRANT_BORDERS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
];

export const MatrixDiagram: React.FC<MatrixDiagramProps> = ({
  axisX,
  axisY,
  quadrants,
}) => {
  const frame = useCurrentFrame();
  const w = 900;
  const h = 600;
  const ox = w / 2;
  const oy = h / 2;
  const cellW = 340;
  const cellH = 220;

  // Axis fade in
  const axisOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Quadrant positions: [top-left, top-right, bottom-left, bottom-right]
  const positions = [
    { x: ox - cellW - 10, y: oy - cellH - 10 },
    { x: ox + 10, y: oy - cellH - 10 },
    { x: ox - cellW - 10, y: oy + 10 },
    { x: ox + 10, y: oy + 10 },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Axes */}
        <line
          x1={ox}
          y1={30}
          x2={ox}
          y2={h - 30}
          stroke="#CBD5E1"
          strokeWidth={2}
          opacity={axisOpacity}
        />
        <line
          x1={30}
          y1={oy}
          x2={w - 30}
          y2={oy}
          stroke="#CBD5E1"
          strokeWidth={2}
          opacity={axisOpacity}
        />
        {/* Axis labels */}
        <text
          x={w - 20}
          y={oy - 10}
          textAnchor="end"
          fontSize={14}
          fill={tokens.colors.text.secondary}
          opacity={axisOpacity}
        >
          {axisX} →
        </text>
        <text
          x={ox + 10}
          y={40}
          textAnchor="start"
          fontSize={14}
          fill={tokens.colors.text.secondary}
          opacity={axisOpacity}
        >
          ↑ {axisY}
        </text>

        {/* Quadrants */}
        {quadrants.map((q, i) => {
          const delay = i * 10 + 8;
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const pos = positions[i];

          return (
            <g key={i} opacity={opacity}>
              <rect
                x={pos.x}
                y={pos.y}
                width={cellW}
                height={cellH}
                fill={QUADRANT_COLORS[i]}
                stroke={QUADRANT_BORDERS[i]}
                strokeWidth={2}
                rx={8}
              />
              <text
                x={pos.x + cellW / 2}
                y={pos.y + 30}
                textAnchor="middle"
                fontSize={18}
                fontWeight={700}
                fill={tokens.colors.text.primary}
              >
                {q.label}
              </text>
              {q.items.map((item, j) => (
                <text
                  key={j}
                  x={pos.x + cellW / 2}
                  y={pos.y + 60 + j * 24}
                  textAnchor="middle"
                  fontSize={14}
                  fill={tokens.colors.text.secondary}
                >
                  {item}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
