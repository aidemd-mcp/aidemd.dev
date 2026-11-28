import type { MetadataRoute } from "next";
import listSitePages from "@/app/_shared/listSitePages";
import siteIdentity from "@/data/siteIdentity";

/**
 * Makes `next dev` able to serve /sitemap.xml under `output: "export"`.
 *
 * In dev, Next 14 serves a dynamic sitemap as `/sitemap.xml/[[...__metadata_id__]]`
 * and `output: "export"` demands static params for any dynamic route, so without
 * this export the request fails with a 500. The empty optional catch-all is
 * `/sitemap.xml` itself. Production builds the route statically and ignores this
 * export. `__metadata_id__` is a Next internal: re-check this export, and delete
 * it if it is no longer needed, when upgrading Next.
 */
export function generateStaticParams(): Array<{ __metadata_id__: string[] }> {
  return [{ __metadata_id__: [] }];
}

/**
 * Build-time sitemap: every indexable page once, from the one page list
 * (`listSitePages`). A `lastModified` date appears only on a page whose version
 * history proves one, passed through as the git ISO string with its offset so
 * the sitemap names the same calendar day the page shows (a `Date` would
 * serialise to UTC and can shift the day); every other entry carries the URL alone. Google ignores
 * the optional weighting and frequency fields, so none is emitted.
 *
 * Next's metadata-route system serializes this to /sitemap.xml at build time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await listSitePages();
  return pages.map((page) => {
    const url = `${siteIdentity.url}${page.urlPath}`;
    return page.modified
      ? { url, lastModified: page.modified }
      : { url };
  });
}
