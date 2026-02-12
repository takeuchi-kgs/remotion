import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type FunnelStage = {
  label: string;
  value?: number;
};

type FunnelDiagramProps = {
  stages: FunnelStage[];
};

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

export const FunnelDiagram: React.FC<FunnelDiagramProps> = ({ stages }) => {
  const frame = useCurrentFrame();
  const w = 900;
  const h = 600;
  const cx = w / 2;
  const topWidth = 600;
  const bottomWidth = 150;
  const totalHeight = 480;
  const startY = (h - totalHeight) / 2;
  const count = stages.length;
  const rowH = totalHeight / count;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {stages.map((stage, i) => {
          const delay = i * 10 + 5;
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const t1 = i / count;
          const t2 = (i + 1) / count;
          const w1 = topWidth - (topWidth - bottomWidth) * t1;
          const w2 = topWidth - (topWidth - bottomWidth) * t2;
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
                y={(y1 + y2) / 2 + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={18}
                fontWeight={700}
                fill="white"
              >
                {stage.label}
              </text>
              {stage.value !== undefined && (
                <text
                  x={cx + w1 / 2 + 20}
                  y={(y1 + y2) / 2 + 2}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontSize={16}
                  fill={tokens.colors.text.secondary}
                >
                  {stage.value}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
