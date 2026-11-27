/**
 * Reads the visitor's reduced-motion preference once. The Typewriter uses it to
 * show the finished headline instead of the looping reveal. Returns false during
 * SSR or where matchMedia is unavailable; it does not subscribe to changes.
 */
export default function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
