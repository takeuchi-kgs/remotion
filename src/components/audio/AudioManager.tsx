import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";

type NarrationTrack = {
  src: string;
  startFrame: number;
  durationFrames: number;
};

type AudioManagerProps = {
  bgmPath?: string;
  bgmVolume?: number;
  narrations?: NarrationTrack[];
  narrationVolume?: number;
  enableDucking?: boolean;
  children?: React.ReactNode;
};

const DEFAULT_BGM_VOLUME = 0.15;
const DEFAULT_NARRATION_VOLUME = 1.0;
const DUCKING_FACTOR = 0.3;
const DUCKING_TRANSITION_FRAMES = 5;

export const AudioManager: React.FC<AudioManagerProps> = ({
  bgmPath,
  bgmVolume = DEFAULT_BGM_VOLUME,
  narrations = [],
  narrationVolume = DEFAULT_NARRATION_VOLUME,
  enableDucking = true,
  children,
}) => {
  const frame = useCurrentFrame();

  const isNarrationActive = narrations.some(
    (n) => frame >= n.startFrame && frame < n.startFrame + n.durationFrames,
  );

  let effectiveBgmVolume = bgmVolume;
  if (enableDucking && bgmPath && narrations.length > 0) {
    // Find distance to nearest narration boundary for smooth transition
    let minDistToActive = Infinity;
    for (const n of narrations) {
      if (frame >= n.startFrame && frame < n.startFrame + n.durationFrames) {
        minDistToActive = 0;
        break;
      }
      const distToStart = Math.abs(frame - n.startFrame);
      const distToEnd = Math.abs(frame - (n.startFrame + n.durationFrames));
      minDistToActive = Math.min(minDistToActive, distToStart, distToEnd);
    }

    if (isNarrationActive) {
      effectiveBgmVolume = bgmVolume * DUCKING_FACTOR;
    } else if (minDistToActive <= DUCKING_TRANSITION_FRAMES) {
      const t = interpolate(
        minDistToActive,
        [0, DUCKING_TRANSITION_FRAMES],
        [DUCKING_FACTOR, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      effectiveBgmVolume = bgmVolume * t;
    }
  }

  return (
    <>
      {/* BGM layer */}
      {bgmPath && (
        <Audio src={staticFile(bgmPath)} volume={effectiveBgmVolume} loop />
      )}

      {/* Narration layer */}
      {narrations.map((track, i) => (
        <Sequence key={i} from={track.startFrame} durationInFrames={track.durationFrames}>
          <Audio src={staticFile(track.src)} volume={narrationVolume} />
        </Sequence>
      ))}

      {/* SE components passed as children */}
      {children}
    </>
  );
};
