import type { LearnCopy, LearnBlock, RichText, TextUnit } from "@/types/learn";

/** One visible value of a copy record and where it sits: a plain string, or rich text that may carry link runs. */
type Slot = Omit<TextUnit, "text"> & { value: string | RichText };

/** Slots for one block; `n` is the block's position in its section, so every label is unique. */
function listBlockSlots(sectionId: string, block: LearnBlock, n: number): Slot[] {
  const prefix = `section:${sectionId}`;
  if (block.kind === "code") return [];
  if (block.kind === "paragraph") return [{ where: `${prefix}:paragraph:${n}`, value: block.text }];
  if (block.kind === "list") {
    return block.items.map((item, m) => ({ where: `${prefix}:list:${n}:${m}`, value: item }));
  }
  return block.terms.flatMap((term) => [
    { where: `${prefix}:glossary:${term.id}:term`, value: term.term },
    { where: `${prefix}:glossary:${term.id}:definition`, value: term.definition },
  ]);
}

/**
 * Walks a copy record once, in page order, and returns every visible value with
 * its location label. Code blocks are not slots. Both the plain-text view
 * (listTextUnits) and the link check read this one traversal, so a location is
 * defined in one place. Block, list-item, column, row, cell and FAQ positions
 * are zero-based.
 */
export default function listSlots(copy: LearnCopy): Slot[] {
  const slots: Slot[] = [
    { where: "title", value: copy.title },
    { where: "description", value: copy.description },
    { where: "h1", value: copy.h1 },
    { where: "answer", value: copy.answer },
  ];

  for (const section of copy.sections) {
    slots.push({ where: `section:${section.id}:heading`, value: section.heading });
    section.blocks.forEach((block, n) => slots.push(...listBlockSlots(section.id, block, n)));
  }

  if (copy.comparison) {
    slots.push({ where: "comparison:caption", value: copy.comparison.caption });
    copy.comparison.columns.forEach((column, n) => slots.push({ where: `comparison:column:${n}`, value: column }));
    copy.comparison.rows.forEach((row, r) =>
      row.cells.forEach((cell, c) => slots.push({ where: `comparison:cell:${r}:${c}`, value: cell.text })),
    );
  }

  (copy.faq ?? []).forEach((item, n) => {
    slots.push({ where: `faq:${n}:question`, value: item.question });
    slots.push({ where: `faq:${n}:answer`, value: item.answer });
  });

  copy.related.forEach((link, n) => slots.push({ where: `related:${n}`, value: link.label }));

  return slots;
}
