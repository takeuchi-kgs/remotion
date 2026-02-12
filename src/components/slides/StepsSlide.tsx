import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromBottom, staggerDelay } from "../../utils/animation";

type StepsSlideProps = {
  title?: string;
  items?: string[];
};

export const StepsSlide: React.FC<StepsSlideProps> = ({
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
          const delay = staggerDelay(i, 12) + 10;
          const opacity = fadeIn(frame, delay);
          const isActive = frame >= delay + 15;

          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: tokens.spacing.md }}>
              {/* Step connector line */}
              {i > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: 83,
                    marginTop: -(tokens.spacing.lg + 20),
                    width: 3,
                    height: tokens.spacing.lg + 20,
                    backgroundColor: tokens.colors.primary,
                    opacity: fadeIn(frame, delay - 6),
                  }}
                />
              )}
              {/* Step number circle */}
              <div
                style={{
                  opacity,
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: isActive ? tokens.colors.primary : tokens.colors.surface,
                  border: `3px solid ${tokens.colors.primary}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: tokens.typography.fontSize.md,
                  fontWeight: 700,
                  color: isActive ? tokens.colors.text.inverse : tokens.colors.primary,
                  flexShrink: 0,
                  transition: "background-color 0.3s",
                }}
              >
                {i + 1}
              </div>
              {/* Step text */}
              <span
                style={{
                  opacity,
                  transform: `translateY(${slideInFromBottom(frame, delay, 15, 15)}px)`,
                  fontSize: tokens.typography.fontSize.lg,
                  color: tokens.colors.text.primary,
                  fontWeight: isActive ? 600 : 400,
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
