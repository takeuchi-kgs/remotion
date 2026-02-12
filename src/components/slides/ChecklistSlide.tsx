import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromBottom, staggerDelay, scaleIn } from "../../utils/animation";

type ChecklistSlideProps = {
  title?: string;
  items?: string[];
};

export const ChecklistSlide: React.FC<ChecklistSlideProps> = ({
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
          const checkboxOpacity = fadeIn(frame, delay);
          const checkmarkScale = interpolate(
            frame,
            [delay + 10, delay + 18],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const textOpacity = fadeIn(frame, delay + 5);

          return (
            <div
              key={i}
              style={{
                opacity: checkboxOpacity,
                transform: `translateY(${slideInFromBottom(frame, delay, 15, 15)}px)`,
                display: "flex",
                alignItems: "center",
                gap: tokens.spacing.md,
                backgroundColor: tokens.colors.surface,
                padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                borderRadius: 8,
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: `2px solid ${checkmarkScale > 0 ? "#10B981" : tokens.colors.text.secondary}`,
                  backgroundColor: checkmarkScale > 0 ? "#10B981" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "border-color 0.2s",
                }}
              >
                <div
                  style={{
                    transform: `scale(${checkmarkScale})`,
                    fontSize: tokens.typography.fontSize.md,
                    color: tokens.colors.text.inverse,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {"\u2713"}
                </div>
              </div>
              {/* Item text */}
              <span
                style={{
                  opacity: textOpacity,
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
