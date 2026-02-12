import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromBottom, pulse } from "../../utils/animation";

type EndingSlideProps = {
  title?: string;
  subtitle?: string;
  ctaText?: string;
};

export const EndingSlide: React.FC<EndingSlideProps> = ({
  title,
  subtitle,
  ctaText,
}) => {
  const frame = useCurrentFrame();

  const scale = pulse(frame, 30, 40);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.primary,
        fontFamily: tokens.typography.fontFamily.sans,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {title && (
        <div
          style={{
            opacity: fadeIn(frame, 0),
            transform: `translateY(${slideInFromBottom(frame, 0)}px)`,
            fontSize: tokens.typography.fontSize["3xl"],
            fontWeight: 700,
            color: tokens.colors.text.inverse,
            textAlign: "center",
            marginBottom: tokens.spacing.md,
          }}
        >
          {title}
        </div>
      )}
      {subtitle && (
        <div
          style={{
            opacity: fadeIn(frame, 8),
            fontSize: tokens.typography.fontSize.xl,
            color: tokens.colors.text.inverse,
            textAlign: "center",
            marginBottom: tokens.spacing.xl,
          }}
        >
          {subtitle}
        </div>
      )}
      {ctaText && (
        <div
          style={{
            opacity: fadeIn(frame, 15),
            transform: `scale(${scale})`,
            backgroundColor: tokens.colors.accent,
            color: tokens.colors.text.primary,
            fontSize: tokens.typography.fontSize.xl,
            fontWeight: 700,
            padding: `${tokens.spacing.sm}px ${tokens.spacing.xl}px`,
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          {ctaText}
        </div>
      )}
    </AbsoluteFill>
  );
};
