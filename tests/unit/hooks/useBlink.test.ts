import { describe, it, expect, vi, beforeEach } from "vitest";

let mockFrame = 0;
vi.mock("remotion", () => ({
  useCurrentFrame: () => mockFrame,
  useVideoConfig: () => ({ fps: 30, width: 1920, height: 1080, durationInFrames: 300, id: "test" }),
  random: (seed: string) => {
    // Deterministic mock: hash seed to a number between 0 and 1
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
    }
    return hash / 1000;
  },
}));

import { useBlink } from "../../../src/components/character/useBlink";

describe("useBlink", () => {
  beforeEach(() => {
    mockFrame = 0;
  });

  it("returns eyesOpen true at frame 0", () => {
    mockFrame = 0;
    const result = useBlink("test-seed");
    expect(result.eyesOpen).toBe(true);
  });

  it("returns consistent results for same seed and frame", () => {
    mockFrame = 100;
    const result1 = useBlink("seed-A");
    const result2 = useBlink("seed-A");
    expect(result1.eyesOpen).toBe(result2.eyesOpen);
  });

  it("is deterministic across calls", () => {
    const results: boolean[] = [];
    for (let f = 0; f < 300; f++) {
      mockFrame = f;
      results.push(useBlink("deterministic").eyesOpen);
    }
    // Should have at least some blinks (eyesOpen=false) over 10 seconds
    const blinkFrames = results.filter((v) => !v).length;
    expect(blinkFrames).toBeGreaterThan(0);
    expect(blinkFrames).toBeLessThan(results.length);
  });

  it("eyes are open most of the time", () => {
    const openCount = Array.from({ length: 300 }, (_, f) => {
      mockFrame = f;
      return useBlink("open-test").eyesOpen;
    }).filter(Boolean).length;

    // Eyes should be open > 90% of the time
    expect(openCount / 300).toBeGreaterThan(0.9);
  });
});
