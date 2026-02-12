import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";

type TitleSlideProps = {
  title: string;
  subtitle?: string;
};

export const TitleSlide: React.FC<TitleSlideProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 15], [30, 0], {
    extrapolateRight: "clamp",
  });
  const subtitleOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.background,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: tokens.typography.fontSize["3xl"],
          fontWeight: 700,
          color: tokens.colors.text.primary,
          textAlign: "center",
          padding: `0 ${tokens.spacing["2xl"]}px`,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: tokens.typography.fontSize.xl,
            color: tokens.colors.text.secondary,
            marginTop: tokens.spacing.md,
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
