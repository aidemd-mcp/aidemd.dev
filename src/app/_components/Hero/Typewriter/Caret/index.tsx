/**
 * Blink period of the caret in ms. Must match the `1s` in the `aideCursor_1s_steps(2)_infinite`
 * class below; change both together.
 */
export const CARET_BLINK_PERIOD_MS = 1000;

/**
 * The typewriter's blinking caret. Typewriter remounts it (new `key`) on every reveal step because
 * the Layout Instability API counts an existing element whose start position moved as a layout
 * shift, while a freshly inserted node is never a shift source. `phaseMs` continues the blink where
 * the previous caret left off, so the remount is invisible.
 */
export default function Caret({ phaseMs }: { phaseMs: number }) {
  return (
    <span
      className="inline-block w-[2px] h-[0.85em] bg-[color:var(--color-accent)] ml-[2px] align-middle animate-[aideCursor_1s_steps(2)_infinite]"
      style={{ animationDelay: `-${phaseMs}ms` }}
      aria-hidden="true"
    />
  );
}
