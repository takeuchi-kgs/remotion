import { describe, it, expect, vi, beforeEach } from "vitest";

let mockFrame = 0;
vi.mock("remotion", () => ({
  useCurrentFrame: () => mockFrame,
  useVideoConfig: () => ({ fps: 30, width: 1920, height: 1080, durationInFrames: 300, id: "test" }),
}));

import { useLipSync } from "../../../src/components/character/useLipSync";

describe("useLipSync", () => {
  beforeEach(() => {
    mockFrame = 0;
  });

  it("returns mouthOpen false when not speaking", () => {
    mockFrame = 0;
    const result = useLipSync(false);
    expect(result.mouthOpen).toBe(false);
  });

  it("returns mouthOpen true at frame 0 when speaking", () => {
    mockFrame = 0;
    const result = useLipSync(true);
    expect(result.mouthOpen).toBe(true);
  });

  it("toggles mouth based on interval (0.15s = 5 frames at 30fps)", () => {
    // interval = Math.round(0.15 * 30) = Math.round(4.5) = 5 frames
    // cycle at frame 0: floor(0/5)=0 -> even -> mouthOpen=true
    mockFrame = 0;
    expect(useLipSync(true).mouthOpen).toBe(true);

    // cycle at frame 5: floor(5/5)=1 -> odd -> mouthOpen=false
    mockFrame = 5;
    expect(useLipSync(true).mouthOpen).toBe(false);

    // cycle at frame 10: floor(10/5)=2 -> even -> mouthOpen=true
    mockFrame = 10;
    expect(useLipSync(true).mouthOpen).toBe(true);
  });

  it("closes mouth mid-interval", () => {
    // frame 7: floor(7/5)=1 -> odd -> false
    mockFrame = 7;
    expect(useLipSync(true).mouthOpen).toBe(false);
  });
});
