import type { IdReference } from '@/types/structuredData';
import resolveAbsoluteUrl from '@/service/structuredData/resolveAbsoluteUrl';

/**
 * The only `@id`s page nodes may use for author, publisher and isPartOf. Pages point at
 * the one Organization and WebSite in the home-page graph by reference and never
 * restate them. Derived from the site identity, so no literal host appears here.
 */
const siteReferences = {
  organization: { '@id': resolveAbsoluteUrl('/#organization') },
  website: { '@id': resolveAbsoluteUrl('/#website') },
} as const satisfies { organization: IdReference; website: IdReference };

export default siteReferences;
