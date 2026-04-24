import { readFile, stat } from 'node:fs/promises';
import { DOCS_CATEGORIES, SECTION_INDEX_META } from '@/data/docsCategories';
import type { DocSection } from '@/types/docs';

/** Regex that every bullet line under an H2 must satisfy. */
const LINK_LINE_RE = /^- \[[^\]]+\]\(https:\/\/aidemd\.dev\/docs\/[^)]+\)(:.+)?$/;

/** Regex to detect abandoned mascot name AIDEY (case-insensitive). */
const AIDEY_RE = /AIDEY/i;

/** Regex to detect the forbidden standalone token " AID " (case-sensitive, word-boundary). */
const AID_TOKEN_RE = / AID /;

/** Strings that must not appear anywhere in the document (companion-file advertisement). */
const FORBIDDEN_PHRASES = ['/llms-full.txt', 'llms-full.txt', '/ai.txt', 'full version'];

/**
 * Reads the generated llms.txt at `outPath` and asserts every structural and
 * content invariant the spec's `outcomes.desired` requires. Throws a descriptive
 * Error on any violation so the prebuild script exits non-zero and `next build`
 * aborts — that is the drift gate.
 *
 * Checks applied (in order):
 *   1. File exists and is non-empty.
 *   2. First line starts with `# ` (H1 present).
 *   3. First non-blank line after H1 starts with `> ` (blockquote present).
 *   4. Exactly one `## <label>` per section, in `expectedSectionOrder`, no extras.
 *   5. Every bullet line under an H2 matches the canonical link-line regex.
 *   6. No link URL ends in `.md`, is relative, or misses the correct section prefix.
 *   7. Each H2 section contains at least one bullet before the next H2.
 *   8. Document does not contain `AIDEY` or the standalone token ` AID `.
 *   9. Document does not advertise companion files (`/llms-full.txt`, `/ai.txt`, "full version").
 *
 * @param outPath - Absolute path to the generated llms.txt file.
 * @param expectedSectionOrder - Ordered `DocSection[]` defining the required H2 sequence.
 * @returns `{ bytes, routeCount }` — bytes on disk and total bullet lines matched.
 */
export default async function verifyOutput(
  outPath: string,
  expectedSectionOrder: DocSection[],
): Promise<{ bytes: number; routeCount: number }> {
  // 1. File exists and is non-empty
  const fileStat = await stat(outPath).catch(() => {
    throw new Error(`llms.txt: file not found at ${outPath}`);
  });
  if (fileStat.size === 0) throw new Error('llms.txt: file is empty');

  const content = await readFile(outPath, { encoding: 'utf8' });
  const lines = content.split('\n');

  // 2. H1 shape — first line must start with exactly `# `
  if (!lines[0]?.startsWith('# ')) throw new Error('llms.txt: missing H1 — first line must start with "# "');

  // 3. Blockquote shape — first non-blank line after H1 must start with `> `
  const blockquoteLine = lines.slice(1).find(l => l.trim() !== '');
  if (!blockquoteLine?.startsWith('> ')) {
    throw new Error('llms.txt: missing blockquote — first non-blank line after H1 must start with "> "');
  }

  // Build lookup maps from DOCS_CATEGORIES for URL and heading validation
  const urlSegmentBySection: Record<string, string> = {};
  for (const cat of DOCS_CATEGORIES) urlSegmentBySection[cat.section] = cat.urlSegment;

  const labelBySection: Record<string, string> = {};
  for (const section of expectedSectionOrder) labelBySection[section] = SECTION_INDEX_META[section].label;

  // 4. Section headings — collect all H2 lines and verify against expectedSectionOrder
  const h2Lines = lines
    .map((line, idx) => ({ line, idx }))
    .filter(({ line }) => line.startsWith('## '));

  const expectedLabels = expectedSectionOrder.map(s => SECTION_INDEX_META[s].label);

  if (h2Lines.length !== expectedLabels.length) {
    throw new Error(
      `llms.txt: expected ${expectedLabels.length} H2 headings but found ${h2Lines.length}`,
    );
  }

  for (let i = 0; i < h2Lines.length; i++) {
    const found = h2Lines[i].line.slice(3); // strip `## `
    const expected = expectedLabels[i];
    if (found !== expected) {
      throw new Error(
        `llms.txt: section order mismatch at position ${i} — expected "## ${expected}", found "## ${found}"`,
      );
    }
  }

  // 5–7. Walk H2 sections: validate link lines, URL shape, and non-empty sections
  let routeCount = 0;

  for (let h = 0; h < h2Lines.length; h++) {
    const sectionStart = h2Lines[h].idx;
    const sectionEnd = h < h2Lines.length - 1 ? h2Lines[h + 1].idx : lines.length;
    const section = expectedSectionOrder[h];
    const urlSegment = urlSegmentBySection[section];

    // Collect bullet lines in this section
    const bulletLines = lines
      .slice(sectionStart + 1, sectionEnd)
      .filter(l => l.startsWith('- '));

    // 7. Section has at least one link
    if (bulletLines.length === 0) {
      throw new Error(
        `llms.txt: section "${SECTION_INDEX_META[section].label}" has no links — the walk broke or the section is empty`,
      );
    }

    for (const bullet of bulletLines) {
      // 5. Link line shape
      if (!LINK_LINE_RE.test(bullet)) {
        throw new Error(
          `llms.txt: malformed link line in section "${SECTION_INDEX_META[section].label}": ${bullet}`,
        );
      }

      // Extract the URL from the bullet
      const urlMatch = bullet.match(/\]\((https:\/\/aidemd\.dev\/docs\/[^)]+)\)/);
      if (!urlMatch) {
        throw new Error(`llms.txt: could not extract URL from bullet: ${bullet}`);
      }
      const url = urlMatch[1];

      // 6a. No .md extension
      if (url.endsWith('.md')) {
        throw new Error(`llms.txt: link has .md extension — ${url}`);
      }

      // 6b. Not relative — already guaranteed by regex (starts with https://), but check explicitly
      if (url.startsWith('/') || url.startsWith('.')) {
        throw new Error(`llms.txt: relative link URL detected — ${url}`);
      }

      // 6c. URL starts with correct section prefix
      const expectedPrefix = `https://aidemd.dev/docs/${urlSegment}/`;
      if (!url.startsWith(expectedPrefix)) {
        throw new Error(
          `llms.txt: link URL in section "${SECTION_INDEX_META[section].label}" must start with "${expectedPrefix}" — got ${url}`,
        );
      }

      routeCount++;
    }
  }

  // 8. No abandoned mascot names
  if (AIDEY_RE.test(content)) throw new Error('llms.txt: document contains abandoned mascot name "AIDEY"');
  if (AID_TOKEN_RE.test(content)) throw new Error('llms.txt: document contains forbidden standalone token " AID "');

  // 9. No companion-file advertisement
  for (const phrase of FORBIDDEN_PHRASES) {
    if (content.includes(phrase)) {
      throw new Error(`llms.txt: document advertises companion file — forbidden phrase found: "${phrase}"`);
    }
  }

  return { bytes: fileStat.size, routeCount };
}
