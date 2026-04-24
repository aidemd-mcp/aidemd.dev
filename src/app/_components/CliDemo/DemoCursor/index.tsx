/**
 * Blinking block cursor for the CLI demo terminal.
 * 8×14 accent-green rectangle; uses the aideCursor keyframe from globals.css.
 */
export default function DemoCursor() {
  return (
    <span
      className="inline-block w-[8px] h-[14px] bg-[color:var(--color-accent)] align-middle"
      style={{ animation: "aideCursor 1s steps(2) infinite" }}
      aria-hidden="true"
    />
  );
}
