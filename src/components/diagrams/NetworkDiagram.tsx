import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type NetworkNode = {
  id: string;
  label: string;
  size?: number;
};

type NetworkLink = {
  source: string;
  target: string;
  label?: string;
};

type NetworkDiagramProps = {
  nodes: NetworkNode[];
  links: NetworkLink[];
};

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({
  nodes,
  links,
}) => {
  const frame = useCurrentFrame();
  const w = 900;
  const h = 600;
  const cx = w / 2;
  const cy = h / 2;
  const layoutRadius = 200;

  // Compute circular layout positions
  const positions = new Map<string, { x: number; y: number }>();
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    positions.set(node.id, {
      x: cx + layoutRadius * Math.cos(angle),
      y: cy + layoutRadius * Math.sin(angle),
    });
  });

  // Calculate total stagger time for nodes
  const nodesEndFrame = nodes.length * 6 + 12;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Links (drawn first, behind nodes) */}
        {links.map((link, i) => {
          const sourcePos = positions.get(link.source);
          const targetPos = positions.get(link.target);
          if (!sourcePos || !targetPos) return null;

          const linkDelay = nodesEndFrame + i * 5;
          const linkOpacity = interpolate(
            frame,
            [linkDelay, linkDelay + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          // Calculate line length for dash animation
          const dx = targetPos.x - sourcePos.x;
          const dy = targetPos.y - sourcePos.y;
          const lineLength = Math.sqrt(dx * dx + dy * dy);
          const lineProgress = interpolate(
            frame,
            [linkDelay, linkDelay + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const dashOffset = lineLength * (1 - lineProgress);

          const midX = (sourcePos.x + targetPos.x) / 2;
          const midY = (sourcePos.y + targetPos.y) / 2;

          return (
            <g key={`link-${i}`}>
              <line
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke="#CBD5E1"
                strokeWidth={2}
                strokeDasharray={lineLength}
                strokeDashoffset={dashOffset}
              />
              {link.label && (
                <text
                  x={midX}
                  y={midY - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fill={tokens.colors.text.secondary}
                  opacity={linkOpacity}
                >
                  {link.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = positions.get(node.id);
          if (!pos) return null;

          const delay = i * 6 + 5;
          const scale = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const color = COLORS[i % COLORS.length];
          const nodeSize = node.size || 28;

          // Label position: push outward from center
          const angle = Math.atan2(pos.y - cy, pos.x - cx);
          const labelDist = nodeSize + 18;
          const labelX = pos.x + Math.cos(angle) * labelDist;
          const labelY = pos.y + Math.sin(angle) * labelDist;

          const cos = Math.cos(angle);
          let textAnchor: "start" | "middle" | "end" = "middle";
          if (cos > 0.3) textAnchor = "start";
          else if (cos < -0.3) textAnchor = "end";

          return (
            <g key={`node-${node.id}`} opacity={opacity}>
              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeSize * scale}
                fill={color}
                stroke={tokens.colors.surface}
                strokeWidth={3}
              />
              {/* Node label */}
              <text
                x={labelX}
                y={labelY + 5}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fontSize={14}
                fontWeight={600}
                fill={tokens.colors.text.primary}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
