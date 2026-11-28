import siteIdentity from '@/data/siteIdentity';
import type { SitePage, SitePageKind } from '@/types/sitePage';
import fileError from '../shared/fileError';

/** The page kinds llms.txt links to. */
const LISTED_KINDS = ['docsSection', 'doc', 'learnIndex', 'learn', 'observer', 'brain'] as const satisfies readonly SitePageKind[];

/** The page kinds llms-full.txt carries the full text of. */
const FULL_TEXT_KINDS = ['doc', 'learn'] as const satisfies readonly SitePageKind[];

/** Every `](target)` link target in a markdown text, in order. */
function linkTargets(text: string): string[] {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)].map((match) => match[1]);
}

/** Every `Source: <url>` value in a text, in order. */
function sourceUrls(text: string): string[] {
  return [...text.matchAll(/^Source: (.+)$/gm)].map((match) => match[1]);
}

/** The canonical URLs of the pages of the given kinds. */
function canonicalUrls({ pages, kinds }: { pages: SitePage[]; kinds: readonly SitePageKind[] }): string[] {
  return pages.filter((page) => kinds.includes(page.kind)).map((page) => siteIdentity.url + page.urlPath);
}

/** Throws unless a file is non-empty and starts with a level-one heading. */
function assertDocument({ file, text }: { file: string; text: string }): void {
  if (text.trim() === '') throw fileError(file, 'is empty');
  if (!text.startsWith('# ')) throw fileError(file, 'does not start with "# "');
}

/**
 * Checks llms.txt and llms-full.txt as read back from disk against the page list.
 * Both must be non-empty and open with a level-one heading. llms.txt must link to
 * exactly the canonical URL of every docs section, doc, /learn index, /learn,
 * /observer and /brain page (none missing, none extra) and to no `.md` address.
 * llms-full.txt must carry exactly one `Source:` line per doc and /learn page and
 * none for any other page. Throws naming the file and the broken rule.
 */
export default function verifyLlmsFiles({
  llmsTxt,
  llmsFullTxt,
  pages,
}: {
  llmsTxt: string;
  llmsFullTxt: string;
  pages: SitePage[];
}): void {
  assertDocument({ file: 'llms.txt', text: llmsTxt });
  assertDocument({ file: 'llms-full.txt', text: llmsFullTxt });

  // llms.txt: the links are the listed pages, and none points at a markdown copy
  const targets = linkTargets(llmsTxt);
  const mdTarget = targets.find((target) => target.endsWith('.md'));
  if (mdTarget) throw fileError('llms.txt', `links to a markdown address: ${mdTarget}`);

  const linked = new Set(targets.filter((target) => target.startsWith(siteIdentity.url)));
  const expectedLinks = new Set(canonicalUrls({ pages, kinds: LISTED_KINDS }));
  const missingLink = [...expectedLinks].find((url) => !linked.has(url));
  if (missingLink) throw fileError('llms.txt', `does not link to ${missingLink}`);
  const extraLink = [...linked].find((url) => !expectedLinks.has(url));
  if (extraLink) throw fileError('llms.txt', `links to ${extraLink}, which is not a listed page`);

  // llms-full.txt: exactly one Source line per full-text page, none for any other
  const sources = sourceUrls(llmsFullTxt);
  const expectedSources = canonicalUrls({ pages, kinds: FULL_TEXT_KINDS });
  const missingSource = expectedSources.find((url) => !sources.includes(url));
  if (missingSource) throw fileError('llms-full.txt', `has no "Source: ${missingSource}" line`);
  const extraSource = sources.find((url) => !expectedSources.includes(url));
  if (extraSource) throw fileError('llms-full.txt', `has "Source: ${extraSource}", which is not a doc or /learn page`);
  const repeatedSource = sources.find((url, index) => sources.indexOf(url) !== index);
  if (repeatedSource) throw fileError('llms-full.txt', `has more than one "Source: ${repeatedSource}" line`);
}
