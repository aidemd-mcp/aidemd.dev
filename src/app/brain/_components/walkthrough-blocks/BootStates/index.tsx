import { BOOT_STATES } from "@/app/brain/_data/bootStates";
import type { BootStateId } from "@/app/brain/_data/bootStates";

/** Maps each boot state id to its indicator CSS variable. */
const STATE_COLOR: Record<BootStateId, string> = {
  ok: "var(--color-good)",
  "no-brain-aide": "var(--color-bad)",
  "no-mcp-entry": "var(--color-warn)",
  "mcp-drift": "var(--color-warn)",
};

/**
 * 2×2 grid of boot state cards, one per BOOT_STATES entry.
 * Matches brain-shared.jsx lines 350–367: colored dot + state id + what body + accent fix hint,
 * border-left 2px in the state's indicator color.
 * Renders all FOUR states: ok, no-brain-aide, no-mcp-entry, mcp-drift.
 * Server component.
 */
export default function BootStates() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] font-mono">
      {BOOT_STATES.map((s) => {
        const color = STATE_COLOR[s.id];
        return (
          <div
            key={s.id}
            className="px-[14px] py-[12px] bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded"
            style={{ borderLeft: `2px solid ${color}` }}
          >
            <div className="text-[12px] mb-[4px] flex items-center gap-[6px]" style={{ color }}>
              <span>●</span>
              <span>{s.id}</span>
            </div>
            <div className="text-[12px] text-[color:var(--color-fg)] mb-[6px] leading-[1.5]">
              {s.what}
            </div>
            <div className="text-[11px] text-[color:var(--color-dim)] leading-[1.5]">
              fix: <span className="text-[color:var(--color-accent)]">{s.fix}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
