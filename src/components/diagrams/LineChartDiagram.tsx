import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type Series = {
  label: string;
  data: number[];
  color?: string;
};

type LineChartDiagramProps = {
  series: Series[];
  xLabels?: string[];
};

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

export const LineChartDiagram: React.FC<LineChartDiagramProps> = ({
  series,
  xLabels,
}) => {
  const frame = useCurrentFrame();
  const w = 900;
  const h = 600;
  const padding = { top: 40, right: 60, bottom: 80, left: 80 };

  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const allValues = series.flatMap((s) => s.data);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(0, Math.min(...allValues));
  const range = maxValue - minValue;

  const maxPoints = Math.max(...series.map((s) => s.data.length));
  const stepX = chartW / Math.max(maxPoints - 1, 1);

  // Axis animation
  const axisProgress = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  function getX(index: number) {
    return padding.left + index * stepX;
  }

  function getY(value: number) {
    return padding.top + chartH - ((value - minValue) / range) * chartH;
  }

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

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((tick, i) => {
          const value = minValue + range * tick;
          const y = getY(value);
          return (
            <g key={`grid-h-${i}`} opacity={axisProgress}>
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
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {xLabels?.map((label, i) => {
          const x = getX(i);
          return (
            <text
              key={`xlabel-${i}`}
              x={x}
              y={padding.top + chartH + 24}
              textAnchor="middle"
              fontSize={13}
              fill={tokens.colors.text.secondary}
              opacity={axisProgress}
            >
              {label}
            </text>
          );
        })}

        {/* Lines and dots */}
        {series.map((s, si) => {
          const color = s.color || COLORS[si % COLORS.length];

          // Build the polyline points
          const points = s.data.map(
            (val, di) => `${getX(di)},${getY(val)}`,
          );
          const polylineStr = points.join(" ");

          // Calculate total path length for stroke-dashoffset animation
          let totalLength = 0;
          for (let i = 1; i < s.data.length; i++) {
            const dx = getX(i) - getX(i - 1);
            const dy = getY(s.data[i]) - getY(s.data[i - 1]);
            totalLength += Math.sqrt(dx * dx + dy * dy);
          }

          const lineDelay = si * 15 + 5;
          const lineProgress = interpolate(
            frame,
            [lineDelay, lineDelay + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const dashOffset = totalLength * (1 - lineProgress);

          return (
            <g key={`series-${si}`}>
              {/* Line */}
              <polyline
                points={polylineStr}
                fill="none"
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={totalLength}
                strokeDashoffset={dashOffset}
              />

              {/* Dots at data points */}
              {s.data.map((val, di) => {
                const dotDelay = lineDelay + (di / Math.max(s.data.length - 1, 1)) * 20;
                const dotScale = interpolate(
                  frame,
                  [dotDelay, dotDelay + 6],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                return (
                  <circle
                    key={`dot-${si}-${di}`}
                    cx={getX(di)}
                    cy={getY(val)}
                    r={5 * dotScale}
                    fill={tokens.colors.surface}
                    stroke={color}
                    strokeWidth={2}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Legend */}
        {series.map((s, si) => {
          const color = s.color || COLORS[si % COLORS.length];
          const legendDelay = si * 15 + 25;
          const legendOpacity = interpolate(
            frame,
            [legendDelay, legendDelay + 8],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <g
              key={`legend-${si}`}
              opacity={legendOpacity}
              transform={`translate(${padding.left + si * 120}, ${h - 30})`}
            >
              <rect x={0} y={-8} width={16} height={4} rx={2} fill={color} />
              <text
                x={22}
                y={0}
                fontSize={13}
                fill={tokens.colors.text.secondary}
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
