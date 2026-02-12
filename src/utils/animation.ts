import { interpolate, Easing } from "remotion";

export function fadeIn(
  frame: number,
  startFrame: number,
  duration: number = 15,
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function slideInFromBottom(
  frame: number,
  startFrame: number,
  duration: number = 20,
  distance: number = 40,
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

export function slideInFromLeft(
  frame: number,
  startFrame: number,
  duration: number = 20,
  distance: number = 100,
): number {
  return interpolate(
    frame,
    [startFrame, startFrame + duration],
    [-distance, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
}

export function slideInFromRight(
  frame: number,
  startFrame: number,
  duration: number = 20,
  distance: number = 100,
): number {
  return interpolate(
    frame,
    [startFrame, startFrame + duration],
    [distance, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
}

export function scaleIn(
  frame: number,
  startFrame: number,
  duration: number = 15,
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

export function staggerDelay(index: number, delayPerItem: number = 8): number {
  return index * delayPerItem;
}

export function pulse(frame: number, startFrame: number, period: number = 30): number {
  if (frame < startFrame) return 1;
  const t = (frame - startFrame) % period;
  return interpolate(t, [0, period / 2, period], [1, 1.05, 1], {
    extrapolateRight: "clamp",
  });
}

export function bounce(
  frame: number,
  startFrame: number,
  duration: number = 20,
  distance: number = 40,
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bounce,
  });
}

export function typewriter(
  frame: number,
  startFrame: number,
  totalChars: number,
  charsPerFrame: number = 0.5,
): number {
  if (frame < startFrame) return 0;
  return Math.min(Math.floor((frame - startFrame) * charsPerFrame), totalChars);
}

export function rotateIn(
  frame: number,
  startFrame: number,
  duration: number = 20,
  fromDeg: number = -90,
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [fromDeg, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

export function countUp(
  frame: number,
  startFrame: number,
  targetValue: number,
  duration: number = 30,
): number {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(targetValue * progress);
}

export function waveIn(
  frame: number,
  startFrame: number,
  index: number,
  amplitude: number = 20,
): number {
  if (frame < startFrame) return amplitude;
  const t = frame - startFrame;
  const phase = index * 4;
  const decay = interpolate(t, [0, 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.sin((t + phase) * 0.3) * amplitude * decay;
}

export function elastic(
  frame: number,
  startFrame: number,
  duration: number = 25,
  distance: number = 40,
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.elastic(1),
  });
}
