import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type RadarAxis = {
  label: string;
  value: number;
};

type RadarChartDiagramProps = {
  axes: RadarAxis[];
};

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleIndex: number,
  total: number,
): { x: number; y: number } {
  const angle = (2 * Math.PI * angleIndex) / total - Math.PI / 2;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

export const RadarChartDiagram: React.FC<RadarChartDiagramProps> = ({
  axes,
}) => {
  const frame = useCurrentFrame();
  const size = 600;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = 200;
  const labelRadius = maxRadius + 35;
  const n = axes.length;
  const maxValue = Math.max(...axes.map((a) => a.value));
  const rings = 3;

  // Web grid fade-in
  const webOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Data polygon grows from center
  const dataProgress = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label fade-in
  const labelOpacity = interpolate(frame, [15, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Build web grid polygons (3 rings)
  const webPolygons: string[] = [];
  for (let ring = 1; ring <= rings; ring++) {
    const r = (maxRadius / rings) * ring;
    const points = Array.from({ length: n }, (_, i) => {
      const p = polarToCartesian(cx, cy, r, i, n);
      return `${p.x},${p.y}`;
    }).join(" ");
    webPolygons.push(points);
  }

  // Axis lines from center to each vertex
  const axisLines = Array.from({ length: n }, (_, i) =>
    polarToCartesian(cx, cy, maxRadius, i, n),
  );

  // Data polygon points
  const dataPoints = axes
    .map((axis, i) => {
      const r = (axis.value / maxValue) * maxRadius * dataProgress;
      const p = polarToCartesian(cx, cy, r, i, n);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  // Data dots
  const dataDots = axes.map((axis, i) => {
    const r = (axis.value / maxValue) * maxRadius * dataProgress;
    return polarToCartesian(cx, cy, r, i, n);
  });

  // Label positions
  const labelPositions = axes.map((_, i) =>
    polarToCartesian(cx, cy, labelRadius, i, n),
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Web grid rings */}
        {webPolygons.map((points, i) => (
          <polygon
            key={`ring-${i}`}
            points={points}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth={1}
            opacity={webOpacity}
          />
        ))}

        {/* Axis lines from center to vertices */}
        {axisLines.map((pos, i) => (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={pos.x}
            y2={pos.y}
            stroke="#CBD5E1"
            strokeWidth={1}
            opacity={webOpacity}
          />
        ))}

        {/* Data polygon (filled) */}
        <polygon
          points={dataPoints}
          fill={`${COLORS[0]}4D`}
          stroke={COLORS[0]}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Data dots */}
        {dataDots.map((pos, i) => {
          const dotDelay = 15 + i * 3;
          const dotScale = interpolate(
            frame,
            [dotDelay, dotDelay + 6],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <circle
              key={`dot-${i}`}
              cx={pos.x}
              cy={pos.y}
              r={5 * dotScale}
              fill={COLORS[0]}
              stroke={tokens.colors.surface}
              strokeWidth={2}
            />
          );
        })}

        {/* Labels at vertices */}
        {labelPositions.map((pos, i) => {
          // Determine text anchor based on position
          const angle = (2 * Math.PI * i) / n - Math.PI / 2;
          const cos = Math.cos(angle);
          let textAnchor: "start" | "middle" | "end" = "middle";
          if (cos > 0.3) textAnchor = "start";
          else if (cos < -0.3) textAnchor = "end";

          return (
            <g key={`label-${i}`} opacity={labelOpacity}>
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fontSize={14}
                fontWeight={600}
                fill={tokens.colors.text.primary}
              >
                {axes[i].label}
              </text>
              <text
                x={pos.x}
                y={pos.y + 22}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fontSize={12}
                fill={tokens.colors.text.secondary}
              >
                {axes[i].value}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
