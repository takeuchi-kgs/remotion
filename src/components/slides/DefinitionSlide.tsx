import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromBottom, slideInFromLeft } from "../../utils/animation";

type DefinitionSlideProps = {
  title?: string;
  definition?: string;
};

export const DefinitionSlide: React.FC<DefinitionSlideProps> = ({
  title,
  definition,
}) => {
  const frame = useCurrentFrame();

  const termOpacity = fadeIn(frame, 0);
  const termX = slideInFromLeft(frame, 0);
  const dividerWidth = interpolate(frame, [10, 30], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const definitionOpacity = fadeIn(frame, 20);
  const definitionY = slideInFromBottom(frame, 20);

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
          backgroundColor: tokens.colors.surface,
          borderRadius: 16,
          padding: tokens.spacing["2xl"],
          maxWidth: 1200,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Term */}
        {title && (
          <div
            style={{
              opacity: termOpacity,
              transform: `translateX(${termX}px)`,
              fontSize: tokens.typography.fontSize["3xl"],
              fontWeight: 700,
              color: tokens.colors.primary,
              marginBottom: tokens.spacing.lg,
            }}
          >
            {title}
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            width: `${dividerWidth}%`,
            height: 3,
            backgroundColor: tokens.colors.primary,
            marginBottom: tokens.spacing.lg,
          }}
        />

        {/* Definition */}
        {definition && (
          <div
            style={{
              opacity: definitionOpacity,
              transform: `translateY(${definitionY}px)`,
              fontSize: tokens.typography.fontSize.lg,
              color: tokens.colors.text.primary,
              lineHeight: 1.8,
            }}
          >
            {definition}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
