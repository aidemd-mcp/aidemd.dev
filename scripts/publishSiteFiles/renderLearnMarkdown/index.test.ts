import { describe, expect, it } from 'vitest';
import copyBySlug from '@/data/learn/copyBySlug';
import flattenRichText from '@/service/structuredData/flattenRichText';
import type { LearnCopy, LearnSlug } from '@/types/learn';
import type { SitePage } from '@/types/sitePage';
import renderLearnMarkdown from './index';

function makeCopy(overrides: Partial<LearnCopy> = {}): LearnCopy {
  return {
    slug: 'intent-driven-engineering',
    status: 'reviewed',
    title: 'Intent-driven engineering',
    description: 'Description.',
    h1: 'What is intent-driven engineering?',
    answer: [
      { kind: 'text', text: 'It starts from ' },
      { kind: 'link', text: 'intent', href: '/docs/intent/' },
      { kind: 'text', text: '.' },
    ],
    sections: [
      {
        id: 'how',
        heading: 'How it works',
        blocks: [
          { kind: 'paragraph', text: [{ kind: 'text', text: 'Write the spec.' }] },
          { kind: 'list', items: [[{ kind: 'text', text: 'plan' }], [{ kind: 'text', text: 'build' }]] },
          { kind: 'code', lang: 'bash', code: 'npx sync' },
          {
            kind: 'glossary',
            terms: [{ id: 'brief', term: 'Brief', definition: [{ kind: 'text', text: 'The shape.' }] }],
          },
        ],
      },
    ],
    comparison: {
      caption: 'Compared.',
      columns: ['Tool', 'Stars'],
      rows: [{ cells: [{ text: 'AIDE' }, { text: '1k', asOf: '2026-11-01' }] }],
    },
    faq: [
      {
        question: 'Why?',
        answer: [
          { kind: 'text', text: 'See ' },
          { kind: 'link', text: 'the hooks', href: '/docs/hooks/' },
          { kind: 'text', text: '.' },
        ],
      },
    ],
    related: [
      { label: 'Hooks', href: '/docs/hooks/' },
      { label: 'Spec Kit', href: 'https://github.com/github/spec-kit' },
    ],
    ...overrides,
  };
}

function makePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/learn/intent-driven-engineering/',
    title: 'Intent-driven engineering',
    description: 'Description.',
    kind: 'learn',
    markdownUrl: '/learn/intent-driven-engineering.md',
    ogImage: '/og/intent-driven-engineering-abc.png',
    breadcrumb: [],
    modified: '2026-11-20T09:30:00+00:00',
    ...overrides,
  };
}

const EXPECTED = [
  '# What is intent-driven engineering?',
  '',
  'It starts from [intent](https://aidemd.dev/docs/intent/).',
  '',
  'Updated 2026-11-20 · Lowmeadow LLC',
  '',
  '## How it works',
  '',
  'Write the spec.',
  '',
  '- plan\n- build',
  '',
  '```bash\nnpx sync\n```',
  '',
  '- **Brief**: The shape.',
  '',
  'Compared.\n\n| Tool | Stars |\n| --- | --- |\n| AIDE | 1k (as of 2026-11-01) |',
  '',
  '## Frequently asked questions',
  '',
  '### Why?',
  '',
  'See [the hooks](https://aidemd.dev/docs/hooks/).',
  '',
  '## Related',
  '',
  '- [Hooks](https://aidemd.dev/docs/hooks/)\n- [Spec Kit](https://github.com/github/spec-kit)',
  '',
].join('\n');

describe('renderLearnMarkdown', () => {
  it('renders every block kind, the table, the FAQ and the related list in template order', () => {
    expect(renderLearnMarkdown({ copy: makeCopy(), page: makePage() })).toBe(EXPECTED);
  });

  it('writes the author alone as the byline when the page has no modified date', () => {
    const markdown = renderLearnMarkdown({ copy: makeCopy(), page: makePage({ modified: undefined }) });
    expect(markdown).toContain('\n\nLowmeadow LLC\n\n## How it works');
    expect(markdown).not.toContain('Updated');
  });

  it('omits the table and the FAQ when the record has none', () => {
    const markdown = renderLearnMarkdown({
      copy: makeCopy({ comparison: undefined, faq: undefined }),
      page: makePage(),
    });
    expect(markdown).not.toContain('Compared.');
    expect(markdown).not.toContain('Frequently asked questions');
    expect(markdown).toContain('## Related');
  });

  it('throws when the copy does not belong to the page', () => {
    expect(() =>
      renderLearnMarkdown({ copy: makeCopy(), page: makePage({ urlPath: '/learn/spec-kit-alternatives/' }) }),
    ).toThrow('does not belong to page /learn/spec-kit-alternatives/');
  });

  it('ends in exactly one newline and contains no CR', () => {
    const markdown = renderLearnMarkdown({ copy: makeCopy(), page: makePage() });
    expect(markdown.endsWith('\n')).toBe(true);
    expect(markdown.endsWith('\n\n')).toBe(false);
    expect(markdown).not.toContain('\r');
  });

  describe.each(Object.entries(copyBySlug) as [LearnSlug, LearnCopy][])('record %s', (slug, copy) => {
    const page = makePage({ urlPath: `/learn/${slug}/` });
    const markdown = renderLearnMarkdown({ copy, page });

    it('renders and starts with its h1', () => {
      expect(markdown.startsWith(`# ${copy.h1}\n`)).toBe(true);
    });

    it('keeps each FAQ answer as its plain text with only link markup added', () => {
      for (const item of copy.faq ?? []) {
        const body = markdown.split(`### ${item.question}\n\n`)[1]!.split('\n\n')[0]!;
        const withoutLinkMarkup = body.replace(/\[((?:\\.|[^\]\\])*)\]\([^)]*\)/g, '$1');
        expect(withoutLinkMarkup.replace(/\\(.)/g, '$1')).toBe(flattenRichText(item.answer));
      }
    });
  });
});
