import siteIdentity from '@/data/siteIdentity';

/**
 * Turns a root-relative path into an absolute URL on the site origin. Every URL and
 * `@id` in a structured-data record goes through this one function, so the origin is
 * never written as a literal host. It never adds or strips a trailing slash:
 * `SitePage.urlPath` already carries it.
 */
export default function resolveAbsoluteUrl(urlPath: string): string {
  if (!urlPath.startsWith('/')) {
    throw new Error(`structuredData: urlPath must be root-relative: ${urlPath}`);
  }
  return `${siteIdentity.url}${urlPath}`;
}
