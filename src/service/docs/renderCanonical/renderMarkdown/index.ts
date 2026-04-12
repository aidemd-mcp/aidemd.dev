import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { Root, Element } from "hast";
import type { Node, Parent } from "unist";
import { visit } from "unist-util-visit";

/**
 * MDAST node types produced by the fixed plugin set:
 *   remarkParse + remarkGfm
 *
 * This set is the contract. Any node type outside it means the source
 * file contains a construct the renderer does not handle. The build
 * must fail loudly with the file name and line number.
 *
 * Covers: GFM tables, fenced code blocks, inline code, headings, lists,
 * links, images, emphasis, strikethrough, HTML comments, blockquotes,
 * thematic breaks, hard line breaks, and structural wrapper nodes.
 */
const ALLOWED_NODE_TYPES = new Set([
  "root",
  "paragraph",
  "text",
  "heading",
  "strong",
  "emphasis",
  "delete", // strikethrough (GFM)
  "inlineCode",
  "code", // fenced code block
  "list",
  "listItem",
  "link",
  "image",
  "blockquote",
  "table", // GFM table
  "tableRow",
  "tableCell",
  "thematicBreak",
  "break", // hard line break
  "html", // HTML comments and inline HTML
]);

/**
 * Patterns that indicate known-unhandled markdown extensions that remark
 * silently degrades into paragraph text rather than producing a distinct
 * node type. These must be caught as text-level patterns.
 *
 * Currently catches: container directives (:::name), since remark-directive
 * is not in the plugin set and remark-parse renders them as plain paragraphs.
 */
const UNHANDLED_TEXT_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /^:::\s*[a-zA-Z]/, name: "container directive (:::)" },
];

type Position = {
  line: number;
  column: number;
};

function formatError(sourceName: string, pos: Position, detail: string): string {
  return `renderCanonical: unknown construct ${detail} at ${sourceName}:${pos.line}`;
}

/**
 * Remark plugin that walks the MDAST after GFM parsing and throws on any
 * node type outside the fixed plugin set, or any text pattern that indicates
 * a silently-degraded construct.
 *
 * Runs after remarkGfm (so GFM nodes are fully classified) and before
 * remarkRehype (so failures are caught before any HTML is produced).
 */
function remarkDetectUnknown(sourceName: string) {
  return (tree: Root) => {
    visit(tree, (node: Node) => {
      if (!ALLOWED_NODE_TYPES.has(node.type)) {
        const pos = node.position?.start ?? { line: 0, column: 0 };
        throw new Error(
          formatError(sourceName, pos, `'${node.type}'`)
        );
      }

      // Catch constructs that degrade to paragraph text
      if (node.type === "text") {
        const textNode = node as Node & { value: string };
        const value = textNode.value ?? "";
        const firstLine = value.split("\n")[0] ?? "";
        for (const { pattern, name } of UNHANDLED_TEXT_PATTERNS) {
          if (pattern.test(firstLine.trim())) {
            const pos = node.position?.start ?? { line: 0, column: 0 };
            throw new Error(
              formatError(sourceName, pos, `'${firstLine.trim().slice(0, 40)}' (${name})`)
            );
          }
        }
      }
    });
  };
}

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
 * headings, lists, links, images, emphasis, strikethrough, HTML comments,
 * blockquotes, thematic breaks, hard line breaks.
 *
 * No MDX, no JSX, no custom directives, no content injection.
 *
 * Throws if the body contains any markdown construct outside the fixed
 * plugin set. The error message includes `sourceName` and the line number
 * of the offending construct so the build fails loudly and actionably.
 *
 * @param body - Markdown body text (frontmatter already stripped)
 * @param sourceName - File path to include in error messages (e.g. ".aide/foo.md")
 */
export default async function renderMarkdown(
  body: string,
  sourceName = "<unknown>"
): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDetectUnknown, sourceName)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRewriteDocLinks)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(body);

  return String(file);
}
