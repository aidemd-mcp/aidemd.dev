import listSitePages from '@/app/_shared/listSitePages';
import composeLlmsFiles from '@/service/llmsTxt';
import composeFeed from '@/service/atomFeed';
import renderOgCards from '@/service/socialShare/renderOgCards';
import type { PublishReport } from '@/types/siteFiles';
import buildLlmsPages from './buildLlmsPages';
import clearGeneratedOutput from './clearGeneratedOutput';
import collectMarkdown from './collectMarkdown';
import feedMeta from './feedMeta';
import planOutputs from './planOutputs';
import renderSecurityTxt from './renderSecurityTxt';
import verifyOutputs from './verifyOutputs';
import writeOutputs from './writeOutputs';

/**
 * The one pre-deploy step that writes every machine-read file into `publicDir`:
 * llms.txt, llms-full.txt, feed.xml, security.txt, a markdown copy of every doc
 * and /learn page, and the share images. It reads the page list once and hands
 * the same list to every composer, so no two publishers can disagree about which
 * pages exist. Everything is composed and rendered before anything is cleared, so
 * a failure in the page list, a composer or the card renderer leaves the last good
 * output in place; only a fully composed set is written, then read back and checked
 * against the page list. Any failure throws and stops the build.
 *
 * The clock enters only as `now`: security.txt's expiry is the one build-time
 * value, and it is a policy deadline, not a page date.
 */
export default async function publishSiteFiles({
  publicDir,
  now,
}: {
  publicDir: string;
  now: Date;
}): Promise<PublishReport> {
  // Step 1: Read the page list once
  const pages = await listSitePages();

  // Step 2: Collect the markdown of every doc and /learn page
  const markdown = await collectMarkdown(pages);

  // Step 3: Compose the llms files, the feed and security.txt
  const llms = composeLlmsFiles({ pages: buildLlmsPages({ pages, markdown }) });
  const feedXml = composeFeed({ pages, meta: feedMeta });
  const securityTxt = renderSecurityTxt(now);

  // Step 4: Render the share images
  const images = await renderOgCards(pages);

  // Step 5: Plan every file; nothing is cleared until the full set exists
  const files = planOutputs({ pages, llms, feedXml, securityTxt, markdown, images });

  // Step 6: Clear last build's generated output so a removed page leaves no stale copy
  await clearGeneratedOutput(publicDir);

  // Step 7: Write the planned files
  await writeOutputs({ publicDir, files });

  // Step 8: Read every file back and check it against the page list
  return verifyOutputs({ publicDir, pages, files, now });
}
