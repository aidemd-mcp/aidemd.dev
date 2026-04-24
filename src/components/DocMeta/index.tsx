import CopyButton from '@/components/CodeBlock/CopyButton';

interface DocMetaProps {
  published: string;
  commit: string;
  slug: string;
}

/**
 * Document metadata card shown at the top of every doc page.
 * 2-col grid: 100px label column / 1fr value column.
 * Cite-as URL is click-to-copy via CopyButton.
 */
export default function DocMeta({ published, commit, slug }: DocMetaProps) {
  const citeUrl = `https://aidemd.dev/docs/${slug}?v=${commit}`;

  return (
    <div
      style={{
        padding: '14px 18px',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 6,
        fontSize: 12,
        marginBottom: 28,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr',
          gap: '4px 12px',
          alignItems: 'center',
          minWidth: 0,
        }}
      >
        <div style={{ color: 'var(--color-dim)' }}>Published</div>
        <div style={{ minWidth: 0, overflow: 'hidden' }}>{published || '—'}</div>

        <div style={{ color: 'var(--color-dim)' }}>Source commit</div>
        <div style={{ minWidth: 0 }}>
          <span
            style={{
              padding: '1px 6px',
              background: 'rgba(232,223,206,0.05)',
              border: '1px solid var(--color-border)',
              borderRadius: 3,
              fontFamily: 'inherit',
            }}
          >
            {commit}
          </span>
        </div>

        <div style={{ color: 'var(--color-dim)' }}>Cite as</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span
            style={{
              borderBottom: '1px dotted var(--color-accent)',
              color: 'var(--color-accent)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
              flex: '1 1 0',
            }}
          >
            {citeUrl}
          </span>
          <CopyButton text={citeUrl} />
        </div>
      </div>
    </div>
  );
}
