import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromBottom, scaleIn, staggerDelay } from "../../utils/animation";

type TipsSlideProps = {
  title?: string;
  items?: string[];
};

export const TipsSlide: React.FC<TipsSlideProps> = ({
  title,
  items = [],
}) => {
  const frame = useCurrentFrame();

  const iconScale = scaleIn(frame, 0);
  const iconOpacity = fadeIn(frame, 0);
  const titleOpacity = fadeIn(frame, 5);
  const titleY = slideInFromBottom(frame, 5);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.background,
        fontFamily: tokens.typography.fontFamily.sans,
        padding: tokens.spacing["2xl"],
        justifyContent: "center",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: tokens.spacing.md,
          marginBottom: tokens.spacing.xl,
        }}
      >
        {/* Lightbulb icon */}
        <div
          style={{
            opacity: iconOpacity,
            transform: `scale(${iconScale})`,
            fontSize: tokens.typography.fontSize["2xl"],
            lineHeight: 1,
          }}
        >
          💡
        </div>

        {/* TIPS badge */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            backgroundColor: tokens.colors.accent,
            color: tokens.colors.text.inverse,
            fontSize: tokens.typography.fontSize.md,
            fontWeight: 700,
            padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
            borderRadius: 8,
            letterSpacing: 2,
          }}
        >
          TIPS
        </div>

        {/* Title */}
        {title && (
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              fontSize: tokens.typography.fontSize["2xl"],
              fontWeight: 700,
              color: tokens.colors.text.primary,
            }}
          >
            {title}
          </div>
        )}
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.md }}>
        {items.map((item, i) => {
          const delay = staggerDelay(i) + 15;
          return (
            <div
              key={i}
              style={{
                opacity: fadeIn(frame, delay),
                transform: `translateY(${slideInFromBottom(frame, delay)}px)`,
                backgroundColor: tokens.colors.surface,
                borderRadius: 12,
                padding: `${tokens.spacing.md}px ${tokens.spacing.lg}px`,
                fontSize: tokens.typography.fontSize.lg,
                color: tokens.colors.text.primary,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
