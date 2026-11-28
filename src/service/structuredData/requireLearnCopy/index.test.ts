import { describe, expect, it } from 'vitest';
import type { LearnCopy } from '@/types/learn';
import type { SitePage } from '@/types/sitePage';
import requireLearnCopy from './index';

function makeSitePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/learn/intent-driven-engineering/',
    title: 'Intent-driven engineering',
    description: 'What it is.',
    kind: 'learn',
    ogImage: '/og/learn.png',
    breadcrumb: [
      { name: 'Home', urlPath: '/' },
      { name: 'Learn', urlPath: '/learn/' },
    ],
    ...overrides,
  };
}

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

describe('requireLearnCopy', () => {
  it('returns the copy when it belongs to the page', () => {
    const copy = makeLearnCopy();
    expect(requireLearnCopy({ page: makeSitePage(), copy })).toBe(copy);
  });

  it('throws when the copy is missing', () => {
    expect(() => requireLearnCopy({ page: makeSitePage() })).toThrow(
      'structuredData: /learn page /learn/intent-driven-engineering/ needs its own copy record',
    );
  });

  it('throws when the copy is for another slug', () => {
    const copy = makeLearnCopy({ slug: 'spec-kit-alternatives' });
    expect(() => requireLearnCopy({ page: makeSitePage(), copy })).toThrow(
      'needs its own copy record',
    );
  });
});
