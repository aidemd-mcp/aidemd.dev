'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
}

/**
 * Canonical copy-to-clipboard button. Swaps icon to "✓ copied" for 1500ms,
 * then resets. Clipboard failure is silent — the visual feedback still fires.
 */
export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable — still show visual feedback.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Copy to clipboard"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        fontSize: 10,
        color: copied ? 'var(--color-accent)' : 'var(--color-dim)',
        fontFamily: 'inherit',
      }}
    >
      <span aria-live="polite">{copied ? '✓ copied' : '⧉'}</span>
    </button>
  );
}
