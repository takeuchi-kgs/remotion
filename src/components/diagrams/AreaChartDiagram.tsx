import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type AreaSeries = {
  label: string;
  data: number[];
  color?: string;
};

type AreaChartDiagramProps = {
  series: AreaSeries[];
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

export const AreaChartDiagram: React.FC<AreaChartDiagramProps> = ({
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

  const baselineY = padding.top + chartH;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          {/* ClipRect for each series to animate area fill from bottom */}
          {series.map((_, si) => {
            const clipDelay = si * 15 + 5;
            const clipProgress = interpolate(
              frame,
              [clipDelay, clipDelay + 20],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const clipHeight = chartH * clipProgress;
            const clipY = baselineY - clipHeight;

            return (
              <clipPath key={`clip-${si}`} id={`area-clip-${si}`}>
                <rect
                  x={padding.left}
                  y={clipY}
                  width={chartW}
                  height={clipHeight}
                />
              </clipPath>
            );
          })}
        </defs>

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
          y1={baselineY}
          x2={padding.left + chartW * axisProgress}
          y2={baselineY}
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
              y={baselineY + 24}
              textAnchor="middle"
              fontSize={13}
              fill={tokens.colors.text.secondary}
              opacity={axisProgress}
            >
              {label}
            </text>
          );
        })}

        {/* Area fills and lines (render in reverse so first series is on top) */}
        {[...series].reverse().map((s, reversedIdx) => {
          const si = series.length - 1 - reversedIdx;
          const color = s.color || COLORS[si % COLORS.length];

          // Build polygon points: line points + baseline points
          const topPoints = s.data.map(
            (val, di) => `${getX(di)},${getY(val)}`,
          );
          const bottomRight = `${getX(s.data.length - 1)},${baselineY}`;
          const bottomLeft = `${getX(0)},${baselineY}`;
          const polygonPoints = [...topPoints, bottomRight, bottomLeft].join(
            " ",
          );

          // Polyline for the top edge
          const linePoints = topPoints.join(" ");

          return (
            <g key={`area-${si}`} clipPath={`url(#area-clip-${si})`}>
              {/* Filled area */}
              <polygon points={polygonPoints} fill={`${color}33`} />
              {/* Top line */}
              <polyline
                points={linePoints}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {/* Dots on top of everything */}
        {series.map((s, si) => {
          const color = s.color || COLORS[si % COLORS.length];
          const clipDelay = si * 15 + 5;

          return s.data.map((val, di) => {
            const dotDelay =
              clipDelay + (di / Math.max(s.data.length - 1, 1)) * 20;
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
                r={4 * dotScale}
                fill={tokens.colors.surface}
                stroke={color}
                strokeWidth={2}
              />
            );
          });
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
              <rect x={0} y={-8} width={16} height={8} rx={2} fill={color} />
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
