import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type GanttTask = {
  label: string;
  start: number;
  end: number;
  color?: string;
};

type GanttChartDiagramProps = {
  tasks: GanttTask[];
};

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

export const GanttChartDiagram: React.FC<GanttChartDiagramProps> = ({
  tasks,
}) => {
  const frame = useCurrentFrame();
  const w = 1200;
  const h = 500;
  const padding = { top: 50, right: 40, bottom: 40, left: 180 };

  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const rowHeight = Math.min(40, chartH / tasks.length);
  const barHeight = rowHeight * 0.6;
  const totalRows = tasks.length;

  // Axis animation
  const axisProgress = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scale ticks (0-100)
  const ticks = [0, 25, 50, 75, 100];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Header line */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left + chartW * axisProgress}
          y2={padding.top}
          stroke="#CBD5E1"
          strokeWidth={2}
        />

        {/* Vertical grid lines and tick labels */}
        {ticks.map((tick, i) => {
          const x = padding.left + (tick / 100) * chartW;
          return (
            <g key={`tick-${i}`} opacity={axisProgress}>
              <line
                x1={x}
                y1={padding.top}
                x2={x}
                y2={padding.top + chartH}
                stroke="#E2E8F0"
                strokeWidth={1}
                strokeDasharray={tick > 0 ? "4,4" : "none"}
              />
              <text
                x={x}
                y={padding.top - 12}
                textAnchor="middle"
                fontSize={12}
                fill={tokens.colors.text.secondary}
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Left axis line */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartH * axisProgress}
          stroke="#CBD5E1"
          strokeWidth={2}
        />

        {/* Row separators and task bars */}
        {tasks.map((task, i) => {
          const delay = i * 10 + 5;
          const progress = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const labelOpacity = interpolate(
            frame,
            [delay, delay + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          const color = task.color || COLORS[i % COLORS.length];
          const rowY = padding.top + i * rowHeight;
          const barY = rowY + (rowHeight - barHeight) / 2;

          const barStartX = padding.left + (task.start / 100) * chartW;
          const barFullWidth = ((task.end - task.start) / 100) * chartW;
          const barCurrentWidth = barFullWidth * progress;

          return (
            <g key={i}>
              {/* Row separator */}
              <line
                x1={padding.left}
                y1={rowY + rowHeight}
                x2={padding.left + chartW}
                y2={rowY + rowHeight}
                stroke="#F1F5F9"
                strokeWidth={1}
                opacity={axisProgress}
              />

              {/* Alternating row background */}
              {i % 2 === 0 && (
                <rect
                  x={padding.left}
                  y={rowY}
                  width={chartW}
                  height={rowHeight}
                  fill="#F8FAFC"
                  opacity={axisProgress * 0.5}
                />
              )}

              {/* Task label */}
              <text
                x={padding.left - 12}
                y={rowY + rowHeight / 2 + 5}
                textAnchor="end"
                fontSize={14}
                fontWeight={500}
                fill={tokens.colors.text.primary}
                opacity={labelOpacity}
              >
                {task.label}
              </text>

              {/* Task bar */}
              <rect
                x={barStartX}
                y={barY}
                width={barCurrentWidth}
                height={barHeight}
                fill={color}
                rx={4}
              />

              {/* Duration label on bar */}
              {barCurrentWidth > 50 && (
                <text
                  x={barStartX + barCurrentWidth / 2}
                  y={barY + barHeight / 2 + 5}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill={tokens.colors.text.inverse}
                  opacity={progress}
                >
                  {task.start}-{task.end}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
