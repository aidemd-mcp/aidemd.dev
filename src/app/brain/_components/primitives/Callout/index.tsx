import type { ReactNode } from "react";
import cn from "@/lib/cn";

/** Maps each callout kind to its BRAIN_PAL color CSS variable. */
export type CalloutKind =
  | "why-stop"
  | "ok"
  | "no-brain-aide"
  | "no-mcp-entry"
  | "mcp-drift"
  | "success";

const KIND_COLOR: Record<CalloutKind, string> = {
  "why-stop": "var(--color-warn)",
  ok: "var(--color-good)",
  "no-brain-aide": "var(--color-bad)",
  "no-mcp-entry": "var(--color-warn)",
  "mcp-drift": "var(--color-warn)",
  success: "var(--color-good)",
};

interface CalloutProps {
  kind: CalloutKind;
  label?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Brain-scoped callout block.
 * Border-left: 2px solid the kind's color (NOT 3px — that is the docs .callout-* treatment).
 * Does NOT reuse docs `.callout-*` classes.
 * Optional uppercase label above the body.
 * Matches the handoff boot-state card style (brain-shared.jsx lines 351–356):
 * card background, 1px border, 2px left accent border, 4px radius.
 * Server component.
 */
export default function Callout({ kind, label, children, className }: CalloutProps) {
  const color = KIND_COLOR[kind];
  return (
    <div
      className={cn(
        "px-[14px] py-[12px] bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded",
        className
      )}
      style={{ borderLeft: `2px solid ${color}` }}
    >
      {label && (
        <div
          className="text-[11px] uppercase tracking-[1.5px] mb-[6px]"
          style={{ color }}
        >
          {label}
        </div>
      )}
      <div className="text-[color:var(--color-fg)] text-[13px] leading-[1.6]">
        {children}
      </div>
    </div>
  );
}
