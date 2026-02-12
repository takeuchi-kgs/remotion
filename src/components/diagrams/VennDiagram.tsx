import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type VennSet = {
  label: string;
  items?: string[];
};

type VennDiagramProps = {
  sets: VennSet[];
  intersection?: string;
};

const SET_COLORS = [
  "rgba(37, 99, 235, 0.3)",
  "rgba(124, 58, 237, 0.3)",
  "rgba(5, 150, 105, 0.3)",
];

const SET_STROKES = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
];

export const VennDiagram: React.FC<VennDiagramProps> = ({ sets, intersection }) => {
  const frame = useCurrentFrame();
  const cx = 450;
  const cy = 300;
  const radius = 160;
  const is3 = sets.length === 3;
  const overlap = 80;

  // Positions for 2 or 3 sets
  const positions = is3
    ? [
        { x: cx - overlap, y: cy - 50 },
        { x: cx + overlap, y: cy - 50 },
        { x: cx, y: cy + 70 },
      ]
    : [
        { x: cx - overlap, y: cy },
        { x: cx + overlap, y: cy },
      ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={900} height={600} viewBox="0 0 900 600">
        {sets.map((set, i) => {
          const delay = i * 12 + 5;
          const r = interpolate(frame, [delay, delay + 15], [0, radius], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const pos = positions[i];

          return (
            <g key={i}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r}
                fill={SET_COLORS[i]}
                stroke={SET_STROKES[i]}
                strokeWidth={2}
              />
              {/* Set label */}
              <text
                x={i === 0 ? pos.x - radius / 2 : i === 1 ? pos.x + radius / 2 : pos.x}
                y={is3 && i === 2 ? pos.y + radius / 2 + 20 : pos.y - radius / 2 - 15}
                textAnchor="middle"
                fontSize={20}
                fontWeight={700}
                fill={tokens.colors.text.primary}
                opacity={opacity}
              >
                {set.label}
              </text>
              {/* Items */}
              {set.items?.map((item, j) => (
                <text
                  key={j}
                  x={i === 0 ? pos.x - 40 : i === 1 ? pos.x + 40 : pos.x}
                  y={pos.y + j * 22 - ((set.items?.length ?? 0) * 22) / 2 + 10}
                  textAnchor="middle"
                  fontSize={13}
                  fill={tokens.colors.text.secondary}
                  opacity={opacity}
                >
                  {item}
                </text>
              ))}
            </g>
          );
        })}
        {/* Intersection label */}
        {intersection && (
          <text
            x={cx}
            y={is3 ? cy : cy + 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={16}
            fontWeight={700}
            fill={tokens.colors.text.primary}
            opacity={interpolate(frame, [30, 42], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          >
            {intersection}
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};
