/**
 * Extracts the first substantive sentence from a markdown body (post-frontmatter,
 * post-H1). Used as the third-level fallback in the description chain when a doc
 * has neither a frontmatter `description:` field nor a section-level purpose
 * statement.
 *
 * Extraction rules:
 *  1. Skip blank lines, ATX headings (`#`), fenced code block delimiters (` ``` `),
 *     HTML comments, and list items (`-`, `*`, `+`, numbered), and table rows.
 *  2. The first non-skipped line starts the candidate paragraph. Join consecutive
 *     non-skipped, non-blank lines to capture sentences that wrap across lines.
 *  3. Blockquotes (`>`) are treated as lower-priority content — they are skipped
 *     during the primary pass. If no regular paragraph is found, a second pass
 *     extracts text from the first blockquote (stripping the `> ` prefix) to use
 *     as the fallback. This lets scaffold/template docs whose only prose is in a
 *     blockquote still produce a useful description.
 *  4. Split the paragraph text on the first `. ` (period + space) boundary to get
 *     the first sentence, or take the whole paragraph if no such boundary exists.
 *  5. Strip markdown syntax from the sentence:
 *     - `**bold**` / `__bold__` → `bold`
 *     - `*italic*` / `_italic_` → `italic`
 *     - `` `code` `` → `code`
 *     - `[link text](url)` → `link text`
 *     - `![alt](url)` → `alt`
 *  6. Trim to a maximum of 200 characters at a word boundary, appending `…` if cut.
 *  7. Collapse internal whitespace and trim.
 *
 * Returns `undefined` if no substantive line is found (e.g. the body is entirely
 * headings and lists with no prose — like the `index.md` methodology hub).
 */
export default function extractBodyFirstSentence(body: string): string | undefined {
  const lines = body.split('\n');

  // Pre-process lines with fenced-code-block awareness.
  // Mark each line as "in-fence" if it's inside or is a code fence delimiter.
  const inCodeFence = ((): boolean[] => {
    const result: boolean[] = [];
    let insideFence = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^```/.test(trimmed)) {
        result.push(true); // delimiter line itself is skipped
        insideFence = !insideFence;
      } else if (insideFence) {
        result.push(true); // content inside fence is skipped
      } else {
        result.push(false);
      }
    }
    return result;
  })();

  /** Returns true if the line should be skipped in both primary and secondary passes. */
  const isStructural = (line: string): boolean => {
    const trimmed = line.trim();
    if (trimmed === '') return true;
    if (/^#{1,6}\s/.test(trimmed)) return true; // ATX heading
    if (/^<!--/.test(trimmed)) return true; // HTML comment
    if (/^[-*+]\s/.test(trimmed)) return true; // unordered list item
    if (/^\d+[.)]\s/.test(trimmed)) return true; // ordered list item
    if (/^\|/.test(trimmed)) return true; // table row
    return false;
  };

  /** Returns true if the line is a blockquote (skipped in primary pass only). */
  const isBlockquote = (line: string): boolean => /^>/.test(line.trim());

  /** Collects a paragraph starting at `startIdx`, stopping at blank/structural/fenced lines. */
  const collectParagraph = (startIdx: number, includeBlockquotes: boolean): string[] => {
    const collected: string[] = [];
    for (let i = startIdx; i < lines.length; i++) {
      if (inCodeFence[i]) break;
      const trimmed = lines[i].trim();
      if (trimmed === '') break;
      if (isStructural(lines[i])) break;
      if (!includeBlockquotes && isBlockquote(lines[i])) break;
      // Strip blockquote prefix if we're in blockquote mode.
      collected.push(includeBlockquotes ? trimmed.replace(/^>+\s*/, '') : trimmed);
    }
    return collected;
  };

  // Primary pass: find the first regular paragraph (no blockquotes).
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (!inCodeFence[i] && !isStructural(lines[i]) && !isBlockquote(lines[i])) {
      startIdx = i;
      break;
    }
  }

  let paragraphLines = startIdx !== -1 ? collectParagraph(startIdx, false) : [];

  // Secondary pass (blockquote fallback): if no regular paragraph found, try the
  // first blockquote — useful for scaffold/template docs whose intro is a blockquote.
  if (paragraphLines.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      if (!inCodeFence[i] && !isStructural(lines[i]) && isBlockquote(lines[i])) {
        paragraphLines = collectParagraph(i, true);
        break;
      }
    }
  }

  if (paragraphLines.length === 0) return undefined;

  const paragraph = paragraphLines.join(' ');

  // Strip markdown syntax from the full paragraph BEFORE splitting into sentences.
  // This ensures bold/italic spans that cross a sentence boundary are resolved
  // before we split, so the sentence boundary detection works on clean text.
  const cleanParagraph = paragraph
    // Images: ![alt](url) → alt
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Links: [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Bold: **text** or __text__ → text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    // Italic: *text* or _text_ → text
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Code: `text` → text
    .replace(/`([^`]+)`/g, '$1')
    // Collapse internal whitespace
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanParagraph) return undefined;

  // Split on the first `. ` to get just the first sentence.
  const sentenceMatch = cleanParagraph.match(/^(.*?\.)\s+/);
  const stripped = sentenceMatch ? sentenceMatch[1] : cleanParagraph;

  if (!stripped) return undefined;

  // Trim to 200 chars at word boundary.
  if (stripped.length <= 200) return stripped;

  const cut = stripped.slice(0, 200).replace(/\s+\S*$/, '');
  return cut + '…'; // …
}
