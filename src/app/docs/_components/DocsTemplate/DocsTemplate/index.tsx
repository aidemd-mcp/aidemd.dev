import type { DocRoute } from '@/types/docs';
import type { DocFrontmatter } from '@/types/docs';
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
 * Orchestrates: Breadcrumb → H1 → DocMeta → body prose → PrevNext → DocsFooter.
 *
 * Callouts in the body are rendered as .callout-{kind} divs by the rehypeCallouts plugin
 * in renderMarkdown — no post-processing needed here. The .docs-body CSS class applies
 * prose typography and callout styles declared in globals.css.
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
