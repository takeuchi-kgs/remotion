import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn, slideInFromBottom } from "../../utils/animation";

type AnimatedTextProps = {
  text: string;
  startFrame?: number;
  duration?: number;
  style?: React.CSSProperties;
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  startFrame = 0,
  duration = 15,
  style,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, startFrame, duration);
  const translateY = slideInFromBottom(frame, startFrame, duration, 15);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
