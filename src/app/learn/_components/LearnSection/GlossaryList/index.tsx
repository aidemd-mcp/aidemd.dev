import type { GlossaryTerm } from "@/types/learn";
import RichTextRuns from "../../shared/RichTextRuns";

interface GlossaryListProps {
  terms: GlossaryTerm[];
}

/**
 * A glossary as a plain list so the docs prose styles apply. Each item's `id`
 * is the stable anchor from the record, not derived from the term text.
 */
export default function GlossaryList({ terms }: GlossaryListProps) {
  return (
    <ul>
      {terms.map((term) => (
        <li key={term.id} id={term.id}>
          <strong>{term.term}</strong>: <RichTextRuns text={term.definition} />
        </li>
      ))}
    </ul>
  );
}
