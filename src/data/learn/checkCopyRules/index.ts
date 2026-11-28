import type { LearnCopy, TextUnit } from "@/types/learn";
import templateLabels from "@/data/learn/templateLabels";
import countWords from "./countWords";
import listSlots from "./listSlots";
import listTextUnits from "./listTextUnits";

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const AS_OF_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const INTERNAL_HREF_PATTERN = /^\/(?:[^#]*\/)?(?:#[^#\s]+)?$/;
const PERSON_PATTERN = /tetsukodai|tetsukod|linkedin\.com\/in\//i;
const AIDE_PAIRING_PATTERN = /intent-driven|aidemd/i;

const ANSWER_WORDS = { min: 25, max: 90 };
const SECTION_WORDS = { min: 120, max: 180 };
const TITLE_MAX_CHARS = 70;
const DESCRIPTION_CHARS = { min: 70, max: 170 };

/** Formats one violation as `<slug> <where>: <rule>`. */
function violation(copy: LearnCopy, where: string, rule: string): string {
  return `${copy.slug} ${where}: ${rule}`;
}

/** Rule 1: the answer is present and quotable at 25-90 words. */
function checkAnswerFirst(copy: LearnCopy, units: TextUnit[]): string[] {
  const answer = units.find((unit) => unit.where === "answer")?.text ?? "";
  const words = countWords(answer);
  if (words === 0) return [violation(copy, "answer", "answer is empty")];
  if (words < ANSWER_WORDS.min || words > ANSWER_WORDS.max) {
    return [violation(copy, "answer", `answer must be ${ANSWER_WORDS.min}-${ANSWER_WORDS.max} words, found ${words}`)];
  }
  return [];
}

/** Rule 2: every section's prose runs 120-180 words, heading and code excluded. */
function checkSectionLength(copy: LearnCopy): string[] {
  return copy.sections.flatMap((section) => {
    // List each section alone so two sections sharing an id are not counted together.
    const alone = { ...copy, sections: [section], comparison: undefined, faq: undefined, related: [] };
    const text = listTextUnits(alone)
      .filter((unit) => unit.where.startsWith("section:") && !unit.where.endsWith(":heading"))
      .map((unit) => unit.text)
      .join(" ");
    const words = countWords(text);
    if (words >= SECTION_WORDS.min && words <= SECTION_WORDS.max) return [];
    return [
      violation(
        copy,
        `section:${section.id}`,
        `section must be ${SECTION_WORDS.min}-${SECTION_WORDS.max} words, found ${words}`,
      ),
    ];
  });
}

/** Rule 3: section and glossary ids are kebab-case, unique in the record and never a template id. */
function checkIds(copy: LearnCopy): string[] {
  const reserved: string[] = [templateLabels.faqId, templateLabels.relatedId];
  const identified = copy.sections.flatMap((section) => [
    { where: `section:${section.id}`, id: section.id },
    ...section.blocks.flatMap((block) =>
      block.kind === "glossary"
        ? block.terms.map((term) => ({ where: `section:${section.id}:glossary:${term.id}`, id: term.id }))
        : [],
    ),
  ]);

  const seen = new Set<string>();
  return identified.flatMap(({ where, id }) => {
    const found: string[] = [];
    if (!ID_PATTERN.test(id)) found.push(violation(copy, where, `id "${id}" must be lowercase kebab-case`));
    if (reserved.includes(id)) found.push(violation(copy, where, `id "${id}" is reserved for the page template`));
    if (seen.has(id)) found.push(violation(copy, where, `id "${id}" is not unique within the record`));
    seen.add(id);
    return found;
  });
}

/** Rule 4: AIDE is always paired with intent-driven or aidemd; AIDEY and a standalone AID never appear. */
function checkAidePairing(copy: LearnCopy, units: TextUnit[]): string[] {
  return units.flatMap(({ where, text }) => {
    const found: string[] = [];
    if (/\bAIDE\b/.test(text) && !AIDE_PAIRING_PATTERN.test(text)) {
      found.push(violation(copy, where, "AIDE must appear with intent-driven or aidemd in the same text"));
    }
    if (/\bAIDEY\b/.test(text)) found.push(violation(copy, where, "AIDEY is not allowed"));
    if (/\bAID\b/.test(text)) found.push(violation(copy, where, "standalone AID is not allowed"));
    return found;
  });
}

/** Rule 5: every comparison cell holding a digit carries a YYYY-MM-DD asOf, and any asOf present is well formed. */
function checkDatedNumbers(copy: LearnCopy): string[] {
  const rows = copy.comparison?.rows ?? [];
  return rows.flatMap((row, r) =>
    row.cells.flatMap((cell, c) => {
      const where = `comparison:cell:${r}:${c}`;
      if (cell.asOf !== undefined && !AS_OF_PATTERN.test(cell.asOf)) {
        return [violation(copy, where, `asOf "${cell.asOf}" must be YYYY-MM-DD`)];
      }
      if (cell.asOf === undefined && /\d/.test(cell.text)) {
        return [violation(copy, where, "a cell with a number needs an asOf date")];
      }
      return [];
    }),
  );
}

/** Rule 6: every comparison row has exactly as many cells as the table has columns. */
function checkTableShape(copy: LearnCopy): string[] {
  const comparison = copy.comparison;
  if (!comparison) return [];
  return comparison.rows.flatMap((row, r) =>
    row.cells.length === comparison.columns.length
      ? []
      : [
          violation(
            copy,
            `comparison:row:${r}`,
            `row has ${row.cells.length} cells, table has ${comparison.columns.length} columns`,
          ),
        ],
  );
}

/** Returns why an href is not allowed, or null when it is. */
function explainBadHref(href: string): string | null {
  if (href.includes(".md")) return `href "${href}" must not contain .md`;
  if (href.startsWith("https://")) return null;
  if (href.startsWith("//")) return `href "${href}" must not be protocol-relative`;
  if (href.startsWith("/")) {
    return INTERNAL_HREF_PATTERN.test(href)
      ? null
      : `internal href "${href}" must end with / or have /#<id> after a trailing slash`;
  }
  return `href "${href}" must be https:// or start with /`;
}

/** Rule 7: every link run and related href is https:// or a root-relative path with a trailing slash, never .md. */
function checkLinks(copy: LearnCopy): string[] {
  const runLinks = listSlots(copy).flatMap(({ where, value }) =>
    typeof value === "string"
      ? []
      : value.flatMap((run) => (run.kind === "link" ? [{ where, href: run.href }] : [])),
  );
  const relatedLinks = copy.related.map((link, n) => ({ where: `related:${n}`, href: link.href }));
  return [...runLinks, ...relatedLinks].flatMap(({ where, href }) => {
    const reason = explainBadHref(href);
    return reason === null ? [] : [violation(copy, where, reason)];
  });
}

/** Rule 8: titles, headings and questions are single-line; title and description stay inside search-snippet limits. */
function checkSingleLineMeta(copy: LearnCopy, units: TextUnit[]): string[] {
  const singleLine = (where: string) =>
    where === "title" ||
    where === "description" ||
    where === "h1" ||
    where.endsWith(":heading") ||
    /^faq:\d+:question$/.test(where);

  const found = units
    .filter((unit) => singleLine(unit.where) && /[\r\n]/.test(unit.text))
    .map((unit) => violation(copy, unit.where, "must be a single line"));

  if (copy.title.length > TITLE_MAX_CHARS) {
    found.push(violation(copy, "title", `title must be at most ${TITLE_MAX_CHARS} characters, found ${copy.title.length}`));
  }
  const descriptionChars = copy.description.length;
  if (descriptionChars < DESCRIPTION_CHARS.min || descriptionChars > DESCRIPTION_CHARS.max) {
    found.push(
      violation(
        copy,
        "description",
        `description must be ${DESCRIPTION_CHARS.min}-${DESCRIPTION_CHARS.max} characters, found ${descriptionChars}`,
      ),
    );
  }
  return found;
}

/** Rule 9: no text unit names the person or a personal profile. */
function checkNoPerson(copy: LearnCopy, units: TextUnit[]): string[] {
  return units
    .filter((unit) => PERSON_PATTERN.test(unit.text))
    .map((unit) => violation(copy, unit.where, "must not name the person or a personal profile"));
}

/** Rule 10: the record is marked draft or reviewed; a cast cannot slip a missing marker through. */
function checkDraftMarker(copy: LearnCopy): string[] {
  const status: string = copy.status;
  return status === "draft" || status === "reviewed"
    ? []
    : [violation(copy, "status", `status must be "draft" or "reviewed", found "${status}"`)];
}

/**
 * The executable form of the /learn data spec's copy rules. Checks one record
 * against ten rules in this order: answer first, section length, ids, AIDE
 * pairing, dated numbers, table shape, links, single-line meta, no person,
 * draft marker. Each violation is one message `<slug> <where>: <rule>`; a
 * clean record returns []. The `[VERIFY]` and `[NEEDS COLLECTION]` markers are
 * how an unproven fact ships, so they are never violations. Reads nothing but
 * the record and `templateLabels`.
 */
export default function checkCopyRules(copy: LearnCopy): string[] {
  const units = listTextUnits(copy);
  return [
    ...checkAnswerFirst(copy, units),
    ...checkSectionLength(copy),
    ...checkIds(copy),
    ...checkAidePairing(copy, units),
    ...checkDatedNumbers(copy),
    ...checkTableShape(copy),
    ...checkLinks(copy),
    ...checkSingleLineMeta(copy, units),
    ...checkNoPerson(copy, units),
    ...checkDraftMarker(copy),
  ];
}
