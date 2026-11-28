import siteIdentity from '@/data/siteIdentity';
import type { LlmsPage } from '@/types/llmsTxt';

/**
 * Turns a page's root-relative `urlPath` into its absolute canonical URL
 * (`siteIdentity.url` + `urlPath`). The path is never appended to, stripped or
 * rewritten; a path that is not already canonical throws, naming the path.
 */
export default function resolvePageUrl(page: Pick<LlmsPage, 'urlPath'>): string {
  const { urlPath } = page;
  if (!urlPath.startsWith('/')) throw new Error(`urlPath must start with "/": ${urlPath}`);
  if (!urlPath.endsWith('/')) throw new Error(`urlPath must end with "/": ${urlPath}`);
  if (urlPath.includes('.md')) throw new Error(`urlPath must not point at a .md copy: ${urlPath}`);
  if (urlPath !== urlPath.toLowerCase()) throw new Error(`urlPath must be lowercase: ${urlPath}`);
  return siteIdentity.url + urlPath;
}
