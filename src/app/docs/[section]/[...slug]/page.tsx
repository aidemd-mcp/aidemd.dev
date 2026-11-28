import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import buildRegistry, { renderDoc } from '@/service/docsRegistry';
import buildStructuredData from '@/service/structuredData';
import JsonLd from '@/components/JsonLd';
import buildPageMetadata from '@/app/_shared/buildPageMetadata';
import findSitePage from '@/app/_shared/listSitePages/findSitePage';
import DocsTemplate from '../../_components/DocsTemplate/DocsTemplate';

interface PageParams {
  section: string;
  // Catch-all [...slug] — Next.js passes segment array.
  // e.g. /docs/commands/aide/align → slug: ['aide', 'align']
  // e.g. /docs/methodology/aide-spec → slug: ['aide-spec']
  slug: string[];
}

// Next.js 14: params is a plain object; Next.js 15: params is a Promise.
// Using Promise<> type works in both (await on a plain object returns it unchanged).
interface PageProps {
  params: PageParams | Promise<PageParams>;
}

/** Reconstructs the registry slug string from a catch-all slug array. */
function slugFromParts(parts: string[]): string {
  return parts.join('/');
}

/**
 * Generates static params for every leaf doc page from the filesystem registry.
 * Returns section + slug-array for each route — no hardcoded list.
 * Slugs containing '/' (e.g. 'aide/align') are split into arrays so Next.js
 * generates the correct nested directory structure instead of URL-encoding the
 * slash as %2F.
 */
export async function generateStaticParams(): Promise<PageParams[]> {
  const { routes } = await buildRegistry();
  return routes.map((r) => ({
    section: r.section,
    slug: r.urlPath.slice(`/docs/${r.section}/`.length).split('/'),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section, slug } = await params;
  const slugStr = slugFromParts(slug);
  const { routes } = await buildRegistry();
  const urlPath = `/docs/${section}/${slugStr}`;
  const route = routes.find((r) => r.urlPath === urlPath);

  if (!route) return { title: 'Not Found' };

  return buildPageMetadata(await findSitePage(`${route.urlPath}/`));
}

/**
 * Leaf doc page. Reads route from registry, renders markdown via renderDoc,
 * computes prev/next neighbors by order, and renders DocsTemplate.
 */
export default async function DocLeafPage({ params }: PageProps) {
  const { section, slug } = await params;
  const slugStr = slugFromParts(slug);
  const { routes } = await buildRegistry();

  const urlPath = `/docs/${section}/${slugStr}`;
  const route = routes.find((r) => r.urlPath === urlPath);

  if (!route) notFound();

  const { frontmatter, bodyHtml, commit } = await renderDoc(route);
  const page = await findSitePage(`${route.urlPath}/`);

  // Prev/next by order — sorted routes are deterministic.
  const sortedRoutes = [...routes].sort((a, b) => a.order - b.order);
  const idx = sortedRoutes.findIndex((r) => r.urlPath === route.urlPath);
  const prev = idx > 0 ? sortedRoutes[idx - 1] : undefined;
  const next = idx < sortedRoutes.length - 1 ? sortedRoutes[idx + 1] : undefined;

  return (
    <>
      <JsonLd document={buildStructuredData({ page })} />
      <DocsTemplate
        route={route}
        frontmatter={frontmatter}
        commit={commit}
        modified={page.modified}
        breadcrumb={page.breadcrumb}
        renderedHtml={bodyHtml}
        prev={prev}
        next={next}
      />
    </>
  );
}
