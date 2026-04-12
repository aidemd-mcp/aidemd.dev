import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin that rewrites relative `.md` links to `/docs/{slug}` routes.
 *
 * Matches href values like `./foo.md`, `foo.md`, `./foo-bar.md` and rewrites
 * them to `/docs/foo`, `/docs/foo-bar`. Only touches links whose target ends
 * in `.md` and looks like a relative doc reference (no protocol, no `/`-prefix).
 */
function rehypeRewriteDocLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;
      const href = node.properties?.href;
      if (typeof href !== "string") return;

      // Match relative .md links: "./slug.md" or "slug.md"
      const match = href.match(/^(?:\.\/)?([a-z0-9][\w.-]*)\.md$/i);
      if (match) {
        node.properties.href = `/docs/${match[1]}`;
      }
    });
  };
}

/**
 * Converts a markdown body to an HTML string using a fixed plugin set.
 *
 * Supported constructs: GFM tables, fenced code blocks, inline code,
 * headings, lists, links, images, emphasis, strikethrough.
 *
 * No MDX, no JSX, no custom directives, no content injection.
 * Unknown constructs surface as-is — remark-gfm extends coverage for
 * all GFM features; anything outside this set is treated as plain text
 * by the unified pipeline.
 */
export default async function renderMarkdown(body: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRewriteDocLinks)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(body);

  return String(file);
}
