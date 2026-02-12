import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromBottom, scaleIn } from "../../utils/animation";

type QuoteSlideProps = {
  quote?: string;
  attribution?: string;
};

export const QuoteSlide: React.FC<QuoteSlideProps> = ({
  quote,
  attribution,
}) => {
  const frame = useCurrentFrame();

  const quoteMarkScale = scaleIn(frame, 0);
  const quoteMarkOpacity = fadeIn(frame, 0);
  const quoteOpacity = fadeIn(frame, 10);
  const quoteY = slideInFromBottom(frame, 10);
  const attributionOpacity = fadeIn(frame, 25);

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
          maxWidth: 1400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Opening quotation mark */}
        <div
          style={{
            opacity: quoteMarkOpacity,
            transform: `scale(${quoteMarkScale})`,
            fontSize: tokens.typography.fontSize["4xl"],
            color: tokens.colors.secondary,
            lineHeight: 1,
            marginBottom: tokens.spacing.md,
            fontWeight: 700,
          }}
        >
          {"\u201C"}
        </div>

        {/* Quote text */}
        {quote && (
          <div
            style={{
              opacity: quoteOpacity,
              transform: `translateY(${quoteY}px)`,
              fontSize: tokens.typography.fontSize.xl,
              fontStyle: "italic",
              color: tokens.colors.text.primary,
              textAlign: "center",
              lineHeight: 1.6,
              padding: `0 ${tokens.spacing.xl}px`,
            }}
          >
            {quote}
          </div>
        )}

        {/* Closing quotation mark */}
        <div
          style={{
            opacity: quoteMarkOpacity,
            transform: `scale(${quoteMarkScale})`,
            fontSize: tokens.typography.fontSize["4xl"],
            color: tokens.colors.secondary,
            lineHeight: 1,
            marginTop: tokens.spacing.md,
            fontWeight: 700,
          }}
        >
          {"\u201D"}
        </div>

        {/* Attribution */}
        {attribution && (
          <div
            style={{
              opacity: attributionOpacity,
              fontSize: tokens.typography.fontSize.md,
              color: tokens.colors.secondary,
              marginTop: tokens.spacing.lg,
              alignSelf: "flex-end",
              fontWeight: 600,
            }}
          >
            {`\u2014 ${attribution}`}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
