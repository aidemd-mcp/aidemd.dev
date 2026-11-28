import { describe, expect, it } from "vitest";
import type { LearnCopy, LearnSlug, RichText } from "@/types/learn";
import checkCopyRules from "@/data/learn/checkCopyRules";
import copyBySlug from "@/data/learn/copyBySlug";
import learnIndex from "@/data/learn/learnIndex";
import priorityOrder from "@/data/learn/priorityOrder";
import learnRoster from "./index";

const slugs: LearnSlug[] = [...priorityOrder];
const records = slugs.map((slug) => [slug, copyBySlug[slug]] as const);
const LEARN_HREF = /^\/learn\/([a-z0-9-]+)\/(?:#([a-z0-9-]+))?$/;

/** Every link run and related href in a record. */
function listHrefs(copy: LearnCopy): string[] {
  const hrefs: string[] = copy.related.map((link) => link.href);
  const collect = (text: RichText) => {
    for (const run of text) if (run.kind === "link") hrefs.push(run.href);
  };
  collect(copy.answer);
  for (const section of copy.sections) {
    for (const block of section.blocks) {
      if (block.kind === "paragraph") collect(block.text);
      if (block.kind === "list") block.items.forEach(collect);
      if (block.kind === "glossary") block.terms.forEach((term) => collect(term.definition));
    }
  }
  copy.faq?.forEach((item) => collect(item.answer));
  return hrefs;
}

/** The section and glossary term ids a record exposes as anchors. */
function listAnchorIds(copy: LearnCopy): string[] {
  const ids: string[] = [];
  for (const section of copy.sections) {
    ids.push(section.id);
    for (const block of section.blocks) {
      if (block.kind === "glossary") block.terms.forEach((term) => ids.push(term.id));
    }
  }
  return ids;
}

describe("learnRoster", () => {
  it("lists the six pages once each in priority order", () => {
    expect(learnRoster).toHaveLength(6);
    expect(learnRoster.map((entry) => entry.slug)).toEqual(priorityOrder);
    expect(new Set(learnRoster.map((entry) => entry.slug)).size).toBe(6);
  });

  it.each(learnRoster.map((entry) => [entry.slug, entry] as const))("%s reads its title and description from its record", (slug, entry) => {
    expect(entry.title).toBe(copyBySlug[slug].title);
    expect(entry.description).toBe(copyBySlug[slug].description);
    expect(entry.urlPath).toBe(`/learn/${slug}/`);
  });
});

describe("copyBySlug", () => {
  it.each(records)("%s record carries its own slug", (slug, copy) => {
    expect(copy.slug).toBe(slug);
  });

  it.each(records)("%s passes checkCopyRules", (_slug, copy) => {
    expect(checkCopyRules(copy)).toEqual([]);
  });

  it.each(records)("%s ships as a draft", (_slug, copy) => {
    expect(copy.status).toBe("draft");
  });

  it.each(records)("%s cross-page links resolve to roster slugs and anchors", (_slug, copy) => {
    for (const href of listHrefs(copy)) {
      const match = LEARN_HREF.exec(href);
      if (!match) continue;
      const [, target, anchor] = match;
      expect(slugs, `${href} names a roster slug`).toContain(target);
      if (anchor) {
        expect(listAnchorIds(copyBySlug[target as LearnSlug]), `${href} names an existing id`).toContain(anchor);
      }
    }
  });
});

describe("learnIndex", () => {
  it("ships as a draft", () => {
    expect(learnIndex.status).toBe("draft");
  });

  it("passes the answer-length, AIDE-pairing, single-line-meta and no-person checks", () => {
    const fixture: LearnCopy = { ...learnIndex, slug: "intent-driven-engineering", sections: [], related: [] };
    const messages = checkCopyRules(fixture).filter((message) => / (title|description|h1|answer):/.test(message));
    expect(messages).toEqual([]);
  });
});
