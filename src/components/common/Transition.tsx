import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { TransitionType } from "../../utils/transition";
import {
  getTransitionEnterOpacity,
  getTransitionEnterTranslateX,
  getTransitionEnterScale,
} from "../../utils/transition";

type TransitionProps = {
  type: TransitionType;
  children: React.ReactNode;
};

export const Transition: React.FC<TransitionProps> = ({ type, children }) => {
  const frame = useCurrentFrame();

  if (type === "none") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const opacity = getTransitionEnterOpacity(frame, type);
  const translateX = getTransitionEnterTranslateX(frame, type);
  const scale = getTransitionEnterScale(frame, type);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
