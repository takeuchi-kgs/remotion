import { interpolate, Easing } from "remotion";

export type TransitionType = "fade" | "wipe" | "slide" | "zoom" | "none";

const TRANSITION_DURATION = 12;

export function getTransitionEnterOpacity(
  frame: number,
  type: TransitionType,
): number {
  if (type === "none") return 1;
  if (type === "fade" || type === "zoom") {
    return interpolate(frame, [0, TRANSITION_DURATION], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return 1;
}

export function getTransitionEnterTranslateX(
  frame: number,
  type: TransitionType,
  width: number = 1920,
): number {
  if (type === "slide") {
    return interpolate(frame, [0, TRANSITION_DURATION], [width, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  }
  if (type === "wipe") {
    return interpolate(frame, [0, TRANSITION_DURATION], [width, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return 0;
}

export function getTransitionEnterScale(
  frame: number,
  type: TransitionType,
): number {
  if (type === "zoom") {
    return interpolate(frame, [0, TRANSITION_DURATION], [0.8, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  }
  return 1;
}

export function getTransitionDuration(): number {
  return TRANSITION_DURATION;
}
