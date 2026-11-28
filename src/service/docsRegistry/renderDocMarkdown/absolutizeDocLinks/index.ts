import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Nodes } from 'mdast';
import siteIdentity from '@/data/siteIdentity';
import type { WalkedDocRoute } from '@/types/docs';
import resolveDocHref from '../../shared/resolveDocHref';
import warnUnresolvedLink from '../../shared/warnUnresolvedLink';

/** A half-open `[start, end)` range of the original markdown string. */
type Span = { start: number; end: number };

/** One destination replacement, located by source offsets. */
type Splice = Span & { text: string };

const HTML_HREF = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

/** Reads the destination token that starts at or after `from` in `source`: inside `<…>` when angle-bracketed, otherwise up to whitespace or the unmatched `)`. */
function findDestination(source: string, from: number): Span | undefined {
  let index = from;
  while (index < source.length && /\s/.test(source[index])) index++;

  if (source[index] === '<') {
    const close = source.indexOf('>', index + 1);
    return close === -1 ? undefined : { start: index + 1, end: close };
  }

  const start = index;
  let depth = 0;
  for (; index < source.length; index++) {
    const char = source[index];
    if (char === '\\') {
      index++;
      continue;
    }
    if (/\s/.test(char)) break;
    if (char === '(') depth++;
    if (char === ')') {
      if (depth === 0) break;
      depth--;
    }
  }
  return index > start ? { start, end: index } : undefined;
}

/** Finds an inline link's destination: the token after the `](` that closes its label. */
function findLinkDestination(source: string, labelEnd: number): Span | undefined {
  const closing = source.indexOf('](', labelEnd);
  return closing === -1 ? undefined : findDestination(source, closing + 2);
}

/** Finds a reference definition's destination: the token after the `]:` that closes its label. */
function findDefinitionDestination(source: string): Span | undefined {
  let index = source.indexOf('[') + 1;
  for (; index < source.length; index++) {
    if (source[index] === '\\') {
      index++;
      continue;
    }
    if (source[index] === ']') break;
  }
  if (source[index + 1] !== ':') return undefined;
  return findDestination(source, index + 2);
}

/** Turns one resolvable href into its replacement text, or undefined when the href must stay as written (missing targets warn once here). */
function absolutizeHref({
  href,
  fromPath,
  routesByPath,
}: {
  href: string;
  fromPath: string;
  routesByPath: ReadonlyMap<string, WalkedDocRoute>;
}): string | undefined {
  const resolution = resolveDocHref({ href, fromPath, routesByPath });
  if (resolution.status === 'rewritten') return `${siteIdentity.url}${resolution.href}`;
  if (resolution.status === 'missing') {
    warnUnresolvedLink({ href, fromPath, resolvedPath: resolution.resolvedPath });
  }
  return undefined;
}

/** Collects the destination replacements for one mdast node and all of its descendants. */
function collectSplices({
  node,
  markdown,
  fromPath,
  routesByPath,
}: {
  node: Nodes;
  markdown: string;
  fromPath: string;
  routesByPath: ReadonlyMap<string, WalkedDocRoute>;
}): Splice[] {
  const splices: Splice[] = [];
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;

  if (start !== undefined && end !== undefined) {
    const source = markdown.slice(start, end);

    if (node.type === 'link' && source.startsWith('[')) {
      const lastChild = node.children[node.children.length - 1];
      const labelEnd = lastChild?.position?.end.offset;
      const destination = findLinkDestination(source, labelEnd === undefined ? 1 : labelEnd - start);
      const text = destination && absolutizeHref({ href: node.url, fromPath, routesByPath });
      if (destination && text) {
        splices.push({ start: start + destination.start, end: start + destination.end, text });
      }
    }

    if (node.type === 'definition') {
      const destination = findDefinitionDestination(source);
      const text = destination && absolutizeHref({ href: node.url, fromPath, routesByPath });
      if (destination && text) {
        splices.push({ start: start + destination.start, end: start + destination.end, text });
      }
    }

    if (node.type === 'html') {
      for (const match of source.matchAll(HTML_HREF)) {
        const href = match[1] ?? match[2];
        const text = absolutizeHref({ href, fromPath, routesByPath });
        if (text === undefined) continue;
        const valueStart = start + match.index + match[0].length - href.length - 1;
        splices.push({ start: valueStart, end: valueStart + href.length, text });
      }
    }
  }

  if ('children' in node) {
    for (const child of node.children) {
      splices.push(...collectSplices({ node: child, markdown, fromPath, routesByPath }));
    }
  }

  return splices;
}

/**
 * Makes the relative doc links in a doc's markdown absolute to the canonical
 * HTML page (`https://aidemd.dev<urlPath>/<query><fragment>`), so the markdown
 * copy keeps working off-site. Links are found by parsing to mdast (inline
 * links, reference definitions and raw-HTML `href` attributes; code spans,
 * fenced code and images are not link nodes and are never touched) and resolved
 * by file path through the shared resolver, the same one the HTML render uses.
 * Only each destination token is replaced, spliced into the original string by
 * source offset from the last to the first, so titles, labels, tables, line
 * endings and every other byte stay exactly as written. A link to a missing doc
 * stays as written and goes to the shared once-per-link warning.
 */
export default function absolutizeDocLinks({
  markdown,
  fromPath,
  routesByPath,
}: {
  markdown: string;
  fromPath: string;
  routesByPath: ReadonlyMap<string, WalkedDocRoute>;
}): string {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const splices = collectSplices({
    node: tree,
    markdown,
    fromPath,
    routesByPath,
  });

  return splices
    .sort((a, b) => b.start - a.start)
    .reduce(
      (result, splice) => result.slice(0, splice.start) + splice.text + result.slice(splice.end),
      markdown,
    );
}
