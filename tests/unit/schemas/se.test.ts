import { describe, it, expect } from "vitest";
import { SESchema } from "../../../src/schemas/se";

describe("SESchema", () => {
  it("validates SE with path and volume", () => {
    const result = SESchema.safeParse({ path: "se/click.mp3", volume: 0.5 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.volume).toBe(0.5);
    }
  });

  it("applies default volume of 0.3", () => {
    const result = SESchema.safeParse({ path: "se/click.mp3" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.volume).toBe(0.3);
    }
  });

  it("rejects volume above 1", () => {
    const result = SESchema.safeParse({ path: "se/click.mp3", volume: 1.5 });
    expect(result.success).toBe(false);
  });

  it("rejects volume below 0", () => {
    const result = SESchema.safeParse({ path: "se/click.mp3", volume: -0.1 });
    expect(result.success).toBe(false);
  });

  it("rejects missing path", () => {
    const result = SESchema.safeParse({ volume: 0.5 });
    expect(result.success).toBe(false);
  });
});
