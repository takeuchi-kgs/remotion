import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, scaleIn, countUp, slideInFromBottom } from "../../utils/animation";

type StatSlideProps = {
  title?: string;
  statValue?: string;
  statLabel?: string;
};

export const StatSlide: React.FC<StatSlideProps> = ({
  title,
  statValue = "",
  statLabel,
}) => {
  const frame = useCurrentFrame();

  // Try to parse statValue as a number for countUp animation
  const numericMatch = statValue.match(/^([^\d]*)(\d+)(.*)$/);
  const isNumeric = numericMatch !== null;
  const prefix = isNumeric ? numericMatch![1] : "";
  const numericValue = isNumeric ? parseInt(numericMatch![2], 10) : 0;
  const suffix = isNumeric ? numericMatch![3] : "";

  const displayValue = isNumeric
    ? `${prefix}${countUp(frame, 5, numericValue, 30)}${suffix}`
    : statValue;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.background,
        fontFamily: tokens.typography.fontFamily.sans,
        padding: tokens.spacing["2xl"],
        justifyContent: "center",
        alignItems: "center",
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
          opacity: fadeIn(frame, 5),
          transform: `scale(${scaleIn(frame, 5)})`,
          fontSize: tokens.typography.fontSize["4xl"],
          fontWeight: 700,
          color: tokens.colors.primary,
          textAlign: "center",
        }}
      >
        {displayValue}
      </div>
      {statLabel && (
        <div
          style={{
            opacity: fadeIn(frame, 20),
            fontSize: tokens.typography.fontSize.xl,
            color: tokens.colors.text.secondary,
            marginTop: tokens.spacing.md,
            textAlign: "center",
          }}
        >
          {statLabel}
        </div>
      )}
    </AbsoluteFill>
  );
};
