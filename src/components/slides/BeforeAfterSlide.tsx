import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromLeft, slideInFromRight, slideInFromBottom, staggerDelay } from "../../utils/animation";

type BeforeAfterSlideProps = {
  title?: string;
  leftColumn?: { title: string; items: string[] };
  rightColumn?: { title: string; items: string[] };
};

export const BeforeAfterSlide: React.FC<BeforeAfterSlideProps> = ({
  title,
  leftColumn = { title: "", items: [] },
  rightColumn = { title: "", items: [] },
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
      <div
        style={{
          display: "flex",
          gap: tokens.spacing.md,
          flex: 1,
          alignItems: "center",
        }}
      >
        {/* Left Column (Before) */}
        <div
          style={{
            flex: 1,
            opacity: fadeIn(frame, 8),
            transform: `translateX(${slideInFromLeft(frame, 8)}px)`,
            backgroundColor: tokens.colors.surface,
            borderRadius: 12,
            padding: tokens.spacing.lg,
            borderTop: `4px solid ${tokens.colors.error}`,
            alignSelf: "stretch",
          }}
        >
          <div
            style={{
              fontSize: tokens.typography.fontSize.xl,
              fontWeight: 700,
              color: tokens.colors.error,
              marginBottom: tokens.spacing.md,
            }}
          >
            {leftColumn.title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
            {leftColumn.items.map((item, i) => {
              const delay = staggerDelay(i) + 20;
              return (
                <div
                  key={i}
                  style={{
                    opacity: fadeIn(frame, delay),
                    transform: `translateY(${slideInFromBottom(frame, delay, 15, 15)}px)`,
                    fontSize: tokens.typography.fontSize.md,
                    color: tokens.colors.text.primary,
                    display: "flex",
                    alignItems: "center",
                    gap: tokens.spacing.xs,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: tokens.colors.error,
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            opacity: fadeIn(frame, 18),
            fontSize: tokens.typography.fontSize["2xl"],
            color: tokens.colors.text.secondary,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: `0 ${tokens.spacing.sm}px`,
          }}
        >
          {"\u2192"}
        </div>

        {/* Right Column (After) */}
        <div
          style={{
            flex: 1,
            opacity: fadeIn(frame, 12),
            transform: `translateX(${slideInFromRight(frame, 12)}px)`,
            backgroundColor: tokens.colors.surface,
            borderRadius: 12,
            padding: tokens.spacing.lg,
            borderTop: `4px solid ${tokens.colors.success}`,
            alignSelf: "stretch",
          }}
        >
          <div
            style={{
              fontSize: tokens.typography.fontSize.xl,
              fontWeight: 700,
              color: tokens.colors.success,
              marginBottom: tokens.spacing.md,
            }}
          >
            {rightColumn.title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
            {rightColumn.items.map((item, i) => {
              const delay = staggerDelay(i) + 24;
              return (
                <div
                  key={i}
                  style={{
                    opacity: fadeIn(frame, delay),
                    transform: `translateY(${slideInFromBottom(frame, delay, 15, 15)}px)`,
                    fontSize: tokens.typography.fontSize.md,
                    color: tokens.colors.text.primary,
                    display: "flex",
                    alignItems: "center",
                    gap: tokens.spacing.xs,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: tokens.colors.success,
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
