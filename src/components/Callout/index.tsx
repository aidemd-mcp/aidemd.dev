import type { ReactNode } from 'react';

type CalloutKind = 'note' | 'warn' | 'info';

interface CalloutProps {
  kind: CalloutKind;
  children: ReactNode;
}

const KIND_COLOR: Record<CalloutKind, string> = {
  note: 'var(--color-accent)',
  warn: 'var(--color-todo)',
  info: 'var(--color-plan)',
};

/**
 * Renders a GitHub-style alert callout with a 3px left-border in the kind color.
 * Three kinds only: note (accent-green), warn (amber), info (blue).
 */
export default function Callout({ kind, children }: CalloutProps) {
  const color = KIND_COLOR[kind];
  return (
    <div
      style={{
        margin: '16px 0 20px',
        padding: '12px 16px',
        background: 'rgba(232,223,206,0.03)',
        border: '1px solid var(--color-border)',
        borderLeft: `3px solid ${color}`,
        borderRadius: 4,
        fontSize: 13,
        lineHeight: 1.7,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color,
          letterSpacing: 1.5,
          fontWeight: 600,
          marginBottom: 4,
          textTransform: 'uppercase',
        }}
      >
        {kind}
      </div>
      {children}
    </div>
  );
}
