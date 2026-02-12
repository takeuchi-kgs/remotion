import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type CycleDiagramProps = {
  steps: string[];
};

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

export const CycleDiagram: React.FC<CycleDiagramProps> = ({ steps }) => {
  const frame = useCurrentFrame();
  const cx = 450;
  const cy = 300;
  const radius = 200;
  const nodeRadius = 45;
  const count = steps.length;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={900} height={600} viewBox="0 0 900 600">
        {steps.map((step, i) => {
          const angle = (2 * Math.PI * i) / count - Math.PI / 2;
          const nextAngle = (2 * Math.PI * ((i + 1) % count)) / count - Math.PI / 2;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          const nextX = cx + radius * Math.cos(nextAngle);
          const nextY = cy + radius * Math.sin(nextAngle);

          const delay = i * 10 + 5;
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const color = COLORS[i % COLORS.length];

          // Arrow along arc
          const arrowDelay = delay + 8;
          const arrowOpacity = interpolate(frame, [arrowDelay, arrowDelay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Midpoint for arrow
          const midAngle = (angle + nextAngle + (nextAngle < angle ? 2 * Math.PI : 0)) / 2;
          const arrowR = radius - 5;
          const midX = cx + arrowR * Math.cos(midAngle);
          const midY = cy + arrowR * Math.sin(midAngle);

          return (
            <g key={i}>
              {/* Arrow from this node toward next */}
              <line
                x1={x + nodeRadius * Math.cos(nextAngle < angle ? midAngle : midAngle)}
                y1={y + nodeRadius * Math.sin(nextAngle < angle ? midAngle : midAngle)}
                x2={midX}
                y2={midY}
                stroke="#CBD5E1"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
                opacity={arrowOpacity}
              />
              {/* Node circle */}
              <circle
                cx={x}
                cy={y}
                r={nodeRadius * scale}
                fill={color}
                opacity={opacity}
              />
              {/* Label */}
              <text
                x={x}
                y={y + 6}
                textAnchor="middle"
                fontSize={16}
                fontWeight={700}
                fill="white"
                opacity={opacity}
              >
                {step}
              </text>
            </g>
          );
        })}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#CBD5E1" />
          </marker>
        </defs>
      </svg>
    </AbsoluteFill>
  );
};
