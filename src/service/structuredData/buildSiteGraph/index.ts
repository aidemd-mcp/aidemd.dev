import siteIdentity from '@/data/siteIdentity';
import type { OrganizationNode, WebSiteNode } from '@/types/structuredData';
import resolveAbsoluteUrl from '@/service/structuredData/resolveAbsoluteUrl';
import siteReferences from '@/service/structuredData/siteReferences';

/**
 * The home page's identity record: the one Lowmeadow LLC Organization and the one
 * aidemd.dev WebSite, linked by `@id`. Every other page points at these two nodes by
 * reference. The AIDE product record (GitHub repo, npm package) is deliberately absent
 * until the package is under Lowmeadow LLC (#38), so there is no `sameAs` and no Person.
 */
export default function buildSiteGraph(): [OrganizationNode, WebSiteNode] {
  const organization: OrganizationNode = {
    '@type': 'Organization',
    '@id': siteReferences.organization['@id'],
    name: siteIdentity.name,
    url: resolveAbsoluteUrl('/'),
    logo: siteIdentity.logo,
  };
  const website: WebSiteNode = {
    '@type': 'WebSite',
    '@id': siteReferences.website['@id'],
    name: siteIdentity.siteName,
    url: resolveAbsoluteUrl('/'),
    publisher: siteReferences.organization,
  };
  return [organization, website];
}
