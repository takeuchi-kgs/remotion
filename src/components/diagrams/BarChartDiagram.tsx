import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type Bar = {
  label: string;
  value: number;
  color?: string;
};

type BarChartDiagramProps = {
  orientation?: "vertical" | "horizontal";
  bars: Bar[];
};

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

export const BarChartDiagram: React.FC<BarChartDiagramProps> = ({
  orientation = "vertical",
  bars,
}) => {
  const frame = useCurrentFrame();
  const w = 900;
  const h = 600;
  const padding = { top: 40, right: 40, bottom: 80, left: 80 };
  const maxValue = Math.max(...bars.map((b) => b.value));

  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // Axis animation
  const axisProgress = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (orientation === "vertical") {
    const barWidth = Math.min(60, (chartW / bars.length) * 0.6);
    const barSpacing = chartW / bars.length;

    return (
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: tokens.typography.fontFamily.sans,
        }}
      >
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          {/* Y axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + chartH * axisProgress}
            stroke="#CBD5E1"
            strokeWidth={2}
          />
          {/* X axis */}
          <line
            x1={padding.left}
            y1={padding.top + chartH}
            x2={padding.left + chartW * axisProgress}
            y2={padding.top + chartH}
            stroke="#CBD5E1"
            strokeWidth={2}
          />

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((tick, i) => {
            const y = padding.top + chartH * (1 - tick);
            return (
              <g key={`grid-${i}`} opacity={axisProgress}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartW}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 5}
                  textAnchor="end"
                  fontSize={12}
                  fill={tokens.colors.text.secondary}
                >
                  {Math.round(maxValue * tick)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {bars.map((bar, i) => {
            const delay = i * 10 + 5;
            const progress = interpolate(frame, [delay, delay + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const labelOpacity = interpolate(
              frame,
              [delay + 8, delay + 16],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            const color = bar.color || COLORS[i % COLORS.length];
            const barHeight = (bar.value / maxValue) * chartH * progress;
            const x =
              padding.left + i * barSpacing + (barSpacing - barWidth) / 2;
            const y = padding.top + chartH - barHeight;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx={3}
                />
                {/* Value label */}
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={600}
                  fill={tokens.colors.text.primary}
                  opacity={labelOpacity}
                >
                  {bar.value}
                </text>
                {/* Category label */}
                <text
                  x={x + barWidth / 2}
                  y={padding.top + chartH + 24}
                  textAnchor="middle"
                  fontSize={14}
                  fill={tokens.colors.text.secondary}
                  opacity={labelOpacity}
                >
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    );
  }

  // Horizontal orientation
  const barHeight = Math.min(40, (chartH / bars.length) * 0.6);
  const barSpacing = chartH / bars.length;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Y axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartH * axisProgress}
          stroke="#CBD5E1"
          strokeWidth={2}
        />
        {/* X axis */}
        <line
          x1={padding.left}
          y1={padding.top + chartH}
          x2={padding.left + chartW * axisProgress}
          y2={padding.top + chartH}
          stroke="#CBD5E1"
          strokeWidth={2}
        />

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((tick, i) => {
          const x = padding.left + chartW * tick;
          return (
            <g key={`grid-${i}`} opacity={axisProgress}>
              <line
                x1={x}
                y1={padding.top}
                x2={x}
                y2={padding.top + chartH}
                stroke="#E2E8F0"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <text
                x={x}
                y={padding.top + chartH + 20}
                textAnchor="middle"
                fontSize={12}
                fill={tokens.colors.text.secondary}
              >
                {Math.round(maxValue * tick)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {bars.map((bar, i) => {
          const delay = i * 10 + 5;
          const progress = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const labelOpacity = interpolate(
            frame,
            [delay + 8, delay + 16],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          const color = bar.color || COLORS[i % COLORS.length];
          const barW = (bar.value / maxValue) * chartW * progress;
          const y =
            padding.top + i * barSpacing + (barSpacing - barHeight) / 2;

          return (
            <g key={i}>
              <rect
                x={padding.left}
                y={y}
                width={barW}
                height={barHeight}
                fill={color}
                rx={3}
              />
              {/* Value label */}
              <text
                x={padding.left + barW + 8}
                y={y + barHeight / 2 + 5}
                textAnchor="start"
                fontSize={14}
                fontWeight={600}
                fill={tokens.colors.text.primary}
                opacity={labelOpacity}
              >
                {bar.value}
              </text>
              {/* Category label */}
              <text
                x={padding.left - 10}
                y={y + barHeight / 2 + 5}
                textAnchor="end"
                fontSize={14}
                fill={tokens.colors.text.secondary}
                opacity={labelOpacity}
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
