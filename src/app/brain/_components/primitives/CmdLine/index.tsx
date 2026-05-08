"use client";

import { useState, useEffect, useRef } from "react";
import cn from "@/lib/cn";

interface CmdLineProps {
  cmd: string;
  className?: string;
}

/**
 * Clickable command-line block. The ENTIRE box is a single <button> —
 * never composed with CopyChip to avoid button-in-button nesting.
 * On click (or Enter/Space): writes cmd to navigator.clipboard and shows
 * ✓ indicator for 1400ms, then resets to ⧉.
 * Layout: $ accent prefix · monospace cmd body · trailing copy indicator.
 * Border-left: 2px solid --color-accent.
 */
export default function CmdLine({ cmd, className }: CmdLineProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleClick() {
    navigator.clipboard?.writeText(cmd);
    setCopied(true);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setCopied(false);
    }, 1400);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full text-left flex items-center gap-[10px]",
        "px-[14px] py-[12px]",
        "bg-[color:var(--color-card)] border border-[color:var(--color-border)]",
        "border-l-2 border-l-[color:var(--color-accent)]",
        "rounded text-[13px] cursor-pointer font-mono text-[color:var(--color-fg)]",
        className
      )}
    >
      <span className="text-[color:var(--color-accent)]">$</span>
      <span className="flex-1">{cmd}</span>
      <span
        className={cn(
          "text-[11px]",
          copied
            ? "text-[color:var(--color-accent)]"
            : "text-[color:var(--color-dim)]"
        )}
      >
        {copied ? "✓" : "⧉"}
      </span>
    </button>
  );
}
