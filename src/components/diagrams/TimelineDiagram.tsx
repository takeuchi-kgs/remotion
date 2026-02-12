import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type TimelineEvent = {
  label: string;
  description?: string;
};

type TimelineDiagramProps = {
  events: TimelineEvent[];
};

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

export const TimelineDiagram: React.FC<TimelineDiagramProps> = ({ events }) => {
  const frame = useCurrentFrame();
  const w = 1600;
  const h = 400;
  const padding = 80;
  const lineY = h / 2;
  const spacing = (w - padding * 2) / Math.max(events.length - 1, 1);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Main line */}
        <line
          x1={padding}
          y1={lineY}
          x2={interpolate(frame, [0, 20], [padding, w - padding], {
            extrapolateRight: "clamp",
          })}
          y2={lineY}
          stroke="#CBD5E1"
          strokeWidth={3}
        />

        {events.map((event, i) => {
          const x = padding + i * spacing;
          const delay = i * 10 + 10;
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const color = COLORS[i % COLORS.length];
          const isAbove = i % 2 === 0;

          return (
            <g key={i} opacity={opacity}>
              {/* Node */}
              <circle
                cx={x}
                cy={lineY}
                r={10 * scale}
                fill={color}
              />
              {/* Connector line */}
              <line
                x1={x}
                y1={lineY + (isAbove ? -14 : 14)}
                x2={x}
                y2={lineY + (isAbove ? -50 : 50)}
                stroke={color}
                strokeWidth={2}
                opacity={opacity}
              />
              {/* Label */}
              <text
                x={x}
                y={lineY + (isAbove ? -60 : 70)}
                textAnchor="middle"
                fontSize={20}
                fontWeight={700}
                fill={tokens.colors.text.primary}
                opacity={opacity}
              >
                {event.label}
              </text>
              {/* Description */}
              {event.description && (
                <text
                  x={x}
                  y={lineY + (isAbove ? -85 : 95)}
                  textAnchor="middle"
                  fontSize={14}
                  fill={tokens.colors.text.secondary}
                  opacity={opacity}
                >
                  {event.description}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
