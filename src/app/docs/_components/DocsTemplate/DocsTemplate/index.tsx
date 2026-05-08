import type { DocRoute } from '@/types/docs';
import type { DocFrontmatter } from '@/types/docs';
import Link from 'next/link';
import Breadcrumb from '../Breadcrumb';
import PrevNext from '../PrevNext';
import DocMeta from '@/components/DocMeta';
import DocsFooter from '../../DocsFooter';

interface DocsTemplateProps {
  route: DocRoute;
  frontmatter: DocFrontmatter;
  commit: string;
  published: string;
  /** Shiki-highlighted HTML from renderMarkdown — rendered via dangerouslySetInnerHTML. */
  renderedHtml: string;
  prev?: DocRoute;
  next?: DocRoute;
}

/**
 * One template that renders every markdown doc uniformly — no special cases per section.
 * Orchestrates: Breadcrumb → [slug-gated banner] → H1 → DocMeta → body prose → PrevNext → DocsFooter.
 *
 * Callouts in the body are rendered as .callout-{kind} divs by the rehypeCallouts plugin
 * in renderMarkdown — no post-processing needed here. The .docs-body CSS class applies
 * prose typography and callout styles declared in globals.css.
 *
 * Slug-gated banner: when route.section === 'methodology' && route.slug === 'brain-aide',
 * a reverse link "→ tutorial: wire your own backend" is rendered between Breadcrumb and H1,
 * pointing to /brain/. All other routes are unaffected.
 */
export default function DocsTemplate({
  route,
  frontmatter,
  commit,
  published,
  renderedHtml,
  prev,
  next,
}: DocsTemplateProps) {
  const sectionLabel = route.section.toUpperCase();
  const title = frontmatter.title ?? route.slug;
  const isBrainAide = route.section === 'methodology' && route.slug === 'brain-aide';

  return (
    <>
      <Breadcrumb
        segments={[
          { label: 'AIDE', href: '/' },
          { label: 'DOCS', href: '/docs' },
          { label: sectionLabel, href: `/docs/${route.section}/` },
          { label: title },
        ]}
      />

      {isBrainAide && (
        <Link
          href="/brain/"
          className="text-[color:var(--color-accent)] no-underline hover:underline"
        >
          → tutorial: wire your own backend
        </Link>
      )}

      <h1
        style={{
          fontSize: 36,
          margin: '8px 0 22px',
          fontWeight: 600,
          letterSpacing: -0.5,
          lineHeight: 1.1,
        }}
      >
        {title}
      </h1>

      <DocMeta
        published={published}
        commit={commit}
        urlPath={route.urlPath}
      />

      <div
        className="docs-body"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />

      <PrevNext prev={prev} next={next} />

      <DocsFooter />
    </>
  );
}
