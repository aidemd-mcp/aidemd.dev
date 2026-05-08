import type { ReactNode } from "react";

interface SectionScaffoldProps {
  num: "01" | "02" | "03" | "04" | "05";
  title: string;
  sub?: string;
  children: ReactNode;
}

/**
 * Shared section wrapper used by §01 through §05.
 * Matches brain-variant-walkthrough.jsx Section helper (lines 203–215):
 * 44px/64px padding, §{num} accent eyebrow baseline-aligned with title,
 * optional dim sub line indented to title's left edge (marginLeft 38),
 * then the children slot.
 * Server component.
 */
export default function SectionScaffold({
  num,
  title,
  sub,
  children,
}: SectionScaffoldProps) {
  return (
    <div className="px-[24px] md:px-[64px] py-[44px] max-w-[1180px]">
      <div className="flex items-baseline gap-[14px] mb-[6px]">
        <span className="text-[14px] text-[color:var(--color-accent)]">§{num}</span>
        <span className="text-[24px] font-semibold text-[color:var(--color-fg)]">{title}</span>
      </div>
      {sub && (
        <div className="text-[13px] text-[color:var(--color-dim)] mb-[26px] ml-[38px] leading-[1.6]">
          {sub}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
