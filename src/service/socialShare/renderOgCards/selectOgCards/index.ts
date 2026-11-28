import type { SitePage } from '@/types/sitePage';
import type { OgCardJob } from '@/types/socialShare';
import chooseCardLayout from '../../chooseCardLayout';
import ogCardAddress from '../../ogCardAddress';
import ogImageConfig from '../../ogImageConfig';

/** Names the record whose stored share-image address is not the one this module computes. */
function addressMismatch({ urlPath, actual, expected }: { urlPath: string; actual: string; expected: string }): Error {
  return new Error(`share-image address mismatch for ${urlPath}: record has ${actual}, expected ${expected}`);
}

/**
 * Turns the page list into the share images to draw: the shared site card
 * first, then one job per page that gets a page card, in input order. It fails
 * the build when a record's `ogImage` is not the address `ogCardAddress`
 * computes, or when two page cards would land on one address, so a card can
 * never be written where no page points or shown for another page's title.
 */
export default function selectOgCards(pages: SitePage[]): OgCardJob[] {
  const siteAddress = ogImageConfig().imagePath;
  const jobs: OgCardJob[] = [{ layout: 'site', address: siteAddress, label: 'site card' }];
  const urlPathByAddress = new Map<string, string>();

  for (const page of pages) {
    const layout = chooseCardLayout(page.kind);
    if (layout === null) continue;

    if (layout === 'site') {
      if (page.ogImage !== siteAddress) {
        throw addressMismatch({ urlPath: page.urlPath, actual: page.ogImage, expected: siteAddress });
      }
      continue;
    }

    const expected = ogCardAddress(page);
    if (expected === null || page.ogImage !== expected) {
      throw addressMismatch({ urlPath: page.urlPath, actual: page.ogImage, expected: String(expected) });
    }

    const first = urlPathByAddress.get(expected);
    if (first !== undefined) {
      throw new Error(`share-image address collision at ${expected}: ${first} and ${page.urlPath}`);
    }
    urlPathByAddress.set(expected, page.urlPath);

    const { urlPath, kind, title, section } = page;
    jobs.push({ layout: 'page', address: expected, label: urlPath, page: { urlPath, kind, title, section } });
  }

  return jobs;
}
