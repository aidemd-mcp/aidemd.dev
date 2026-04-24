import Link from 'next/link';
import type { DocRoute } from '@/types/docs';

interface PrevNextProps {
  prev?: DocRoute;
  next?: DocRoute;
}

/**
 * Prev/next navigation at the bottom of each doc page.
 * 2-col grid: prev card on left, next card on right.
 */
export default function PrevNext({ prev, next }: PrevNextProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginTop: 60,
        paddingTop: 24,
        borderTop: '1px solid var(--color-border)',
      }}
    >
      {prev ? (
        <Link
          href={prev.urlPath}
          style={{
            padding: '14px 16px',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            textDecoration: 'none',
            color: 'var(--color-fg)',
            background: 'var(--color-card)',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--color-dim-text)', marginBottom: 4 }}>← prev</div>
          <div style={{ fontSize: 14, color: 'var(--color-accent)' }}>{prev.title}</div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.urlPath}
          style={{
            padding: '14px 16px',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            textDecoration: 'none',
            color: 'var(--color-fg)',
            background: 'var(--color-card)',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--color-dim-text)', marginBottom: 4 }}>next →</div>
          <div style={{ fontSize: 14, color: 'var(--color-accent)' }}>{next.title}</div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
