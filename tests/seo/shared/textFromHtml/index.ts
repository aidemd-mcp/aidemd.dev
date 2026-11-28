const entities: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#x27;': "'",
  '&#39;': "'",
};

/**
 * The words a visitor would read in raw HTML, before any script runs: script
 * and style bodies, comments and tags removed, entities decoded. Script bodies
 * are dropped so structured data cannot satisfy a visible-text check.
 */
export default function textFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&(?:amp|lt|gt|quot|#x27|#39);/g, (entity) => entities[entity]);
}
