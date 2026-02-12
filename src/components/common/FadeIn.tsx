import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn, slideInFromBottom } from "../../utils/animation";

type FadeInProps = {
  startFrame?: number;
  duration?: number;
  slideDistance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const FadeIn: React.FC<FadeInProps> = ({
  startFrame = 0,
  duration = 15,
  slideDistance = 20,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, startFrame, duration);
  const translateY = slideInFromBottom(frame, startFrame, duration, slideDistance);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
