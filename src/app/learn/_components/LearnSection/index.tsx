import type { LearnSection as LearnSectionRecord } from "@/types/learn";
import LearnBlock from "./LearnBlock";

interface LearnSectionProps {
  section: LearnSectionRecord;
}

/**
 * One headed section. The H2 `id` comes from the record, so a heading edit
 * never breaks an inbound anchor link.
 */
export default function LearnSection({ section }: LearnSectionProps) {
  return (
    <section aria-labelledby={section.id}>
      <h2 id={section.id}>{section.heading}</h2>
      {section.blocks.map((block, index) => (
        <LearnBlock key={index} block={block} />
      ))}
    </section>
  );
}
