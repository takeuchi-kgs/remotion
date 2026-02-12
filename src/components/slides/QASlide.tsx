import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromLeft, slideInFromRight } from "../../utils/animation";

type QASlideProps = {
  question?: string;
  answer?: string;
};

export const QASlide: React.FC<QASlideProps> = ({
  question = "",
  answer = "",
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
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.xl }}>
        {/* Question */}
        <div
          style={{
            opacity: fadeIn(frame, 0),
            transform: `translateX(${slideInFromLeft(frame, 0)}px)`,
            display: "flex",
            alignItems: "flex-start",
            gap: tokens.spacing.md,
          }}
        >
          {/* Q Badge */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: tokens.colors.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: tokens.typography.fontSize.lg,
              fontWeight: 700,
              color: tokens.colors.text.inverse,
              flexShrink: 0,
            }}
          >
            Q
          </div>
          {/* Question bubble */}
          <div
            style={{
              backgroundColor: tokens.colors.surface,
              borderRadius: 16,
              borderTopLeftRadius: 4,
              padding: `${tokens.spacing.md}px ${tokens.spacing.lg}px`,
              fontSize: tokens.typography.fontSize.lg,
              color: tokens.colors.text.primary,
              fontWeight: 600,
              flex: 1,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            }}
          >
            {question}
          </div>
        </div>

        {/* Answer */}
        <div
          style={{
            opacity: fadeIn(frame, 15),
            transform: `translateX(${slideInFromRight(frame, 15)}px)`,
            display: "flex",
            alignItems: "flex-start",
            gap: tokens.spacing.md,
            flexDirection: "row-reverse",
          }}
        >
          {/* A Badge */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: tokens.colors.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: tokens.typography.fontSize.lg,
              fontWeight: 700,
              color: tokens.colors.text.inverse,
              flexShrink: 0,
            }}
          >
            A
          </div>
          {/* Answer bubble */}
          <div
            style={{
              backgroundColor: tokens.colors.surface,
              borderRadius: 16,
              borderTopRightRadius: 4,
              padding: `${tokens.spacing.md}px ${tokens.spacing.lg}px`,
              fontSize: tokens.typography.fontSize.lg,
              color: tokens.colors.text.primary,
              flex: 1,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            }}
          >
            {answer}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
