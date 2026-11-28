/**
 * Counts whitespace-separated tokens after trimming, the one word count the
 * copy rules use for answer and section length. A hyphenated word or a package
 * name such as `@aidemd-mcp/server` is one token; empty text is 0.
 */
export default function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  return trimmed.split(/\s+/).length;
}
