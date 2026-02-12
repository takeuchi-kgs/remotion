import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromBottom, staggerDelay } from "../../utils/animation";

type ListSlideProps = {
  title?: string;
  items?: string[];
};

export const ListSlide: React.FC<ListSlideProps> = ({
  title,
  items = [],
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
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.md }}>
        {items.map((item, i) => {
          const delay = staggerDelay(i) + 10;
          return (
            <div
              key={i}
              style={{
                opacity: fadeIn(frame, delay),
                transform: `translateY(${slideInFromBottom(frame, delay)}px)`,
                display: "flex",
                alignItems: "center",
                gap: tokens.spacing.sm,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: tokens.colors.primary,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: tokens.typography.fontSize.lg,
                  color: tokens.colors.text.primary,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
