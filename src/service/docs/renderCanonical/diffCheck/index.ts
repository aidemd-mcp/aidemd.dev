import { createHash } from "node:crypto";

/**
 * Extracts plain text from HTML by stripping tags and decoding entities.
 */
function extractTextFromHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

/**
 * Extracts plain text from markdown by stripping syntax markers.
 */
function extractTextFromMarkdown(md: string): string {
  return (
    md
      // Remove fenced code block delimiters (preserve content inside)
      .replace(/^```[^\n]*$/gm, "")
      // Remove ATX headings markers
      .replace(/^#{1,6}\s+/gm, "")
      // Remove setext underlines
      .replace(/^[=\-]{2,}\s*$/gm, "")
      // Remove blockquote markers
      .replace(/^>\s?/gm, "")
      // Remove horizontal rules
      .replace(/^[-*_]{3,}\s*$/gm, "")
      // Remove unordered list markers
      .replace(/^(\s*)[-*+]\s+/gm, "$1")
      // Remove ordered list markers
      .replace(/^(\s*)\d+\.\s+/gm, "$1")
      // Remove images (keep alt text)
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      // Remove links (keep link text)
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // Remove inline code backticks
      .replace(/`([^`]*)`/g, "$1")
      // Remove bold/italic (greedy within lines)
      .replace(/\*{1,3}(.+?)\*{1,3}/g, "$1")
      .replace(/_{1,3}(.+?)_{1,3}/g, "$1")
      // Remove strikethrough
      .replace(/~~(.+?)~~/g, "$1")
  );
}

/**
 * Normalizes text to a bag of words for comparison.
 * Lowercases, strips all non-alphanumeric characters, splits on whitespace,
 * sorts, and joins. This makes comparison resilient to formatting differences
 * while still catching content additions, removals, or rewrites.
 */
function normalizeToWords(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .sort()
    .join(" ");
}

/**
 * Hashes a string with SHA-256 and returns the hex digest.
 */
function sha256(input: string): string {
  return createHash("sha256").update(input, "utf-8").digest("hex");
}

/**
 * Post-render byte-faithfulness check.
 *
 * Extracts plain text from both the markdown source body and the rendered HTML,
 * normalizes both to sorted word bags, and compares hashes. This catches content
 * rewrites introduced by the renderer (added words, removed words, changed words)
 * while tolerating the formatting differences inherent in markdown-to-HTML
 * conversion (tag wrapping, entity encoding, whitespace changes).
 */
export default function diffCheck(
  slug: string,
  sourceBody: string,
  contentHtml: string,
): void {
  const sourceText = normalizeToWords(extractTextFromMarkdown(sourceBody));
  const htmlText = normalizeToWords(extractTextFromHtml(contentHtml));

  const sourceHash = sha256(sourceText);
  const htmlHash = sha256(htmlText);

  if (sourceHash !== htmlHash) {
    throw new Error(
      `renderCanonical: byte-faithfulness check failed for "${slug}" — ` +
        `source hash ${sourceHash} does not match rendered content hash ${htmlHash}. ` +
        `The renderer introduced a content transformation that is not permitted.`,
    );
  }
}
