import type { ReactNode } from "react";
import cn from "@/lib/cn";

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Pill button used as a backend-preset selector and as a horizontal tab.
 * Active state: filled accent background with dark #0d0b08 text.
 * Inactive state: transparent background, foreground text, border.
 * Renders as <button> for accessibility (not <div role="button">).
 * The click handler is passed in by the parent client component.
 * Server component — no internal state.
 */
export default function Chip({
  active = false,
  onClick,
  ariaLabel,
  children,
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={cn(
        "px-[13px] py-[7px] font-mono text-[12px] rounded border cursor-pointer transition-colors",
        active
          ? "bg-[color:var(--color-accent)] text-[#0d0b08] border-[color:var(--color-accent)]"
          : "bg-transparent text-[color:var(--color-fg)] border-[color:var(--color-border)]",
        className
      )}
    >
      {children}
    </button>
  );
}
