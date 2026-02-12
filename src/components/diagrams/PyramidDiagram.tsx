import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type PyramidLevel = {
  label: string;
  description?: string;
};

type PyramidDiagramProps = {
  levels: PyramidLevel[];
};

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

export const PyramidDiagram: React.FC<PyramidDiagramProps> = ({ levels }) => {
  const frame = useCurrentFrame();
  const w = 900;
  const h = 600;
  const cx = w / 2;
  const totalHeight = 480;
  const startY = (h - totalHeight) / 2;
  const count = levels.length;
  const rowH = totalHeight / count;
  const topWidth = 120;
  const bottomWidth = 700;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Render bottom-up: levels[0] is the top of the pyramid */}
        {levels.map((level, i) => {
          // Bottom-up animation: reverse index
          const animIdx = count - 1 - i;
          const delay = animIdx * 10 + 5;
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const t1 = i / count;
          const t2 = (i + 1) / count;
          const w1 = topWidth + (bottomWidth - topWidth) * t1;
          const w2 = topWidth + (bottomWidth - topWidth) * t2;
          const y1 = startY + i * rowH;
          const y2 = y1 + rowH;
          const color = COLORS[i % COLORS.length];

          const points = [
            `${cx - w1 / 2},${y1}`,
            `${cx + w1 / 2},${y1}`,
            `${cx + w2 / 2},${y2}`,
            `${cx - w2 / 2},${y2}`,
          ].join(" ");

          return (
            <g key={i} opacity={opacity}>
              <polygon
                points={points}
                fill={color}
                stroke={tokens.colors.background}
                strokeWidth={2}
              />
              <text
                x={cx}
                y={(y1 + y2) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={18}
                fontWeight={700}
                fill="white"
              >
                {level.label}
              </text>
              {level.description && (
                <text
                  x={cx}
                  y={(y1 + y2) / 2 + 22}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={13}
                  fill="rgba(255,255,255,0.8)"
                >
                  {level.description}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
