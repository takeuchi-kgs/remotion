import { describe, it, expect } from "vitest";
import { AnnotationSchema } from "../../../src/schemas/annotation";

describe("AnnotationSchema", () => {
  it("validates arrow annotation (type: 'arrow', x, y, targetX, targetY)", () => {
    const arrowAnnotation = {
      type: "arrow",
      x: 100,
      y: 200,
      targetX: 300,
      targetY: 400,
    };

    const result = AnnotationSchema.safeParse(arrowAnnotation);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(arrowAnnotation);
    }
  });

  it("validates circle annotation (type: 'circle', x, y, width)", () => {
    const circleAnnotation = {
      type: "circle",
      x: 150,
      y: 250,
      width: 50,
    };

    const result = AnnotationSchema.safeParse(circleAnnotation);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(circleAnnotation);
    }
  });

  it("validates highlight annotation (type: 'highlight', x, y, width, height)", () => {
    const highlightAnnotation = {
      type: "highlight",
      x: 200,
      y: 300,
      width: 100,
      height: 50,
    };

    const result = AnnotationSchema.safeParse(highlightAnnotation);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(highlightAnnotation);
    }
  });

  it("validates underline annotation (type: 'underline', x, y, width)", () => {
    const underlineAnnotation = {
      type: "underline",
      x: 120,
      y: 180,
      width: 200,
    };

    const result = AnnotationSchema.safeParse(underlineAnnotation);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(underlineAnnotation);
    }
  });

  it("validates box annotation (type: 'box', x, y, width, height)", () => {
    const boxAnnotation = {
      type: "box",
      x: 50,
      y: 75,
      width: 150,
      height: 100,
    };

    const result = AnnotationSchema.safeParse(boxAnnotation);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(boxAnnotation);
    }
  });

  it("validates annotation with optional fields (color, label, triggerFrame)", () => {
    const annotationWithOptionalFields = {
      type: "arrow",
      x: 100,
      y: 200,
      targetX: 300,
      targetY: 400,
      color: "#FF0000",
      label: "Important point",
      triggerFrame: 30,
    };

    const result = AnnotationSchema.safeParse(annotationWithOptionalFields);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(annotationWithOptionalFields);
    }
  });

  it("rejects invalid annotation type", () => {
    const invalidAnnotation = {
      type: "invalid-type",
      x: 100,
      y: 200,
    };

    const result = AnnotationSchema.safeParse(invalidAnnotation);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
      expect(result.error.issues[0].path).toEqual(["type"]);
    }
  });

  it("rejects annotation missing required x coordinate", () => {
    const invalidAnnotation = {
      type: "circle",
      y: 200,
      width: 50,
    };

    const result = AnnotationSchema.safeParse(invalidAnnotation);
    expect(result.success).toBe(false);
  });

  it("rejects annotation missing required y coordinate", () => {
    const invalidAnnotation = {
      type: "circle",
      x: 100,
      width: 50,
    };

    const result = AnnotationSchema.safeParse(invalidAnnotation);
    expect(result.success).toBe(false);
  });
});
