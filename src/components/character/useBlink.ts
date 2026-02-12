import { useCurrentFrame, useVideoConfig, random } from "remotion";

const BLINK_DURATION_SEC = 0.15;
const MIN_INTERVAL_SEC = 2;
const MAX_INTERVAL_SEC = 5;

export function useBlink(seed: string): { eyesOpen: boolean } {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blinkDurationFrames = Math.round(BLINK_DURATION_SEC * fps);

  // Generate deterministic blink schedule
  let nextBlinkFrame = 0;
  let blinkIndex = 0;

  while (nextBlinkFrame <= frame) {
    const interval =
      MIN_INTERVAL_SEC +
      random(`${seed}-blink-${blinkIndex}`) * (MAX_INTERVAL_SEC - MIN_INTERVAL_SEC);
    const intervalFrames = Math.round(interval * fps);

    nextBlinkFrame += intervalFrames;

    if (frame >= nextBlinkFrame && frame < nextBlinkFrame + blinkDurationFrames) {
      return { eyesOpen: false };
    }

    nextBlinkFrame += blinkDurationFrames;
    blinkIndex++;
  }

  return { eyesOpen: true };
}
