import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type PieSlice = {
  label: string;
  value: number;
  color?: string;
};

type PieDiagramProps = {
  slices: PieSlice[];
};

const DEFAULT_COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
  "#8B5CF6",
  "#F97316",
];

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export const PieDiagram: React.FC<PieDiagramProps> = ({ slices }) => {
  const frame = useCurrentFrame();
  const cx = 400;
  const cy = 300;
  const radius = 200;
  const labelRadius = 260;
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  let currentAngle = -Math.PI / 2;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={900} height={600} viewBox="0 0 900 600">
        {slices.map((slice, i) => {
          const sliceAngle = (slice.value / total) * 2 * Math.PI;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;
          const midAngle = startAngle + sliceAngle / 2;

          const delay = i * 8;
          const sweepProgress = interpolate(
            frame,
            [delay, delay + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const animatedEnd = startAngle + sliceAngle * sweepProgress;

          const labelOpacity = interpolate(
            frame,
            [delay + 12, delay + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          const color = slice.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const labelPos = polarToCartesian(cx, cy, labelRadius, midAngle);

          currentAngle = endAngle;

          return (
            <g key={i}>
              <path
                d={arcPath(cx, cy, radius, startAngle, animatedEnd)}
                fill={color}
                stroke={tokens.colors.background}
                strokeWidth={2}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor={midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2 ? "end" : "start"}
                dominantBaseline="middle"
                fontSize={16}
                fontWeight={600}
                fill={tokens.colors.text.primary}
                opacity={labelOpacity}
              >
                {slice.label} ({Math.round((slice.value / total) * 100)}%)
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
