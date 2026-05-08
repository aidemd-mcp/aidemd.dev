import type { ReactNode } from "react";

interface SubHeaderProps {
  children: ReactNode;
}

/**
 * Uppercase letter-spaced accent label used as a sub-section header within sections.
 * Matches brain-variant-walkthrough.jsx lines 221–227: accent color, fontSize 12,
 * letterSpacing 1.5, marginBottom 14, marginTop 8.
 * Server component.
 */
export default function SubHeader({ children }: SubHeaderProps) {
  return (
    <div className="text-[12px] text-[color:var(--color-accent)] tracking-[1.5px] mb-[14px] mt-[8px] uppercase">
      {children}
    </div>
  );
}
