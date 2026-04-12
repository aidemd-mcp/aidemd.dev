import { describe, it, expect } from "vitest";
import diffCheck from "./index";

describe("diffCheck", () => {
  it("matching content passes without throwing", async () => {
    // Render a known markdown body and verify diffCheck accepts the output
    const { unified } = await import("unified");
    const remarkParse = (await import("remark-parse")).default;
    const remarkGfm = (await import("remark-gfm")).default;
    const remarkRehype = (await import("remark-rehype")).default;
    const rehypeStringify = (await import("rehype-stringify")).default;

    const body = "# Hello\n\nThis is a paragraph with **bold** text.\n";
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(body);
    const html = String(file);

    expect(() => diffCheck("test-slug", body, html)).not.toThrow();
  });

  it("divergent content throws with a descriptive error", () => {
    const body = "# Hello\n\nOriginal paragraph text.\n";
    // Render completely different HTML — simulates a renderer that rewrites content
    const injectedHtml = "<h1>Hello</h1><p>Completely different content injected.</p>";

    expect(() => diffCheck("test-slug", body, injectedHtml)).toThrow(
      /byte-faithfulness check failed/
    );
  });

  it("HTML wrapping alone does not cause failure (adding tags around unchanged text passes)", async () => {
    const { unified } = await import("unified");
    const remarkParse = (await import("remark-parse")).default;
    const remarkGfm = (await import("remark-gfm")).default;
    const remarkRehype = (await import("remark-rehype")).default;
    const rehypeStringify = (await import("rehype-stringify")).default;

    // Plain paragraph — rendering wraps it in <p> tags
    const body = "Simple sentence with no markdown.\n";
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(body);
    const html = String(file);

    // The HTML contains <p>...</p> but the text content is unchanged — must pass
    expect(html).toContain("<p>");
    expect(() => diffCheck("test-slug", body, html)).not.toThrow();
  });
});
