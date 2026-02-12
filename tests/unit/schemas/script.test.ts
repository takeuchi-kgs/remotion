import { describe, it, expect } from "vitest";
import { ScriptSchema } from "../../../src/schemas/script";
import fixture from "../../fixtures/script.json";

describe("ScriptSchema", () => {
  it("validates a correct script.json", () => {
    const result = ScriptSchema.safeParse(fixture);
    expect(result.success).toBe(true);
  });

  it("rejects script without title", () => {
    const result = ScriptSchema.safeParse({ scenes: [] });
    expect(result.success).toBe(false);
  });

  it("rejects script without scenes", () => {
    const result = ScriptSchema.safeParse({ title: "Test" });
    expect(result.success).toBe(false);
  });

  it("validates script with optional description", () => {
    const result = ScriptSchema.safeParse({
      title: "Test",
      description: "A test script",
      scenes: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects scene with invalid slide type", () => {
    const result = ScriptSchema.safeParse({
      title: "Test",
      scenes: [
        {
          title: "Scene 1",
          slide: { type: "invalid-type" },
          lines: [],
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects line with invalid speaker", () => {
    const result = ScriptSchema.safeParse({
      title: "Test",
      scenes: [
        {
          title: "Scene 1",
          slide: { type: "title" },
          lines: [{ speaker: "center", text: "Hello" }],
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});
