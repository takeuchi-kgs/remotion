import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromBottom, staggerDelay } from "../../utils/animation";

type SummarySlideProps = {
  title?: string;
  items?: string[];
};

export const SummarySlide: React.FC<SummarySlideProps> = ({
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
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.md }}>
        {items.map((item, i) => {
          const delay = staggerDelay(i, 10) + 10;
          const checkScale = interpolate(
            frame,
            [delay + 10, delay + 18],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <div
              key={i}
              style={{
                opacity: fadeIn(frame, delay),
                transform: `translateY(${slideInFromBottom(frame, delay, 15, 15)}px)`,
                display: "flex",
                alignItems: "center",
                gap: tokens.spacing.md,
                backgroundColor: tokens.colors.surface,
                padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                borderRadius: 8,
                borderLeft: `4px solid ${tokens.colors.success}`,
              }}
            >
              <div
                style={{
                  transform: `scale(${checkScale})`,
                  fontSize: tokens.typography.fontSize.lg,
                  color: tokens.colors.success,
                  flexShrink: 0,
                  width: 32,
                  textAlign: "center",
                }}
              >
                {"\u2713"}
              </div>
              <span
                style={{
                  fontSize: tokens.typography.fontSize.lg,
                  color: tokens.colors.text.primary,
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
