import Link from 'next/link';

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
}

/**
 * Breadcrumb trail. Segments with href are linked; the last segment is plain text.
 * Separator: ' / ' in dim color.
 */
export default function Breadcrumb({ segments }: BreadcrumbProps) {
  return (
    <div
      style={{
        fontSize: 12,
        color: 'var(--color-dim-text)',
        letterSpacing: 2,
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
      }}
    >
      {segments.map((seg, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
          {i > 0 && (
            <span style={{ margin: '0 6px', color: 'var(--color-dim-2)' }}>/</span>
          )}
          {seg.href ? (
            <Link
              href={seg.href}
              style={{ color: 'var(--color-dim-text)', textDecoration: 'none' }}
            >
              {seg.label}
            </Link>
          ) : (
            <span>{seg.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
