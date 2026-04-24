import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { raw } from 'hast-util-raw';
import type { Root, Element } from 'hast';
import type { Plugin } from 'unified';
import type { Highlighter } from 'shiki';

/**
 * Minimal shiki Highlighter interface — the subset renderMarkdown uses.
 * Step 5 supplies a fully-loaded Highlighter; this interface keeps the
 * dependency direction clean and makes the helper independently testable.
 */
export type ShikiHighlighter = Pick<Highlighter, 'codeToHtml'>;

/**
 * Builds a rehype plugin that replaces fenced code block nodes with Shiki-
 * rendered HTML. Equivalent to rehypeShikiFromHighlighter from @shikijs/rehype,
 * implemented inline because that package is not in the dependency tree.
 *
 * The plugin walks the hast tree for `<pre><code class="language-*">` nodes
 * and replaces each with the raw HTML fragment returned by codeToHtml.
 */
function makeShikiPlugin(highlighter: ShikiHighlighter, theme: string): Plugin<[], Root> {
  return () => async (tree) => {
    // Dynamically import hast utilities inside the plugin factory to keep the
    // module's top-level imports free of optional peer dependencies.
    const { visit } = await import('unist-util-visit');

    const tasks: Array<() => Promise<void>> = [];

    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName !== 'pre' ||
        !Array.isArray(node.children) ||
        node.children.length !== 1
      ) return;

      const codeNode = node.children[0];
      if (
        !codeNode ||
        codeNode.type !== 'element' ||
        codeNode.tagName !== 'code'
      ) return;

      // Extract the language from the class attribute (e.g. "language-ts").
      const classNames: string[] = Array.isArray(codeNode.properties?.className)
        ? (codeNode.properties.className as string[])
        : [];
      const langClass = classNames.find((c) => c.startsWith('language-'));
      const lang = langClass ? langClass.replace('language-', '') : 'text';

      // Extract raw text content of the code node.
      const rawText = codeNode.children
        .map((child) => (child.type === 'text' ? child.value : ''))
        .join('');

      if (parent && typeof index === 'number') {
        tasks.push(async () => {
          try {
            const html = highlighter.codeToHtml(rawText, { lang, theme });
            // Replace the pre node with a raw HTML node so rehype-raw can
            // pass it through verbatim.
            (parent.children as typeof tree.children)[index] = {
              type: 'raw',
              value: html,
            } as unknown as typeof tree.children[number];
          } catch {
            // Unknown language — leave the node as-is so the page still renders.
          }
        });
      }
    });

    await Promise.all(tasks.map((t) => t()));
  };
}

/**
 * Rehype plugin that re-runs hast-util-raw in a mutating manner.
 *
 * `rehypeRaw` (the plugin) returns a new Root tree from `raw()`, but unified
 * does not propagate a returned tree from async plugins — it keeps a reference
 * to the original. When the shiki plugin injects { type: 'raw', value: html }
 * nodes AFTER the first rehype-raw pass, we need a second pass that mutates
 * the existing tree in-place so unified sees the parsed HAST elements.
 */
const rehypeRawMutate: Plugin<[], Root> = () => (tree, file) => {
  const result = raw(tree, { file }) as Root;
  tree.children = result.children;
};

/**
 * Rehype plugin that converts GitHub-style alert blockquotes to callout divs.
 *
 * Detects blockquotes whose first paragraph starts with [!NOTE], [!WARN], or [!INFO]
 * and transforms them into <div class="callout-{kind}"> elements with a label div
 * and a content wrapper — matching the Callout component's visual output via CSS.
 *
 * Decision: Option A (rehype plugin on the HAST) is chosen over post-processing the
 * HTML string. Walking the tree is safer than regex-replacing serialized HTML, and
 * the output is structurally identical to what the Callout React component emits.
 */
const rehypeCallouts: Plugin<[], Root> = () => async (tree) => {
  const { visit } = await import('unist-util-visit');

  const KINDS = new Set(['NOTE', 'WARN', 'INFO']);

  visit(tree, 'element', (node: Element, index, parent) => {
    if (node.tagName !== 'blockquote' || !Array.isArray(node.children)) return;

    // Find the first paragraph-like element child.
    const firstPara = node.children.find(
      (c): c is Element => c.type === 'element' && (c.tagName === 'p' || c.tagName === 'div'),
    );
    if (!firstPara || !Array.isArray(firstPara.children)) return;

    // First child of the paragraph should be a text node like "[!NOTE]".
    const firstText = firstPara.children[0];
    if (!firstText || firstText.type !== 'text') return;

    const match = firstText.value.match(/^\[!(NOTE|WARN|INFO)\]/i);
    if (!match) return;
    const kind = match[1].toUpperCase();
    if (!KINDS.has(kind)) return;

    // Strip the "[!KIND]" text token from the paragraph.
    firstPara.children = firstPara.children.slice(1);
    // Trim leading whitespace/newline from what follows (common when "[!NOTE]\n body text").
    const nextText = firstPara.children[0];
    if (nextText && nextText.type === 'text') {
      nextText.value = nextText.value.replace(/^\s+/, '');
      if (nextText.value === '') firstPara.children.shift();
    }

    // Build the callout replacement node.
    const kindLower = kind.toLowerCase() as 'note' | 'warn' | 'info';
    const calloutNode: Element = {
      type: 'element',
      tagName: 'div',
      properties: { className: [`callout-${kindLower}`] },
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: { className: ['callout-label'] },
          children: [{ type: 'text', value: kind }],
        } as Element,
        {
          type: 'element',
          tagName: 'div',
          properties: { className: ['callout-body'] },
          children: node.children,
        } as Element,
      ],
    };

    if (parent && typeof index === 'number') {
      (parent.children as typeof tree.children)[index] = calloutNode as typeof tree.children[number];
    }
  });
};

/**
 * Converts a markdown string to an HTML string via the unified pipeline:
 * remark-parse → remark-gfm → remark-rehype → rehype-raw →
 * shiki code block replacement → callout detection → rehype-stringify.
 *
 * Takes a prebuilt ShikiHighlighter so the singleton from step 5 is shared
 * across all 33 docs pages rather than instantiated per render. If no
 * highlighter is supplied, code blocks are left as plain <pre><code> nodes.
 */
export default async function renderMarkdown(
  markdown: string,
  highlighter?: ShikiHighlighter,
): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw);

  if (highlighter) {
    // makeShikiPlugin injects { type: 'raw', value: html } nodes into the HAST.
    // rehypeRawMutate re-runs hast-util-raw in-place so those raw nodes are
    // deserialized into proper HAST elements before rehype-stringify sees them.
    // (rehypeRaw returns a new Root, which unified does not propagate from async
    // transforms — hence the mutating variant is required here.)
    processor.use(makeShikiPlugin(highlighter, 'aide-theme'));
    processor.use(rehypeRawMutate);
  }

  processor.use(rehypeCallouts);
  processor.use(rehypeStringify);

  const result = await processor.process(markdown);
  return String(result);
}
