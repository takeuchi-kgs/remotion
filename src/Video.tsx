import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SceneRenderer } from "./compositions/SceneRenderer";
import { Transition } from "./components/common/Transition";
import { ProgressIndicator } from "./components/overlays/ProgressIndicator";
import type { Script } from "./schemas/script";
import type { AudioManifest, SceneTiming, TimingOptions } from "./utils/timing";
import type { TransitionType } from "./utils/transition";
import { calculateTimings } from "./utils/timing";
import { tokens } from "./styles/tokens";

type VideoProps = {
  script: Script;
  audioManifest?: AudioManifest;
  bgmPath?: string;
  showProgress?: boolean;
  showSubtitles?: boolean;
  lineGapFrames?: number;
  sceneBufferFrames?: number;
  avatarLeft?: string;
  avatarRight?: string;
};

export const Video: React.FC<VideoProps> = ({
  script,
  audioManifest,
  bgmPath,
  showProgress = true,
  showSubtitles = true,
  lineGapFrames,
  sceneBufferFrames,
  avatarLeft,
  avatarRight,
}) => {
  const linesPerScene = script.scenes.map((s) => s.lines.length);
  const timingOptions: TimingOptions | undefined =
    lineGapFrames != null || sceneBufferFrames != null
      ? { lineGapFrames, sceneBufferFrames }
      : undefined;
  const { scenes: timings, totalFrames } = calculateTimings(
    script.scenes.length,
    linesPerScene,
    audioManifest,
    timingOptions,
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.background,
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      {script.scenes.map((scene, i) => {
        const sceneTiming: SceneTiming = timings[i];
        const transition: TransitionType = (scene as any).transition ?? "none";
        return (
          <Sequence
            key={i}
            from={sceneTiming.startFrame}
            durationInFrames={sceneTiming.durationFrames}
          >
            <Transition type={transition}>
              <SceneRenderer
                scene={scene}
                timing={sceneTiming}
                bgmPath={bgmPath}
                sceneNumber={i + 1}
                totalScenes={script.scenes.length}
                showSubtitles={showSubtitles}
                avatarLeft={avatarLeft}
                avatarRight={avatarRight}
              />
            </Transition>
          </Sequence>
        );
      })}

      {/* Progress bar */}
      {showProgress && <ProgressIndicator totalFrames={totalFrames} />}
    </AbsoluteFill>
  );
};
