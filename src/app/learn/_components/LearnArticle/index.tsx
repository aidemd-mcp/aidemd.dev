import type { LearnCopy } from "@/types/learn";
import type { SitePage } from "@/types/sitePage";
import ComparisonTable from "../ComparisonTable";
import FaqList from "../FaqList";
import LearnBreadcrumb from "../LearnBreadcrumb";
import LearnHeader from "../LearnHeader";
import LearnSection from "../LearnSection";
import RelatedLinks from "../RelatedLinks";

interface LearnArticleProps {
  copy: LearnCopy;
  page: SitePage;
}

/**
 * Renders one copy record in a fixed order, and nothing else: breadcrumb,
 * header (H1, answer, date and author), the sections in record order, the
 * comparison table when it has rows, the FAQ when it has items, then the
 * related list. The sequence lives here, so copy can neither reorder nor
 * insert blocks. The record's review marker is never read: rendering does not
 * branch on it.
 */
export default function LearnArticle({ copy, page }: LearnArticleProps) {
  const hasComparison = copy.comparison !== undefined && copy.comparison.rows.length > 0;
  const hasFaq = copy.faq !== undefined && copy.faq.length > 0;
  return (
    <article className="docs-body">
      <LearnBreadcrumb breadcrumb={page.breadcrumb} />
      <LearnHeader h1={copy.h1} answer={copy.answer} modified={page.modified} />
      {copy.sections.map((section) => (
        <LearnSection key={section.id} section={section} />
      ))}
      {hasComparison && copy.comparison && <ComparisonTable table={copy.comparison} />}
      {hasFaq && copy.faq && <FaqList items={copy.faq} />}
      <RelatedLinks links={copy.related} />
    </article>
  );
}
