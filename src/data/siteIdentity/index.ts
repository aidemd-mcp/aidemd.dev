import type { SiteIdentity } from "@/types/structuredData";

/**
 * The one identity record every structured-data, feed, footer and security.txt
 * surface reads. It credits Lowmeadow LLC only. Profile links (sameAs) are
 * deliberately absent until the npm package is under Lowmeadow LLC (decision #38).
 * `url` is the origin with no trailing slash.
 */
const siteIdentity = {
  name: "Lowmeadow LLC",
  siteName: "aidemd.dev",
  url: "https://aidemd.dev",
  logo: "https://aidemd.dev/icon-512.png",
  securityContact: "https://github.com/aidemd-mcp/server/security/advisories/new",
} as const satisfies SiteIdentity;

export default siteIdentity;
