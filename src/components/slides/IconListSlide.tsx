import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import {
  fadeIn,
  scaleIn,
  slideInFromRight,
  staggerDelay,
} from "../../utils/animation";

const COLORS = [
  tokens.colors.primary,
  tokens.colors.secondary,
  "#059669",
  tokens.colors.accent,
  "#EC4899",
  "#06B6D4",
];

type IconListSlideProps = {
  title?: string;
  iconItems?: Array<{
    icon: string;
    text: string;
  }>;
};

export const IconListSlide: React.FC<IconListSlideProps> = ({
  title,
  iconItems = [],
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.background,
        fontFamily: tokens.typography.fontFamily.sans,
        padding: tokens.spacing["2xl"],
        justifyContent: "center",
      }}
    >
      {title && (
        <div
          style={{
            opacity: fadeIn(frame, 0),
            fontSize: tokens.typography.fontSize["2xl"],
            fontWeight: 700,
            color: tokens.colors.text.primary,
            marginBottom: tokens.spacing.xl,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.md }}>
        {iconItems.map((item, i) => {
          const delay = staggerDelay(i, 8) + 10;
          const color = COLORS[i % COLORS.length];

          return (
            <div
              key={i}
              style={{
                opacity: fadeIn(frame, delay),
                display: "flex",
                alignItems: "center",
                gap: tokens.spacing.md,
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  transform: `scale(${scaleIn(frame, delay)})`,
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: tokens.typography.fontSize.lg,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              {/* Text */}
              <span
                style={{
                  opacity: fadeIn(frame, delay + 3),
                  transform: `translateX(${slideInFromRight(frame, delay + 3, 15, 30)}px)`,
                  fontSize: tokens.typography.fontSize.lg,
                  color: tokens.colors.text.primary,
                  fontWeight: 500,
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
