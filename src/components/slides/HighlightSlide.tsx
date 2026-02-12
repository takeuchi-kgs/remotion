import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, scaleIn } from "../../utils/animation";

type HighlightSlideProps = {
  title?: string;
  subtitle?: string;
};

export const HighlightSlide: React.FC<HighlightSlideProps> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();

  const textOpacity = fadeIn(frame, 0);
  const textScale = scaleIn(frame, 0);
  const subtitleOpacity = fadeIn(frame, 10);
  const highlightWidth = interpolate(frame, [15, 35], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.background,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
        padding: tokens.spacing["2xl"],
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Main statement */}
        {title && (
          <div
            style={{
              opacity: textOpacity,
              transform: `scale(${textScale})`,
              fontSize: tokens.typography.fontSize["3xl"],
              fontWeight: 700,
              color: tokens.colors.text.primary,
              textAlign: "center",
              padding: `0 ${tokens.spacing["2xl"]}px`,
            }}
          >
            {title}
          </div>
        )}

        {/* Accent underline bar */}
        <div
          style={{
            width: `${highlightWidth}%`,
            maxWidth: 600,
            height: 8,
            backgroundColor: tokens.colors.highlight,
            borderRadius: 4,
            marginTop: tokens.spacing.md,
          }}
        />

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              opacity: subtitleOpacity,
              fontSize: tokens.typography.fontSize.xl,
              color: tokens.colors.text.secondary,
              marginTop: tokens.spacing.lg,
              textAlign: "center",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
