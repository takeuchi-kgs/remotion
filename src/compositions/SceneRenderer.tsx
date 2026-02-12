import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { SlideSelector } from "./SlideSelector";
import { DiagramSelector } from "./DiagramSelector";
import { Character } from "../components/character/Character";
import { SlideSE } from "../components/audio/SlideSE";
import { LineSE } from "../components/audio/LineSE";
import { AudioManager } from "../components/audio/AudioManager";
import { SubtitleOverlay } from "../components/overlays/SubtitleOverlay";
import { SceneNumberOverlay } from "../components/overlays/SceneNumberOverlay";
import { AnnotationOverlay } from "../components/overlays/AnnotationOverlay";
import type { Scene } from "../schemas/script";
import type { SceneTiming, LineTiming } from "../utils/timing";
import { getActiveLineIndex } from "../utils/timing";
import { tokens } from "../styles/tokens";

type SceneRendererProps = {
  scene: Scene;
  timing: SceneTiming;
  bgmPath?: string;
  sceneNumber?: number;
  totalScenes?: number;
  showSubtitles?: boolean;
  avatarLeft?: string;
  avatarRight?: string;
};

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  timing,
  bgmPath,
  sceneNumber,
  totalScenes,
  showSubtitles = true,
  avatarLeft,
  avatarRight,
}) => {
  const frame = useCurrentFrame();
  const activeLineIdx = getActiveLineIndex(timing, frame);
  const activeLine = scene.lines[activeLineIdx];

  const narrations = timing.lines
    .filter((lt: LineTiming) => lt.audioPath)
    .map((lt: LineTiming) => ({
      src: lt.audioPath!,
      startFrame: lt.startFrame,
      durationFrames: lt.durationFrames,
    }));

  return (
    <AbsoluteFill>
      {/* Slide layer */}
      <AbsoluteFill>
        <SlideSelector slide={scene.slide} />
      </AbsoluteFill>

      {/* Diagram layer (optional overlay on top of slide) */}
      {scene.slide.diagram && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DiagramSelector diagram={scene.slide.diagram} />
        </AbsoluteFill>
      )}

      {/* Annotation layer */}
      {scene.slide.annotations && scene.slide.annotations.length > 0 && (
        <AnnotationOverlay annotations={scene.slide.annotations} />
      )}

      {/* Scene number overlay */}
      {sceneNumber != null && totalScenes != null && (
        <SceneNumberOverlay current={sceneNumber} total={totalScenes} />
      )}

      {/* Subtitle layer */}
      {showSubtitles && activeLine && (
        <SubtitleOverlay text={activeLine.text} isVisible={true} />
      )}

      {/* Character layer */}
      <AbsoluteFill
        style={{
          top: "auto",
          bottom: 0,
          height: 320,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: `0 ${tokens.spacing.xl}px ${tokens.spacing.sm}px`,
        }}
      >
        <Character
          speaker="left"
          isSpeaking={activeLine?.speaker === "left"}
          expression={activeLine?.expression}
          avatarId={avatarLeft}
        />
        <Character
          speaker="right"
          isSpeaking={activeLine?.speaker === "right"}
          expression={activeLine?.expression}
          avatarId={avatarRight}
        />
      </AbsoluteFill>

      {/* Audio layer */}
      <AudioManager bgmPath={bgmPath} narrations={narrations}>
        {/* Slide SE */}
        {scene.slide.se && <SlideSE se={scene.slide.se} />}

        {/* Line SEs */}
        {scene.lines.map((line, i) => {
          if (!line.se) return null;
          const lt = timing.lines[i];
          return (
            <Sequence key={`line-se-${i}`} from={lt.startFrame}>
              <LineSE se={line.se} />
            </Sequence>
          );
        })}
      </AudioManager>
    </AbsoluteFill>
  );
};
