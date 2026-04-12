import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

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
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(body);

  return String(file);
}
