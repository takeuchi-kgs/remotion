import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import type { Annotation } from "../../schemas/annotation";
import { tokens } from "../../styles/tokens";

type AnnotationOverlayProps = {
  annotations: Annotation[];
};

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  annotations,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {annotations.map((ann, i) => {
          const trigger = ann.triggerFrame ?? i * 15;
          const opacity = interpolate(frame, [trigger, trigger + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const color = ann.color ?? tokens.colors.error;

          if (ann.type === "arrow" && ann.targetX != null && ann.targetY != null) {
            return (
              <g key={i} opacity={opacity}>
                <defs>
                  <marker
                    id={`arrowhead-${i}`}
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill={color} />
                  </marker>
                </defs>
                <line
                  x1={ann.x}
                  y1={ann.y}
                  x2={ann.targetX}
                  y2={ann.targetY}
                  stroke={color}
                  strokeWidth={3}
                  markerEnd={`url(#arrowhead-${i})`}
                />
              </g>
            );
          }

          if (ann.type === "circle") {
            const r = (ann.width ?? 60) / 2;
            const scale = interpolate(frame, [trigger, trigger + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={i}
                cx={ann.x}
                cy={ann.y}
                r={r * scale}
                fill="none"
                stroke={color}
                strokeWidth={3}
                opacity={opacity}
              />
            );
          }

          if (ann.type === "highlight") {
            const w = ann.width ?? 200;
            const h = ann.height ?? 40;
            return (
              <rect
                key={i}
                x={ann.x - w / 2}
                y={ann.y - h / 2}
                width={w}
                height={h}
                fill={tokens.colors.highlight}
                opacity={opacity * 0.4}
                rx={4}
              />
            );
          }

          if (ann.type === "underline") {
            const w = ann.width ?? 200;
            const drawProgress = interpolate(
              frame,
              [trigger, trigger + 15],
              [0, w],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <line
                key={i}
                x1={ann.x}
                y1={ann.y}
                x2={ann.x + drawProgress}
                y2={ann.y}
                stroke={color}
                strokeWidth={4}
                opacity={opacity}
              />
            );
          }

          if (ann.type === "box") {
            const w = ann.width ?? 200;
            const h = ann.height ?? 100;
            return (
              <rect
                key={i}
                x={ann.x - w / 2}
                y={ann.y - h / 2}
                width={w}
                height={h}
                fill="none"
                stroke={color}
                strokeWidth={3}
                rx={8}
                opacity={opacity}
              />
            );
          }

          return null;
        })}
      </svg>
    </AbsoluteFill>
  );
};
