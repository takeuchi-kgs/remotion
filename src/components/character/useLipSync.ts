import { useCurrentFrame, useVideoConfig } from "remotion";

const LIP_SYNC_INTERVAL_SEC = 0.15;

export function useLipSync(isSpeaking: boolean): { mouthOpen: boolean } {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!isSpeaking) {
    return { mouthOpen: false };
  }

  const intervalFrames = Math.round(LIP_SYNC_INTERVAL_SEC * fps);
  const cycle = Math.floor(frame / intervalFrames);
  const mouthOpen = cycle % 2 === 0;

  return { mouthOpen };
}
