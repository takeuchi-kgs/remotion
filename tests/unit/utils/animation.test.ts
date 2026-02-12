import { describe, it, expect } from "vitest";
import { fadeIn, slideInFromBottom, slideInFromLeft, slideInFromRight, scaleIn, staggerDelay, pulse, bounce, typewriter, rotateIn, countUp, waveIn, elastic } from "../../../src/utils/animation";

describe("fadeIn", () => {
  it("returns 0 before start", () => {
    expect(fadeIn(0, 10)).toBe(0);
  });

  it("returns 1 after completion", () => {
    expect(fadeIn(30, 10, 15)).toBe(1);
  });

  it("returns 0.5 at midpoint", () => {
    const val = fadeIn(17, 10, 15);
    expect(val).toBeCloseTo(0.467, 1);
  });

  it("returns 0 at start frame", () => {
    expect(fadeIn(10, 10)).toBe(0);
  });

  it("returns 1 at end frame", () => {
    expect(fadeIn(25, 10, 15)).toBe(1);
  });
});

describe("slideInFromBottom", () => {
  it("returns full distance before start", () => {
    expect(slideInFromBottom(0, 10)).toBe(40);
  });

  it("returns 0 after completion", () => {
    expect(slideInFromBottom(50, 10, 20)).toBe(0);
  });
});

describe("slideInFromLeft", () => {
  it("returns negative distance before start", () => {
    expect(slideInFromLeft(0, 10)).toBe(-100);
  });

  it("returns 0 after completion", () => {
    expect(slideInFromLeft(50, 10, 20)).toBe(0);
  });
});

describe("slideInFromRight", () => {
  it("returns positive distance before start", () => {
    expect(slideInFromRight(0, 10)).toBe(100);
  });

  it("returns 0 after completion", () => {
    expect(slideInFromRight(50, 10, 20)).toBe(0);
  });
});

describe("scaleIn", () => {
  it("returns 0.8 before start", () => {
    expect(scaleIn(0, 10)).toBe(0.8);
  });

  it("returns 1 after completion", () => {
    expect(scaleIn(30, 10, 15)).toBe(1);
  });
});

describe("staggerDelay", () => {
  it("returns 0 for index 0", () => {
    expect(staggerDelay(0)).toBe(0);
  });

  it("returns correct delay for index", () => {
    expect(staggerDelay(3)).toBe(24);
    expect(staggerDelay(3, 10)).toBe(30);
  });
});

describe("pulse", () => {
  it("returns 1 before start", () => {
    expect(pulse(0, 10)).toBe(1);
  });

  it("returns 1 at start", () => {
    expect(pulse(10, 10)).toBe(1);
  });

  it("peaks at 1.05 at midpoint", () => {
    expect(pulse(25, 10, 30)).toBe(1.05);
  });

  it("returns to 1 at end of period", () => {
    expect(pulse(40, 10, 30)).toBe(1);
  });
});

describe("bounce", () => {
  it("returns full distance before start", () => {
    expect(bounce(0, 10)).toBe(40);
  });

  it("returns 0 after completion", () => {
    expect(bounce(50, 10, 20)).toBe(0);
  });

  it("uses bounce easing for animation", () => {
    const val = bounce(20, 10, 20);
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThanOrEqual(40);
  });
});

describe("typewriter", () => {
  it("returns 0 before start", () => {
    expect(typewriter(0, 10, 50)).toBe(0);
  });

  it("returns total chars after completion", () => {
    expect(typewriter(150, 10, 50, 0.5)).toBe(50);
  });

  it("returns integer character counts", () => {
    const val = typewriter(20, 10, 50, 0.5);
    expect(Number.isInteger(val)).toBe(true);
    expect(val).toBe(5);
  });
});

describe("rotateIn", () => {
  it("returns starting rotation before start", () => {
    expect(rotateIn(0, 10)).toBe(-90);
  });

  it("returns 0 after completion", () => {
    expect(rotateIn(50, 10, 20)).toBe(0);
  });

  it("supports custom starting rotation", () => {
    expect(rotateIn(0, 10, 20, 180)).toBe(180);
  });
});

describe("countUp", () => {
  it("returns 0 before start", () => {
    expect(countUp(0, 10, 100)).toBe(0);
  });

  it("returns target value after completion", () => {
    expect(countUp(50, 10, 100, 30)).toBe(100);
  });

  it("returns integer values", () => {
    const val = countUp(25, 10, 100, 30);
    expect(Number.isInteger(val)).toBe(true);
  });
});

describe("waveIn", () => {
  it("returns amplitude before start", () => {
    expect(waveIn(0, 10, 0)).toBe(20);
  });

  it("decays to 0 after animation completes", () => {
    const val = waveIn(50, 10, 0);
    expect(Math.abs(val)).toBe(0);
  });

  it("produces different values for different indices", () => {
    const val1 = waveIn(15, 10, 0);
    const val2 = waveIn(15, 10, 1);
    expect(val1).not.toBe(val2);
  });
});

describe("elastic", () => {
  it("returns full distance before start", () => {
    expect(elastic(0, 10)).toBe(40);
  });

  it("returns 0 after completion", () => {
    expect(elastic(50, 10, 25)).toBe(0);
  });

  it("uses elastic easing for animation", () => {
    const val = elastic(20, 10, 25);
    expect(typeof val).toBe("number");
  });
});
