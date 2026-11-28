import { Children, cloneElement, createElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import copyBySlug from "@/data/learn/copyBySlug";
import templateLabels from "@/data/learn/templateLabels";
import type { LearnBlock as LearnBlockRecord, LearnCopy } from "@/types/learn";
import type { SitePage } from "@/types/sitePage";
import ComparisonTable from "./_components/ComparisonTable";
import LearnBlock from "./_components/LearnSection/LearnBlock";
import LearnArticle from "./_components/LearnArticle";
import learnRoster from "@/data/learn";
import learnIndex from "@/data/learn/learnIndex";
import LearnIndexPage, { generateMetadata } from "./page";

const record: LearnCopy = copyBySlug["spec-kit-alternatives"];
const faqRecord: LearnCopy = copyBySlug["intent-driven-engineering"];

function pageFor(copy: LearnCopy, modified?: string): SitePage {
  return {
    urlPath: `/learn/${copy.slug}/`,
    title: copy.title,
    description: copy.description,
    kind: "learn",
    ogImage: `/og/learn/${copy.slug}.png`,
    breadcrumb: [
      { name: templateLabels.breadcrumbHome, urlPath: "/" },
      { name: templateLabels.breadcrumbLearn, urlPath: "/learn/" },
      { name: copy.title, urlPath: `/learn/${copy.slug}/` },
    ],
    modified,
  };
}

/**
 * React 18 server rendering cannot await async components (Next does that in
 * the app router), so resolve them here: call every function component, awaiting
 * async ones, and leave components that need a React dispatcher (next/link, the
 * CodeBlock copy button) for the renderer.
 */
async function resolveAsync(node: ReactNode): Promise<ReactNode> {
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<{ children?: ReactNode }>;
  if (typeof element.type === "function") {
    const component = element.type as (props: unknown) => ReactNode | Promise<ReactNode>;
    const isAsync = component.constructor.name === "AsyncFunction";
    try {
      return await resolveAsync(await component(element.props));
    } catch (error) {
      if (isAsync) throw error;
      return element;
    }
  }
  const children = await Promise.all(Children.toArray(element.props.children).map(resolveAsync));
  return cloneElement(element, undefined, ...children);
}

async function render(copy: LearnCopy, modified?: string): Promise<string> {
  const tree = await resolveAsync(
    createElement(LearnArticle, { copy, page: pageFor(copy, modified) }),
  );
  return renderToStaticMarkup(tree as ReactElement);
}

async function renderBlock(block: LearnBlockRecord): Promise<string> {
  const tree = await resolveAsync(createElement(LearnBlock, { block }));
  return renderToStaticMarkup(tree as ReactElement);
}

describe("LearnArticle", () => {
  it("renders the article in the fixed order, answer right after the H1", async () => {
    const html = await render(faqRecord, "2026-11-27T10:00:00-05:00");
    const order = [
      '<article class="docs-body">',
      '<nav aria-label="Breadcrumb">',
      "<header><h1>",
      "</h1><p>",
      "<section",
      `<section aria-labelledby="${templateLabels.faqId}">`,
      `<nav aria-labelledby="${templateLabels.relatedId}">`,
    ].map((marker) => html.indexOf(marker));
    expect(order.every((index) => index >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("renders the byline with the date and the organization", async () => {
    const html = await render(record, "2026-11-27T10:00:00-05:00");
    expect(html).toContain(
      `${templateLabels.updatedLabel} <time dateTime="2026-11-27">2026-11-27</time> · Lowmeadow LLC`,
    );
  });

  it("renders the author alone when no date is known", async () => {
    const html = await render(record);
    expect(html).not.toContain("<time");
    expect(html).toContain("Lowmeadow LLC</div></header>");
  });

  it("gives every section its record id on the H2", async () => {
    const html = await render(record);
    for (const section of record.sections) {
      expect(html).toContain(`<h2 id="${section.id}">`);
    }
  });

  it("omits the FAQ block when the record has no FAQ", async () => {
    expect(await render(record)).not.toContain(templateLabels.faqHeading);
    expect(await render(faqRecord)).toContain(templateLabels.faqHeading);
  });

  it("renders the visible breadcrumb labels in the page list order, last step unlinked", async () => {
    const html = await render(record);
    expect(html).toMatch(/<a [^>]*href="\/learn\/?">learn<\/a>/);
    expect(html).toContain(`<span>${record.title}</span>`);
  });

  it("never reads the review marker", async () => {
    const draft = await render({ ...record, status: "draft" });
    const reviewed = await render({ ...record, status: "reviewed" });
    expect(draft).toBe(reviewed);
  });
});

describe("ComparisonTable", () => {
  it("labels the table by its caption and puts the as-of date in dated cells", async () => {
    const html = renderToStaticMarkup(
      createElement(ComparisonTable, {
        table: {
          caption: "Caption text",
          columns: ["Tool", "Stars"],
          rows: [{ cells: [{ text: "Alpha" }, { text: "1,000", asOf: "2026-11-25" }] }],
        },
      }),
    );
    expect(html).toContain('<p id="comparison-caption">Caption text</p>');
    expect(html).toContain('<table aria-labelledby="comparison-caption">');
    expect(html).toContain('<th scope="col">Tool</th>');
    expect(html).toContain('<th scope="row">Alpha</th>');
    expect(html).toContain(`<td>1,000 (${templateLabels.asOfPrefix} 2026-11-25)</td>`);
  });
});

describe("LearnBlock", () => {
  it("renders a code block through the shared highlighter", async () => {
    const html = await renderBlock({ kind: "code", lang: "bash", code: "npm install" });
    expect(html).toContain("shiki");
    expect(html).toContain("install");
  });

  it("renders a glossary as list items carrying the record anchors", async () => {
    const html = await renderBlock({
      kind: "glossary",
      terms: [{ id: "term-a", term: "Term A", definition: [{ kind: "text", text: "Means a." }] }],
    });
    expect(html).toBe('<ul><li id="term-a"><strong>Term A</strong>: Means a.</li></ul>');
  });

  it("renders internal links through next/link and external links as plain anchors", async () => {
    const html = await renderBlock({
      kind: "paragraph",
      text: [
        { kind: "text", text: "See " },
        { kind: "link", text: "docs", href: "/docs/hooks/" },
        { kind: "text", text: " and " },
        { kind: "link", text: "site", href: "https://example.com/" },
      ],
    });
    // next/link normalizes the trailing slash from build config, absent in this test process.
    expect(html).toMatch(/^<p>See <a href="\/docs\/hooks\/?">docs<\/a> and /);
    expect(html).toMatch(/<a href="https:\/\/example\.com\/" rel="noopener">site<\/a><\/p>$/);
  });
});

describe("LearnIndexPage", () => {
  it("renders the index H1, the six titles in roster order and the two records", async () => {
    const tree = await resolveAsync(createElement(LearnIndexPage));
    const html = renderToStaticMarkup(tree as ReactElement);
    expect(html).toContain(`<h1>${learnIndex.h1}</h1>`);
    const positions = learnRoster.map((entry) => html.indexOf(`>${entry.title}</a>`));
    expect(positions.every((position) => position > -1)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(html).not.toContain("<time");
    const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
    expect(match).not.toBeNull();
    const types = (JSON.parse(match![1].replace(/\u003c/g, "<")) as { "@graph": { "@type": string }[] })[
      "@graph"
    ].map((node) => node["@type"]);
    expect(types).toEqual(["CollectionPage", "BreadcrumbList"]);
  });

  it("builds metadata from the page-list entry with the trailing-slash canonical", async () => {
    const metadata = await generateMetadata();
    expect(metadata.alternates?.canonical).toBe("https://aidemd.dev/learn/");
    expect(metadata.openGraph?.url).toBe("https://aidemd.dev/learn/");
  });
});
