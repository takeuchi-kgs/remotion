import { describe, it, expect } from "vitest";
import {
  getTransitionEnterOpacity,
  getTransitionEnterTranslateX,
  getTransitionEnterScale,
} from "../../../src/utils/transition";

describe("getTransitionEnterOpacity", () => {
  it("returns 0 at frame 0 for 'fade' type", () => {
    const opacity = getTransitionEnterOpacity(0, "fade");
    expect(opacity).toBe(0);
  });

  it("returns 1 after transition completes", () => {
    const opacity = getTransitionEnterOpacity(12, "fade");
    expect(opacity).toBe(1);
  });

  it("returns 1 for 'none' type at any frame", () => {
    expect(getTransitionEnterOpacity(0, "none")).toBe(1);
    expect(getTransitionEnterOpacity(6, "none")).toBe(1);
    expect(getTransitionEnterOpacity(12, "none")).toBe(1);
    expect(getTransitionEnterOpacity(100, "none")).toBe(1);
  });

  it("interpolates opacity for 'fade' type between frames 0 and 12", () => {
    const opacityAtFrame6 = getTransitionEnterOpacity(6, "fade");
    expect(opacityAtFrame6).toBeGreaterThan(0);
    expect(opacityAtFrame6).toBeLessThan(1);
    expect(opacityAtFrame6).toBe(0.5);
  });

  it("returns 0 at frame 0 for 'zoom' type", () => {
    const opacity = getTransitionEnterOpacity(0, "zoom");
    expect(opacity).toBe(0);
  });

  it("returns 1 for 'slide' type at any frame", () => {
    expect(getTransitionEnterOpacity(0, "slide")).toBe(1);
    expect(getTransitionEnterOpacity(12, "slide")).toBe(1);
  });

  it("returns 1 for 'wipe' type at any frame", () => {
    expect(getTransitionEnterOpacity(0, "wipe")).toBe(1);
    expect(getTransitionEnterOpacity(12, "wipe")).toBe(1);
  });
});

describe("getTransitionEnterTranslateX", () => {
  it("returns non-zero at frame 0 for 'slide' type", () => {
    const translateX = getTransitionEnterTranslateX(0, "slide");
    expect(translateX).not.toBe(0);
    expect(translateX).toBe(1920); // default width
  });

  it("returns 0 after transition for 'slide' type", () => {
    const translateX = getTransitionEnterTranslateX(12, "slide");
    expect(translateX).toBe(0);
  });

  it("returns non-zero at frame 0 for 'wipe' type", () => {
    const translateX = getTransitionEnterTranslateX(0, "wipe");
    expect(translateX).not.toBe(0);
    expect(translateX).toBe(1920); // default width
  });

  it("returns 0 after transition for 'wipe' type", () => {
    const translateX = getTransitionEnterTranslateX(12, "wipe");
    expect(translateX).toBe(0);
  });

  it("uses custom width when provided for 'slide' type", () => {
    const customWidth = 1280;
    const translateX = getTransitionEnterTranslateX(0, "slide", customWidth);
    expect(translateX).toBe(customWidth);
  });

  it("interpolates translateX for 'slide' type between frames 0 and 12", () => {
    const translateXAtFrame6 = getTransitionEnterTranslateX(6, "slide");
    expect(translateXAtFrame6).toBeGreaterThan(0);
    expect(translateXAtFrame6).toBeLessThan(1920);
  });

  it("returns 0 for 'fade' type at any frame", () => {
    expect(getTransitionEnterTranslateX(0, "fade")).toBe(0);
    expect(getTransitionEnterTranslateX(12, "fade")).toBe(0);
  });

  it("returns 0 for 'zoom' type at any frame", () => {
    expect(getTransitionEnterTranslateX(0, "zoom")).toBe(0);
    expect(getTransitionEnterTranslateX(12, "zoom")).toBe(0);
  });

  it("returns 0 for 'none' type at any frame", () => {
    expect(getTransitionEnterTranslateX(0, "none")).toBe(0);
    expect(getTransitionEnterTranslateX(12, "none")).toBe(0);
  });
});

describe("getTransitionEnterScale", () => {
  it("returns < 1 at frame 0 for 'zoom' type", () => {
    const scale = getTransitionEnterScale(0, "zoom");
    expect(scale).toBeLessThan(1);
    expect(scale).toBe(0.8);
  });

  it("returns 1 after transition for 'zoom' type", () => {
    const scale = getTransitionEnterScale(12, "zoom");
    expect(scale).toBe(1);
  });

  it("interpolates scale for 'zoom' type between frames 0 and 12", () => {
    const scaleAtFrame6 = getTransitionEnterScale(6, "zoom");
    expect(scaleAtFrame6).toBeGreaterThan(0.8);
    expect(scaleAtFrame6).toBeLessThan(1);
  });

  it("returns 1 for 'fade' type at any frame", () => {
    expect(getTransitionEnterScale(0, "fade")).toBe(1);
    expect(getTransitionEnterScale(12, "fade")).toBe(1);
  });

  it("returns 1 for 'slide' type at any frame", () => {
    expect(getTransitionEnterScale(0, "slide")).toBe(1);
    expect(getTransitionEnterScale(12, "slide")).toBe(1);
  });

  it("returns 1 for 'wipe' type at any frame", () => {
    expect(getTransitionEnterScale(0, "wipe")).toBe(1);
    expect(getTransitionEnterScale(12, "wipe")).toBe(1);
  });

  it("returns 1 for 'none' type at any frame", () => {
    expect(getTransitionEnterScale(0, "none")).toBe(1);
    expect(getTransitionEnterScale(12, "none")).toBe(1);
  });
});
