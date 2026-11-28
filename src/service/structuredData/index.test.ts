import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FaqItem, LearnCopy, LearnSection } from '@/types/learn';
import type { SitePage, SitePageKind } from '@/types/sitePage';
import type { StructuredDataNode } from '@/types/structuredData';
import flattenRichText from './flattenRichText';
import richRecordSlugs from './richRecordSlugs';
import serializeJsonLd from './serializeJsonLd';
import buildStructuredData from './index';

const ORGANIZATION_REF = { '@id': 'https://aidemd.dev/#organization' };
const WEBSITE_REF = { '@id': 'https://aidemd.dev/#website' };

const TRAIL = [
  { name: 'Home', urlPath: '/' },
  { name: 'Docs', urlPath: '/docs/' },
];

const PAGE_URL_BY_KIND: Record<SitePageKind, string> = {
  home: '/',
  docsIndex: '/docs/',
  docsSection: '/docs/hooks/',
  doc: '/docs/hooks/stop/',
  brain: '/brain/',
  brainRecipes: '/brain/recipes/',
  observer: '/observer/',
  privacy: '/privacy/',
  learnIndex: '/learn/',
  learn: '/learn/intent-driven-engineering/',
};

function makeSitePage(overrides: Partial<SitePage> = {}): SitePage {
  const kind = overrides.kind ?? 'doc';
  return {
    urlPath: PAGE_URL_BY_KIND[kind],
    title: 'A page',
    description: 'What the page is about.',
    kind,
    ogImage: '/og/page.png',
    breadcrumb: TRAIL,
    ...overrides,
  };
}

const FAQ: FaqItem[] = [
  {
    question: 'What is it?',
    answer: [
      { kind: 'text', text: 'Read ' },
      { kind: 'link', text: 'the hooks docs', href: '/docs/hooks/' },
      { kind: 'text', text: ' first.' },
    ],
  },
  { question: 'Why?', answer: [{ kind: 'text', text: 'Because.' }] },
];

const GLOSSARY: LearnSection = {
  id: 'glossary',
  heading: 'Glossary',
  blocks: [
    {
      kind: 'glossary',
      terms: [
        {
          id: 'intent',
          term: 'Intent',
          definition: [
            { kind: 'text', text: 'See ' },
            { kind: 'link', text: 'the spec', href: '/docs/spec/' },
            { kind: 'text', text: ' for detail.' },
          ],
        },
        { id: 'plan', term: 'Plan', definition: [{ kind: 'text', text: 'A plan.' }] },
      ],
    },
  ],
};

function makeLearnCopy(overrides: Partial<LearnCopy> = {}): LearnCopy {
  return {
    slug: 'intent-driven-engineering',
    status: 'reviewed',
    title: 'Intent-driven engineering',
    description: 'What it is.',
    h1: 'What is intent-driven engineering?',
    answer: [{ kind: 'text', text: 'An answer.' }],
    sections: [GLOSSARY],
    faq: FAQ,
    related: [],
    ...overrides,
  };
}

function makeLearnInput(copyOverrides: Partial<LearnCopy> = {}, pageOverrides: Partial<SitePage> = {}) {
  const copy = makeLearnCopy(copyOverrides);
  const page = makeSitePage({
    kind: 'learn',
    urlPath: `/learn/${copy.slug}/`,
    ...pageOverrides,
  });
  return { page, copy };
}

function typesOf(nodes: StructuredDataNode[]): string[] {
  return nodes.map((node) => node['@type']);
}

function graphFor(kind: SitePageKind) {
  if (kind === 'learn') return buildStructuredData(makeLearnInput())['@graph'];
  return buildStructuredData({ page: makeSitePage({ kind }) })['@graph'];
}

