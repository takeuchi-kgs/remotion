import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromBottom, pulse, staggerDelay } from "../../utils/animation";

type WarningSlideProps = {
  title?: string;
  items?: string[];
};

export const WarningSlide: React.FC<WarningSlideProps> = ({
  title,
  items = [],
}) => {
  const frame = useCurrentFrame();

  const iconOpacity = fadeIn(frame, 0);
  const iconPulse = pulse(frame, 5);
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
        {/* Warning icon */}
        <div
          style={{
            opacity: iconOpacity,
            transform: `scale(${iconPulse})`,
            fontSize: tokens.typography.fontSize["2xl"],
            lineHeight: 1,
          }}
        >
          ⚠️
        </div>

        {/* Title */}
        {title && (
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              fontSize: tokens.typography.fontSize["2xl"],
              fontWeight: 700,
              color: tokens.colors.error,
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
                display: "flex",
                alignItems: "center",
                gap: tokens.spacing.md,
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 40,
                  backgroundColor: tokens.colors.error,
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  backgroundColor: tokens.colors.surface,
                  borderRadius: 8,
                  padding: `${tokens.spacing.md}px ${tokens.spacing.lg}px`,
                  fontSize: tokens.typography.fontSize.lg,
                  color: tokens.colors.text.primary,
                  flex: 1,
                  borderLeft: `3px solid ${tokens.colors.warning}`,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
