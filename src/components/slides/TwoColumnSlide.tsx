import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromLeft, slideInFromRight, slideInFromBottom, staggerDelay } from "../../utils/animation";

type TwoColumnSlideProps = {
  title?: string;
  leftColumn?: { title: string; items: string[] };
  rightColumn?: { title: string; items: string[] };
};

export const TwoColumnSlide: React.FC<TwoColumnSlideProps> = ({
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
          gap: tokens.spacing.xl,
          flex: 1,
          alignItems: "stretch",
        }}
      >
        {/* Left Column */}
        <div
          style={{
            flex: 1,
            opacity: fadeIn(frame, 8),
            transform: `translateX(${slideInFromLeft(frame, 8)}px)`,
          }}
        >
          <div
            style={{
              fontSize: tokens.typography.fontSize.xl,
              fontWeight: 700,
              color: tokens.colors.text.primary,
              marginBottom: tokens.spacing.md,
            }}
          >
            {leftColumn.title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
            {leftColumn.items.map((item, i) => {
              const delay = staggerDelay(i) + 18;
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
                      backgroundColor: tokens.colors.primary,
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div
          style={{
            flex: 1,
            opacity: fadeIn(frame, 8),
            transform: `translateX(${slideInFromRight(frame, 8)}px)`,
          }}
        >
          <div
            style={{
              fontSize: tokens.typography.fontSize.xl,
              fontWeight: 700,
              color: tokens.colors.text.primary,
              marginBottom: tokens.spacing.md,
            }}
          >
            {rightColumn.title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
            {rightColumn.items.map((item, i) => {
              const delay = staggerDelay(i) + 18;
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
                      backgroundColor: tokens.colors.primary,
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
