const REPLACEMENTS: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

/** Characters XML 1.0 forbids: C0 controls except tab/LF/CR, U+FFFE, U+FFFF, and lone surrogates. */
const FORBIDDEN =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;

/**
 * Escapes raw text for use as an XML text node or attribute value. It is the only
 * escaping path in the atomFeed module. Input is always raw text, never pre-escaped.
 * Throws when the text holds a character XML 1.0 forbids: dropping it would make a
 * feed entry differ from the page it describes, so the build fails instead.
 */
export default function escapeXml(text: string): string {
  const forbidden = FORBIDDEN.exec(text);
  if (forbidden) {
    const codePoint = forbidden[0].charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
    throw new Error(`escapeXml: text holds U+${codePoint}, which XML 1.0 forbids`);
  }
  return text.replace(/[&<>"']/g, (character) => REPLACEMENTS[character]);
}
