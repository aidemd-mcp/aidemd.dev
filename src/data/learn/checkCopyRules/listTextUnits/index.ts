import type { LearnCopy, TextUnit } from "@/types/learn";
import listSlots from "../listSlots";

/**
 * Every visible string of a copy record, in page order, each with a `where`
 * label. A rich-text value becomes its runs' `text` joined with nothing between
 * them, the same plain text the structured data uses; code blocks are not
 * text units. The checker does its own join rather than importing the service
 * that flattens for structured data, because a data module may not import a
 * service.
 */
export default function listTextUnits(copy: LearnCopy): TextUnit[] {
  return listSlots(copy).map(({ where, value }) => ({
    where,
    text: typeof value === "string" ? value : value.map((run) => run.text).join(""),
  }));
}
