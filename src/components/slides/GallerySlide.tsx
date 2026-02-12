import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, scaleIn, staggerDelay } from "../../utils/animation";

type GallerySlideProps = {
  title?: string;
  images?: Array<{
    source: "generate" | "static";
    prompt?: string;
    path?: string;
  }>;
};

export const GallerySlide: React.FC<GallerySlideProps> = ({
  title,
  images = [],
}) => {
  const frame = useCurrentFrame();

  const columns = images.length > 4 ? 3 : 2;

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
          gap: tokens.spacing.md,
          flex: 1,
        }}
      >
        {images.map((image, i) => {
          const delay = staggerDelay(i, 8) + 10;
          return (
            <div
              key={i}
              style={{
                opacity: fadeIn(frame, delay),
                transform: `scale(${scaleIn(frame, delay)})`,
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#64748B",
                color: tokens.colors.text.inverse,
                fontSize: tokens.typography.fontSize.sm,
              }}
            >
              {image.prompt || "Image"}
            </div>
          );
        })}
        {images.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => {
            const delay = staggerDelay(i, 8) + 10;
            return (
              <div
                key={i}
                style={{
                  opacity: fadeIn(frame, delay),
                  transform: `scale(${scaleIn(frame, delay)})`,
                  borderRadius: 12,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#64748B",
                  color: tokens.colors.text.inverse,
                  fontSize: tokens.typography.fontSize.sm,
                }}
              >
                Image
              </div>
            );
          })}
      </div>
    </AbsoluteFill>
  );
};
