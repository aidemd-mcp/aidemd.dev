import { readFile } from 'node:fs/promises';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import buildRegistry from '@/service/docsRegistry';
import buildStructuredData from '@/service/structuredData';
import JsonLd from '@/components/JsonLd';
import buildPageMetadata from '@/app/_shared/buildPageMetadata';
import findSitePage from '@/app/_shared/listSitePages/findSitePage';
import parseDocFrontmatter from '@/service/docsRegistry/parseDocFrontmatter';
import { DOCS_CATEGORIES, SECTION_INDEX_META } from '@/data/docsCategories';
import type { DocSection, DocRoute, DocFrontmatter } from '@/types/docs';
import Breadcrumb from '../_components/DocsTemplate/Breadcrumb';
import DocsIndexCard from '../_components/DocsIndexCard';
import DocsFooter from '../_components/DocsFooter';

interface PageParams {
  section: string;
}

// Next.js 14: params is a plain object; Next.js 15: params is a Promise.
// Using Promise<> type works in both (await on a plain object returns it unchanged).
interface PageProps {
  params: PageParams | Promise<PageParams>;
}

type RouteWithFrontmatter = {
  route: DocRoute;
  frontmatter: DocFrontmatter;
};

/**
 * Generates static params for one section-index page per DOCS_CATEGORIES entry.
 * Sourced from DOCS_CATEGORIES — no hardcoded section list.
 */
export async function generateStaticParams(): Promise<PageParams[]> {
  return DOCS_CATEGORIES.map((c) => ({ section: c.section }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section } = await params;
  const meta = SECTION_INDEX_META[section as DocSection];

  if (!meta) return { title: 'Not Found' };

  return buildPageMetadata(await findSitePage(`/docs/${section}/`));
}

/**
 * Section-index page backing /docs/<section>/ for every DOCS_CATEGORIES entry.
 * Filters the full registry to the matching section and renders DocsIndexCards.
 * Visually consistent with the global /docs/ index — differs only in scope.
 */
export default async function SectionIndexPage({ params }: PageProps) {
  const { section } = await params;
  const meta = SECTION_INDEX_META[section as DocSection];

  if (!meta) notFound();

  const page = await findSitePage(`/docs/${section}/`);
  const { routes } = await buildRegistry();
  const sectionRoutes = routes.filter((r) => r.section === section);

  const routesWithFrontmatter: RouteWithFrontmatter[] = await Promise.all(
    sectionRoutes.map(async (route) => {
      let frontmatter: DocFrontmatter = { title: route.title };
      try {
        const raw = await readFile(route.absPath, 'utf8');
        const parsed = parseDocFrontmatter(raw, route.slug);
        frontmatter = parsed.frontmatter;
      } catch {
        // Fall back to route title on read failure.
      }
      return { route, frontmatter };
    }),
  );

  return (
    <>
      <JsonLd document={buildStructuredData({ page })} />
      <Breadcrumb
        segments={page.breadcrumb.map((item, i) =>
          i < page.breadcrumb.length - 1 ? { label: item.name, href: item.urlPath } : { label: item.name },
        )}
      />

      <h1
        style={{
          fontSize: 36,
          margin: '8px 0 16px',
          fontWeight: 600,
          letterSpacing: -0.5,
          lineHeight: 1.1,
        }}
      >
        {meta.label}
      </h1>

      <p
        style={{
          fontSize: 16,
          lineHeight: 1.7,
          margin: '0 0 32px',
          color: 'var(--color-dim)',
        }}
      >
        {meta.lede}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {routesWithFrontmatter.map(({ route, frontmatter }, i) => (
          <DocsIndexCard
            key={route.urlPath}
            route={route}
            frontmatter={frontmatter}
            index={i}
          />
        ))}
      </div>

      <DocsFooter />
    </>
  );
}
