import CopyButton from './CopyButton';

interface CodeBlockProps {
  /** Pre-rendered Shiki HTML fragment — inserted verbatim. */
  html: string;
  /** Optional language name or filename shown in the header row. */
  label?: string;
  /** Raw source text — passed to CopyButton so it copies clean code. */
  code: string;
}

/**
 * Server-side code block wrapper. Accepts pre-highlighted Shiki HTML and
 * renders it inside a terminal-aesthetic card. When a label is supplied an
 * optional header row is shown with the label on the left and a CopyButton
 * on the right.
 */
export default function CodeBlock({ html, label, code }: CodeBlockProps) {
  return (
    <div
      style={{
        margin: '16px 0 20px',
        border: '1px solid var(--color-border)',
        borderRadius: 6,
        overflowX: 'auto',
        background: '#0a0906',
      }}
    >
      {label && (
        <div
          style={{
            padding: '8px 14px',
            borderBottom: '1px solid var(--color-border)',
            fontSize: 11,
            color: 'var(--color-dim)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-card)',
          }}
        >
          <span>{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          margin: 0,
          padding: '16px 18px',
          fontSize: 13,
          lineHeight: 1.65,
          overflowX: 'auto',
        }}
      />
    </div>
  );
}
