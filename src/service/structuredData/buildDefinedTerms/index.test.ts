import { describe, expect, it } from 'vitest';
import type { GlossaryTerm, LearnCopy, LearnSection } from '@/types/learn';
import buildDefinedTerms from './index';

function makeLearnCopy(overrides: Partial<LearnCopy> = {}): LearnCopy {
  return {
    slug: 'intent-driven-engineering',
    status: 'reviewed',
    title: 'Intent-driven engineering',
    description: 'What it is.',
    h1: 'What is intent-driven engineering?',
    answer: [{ kind: 'text', text: 'An answer.' }],
    sections: [],
    related: [],
    ...overrides,
  };
}

function makeTerm(id: string, overrides: Partial<GlossaryTerm> = {}): GlossaryTerm {
  return {
    id,
    term: `Term ${id}`,
    definition: [{ kind: 'text', text: `Definition of ${id}.` }],
    ...overrides,
  };
}

function makeGlossarySection(id: string, heading: string, terms: GlossaryTerm[]): LearnSection {
  return { id, heading, blocks: [{ kind: 'glossary', terms }] };
}

describe('buildDefinedTerms', () => {
  it('returns a bare DefinedTerm for a one-term block', () => {
    const copy = makeLearnCopy({
      sections: [makeGlossarySection('glossary', 'Glossary', [makeTerm('intent')])],
    });
    expect(buildDefinedTerms(copy)).toEqual([
      {
        '@type': 'DefinedTerm',
        name: 'Term intent',
        description: 'Definition of intent.',
        url: 'https://aidemd.dev/learn/intent-driven-engineering/#intent',
      },
    ]);
  });

  it('returns one DefinedTermSet named by the section heading for a three-term block', () => {
    const copy = makeLearnCopy({
      sections: [
        makeGlossarySection('key-terms', 'Key terms', [
          makeTerm('a'),
          makeTerm('b'),
          makeTerm('c'),
        ]),
      ],
    });
    const result = buildDefinedTerms(copy);
    expect(result).toHaveLength(1);
    const set = result[0];
    expect(set['@type']).toBe('DefinedTermSet');
    if (set['@type'] !== 'DefinedTermSet') return;
    expect(set['@id']).toBe('https://aidemd.dev/learn/intent-driven-engineering/#key-terms');
    expect(set.name).toBe('Key terms');
    expect(set.hasDefinedTerm.map((term) => term.name)).toEqual(['Term a', 'Term b', 'Term c']);
    expect(set.hasDefinedTerm.every((term) => !('inDefinedTermSet' in term))).toBe(true);
  });

  it('flattens a definition with a link run to the visible words', () => {
    const copy = makeLearnCopy({
      sections: [
        makeGlossarySection('glossary', 'Glossary', [
          makeTerm('hook', {
            definition: [
              { kind: 'text', text: 'See ' },
              { kind: 'link', text: 'the hooks docs', href: '/docs/hooks/' },
              { kind: 'text', text: ' for more.' },
            ],
          }),
        ]),
      ],
    });
    const [node] = buildDefinedTerms(copy);
    expect(node['@type']).toBe('DefinedTerm');
    if (node['@type'] !== 'DefinedTerm') return;
    expect(node.description).toBe('See the hooks docs for more.');
  });

  it('ends each term url with /learn/<slug>/#<term.id>', () => {
    const copy = makeLearnCopy({
      slug: 'open-source-agentic-sdlc-framework',
      sections: [makeGlossarySection('terms', 'Terms', [makeTerm('x'), makeTerm('y')])],
    });
    const [set] = buildDefinedTerms(copy);
    if (set['@type'] !== 'DefinedTermSet') throw new Error('expected a DefinedTermSet');
    expect(set.hasDefinedTerm.map((term) => term.url)).toEqual([
      'https://aidemd.dev/learn/open-source-agentic-sdlc-framework/#x',
      'https://aidemd.dev/learn/open-source-agentic-sdlc-framework/#y',
    ]);
  });

  it('walks sections and blocks in order', () => {
    const copy = makeLearnCopy({
      sections: [
        makeGlossarySection('one', 'One', [makeTerm('first')]),
        { id: 'prose', heading: 'Prose', blocks: [{ kind: 'paragraph', text: [{ kind: 'text', text: 'x' }] }] },
        makeGlossarySection('two', 'Two', [makeTerm('second')]),
      ],
    });
    expect(buildDefinedTerms(copy).map((node) => node.name)).toEqual([
      'Term first',
      'Term second',
    ]);
  });

  it('returns [] when the copy has no glossary block', () => {
    const copy = makeLearnCopy({
      sections: [{ id: 'prose', heading: 'Prose', blocks: [{ kind: 'paragraph', text: [{ kind: 'text', text: 'x' }] }] }],
    });
    expect(buildDefinedTerms(copy)).toEqual([]);
  });
});
