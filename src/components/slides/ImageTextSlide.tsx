import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromLeft, slideInFromRight } from "../../utils/animation";

type ImageTextSlideProps = {
  title?: string;
  items?: string[];
  image?: { source: "generate" | "static"; prompt?: string; path?: string };
};

export const ImageTextSlide: React.FC<ImageTextSlideProps> = ({
  title,
  items = [],
  image,
}) => {
  const frame = useCurrentFrame();

  const imagePath = image?.source === "static" && image.path ? image.path : null;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.background,
        fontFamily: tokens.typography.fontFamily.sans,
        flexDirection: "row",
        display: "flex",
      }}
    >
      {/* Left: Image */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeIn(frame, 0),
          transform: `translateX(${slideInFromLeft(frame, 0)}px)`,
          padding: tokens.spacing.xl,
        }}
      >
        {imagePath ? (
          <Img
            src={staticFile(imagePath)}
            style={{
              maxWidth: "100%",
              maxHeight: "80%",
              objectFit: "contain",
              borderRadius: 12,
            }}
          />
        ) : (
          <div
            style={{
              width: "80%",
              height: "60%",
              backgroundColor: tokens.colors.surface,
              border: `2px dashed ${tokens.colors.text.secondary}`,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tokens.colors.text.secondary,
              fontSize: tokens.typography.fontSize.md,
            }}
          >
            {image?.prompt || "Image"}
          </div>
        )}
      </div>

      {/* Right: Text */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: tokens.spacing.xl,
          opacity: fadeIn(frame, 5),
          transform: `translateX(${slideInFromRight(frame, 5)}px)`,
        }}
      >
        {title && (
          <div
            style={{
              fontSize: tokens.typography.fontSize["2xl"],
              fontWeight: 700,
              color: tokens.colors.text.primary,
              marginBottom: tokens.spacing.lg,
            }}
          >
            {title}
          </div>
        )}
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: tokens.typography.fontSize.md,
              color: tokens.colors.text.primary,
              marginBottom: tokens.spacing.sm,
              lineHeight: 1.6,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
