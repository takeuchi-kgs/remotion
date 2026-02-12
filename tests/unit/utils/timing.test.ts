import { describe, it, expect } from "vitest";
import { calculateTimings, getActiveLineIndex } from "../../../src/utils/timing";
import type { AudioManifest, SceneTiming } from "../../../src/utils/timing";

describe("calculateTimings", () => {
  it("calculates timings without manifest (default 90 frames per line)", () => {
    const result = calculateTimings(2, [2, 1]);
    expect(result.scenes).toHaveLength(2);

    // Scene 0: 2 lines * 90 frames + 15 buffer = 195
    expect(result.scenes[0].startFrame).toBe(0);
    expect(result.scenes[0].durationFrames).toBe(195);
    expect(result.scenes[0].lines).toHaveLength(2);
    expect(result.scenes[0].lines[0]).toEqual({
      lineIndex: 0,
      startFrame: 0,
      durationFrames: 90,
      audioPath: undefined,
    });
    expect(result.scenes[0].lines[1]).toEqual({
      lineIndex: 1,
      startFrame: 90,
      durationFrames: 90,
      audioPath: undefined,
    });

    // Scene 1: 1 line * 90 frames + 15 buffer = 105
    expect(result.scenes[1].startFrame).toBe(195);
    expect(result.scenes[1].durationFrames).toBe(105);

    expect(result.totalFrames).toBe(300);
  });

  it("uses manifest durations when provided", () => {
    const manifest: AudioManifest = {
      fps: 30,
      files: [
        { scene: 0, line: 0, speaker: "left", text: "", path: "audio/s0l0.wav", durationSeconds: 2, durationFrames: 60 },
        { scene: 0, line: 1, speaker: "right", text: "", path: "audio/s0l1.wav", durationSeconds: 4, durationFrames: 120 },
      ],
    };

    const result = calculateTimings(1, [2], manifest);

    expect(result.scenes[0].lines[0].durationFrames).toBe(60);
    expect(result.scenes[0].lines[0].audioPath).toBe("audio/s0l0.wav");
    expect(result.scenes[0].lines[1].durationFrames).toBe(120);
    // Scene duration: 60 + 120 + 15 buffer = 195
    expect(result.scenes[0].durationFrames).toBe(195);
    expect(result.totalFrames).toBe(195);
  });

  it("falls back to default when manifest entry is missing", () => {
    const manifest: AudioManifest = {
      fps: 30,
      files: [
        { scene: 0, line: 0, speaker: "left", text: "", path: "audio/s0l0.wav", durationSeconds: 2, durationFrames: 60 },
      ],
    };

    const result = calculateTimings(1, [2], manifest);

    expect(result.scenes[0].lines[0].durationFrames).toBe(60);
    expect(result.scenes[0].lines[1].durationFrames).toBe(90); // default
    expect(result.scenes[0].lines[1].audioPath).toBeUndefined();
  });

  it("handles empty scenes", () => {
    const result = calculateTimings(1, [0]);
    expect(result.scenes[0].durationFrames).toBe(15); // only buffer
    expect(result.totalFrames).toBe(15);
  });
});

describe("getActiveLineIndex", () => {
  const timing: SceneTiming = {
    sceneIndex: 0,
    startFrame: 0,
    durationFrames: 195,
    lines: [
      { lineIndex: 0, startFrame: 0, durationFrames: 90 },
      { lineIndex: 1, startFrame: 90, durationFrames: 90 },
    ],
  };

  it("returns 0 at frame 0", () => {
    expect(getActiveLineIndex(timing, 0)).toBe(0);
  });

  it("returns 0 just before line 1 starts", () => {
    expect(getActiveLineIndex(timing, 89)).toBe(0);
  });

  it("returns 1 at line 1 start frame", () => {
    expect(getActiveLineIndex(timing, 90)).toBe(1);
  });

  it("returns 1 past all lines", () => {
    expect(getActiveLineIndex(timing, 180)).toBe(1);
  });

  it("returns 0 for negative frame", () => {
    expect(getActiveLineIndex(timing, -1)).toBe(0);
  });
});
