import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, scaleIn, countUp, staggerDelay } from "../../utils/animation";

type MetricsSlideProps = {
  title?: string;
  metrics?: Array<{
    label: string;
    value: string;
    change?: string;
  }>;
};

export const MetricsSlide: React.FC<MetricsSlideProps> = ({
  title,
  metrics = [],
}) => {
  const frame = useCurrentFrame();

  const columns = metrics.length <= 2 ? metrics.length : 2;

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: tokens.spacing.lg,
        }}
      >
        {metrics.map((metric, i) => {
          const delay = staggerDelay(i, 10) + 10;
          const numericValue = parseFloat(metric.value.replace(/[^0-9.-]/g, ""));
          const isNumeric = !isNaN(numericValue);
          const isNegativeChange = metric.change?.startsWith("-");
          const changeColor = isNegativeChange ? "#EF4444" : "#10B981";

          return (
            <div
              key={i}
              style={{
                opacity: fadeIn(frame, delay),
                transform: `scale(${scaleIn(frame, delay)})`,
                backgroundColor: tokens.colors.surface,
                borderRadius: 16,
                padding: tokens.spacing.lg,
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.sm,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {/* Value */}
              <div
                style={{
                  fontSize: tokens.typography.fontSize["3xl"],
                  fontWeight: 700,
                  color: tokens.colors.text.primary,
                }}
              >
                {isNumeric
                  ? metric.value.replace(
                      String(numericValue),
                      String(countUp(frame, delay, numericValue)),
                    )
                  : metric.value}
              </div>
              {/* Label */}
              <div
                style={{
                  fontSize: tokens.typography.fontSize.md,
                  color: tokens.colors.text.secondary,
                  fontWeight: 500,
                }}
              >
                {metric.label}
              </div>
              {/* Change */}
              {metric.change && (
                <div
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    color: changeColor,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: tokens.spacing.xs,
                  }}
                >
                  <span>{isNegativeChange ? "\u25BC" : "\u25B2"}</span>
                  <span>{metric.change}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
