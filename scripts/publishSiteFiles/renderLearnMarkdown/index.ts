import siteIdentity from '@/data/siteIdentity';
import templateLabels from '@/data/learn/templateLabels';
import type { LearnCopy } from '@/types/learn';
import type { SitePage } from '@/types/sitePage';
import renderBlock from './renderBlock';
import renderComparisonTable from './renderComparisonTable';
import renderRichText from './renderRichText';

/** The byline the page template shows: updated date and author, or the author alone when the page has no date. */
function renderByline(page: SitePage): string {
  if (!page.modified) return siteIdentity.name;
  return `${templateLabels.updatedLabel} ${page.modified.slice(0, 10)} · ${siteIdentity.name}`;
}

/** Writes the FAQ section: one `###` question and its answer per item. */
function renderFaq(faq: NonNullable<LearnCopy['faq']>): string[] {
  return [
    `## ${templateLabels.faqHeading}`,
    ...faq.flatMap((item) => [`### ${item.question}`, renderRichText(item.answer)]),
  ];
}

/** Writes the related section: one absolute link per entry. */
function renderRelated(related: LearnCopy['related']): string[] {
  return [
    `## ${templateLabels.relatedHeading}`,
    related.map((link) => `- ${renderRichText([{ kind: 'link', text: link.label, href: link.href }])}`).join('\n'),
  ];
}

/**
 * Renders the markdown copy of one /learn page. The order is the page
 * template's (H1, answer, byline, sections, comparison table, FAQ, related)
 * minus the breadcrumb, which is navigation and not content. Blocks are joined
 * by one blank line; the output is LF-only and ends in exactly one newline.
 * Throws when the copy record and the page list entry are not the same page.
 */
export default function renderLearnMarkdown({ copy, page }: { copy: LearnCopy; page: SitePage }): string {
  if (page.urlPath !== `/learn/${copy.slug}/`) {
    throw new Error(`renderLearnMarkdown: copy "${copy.slug}" does not belong to page ${page.urlPath}`);
  }

  const blocks = [
    // 1. Heading, answer and byline
    `# ${copy.h1}`,
    renderRichText(copy.answer),
    renderByline(page),
    // 2. Sections in record order
    ...copy.sections.flatMap((section) => [`## ${section.heading}`, ...section.blocks.map(renderBlock)]),
    // 3. Comparison table, FAQ and related links, when the record has them
    ...(copy.comparison ? [renderComparisonTable(copy.comparison)] : []),
    ...(copy.faq && copy.faq.length > 0 ? renderFaq(copy.faq) : []),
    ...renderRelated(copy.related),
  ];

  return `${blocks.join('\n\n')}\n`;
}
