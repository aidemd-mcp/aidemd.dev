import type { ReactNode } from "react";

interface AideFrameProps {
  title: string;
  children: ReactNode;
}

/**
 * Window-chrome card used by the hero preview and pipeline output panel.
 * Chrome row: 8px dim dot + 11px dim title.
 * Body: 16px 18px padding, 13px font, 1.75 line-height.
 */
export default function AideFrame({ title, children }: AideFrameProps) {
  return (
    <div
      className="bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-[6px] overflow-hidden"
      style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}
    >
      {/* Chrome row */}
      <div className="flex items-center gap-[6px] px-[12px] py-[8px] border-b border-[color:var(--color-border)] bg-[rgba(255,255,255,0.03)]">
        <span
          className="block w-[8px] h-[8px] rounded-full bg-[color:var(--color-dim)]"
          aria-hidden="true"
        />
        <span className="text-[11px] text-[color:var(--color-dim)] ml-[6px]">
          {title}
        </span>
      </div>
      {/* Body */}
      <div className="px-[18px] py-[16px] text-[13px] leading-[1.75]">
        {children}
      </div>
    </div>
  );
}
