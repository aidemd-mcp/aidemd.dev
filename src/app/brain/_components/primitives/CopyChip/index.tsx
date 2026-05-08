"use client";

import { useState, useEffect, useRef } from "react";
import cn from "@/lib/cn";

interface CopyChipProps {
  text: string;
  label?: string;
  className?: string;
}

/**
 * Client-side clipboard copy button.
 * Renders as a <button> (not <span>) for accessibility.
 * On click: writes text to navigator.clipboard, shows "✓ copied" for 1400ms,
 * then resets to the prior label (default "⧉ copy").
 * Timeout is cleared on unmount via useEffect cleanup.
 */
export default function CopyChip({ text, label = "⧉ copy", className }: CopyChipProps) {
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
    navigator.clipboard?.writeText(text);
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
        "cursor-pointer text-[11px] select-none bg-transparent border-0 p-0",
        copied
          ? "text-[color:var(--color-accent)]"
          : "text-[color:var(--color-dim)]",
        className
      )}
    >
      {copied ? "✓ copied" : label}
    </button>
  );
}
