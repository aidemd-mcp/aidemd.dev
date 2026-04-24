import Link from 'next/link';
import type { DocRoute } from '@/types/docs';
import type { DocFrontmatter } from '@/types/docs';

interface DocsIndexCardProps {
  route: DocRoute;
  frontmatter: DocFrontmatter;
  index: number;
}

/**
 * Card row for the docs index and section-index pages.
 * Grid: 02-digit index | slug.md | dim description preview | read → accent link.
 */
export default function DocsIndexCard({ route, frontmatter, index }: DocsIndexCardProps) {
  const preview = frontmatter.description ?? '';

  return (
    <Link
      href={route.urlPath}
      style={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr auto',
        gap: 16,
        alignItems: 'center',
        padding: '14px 18px',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderLeft: '2px solid var(--color-accent)',
        borderRadius: 4,
        textDecoration: 'none',
        color: 'var(--color-fg)',
        fontSize: 14,
      }}
    >
      <span style={{ color: 'var(--color-dim)', fontSize: 12 }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      {/* min-width: 0 allows the 1fr grid cell to shrink below its content size */}
      <span style={{ minWidth: 0 }}>
        <span style={{ color: 'var(--color-accent)', fontWeight: 600, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {route.slug}.md
        </span>
        {preview && (
          <span
            style={{
              display: 'block',
              color: 'var(--color-dim)',
              fontSize: 12,
              marginTop: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {preview.length > 100 ? preview.slice(0, 100) + '…' : preview}
          </span>
        )}
      </span>
      <span style={{ color: 'var(--color-dim)', fontSize: 11 }}>read →</span>
    </Link>
  );
}