describe('buildStructuredData', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('one identity', () => {
    it('yields exactly one Organization and one WebSite for home', () => {
      const types = typesOf(graphFor('home'));
      expect(types.filter((type) => type === 'Organization')).toHaveLength(1);
      expect(types.filter((type) => type === 'WebSite')).toHaveLength(1);
    });

    it.each(['doc', 'docsSection', 'learnIndex', 'learn'] as const)(
      'yields no Organization or WebSite for %s',
      (kind) => {
        const types = typesOf(graphFor(kind));
        expect(types).not.toContain('Organization');
        expect(types).not.toContain('WebSite');
      },
    );

    it.each(['home', 'doc', 'docsSection', 'learnIndex', 'learn'] as const)(
      'carries no person, sameAs or AIDE product link for %s',
      (kind) => {
        const serialized = JSON.stringify(buildStructuredData(
          kind === 'learn' ? makeLearnInput() : { page: makeSitePage({ kind }) },
        ));
        for (const forbidden of ['Person', 'sameAs', 'github.com', 'npmjs.com']) {
          expect(serialized).not.toContain(forbidden);
        }
      },
    );
  });

  describe('references, not restatements', () => {
    const home = graphFor('home');
    const organization = home.find((node) => node['@type'] === 'Organization');
    const website = home.find((node) => node['@type'] === 'WebSite');

    it('uses the same @ids the home page emits', () => {
      expect(organization).toMatchObject(ORGANIZATION_REF);
      expect(website).toMatchObject(WEBSITE_REF);
    });

    it.each(['doc', 'learn'] as const)('points %s author, publisher and isPartOf at the identity', (kind) => {
      const article = graphFor(kind).find(
        (node) => node['@type'] === 'Article' || node['@type'] === 'TechArticle',
      );
      expect(article).toMatchObject({
        author: ORGANIZATION_REF,
        publisher: ORGANIZATION_REF,
        isPartOf: WEBSITE_REF,
      });
    });

    it('points the learn index publisher and isPartOf at the identity', () => {
      const collection = graphFor('learnIndex').find((node) => node['@type'] === 'CollectionPage');
      expect(collection).toMatchObject({ publisher: ORGANIZATION_REF, isPartOf: WEBSITE_REF });
    });
  });

  describe('right record per page', () => {
    it.each([
      ['home', ['Organization', 'WebSite']],
      ['doc', ['TechArticle', 'BreadcrumbList']],
      ['docsSection', ['BreadcrumbList']],
      ['learnIndex', ['CollectionPage', 'BreadcrumbList']],
    ] as const)('emits the table sequence for %s', (kind, expected) => {
      expect(typesOf(graphFor(kind))).toEqual(expected);
    });

    it('emits Article, BreadcrumbList, FAQPage and a DefinedTermSet for a rich /learn page', () => {
      expect(typesOf(graphFor('learn'))).toEqual([
        'Article',
        'BreadcrumbList',
        'FAQPage',
        'DefinedTermSet',
      ]);
    });

    it('emits the SDLC page records too', () => {
      const input = makeLearnInput({ slug: 'open-source-agentic-sdlc-framework' });
      expect(typesOf(buildStructuredData(input)['@graph'])).toEqual([
        'Article',
        'BreadcrumbList',
        'FAQPage',
        'DefinedTermSet',
      ]);
    });

    it('omits FAQPage when a rich page has no FAQ items', () => {
      const input = makeLearnInput({ faq: [] });
      expect(typesOf(buildStructuredData(input)['@graph'])).toEqual([
        'Article',
        'BreadcrumbList',
        'DefinedTermSet',
      ]);
    });

    it('emits only Article and BreadcrumbList for a /learn page outside richRecordSlugs', () => {
      const input = makeLearnInput({ slug: 'spec-kit-alternatives' });
      expect(richRecordSlugs).not.toContain(input.copy.slug);
      expect(typesOf(buildStructuredData(input)['@graph'])).toEqual(['Article', 'BreadcrumbList']);
    });

    it.each(['docsIndex', 'brain', 'brainRecipes', 'observer', 'privacy'] as const)(
      'throws for %s',
      (kind) => {
        expect(() => buildStructuredData({ page: makeSitePage({ kind }) })).toThrow(
          `structuredData: no record for page kind ${kind}`,
        );
      },
    );

    it('throws for a /learn page without its copy', () => {
      expect(() => buildStructuredData({ page: makeLearnInput().page })).toThrow(
        'needs its own copy record',
      );
    });

    it('headlines a /learn article with the copy H1 and a doc with the page title', () => {
      const learn = graphFor('learn')[0];
      const doc = buildStructuredData({ page: makeSitePage({ kind: 'doc', title: 'Stop hook' }) })['@graph'][0];
      expect(learn).toMatchObject({ headline: 'What is intent-driven engineering?' });
      expect(doc).toMatchObject({ headline: 'Stop hook' });
    });
  });

  describe('FAQ and glossary match the page', () => {
    const graph = graphFor('learn');

    it('matches every FAQ question and answer, in count and order', () => {
      const faqPage = graph.find((node) => node['@type'] === 'FAQPage');
      if (faqPage?.['@type'] !== 'FAQPage') throw new Error('expected a FAQPage');
      expect(faqPage.mainEntity).toHaveLength(FAQ.length);
      faqPage.mainEntity.forEach((entity, index) => {
        expect(entity.name).toBe(FAQ[index].question);
        expect(entity.acceptedAnswer.text).toBe(flattenRichText(FAQ[index].answer));
      });
      expect(faqPage.mainEntity[0].acceptedAnswer.text).toBe('Read the hooks docs first.');
    });

    it('matches every glossary term name and definition, in count and order', () => {
      const set = graph.find((node) => node['@type'] === 'DefinedTermSet');
      if (set?.['@type'] !== 'DefinedTermSet') throw new Error('expected a DefinedTermSet');
      const block = GLOSSARY.blocks[0];
      if (block.kind !== 'glossary') throw new Error('expected a glossary block');
      expect(set.hasDefinedTerm).toHaveLength(block.terms.length);
      set.hasDefinedTerm.forEach((term, index) => {
        expect(term.name).toBe(block.terms[index].term);
        expect(term.description).toBe(flattenRichText(block.terms[index].definition));
      });
    });
  });

  describe('true dates only', () => {
    it('leaves date keys out of the whole graph when the page has no true dates', () => {
      for (const kind of ['doc', 'docsSection', 'learnIndex', 'learn'] as const) {
        const serialized = JSON.stringify(graphFor(kind));
        expect(serialized).not.toContain('datePublished');
        expect(serialized).not.toContain('dateModified');
      }
    });

    it('copies the page dates verbatim onto the article', () => {
      const published = '2026-03-02T09:15:00+01:00';
      const modified = '2026-04-10T18:30:00-07:00';
      const [article] = buildStructuredData({
        page: makeSitePage({ kind: 'doc', published, modified }),
      })['@graph'];
      expect(article).toMatchObject({ datePublished: published, dateModified: modified });
    });

    it('never gives the learn index a date even when the page has one', () => {
      const [collection] = buildStructuredData({
        page: makeSitePage({
          kind: 'learnIndex',
          published: '2026-03-02T09:15:00+01:00',
          modified: '2026-04-10T18:30:00-07:00',
        }),
      })['@graph'];
      expect(collection).not.toHaveProperty('datePublished');
      expect(collection).not.toHaveProperty('dateModified');
    });

    it('does not read the clock', () => {
      const input = makeLearnInput({}, { published: '2026-03-02T09:15:00+01:00' });
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2020-01-01T00:00:00Z'));
      const first = buildStructuredData(input);
      vi.setSystemTime(new Date('2031-06-15T12:00:00Z'));
      const second = buildStructuredData(input);
      expect(second).toEqual(first);
    });
  });

  describe('safe to embed', () => {
    it('leaves no < in the serialized record when the title would close the script', () => {
      const title = '</script><script>alert(1)</script>';
      const document = buildStructuredData({ page: makeSitePage({ kind: 'doc', title }) });
      const serialized = serializeJsonLd(document);
      expect(serialized).not.toContain('<');
      expect(JSON.parse(serialized)).toEqual(document);
    });
  });
});
