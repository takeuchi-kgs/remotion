import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, scaleIn, pulse } from "../../utils/animation";

type BridgeSlideProps = {
  title?: string;
  subtitle?: string;
};

export const BridgeSlide: React.FC<BridgeSlideProps> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();

  const titleScale = scaleIn(frame, 0);
  const titleOpacity = fadeIn(frame, 0);
  const subtitleOpacity = fadeIn(frame, 15);
  const linePulse = pulse(frame, 20);

  const lineWidth = interpolate(frame, [5, 25], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${tokens.colors.secondary}, #9F5AFF)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      {/* Top decorative line */}
      <div
        style={{
          width: lineWidth,
          height: 4,
          backgroundColor: tokens.colors.text.inverse,
          opacity: 0.6,
          marginBottom: tokens.spacing.lg,
          transform: `scaleX(${linePulse})`,
        }}
      />

      {title && (
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            fontSize: tokens.typography.fontSize["3xl"],
            fontWeight: 700,
            color: tokens.colors.text.inverse,
            textAlign: "center",
            padding: `0 ${tokens.spacing["2xl"]}px`,
          }}
        >
          {title}
        </div>
      )}

      {subtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: tokens.typography.fontSize.xl,
            color: tokens.colors.text.inverse,
            marginTop: tokens.spacing.md,
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Bottom decorative line */}
      <div
        style={{
          width: lineWidth,
          height: 4,
          backgroundColor: tokens.colors.text.inverse,
          opacity: 0.6,
          marginTop: tokens.spacing.lg,
          transform: `scaleX(${linePulse})`,
        }}
      />
    </AbsoluteFill>
  );
};
