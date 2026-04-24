"use client";

import { useState } from "react";

const DISPLAY_CMD = "$ npx @aidemd-mcp/server init";
const COPY_CMD = "npx @aidemd-mcp/server init";

/**
 * Install command line with copy-to-clipboard.
 * Clicking the row copies COPY_CMD (no leading $) and swaps ⧉ → ✓ copied for 1500ms.
 */
export default function InstallLine() {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(COPY_CMD);
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS or automated context) —
      // still show the visual feedback so the UI responds to the click.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      aria-label="Copy install command to clipboard"
      className="flex items-center gap-[10px] px-[14px] py-[12px] bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-[4px] text-[13px] cursor-pointer select-none hover:bg-[color:var(--color-hover)] transition-colors"
    >
      <span className="text-[color:var(--color-accent)]">$</span>
      <span className="flex-1 text-[color:var(--color-fg)]">
        npx @aidemd-mcp/server init
      </span>
      <span
        className="text-[11px] text-[color:var(--color-dim)] ml-[4px] min-w-[56px] text-right"
        aria-live="polite"
      >
        {copied ? "✓ copied" : "⧉"}
      </span>
    </div>
  );
}
