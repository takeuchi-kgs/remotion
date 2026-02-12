import React from "react";
import { useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";

type ProgressIndicatorProps = {
  totalFrames: number;
  color?: string;
  height?: number;
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  totalFrames,
  color = tokens.colors.primary,
  height = 4,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(frame / totalFrames, 1);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          backgroundColor: color,
        }}
      />
    </div>
  );
};
