import { readFile } from 'node:fs/promises';
import type { Metadata } from 'next';
import buildRegistry from '@/service/docsRegistry';
import parseDocFrontmatter from '@/service/docsRegistry/parseDocFrontmatter';
import { DOCS_CATEGORIES } from '@/data/docsCategories';
import type { DocRoute, DocFrontmatter } from '@/types/docs';
import Breadcrumb from './_components/DocsTemplate/Breadcrumb';
import DocsIndexCard from './_components/DocsIndexCard';
import DocsFooter from './_components/DocsFooter';

export const metadata: Metadata = {
  title: 'Canonical Docs',
  description:
    'The byte-faithful, timestamped, archivable record of the AIDE methodology. Every page is a direct render of the source file in the .aide/ hub.',
  alternates: {
    canonical: 'https://aidemd.dev/docs/',
  },
};

type RouteWithFrontmatter = {
  route: DocRoute;
  frontmatter: DocFrontmatter;
};

/**
 * /docs — global docs index. Groups all 33 routes by section and renders
 * them as DocsIndexCard lists. No hardcoded doc list — all routes come from
 * the filesystem walk in buildRegistry().
 */
export default async function DocsPage() {
  const { routes } = await buildRegistry();

  // Read frontmatter for every route (needed for the description preview).
  const routesWithFrontmatter: RouteWithFrontmatter[] = await Promise.all(
    routes.map(async (route) => {
      let frontmatter: DocFrontmatter = { title: route.title };
      try {
        const raw = await readFile(route.absPath, 'utf8');
        const parsed = parseDocFrontmatter(raw, route.slug);
        frontmatter = parsed.frontmatter;
      } catch {
        // If unreadable, fall back to route title.
      }
      return { route, frontmatter };
    }),
  );

  const groupedBySection = DOCS_CATEGORIES.map((cat) => ({
    section: cat.section,
    label: cat.label,
    items: routesWithFrontmatter.filter(({ route }) => route.section === cat.section),
  }));

  return (
    <>
      <Breadcrumb
        segments={[
          { label: 'AIDE', href: '/' },
          { label: 'DOCS' },
        ]}
      />

      <h1
        style={{
          fontSize: 36,
          margin: '8px 0 22px',
          fontWeight: 600,
          letterSpacing: -0.5,
          lineHeight: 1.1,
        }}
      >
        AIDE Canonical Docs
      </h1>

      <p
        style={{
          fontSize: 16,
          lineHeight: 1.7,
          margin: '0 0 32px',
          color: 'var(--color-fg)',
        }}
      >
        The byte-faithful, timestamped, archivable record of the AIDE methodology — every page is a direct render of the source file in the{' '}
        <code
          style={{
            fontFamily: 'inherit',
            fontSize: 14,
            padding: '1px 6px',
            background: 'rgba(232,223,206,0.06)',
            border: '1px solid var(--color-border)',
            borderRadius: 3,
            color: 'var(--color-accent)',
          }}
        >
          .aide/
        </code>{' '}
        hub.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {groupedBySection.map(({ section, label, items }) => (
          <section key={section}>
            <div
              style={{
                fontSize: 11,
                color: 'var(--color-dim-2)',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              # {label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {items.map(({ route, frontmatter }, i) => (
                <DocsIndexCard
                  key={route.urlPath}
                  route={route}
                  frontmatter={frontmatter}
                  index={i}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <DocsFooter />
    </>
  );
}
