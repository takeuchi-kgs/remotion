import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromLeft, staggerDelay } from "../../utils/animation";

type ProcessSlideProps = {
  title?: string;
  items?: string[];
};

export const ProcessSlide: React.FC<ProcessSlideProps> = ({
  title,
  items = [],
}) => {
  const frame = useCurrentFrame();

  const itemsPerRow = items.length > 4 ? Math.ceil(items.length / 2) : items.length;
  const rows: string[][] = [];
  for (let i = 0; i < items.length; i += itemsPerRow) {
    rows.push(items.slice(i, i + itemsPerRow));
  }

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
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.xl }}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
            }}
          >
            {row.map((item, i) => {
              const globalIndex = rowIndex * itemsPerRow + i;
              const delay = staggerDelay(globalIndex, 12) + 10;
              const arrowProgress = interpolate(
                frame,
                [delay + 12, delay + 22],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );

              return (
                <React.Fragment key={i}>
                  {/* Step card */}
                  <div
                    style={{
                      opacity: fadeIn(frame, delay),
                      transform: `translateX(${slideInFromLeft(frame, delay, 20, 40)}px)`,
                      backgroundColor: tokens.colors.surface,
                      border: `2px solid ${tokens.colors.primary}`,
                      borderRadius: 16,
                      padding: `${tokens.spacing.md}px ${tokens.spacing.lg}px`,
                      display: "flex",
                      alignItems: "center",
                      gap: tokens.spacing.sm,
                      minWidth: 160,
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: tokens.colors.primary,
                        color: tokens.colors.text.inverse,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: tokens.typography.fontSize.sm,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {globalIndex + 1}
                    </div>
                    <span
                      style={{
                        fontSize: tokens.typography.fontSize.md,
                        color: tokens.colors.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                  {/* Arrow between steps */}
                  {i < row.length - 1 && (
                    <svg
                      width="60"
                      height="24"
                      viewBox="0 0 60 24"
                      style={{
                        flexShrink: 0,
                        margin: `0 ${tokens.spacing.xs}px`,
                      }}
                    >
                      <line
                        x1="0"
                        y1="12"
                        x2={40 * arrowProgress}
                        y2="12"
                        stroke={tokens.colors.primary}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {arrowProgress > 0.8 && (
                        <polygon
                          points="40,12 32,6 32,18"
                          fill={tokens.colors.primary}
                          opacity={interpolate(
                            arrowProgress,
                            [0.8, 1],
                            [0, 1],
                            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                          )}
                        />
                      )}
                    </svg>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
