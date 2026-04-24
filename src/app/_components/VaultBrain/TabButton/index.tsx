"use client";

import cn from "@/lib/cn";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onSelect: () => void;
}

/**
 * Vault tab button — active: bg accent, fg bg; inactive: transparent bg, border.
 * 5px/10px padding, 11px mono font.
 */
export default function TabButton({ label, isActive, onSelect }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "font-mono text-[11px] rounded-[4px] border cursor-pointer transition-colors duration-[120ms]",
        isActive
          ? "bg-[color:var(--color-accent)] text-[color:var(--color-bg)] border-[color:var(--color-accent)]"
          : "bg-transparent text-[color:var(--color-fg)] border-[color:var(--color-border)]"
      )}
      style={{ padding: "5px 10px" }}
    >
      {label}
    </button>
  );
}
