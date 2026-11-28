/**
 * Joins the site origin and a root-relative path into an absolute URL. It does not
 * check for a trailing slash, because the feed's own path (`/feed.xml`) has none;
 * renderEntry checks the trailing slash of page paths.
 */
export default function buildAbsoluteUrl({ siteUrl, urlPath }: { siteUrl: string; urlPath: string }): string {
  if (siteUrl.endsWith('/')) throw new Error(`buildAbsoluteUrl: siteUrl must not end with '/': ${siteUrl}`);
  if (!urlPath.startsWith('/')) throw new Error(`buildAbsoluteUrl: urlPath must start with '/': ${urlPath}`);
  return `${siteUrl}${urlPath}`;
}
