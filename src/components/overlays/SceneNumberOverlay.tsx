import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn } from "../../utils/animation";
import { tokens } from "../../styles/tokens";

type SceneNumberOverlayProps = {
  current: number;
  total: number;
};

export const SceneNumberOverlay: React.FC<SceneNumberOverlayProps> = ({
  current,
  total,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, 5, 10);

  return (
    <div
      style={{
        position: "absolute",
        top: tokens.spacing.md,
        right: tokens.spacing.md,
        opacity,
        fontFamily: tokens.typography.fontFamily.sans,
        fontSize: tokens.typography.fontSize.sm,
        color: tokens.colors.text.secondary,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: `${tokens.spacing.xs / 2}px ${tokens.spacing.sm}px`,
        borderRadius: 12,
      }}
    >
      {current}/{total}
    </div>
  );
};
