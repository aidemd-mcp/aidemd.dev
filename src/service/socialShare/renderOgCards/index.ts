import type { SitePage } from '@/types/sitePage';
import type { OgCardImage } from '@/types/socialShare';
import selectOgCards from './selectOgCards';
import launchBrowser from './launchBrowser';
import loadDesignSource from './loadDesignSource';
import loadDesignFonts from './loadDesignFonts';
import fillPageCard from './fillPageCard';
import fitTitle from './fitTitle';
import captureOgElement from './captureOgElement';
import verifyOutput from './verifyOutput';

/**
 * Render pipeline orchestrator. Draws the shared site card plus one 1200×630
 * sRGB PNG per page that gets a page card, from the page records alone, and
 * returns them as buffers at the addresses the records already carry. It
 * writes no file: the caller (publishSiteFiles) owns the output location.
 *
 * It is never imported by `index.ts` or the Next.js application graph —
 * Playwright stays out of the bundle. It is called by
 * scripts/publishSiteFiles.
 *
 * Pipeline sequence:
 *   1. `selectOgCards(pages)` — decides the jobs before any browser starts, so
 *      a record whose `ogImage` disagrees with its computed address fails fast.
 *   2. `launchBrowser()` — launches headless Chromium with a 1200×630 page.
 *   3. `loadDesignSource(page)` + `loadDesignFonts(page)` — opens the design
 *      source and confirms all four JetBrains Mono weights are loaded.
 *   4. For each job, in order: a page card is filled (`fillPageCard`), its
 *      title fitted (`fitTitle`) and `#og-page` captured; the site card is
 *      captured from `#og`. Each capture is checked by `verifyOutput`.
 *   5. `browser.close()` always runs in `finally`, so no Chromium process
 *      leaks when a helper throws.
 *
 * Any error from a helper bubbles uncaught; the caller aborts the build. This
 * is the drift gate — a silently wrong card never reaches the deploy artifact.
 *
 * Prerequisites: the Chromium binary must be installed
 * (`npx playwright install chromium`; add `--with-deps` on Linux CI).
 *
 * @param pages - Every site page record; `observer` and other card-less kinds are skipped.
 * @returns The site card first, then one image per page card, in input order.
 */
export default async function renderOgCards(pages: SitePage[]): Promise<OgCardImage[]> {
  const jobs = selectOgCards(pages);

  const { browser, page } = await launchBrowser();
  const images: OgCardImage[] = [];

  try {
    await loadDesignSource(page);
    await loadDesignFonts(page);

    for (const job of jobs) {
      if (job.layout === 'page') {
        await fillPageCard({ page, card: job.page });
        await fitTitle({ page, urlPath: job.page.urlPath });
      }
      const selector = job.layout === 'page' ? '#og-page' : '#og';
      const png = await captureOgElement({ page, selector });
      verifyOutput({ png, label: job.label });
      images.push({ address: job.address, png });
    }
  } finally {
    await browser.close();
  }

  return images;
}
