import type { ReactNode } from "react";
import cn from "@/lib/cn";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

/**
 * Uppercase 11px letter-spaced label in accent green.
 * Used as a section label / eyebrow above headings or cards.
 * Matches the handoff treatment: fontSize 11, letterSpacing 1.5, color accent.
 * Server component.
 */
export default function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <div
      className={cn(
        "text-[11px] text-[color:var(--color-accent)] uppercase tracking-[1.5px]",
        className
      )}
    >
      {children}
    </div>
  );
}
