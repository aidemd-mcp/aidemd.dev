import { Fragment } from "react";
import templateLabels from "@/data/learn/templateLabels";
import type { FaqItem } from "@/types/learn";
import RichTextRuns from "../shared/RichTextRuns";

interface FaqListProps {
  items: FaqItem[];
}

/**
 * The visible FAQ: one H3 question and answer paragraph per item, under the
 * shared heading. The FAQPage record is built elsewhere from the same items.
 */
export default function FaqList({ items }: FaqListProps) {
  return (
    <section aria-labelledby={templateLabels.faqId}>
      <h2 id={templateLabels.faqId}>{templateLabels.faqHeading}</h2>
      {items.map((item, index) => (
        <Fragment key={index}>
          <h3>{item.question}</h3>
          <p>
            <RichTextRuns text={item.answer} />
          </p>
        </Fragment>
      ))}
    </section>
  );
}
