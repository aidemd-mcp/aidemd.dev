import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/resolveGitDates', () => ({ default: vi.fn(() => ({})) }));

import learnRoster from '@/data/learn';
import listLearnPages from './index';

describe('listLearnPages', () => {
  it('returns seven pages: the index first, then the six answer pages', () => {
    const pages = listLearnPages();
    expect(pages).toHaveLength(7);
    expect(pages[0].kind).toBe('learnIndex');
    expect(pages.slice(1).every((page) => page.kind === 'learn')).toBe(true);
  });

  it('lists the answer pages in roster order', () => {
    const pages = listLearnPages();
    expect(pages.slice(1).map((page) => page.urlPath)).toEqual(learnRoster.map((entry) => entry.urlPath));
  });
});
