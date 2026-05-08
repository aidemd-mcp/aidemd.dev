import type { ReactNode } from "react";

interface StepProps {
  n: string;
  what: string;
  children: ReactNode;
}

/**
 * Numbered step row. Maps to JSX `<Step/>` (lines 234–244).
 * 40px / 1fr two-column grid: accent "step {n}" label on the left,
 * bold {what} title + children body on the right.
 * Bottom margin 18px between steps.
 * Server component.
 */
export default function Step({ n, what, children }: StepProps) {
  return (
    <div
      className="grid gap-[14px] mb-[18px]"
      style={{ gridTemplateColumns: "40px 1fr" }}
    >
      <div className="text-[12px] text-[color:var(--color-accent)] font-mono">
        step {n}
      </div>
      <div>
        <div className="text-[14px] font-semibold text-[color:var(--color-fg)] mb-[8px]">
          {what}
        </div>
        {children}
      </div>
    </div>
  );
}
