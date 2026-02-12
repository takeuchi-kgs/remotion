import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromLeft, slideInFromBottom, staggerDelay } from "../../utils/animation";

type AgendaSlideProps = {
  title?: string;
  items?: string[];
};

// Rotating colors for number circles
const circleColors = [
  tokens.colors.primary,
  tokens.colors.secondary,
  tokens.colors.accent,
  tokens.colors.success,
  tokens.colors.info,
  tokens.colors.error,
];

export const AgendaSlide: React.FC<AgendaSlideProps> = ({
  title,
  items = [],
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
            transform: `translateY(${slideInFromBottom(frame, 0)}px)`,
            fontSize: tokens.typography.fontSize["2xl"],
            fontWeight: 700,
            color: tokens.colors.text.primary,
            marginBottom: tokens.spacing.xl,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.lg }}>
        {items.map((item, i) => {
          const delay = staggerDelay(i, 10) + 10;
          const color = circleColors[i % circleColors.length];

          return (
            <div
              key={i}
              style={{
                opacity: fadeIn(frame, delay),
                transform: `translateX(${slideInFromLeft(frame, delay)}px)`,
                display: "flex",
                alignItems: "center",
                gap: tokens.spacing.md,
              }}
            >
              {/* Number circle */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: tokens.typography.fontSize.lg,
                  fontWeight: 700,
                  color: tokens.colors.text.inverse,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              {/* Item text */}
              <span
                style={{
                  fontSize: tokens.typography.fontSize.lg,
                  color: tokens.colors.text.primary,
                  fontWeight: 500,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
