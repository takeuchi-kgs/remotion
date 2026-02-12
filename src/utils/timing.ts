export type AudioManifestEntry = {
  scene: number;
  line: number;
  speaker: string;
  text: string;
  path: string;
  durationSeconds: number;
  durationFrames: number;
};

export type AudioManifest = {
  fps: number;
  files: AudioManifestEntry[];
};

const SCENE_BUFFER_FRAMES = 15; // 0.5s buffer between scenes
const DEFAULT_LINE_FRAMES = 90; // 3s fallback when no audio
const DEFAULT_LINE_GAP_FRAMES = 0; // gap between lines

export type TimingOptions = {
  lineGapFrames?: number; // frames of silence between lines
  sceneBufferFrames?: number; // frames of buffer between scenes
};

export type SceneTiming = {
  sceneIndex: number;
  startFrame: number;
  durationFrames: number;
  lines: LineTiming[];
};

export type LineTiming = {
  lineIndex: number;
  startFrame: number;
  durationFrames: number;
  audioPath?: string;
};

export function calculateTimings(
  sceneCount: number,
  linesPerScene: number[],
  manifest?: AudioManifest,
  options?: TimingOptions,
): { scenes: SceneTiming[]; totalFrames: number } {
  const lineGap = options?.lineGapFrames ?? DEFAULT_LINE_GAP_FRAMES;
  const sceneBuffer = options?.sceneBufferFrames ?? SCENE_BUFFER_FRAMES;
  const scenes: SceneTiming[] = [];
  let currentFrame = 0;

  for (let sceneIdx = 0; sceneIdx < sceneCount; sceneIdx++) {
    const lineCount = linesPerScene[sceneIdx];
    const lines: LineTiming[] = [];
    const sceneStartFrame = currentFrame;
    let sceneLocalFrame = 0;

    for (let lineIdx = 0; lineIdx < lineCount; lineIdx++) {
      const entry = manifest?.files.find(
        (f) => f.scene === sceneIdx && f.line === lineIdx,
      );

      const durationFrames = entry?.durationFrames || DEFAULT_LINE_FRAMES;

      lines.push({
        lineIndex: lineIdx,
        startFrame: sceneLocalFrame,
        durationFrames,
        audioPath: entry?.path,
      });

      sceneLocalFrame += durationFrames;
      // Add gap after each line except the last
      if (lineIdx < lineCount - 1) {
        sceneLocalFrame += lineGap;
      }
    }

    const sceneDuration = sceneLocalFrame + sceneBuffer;

    scenes.push({
      sceneIndex: sceneIdx,
      startFrame: sceneStartFrame,
      durationFrames: sceneDuration,
      lines,
    });

    currentFrame += sceneDuration;
  }

  return { scenes, totalFrames: currentFrame };
}

export function getActiveLineIndex(
  sceneTiming: SceneTiming,
  localFrame: number,
): number {
  for (let i = sceneTiming.lines.length - 1; i >= 0; i--) {
    if (localFrame >= sceneTiming.lines[i].startFrame) {
      return i;
    }
  }
  return 0;
}
