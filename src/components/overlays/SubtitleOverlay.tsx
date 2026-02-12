import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn } from "../../utils/animation";
import { tokens } from "../../styles/tokens";

type SubtitleOverlayProps = {
  text: string;
  isVisible: boolean;
};

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  text,
  isVisible,
}) => {
  const frame = useCurrentFrame();

  if (!isVisible || !text) return null;

  const opacity = fadeIn(frame, 0, 8);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 340,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: tokens.colors.text.inverse,
          fontFamily: tokens.typography.fontFamily.sans,
          fontSize: tokens.typography.fontSize.lg,
          padding: `${tokens.spacing.xs}px ${tokens.spacing.lg}px`,
          borderRadius: 8,
          maxWidth: "80%",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {text}
      </div>
    </div>
  );
};
