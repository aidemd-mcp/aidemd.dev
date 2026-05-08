import type { ReactNode } from "react";
import cn from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Bordered card container for brain-section content blocks.
 * Matches the handoff card treatment: card background, 1px border, 4px radius.
 * Server component.
 */
export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded",
        className
      )}
    >
      {children}
    </div>
  );
}
