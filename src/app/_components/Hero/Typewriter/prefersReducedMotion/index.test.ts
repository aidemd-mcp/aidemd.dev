import { afterEach, describe, expect, it, vi } from "vitest";
import prefersReducedMotion from ".";

function stubMatchMedia(matches: boolean) {
  const matchMedia = vi.fn().mockReturnValue({ matches });
  vi.stubGlobal("window", { matchMedia });
  return matchMedia;
}

describe("prefersReducedMotion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is true when the reduced-motion query matches", () => {
    stubMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it("is false when the reduced-motion query does not match", () => {
    stubMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  it("is false when there is no window", () => {
    expect(typeof window).toBe("undefined");
    expect(prefersReducedMotion()).toBe(false);
  });

  it("is false when window has no matchMedia", () => {
    vi.stubGlobal("window", {});
    expect(prefersReducedMotion()).toBe(false);
  });

  it("asks for the exact prefers-reduced-motion query", () => {
    const matchMedia = stubMatchMedia(false);
    prefersReducedMotion();
    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
  });
});
