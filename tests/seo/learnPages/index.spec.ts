import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import copyBySlug from '../../../src/data/learn/copyBySlug';
import learnIndex from '../../../src/data/learn/learnIndex';
import flattenRichText from '../../../src/service/structuredData/flattenRichText';
import resolveOutFile from '../shared/resolveOutFile';
import readJsonLd from '../shared/readJsonLd';
import textFromHtml from '../shared/textFromHtml';
import type { FaqItem, LearnIndexCopy } from '../../../src/types/learn';

type LearnPage = { urlPath: string; copy: LearnIndexCopy; faq?: FaqItem[]; hasGlossary: boolean };

const pages: LearnPage[] = [
  { urlPath: '/learn/', copy: learnIndex, hasGlossary: false },
  ...Object.values(copyBySlug).map((copy) => ({
    urlPath: `/learn/${copy.slug}/`,
    copy,
    faq: copy.faq,
    hasGlossary: copy.sections.some((section) => section.blocks.some((block) => block.kind === 'glossary')),
  })),
];

for (const { urlPath, copy, faq, hasGlossary } of pages) {
  const answer = flattenRichText(copy.answer);

  test.describe(urlPath, () => {
    test('the h1 is followed by a paragraph that is the answer', async ({ page }) => {
      await page.goto(urlPath);
      const sibling = await page.locator('h1').evaluate((h1) => ({
        tag: h1.nextElementSibling?.tagName,
        text: h1.nextElementSibling?.textContent,
      }));
      expect(sibling.tag).toBe('P');
      expect(sibling.text).toBe(answer);
    });

    test('FAQPage questions and answers equal the visible FAQ, in order', async ({ page }) => {
      await page.goto(urlPath);
      const nodes = (await readJsonLd(page)).filter((node) => node['@type'] === 'FAQPage');
      if (!faq) {
        expect(nodes, 'no FAQ in the record, no FAQPage').toHaveLength(0);
        return;
      }
      expect(nodes).toHaveLength(1);
      const structured = (
        nodes[0].mainEntity as { name: string; acceptedAnswer: { text: string } }[]
      ).map((question) => ({ name: question.name, text: question.acceptedAnswer.text }));
      const visible = await page.locator('main section h3').evaluateAll((headings) =>
        headings
          .filter(
            (h3) =>
              h3.nextElementSibling?.tagName === 'P' &&
              h3.closest('section')?.querySelector('h2')?.id === 'faq',
          )
          .map((h3) => ({ name: h3.textContent ?? '', text: h3.nextElementSibling?.textContent ?? '' })),
      );
      expect(structured).toEqual(visible);
      expect(visible).toEqual(faq.map((item) => ({ name: item.question, text: flattenRichText(item.answer) })));
    });

    test('DefinedTerm records equal the visible glossary and resolve to ids', async ({ page }) => {
      await page.goto(urlPath);
      const sets = (await readJsonLd(page)).filter((node) => node['@type'] === 'DefinedTermSet');
      if (!hasGlossary) {
        expect(sets, 'no glossary in the record, no DefinedTermSet').toHaveLength(0);
        return;
      }
      expect(sets).toHaveLength(1);
      const terms = sets[0].hasDefinedTerm as { name: string; description: string; url: string }[];
      expect(terms.length).toBeGreaterThan(0);
      for (const term of terms) {
        const fragment = new URL(term.url).hash.slice(1);
        expect(fragment, `${term.name}: url has a fragment`).not.toBe('');
        const item = page.locator(`[id="${fragment}"]`);
        await expect(item, `${term.name}: #${fragment} exists once`).toHaveCount(1);
        const visible = await item.evaluate((li) => {
          const strong = li.querySelector('strong')?.textContent ?? '';
          return { strong, definition: (li.textContent ?? '').slice(strong.length).replace(/^: /, '') };
        });
        expect(visible.strong).toBe(term.name);
        expect(visible.definition).toBe(term.description);
      }
    });

    test('BreadcrumbList names equal the visible trail', async ({ page }) => {
      await page.goto(urlPath);
      const lists = (await readJsonLd(page)).filter((node) => node['@type'] === 'BreadcrumbList');
      expect(lists).toHaveLength(1);
      const names = (lists[0].itemListElement as { name: string }[]).map((item) => item.name);
      const trail = await page.locator('nav[aria-label="Breadcrumb"]').evaluate((nav) =>
        [...nav.querySelectorAll('a, span')]
          .filter((el) => el.children.length === 0 && el.textContent !== '/')
          .map((el) => el.textContent ?? ''),
      );
      expect(names).toEqual(trail);
    });

    test('every internal link in main resolves to a built file', async ({ page }) => {
      await page.goto(urlPath);
      const hrefs = await page
        .locator('main a[href^="/"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
      expect(hrefs.length).toBeGreaterThan(0);
      const missing = hrefs.filter((href) => !fs.existsSync(resolveOutFile(href)));
      expect(missing).toEqual([]);
    });

    test('the raw HTML already holds the answer and every FAQ answer', async ({ request }) => {
      const response = await request.get(urlPath);
      expect(response.ok()).toBe(true);
      const text = textFromHtml(await response.text());
      expect(text).toContain(answer);
      for (const item of faq ?? []) {
        expect(text).toContain(flattenRichText(item.answer));
      }
    });

    test('the page is not noindex', async ({ page }) => {
      await page.goto(urlPath);
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    });
  });
}
