import type { DocRoute } from '@/types/docs';
import type { DocFrontmatter } from '@/types/docs';
import type { BreadcrumbItem } from '@/types/sitePage';
import Link from 'next/link';
import Breadcrumb from '../Breadcrumb';
import PrevNext from '../PrevNext';
import DocMeta from '@/components/DocMeta';
import DocsFooter from '../../DocsFooter';
import DocsBody from '../DocsBody';

interface DocsTemplateProps {
  route: DocRoute;
  frontmatter: DocFrontmatter;
  commit: string;
  modified?: string;
  /** The page record's trail: every item but the last links, the last is the current page. */
  breadcrumb: BreadcrumbItem[];
  /** Shiki-highlighted HTML from renderMarkdown — rendered via dangerouslySetInnerHTML. */
  renderedHtml: string;
  prev?: DocRoute;
  next?: DocRoute;
}

/**
 * One template that renders every markdown doc uniformly — no special cases per section.
 * Orchestrates: Breadcrumb → [slug-gated banner] → <article>(H1 → DocMeta → body prose rendered by DocsBody) → PrevNext → DocsFooter.
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
  modified,
  breadcrumb,
  renderedHtml,
  prev,
  next,
}: DocsTemplateProps) {
  const title = frontmatter.title ?? route.slug;
  const isBrainAide = route.section === 'methodology' && route.slug === 'brain-aide';

  return (
    <>
      <Breadcrumb
        segments={breadcrumb.map((item, i) =>
          i < breadcrumb.length - 1 ? { label: item.name, href: item.urlPath } : { label: item.name },
        )}
      />

      {isBrainAide && (
        <Link
          href="/brain/"
          className="text-[color:var(--color-accent)] no-underline hover:underline"
        >
          → tutorial: wire your own backend
        </Link>
      )}

      <article>
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
          modified={modified}
          commit={commit}
          urlPath={route.urlPath}
        />

        <DocsBody html={renderedHtml} />
      </article>

      <PrevNext prev={prev} next={next} />

      <DocsFooter />
    </>
  );
}
