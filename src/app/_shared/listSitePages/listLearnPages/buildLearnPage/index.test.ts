import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'node:path';

vi.mock('@/lib/resolveGitDates', () => ({ default: vi.fn() }));

import copyBySlug from '@/data/learn/copyBySlug';
import learnRoster from '@/data/learn';
import templateLabels from '@/data/learn/templateLabels';
import resolveGitDates from '@/lib/resolveGitDates';
import buildLearnPage from './index';

const mockResolveGitDates = resolveGitDates as ReturnType<typeof vi.fn>;
const entry = learnRoster[0];

describe('buildLearnPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('copies the roster entry and links the markdown copy', () => {
    mockResolveGitDates.mockReturnValue({});
    const page = buildLearnPage(entry);
    expect(page.urlPath).toBe(entry.urlPath);
    expect(page.kind).toBe('learn');
    expect(page.title).toBe(entry.title);
    expect(page.description).toBe(entry.description);
    expect(page.section).toBe('learn');
    expect(page.markdownUrl).toBe(`/learn/${entry.slug}.md`);
    expect(page.ogImage).toMatch(/^\/og\/[a-z0-9-]+-[0-9a-f]{10}\.png$/);
  });

  it('reads dates from the absolute path of the copy module', () => {
    mockResolveGitDates.mockReturnValue({});
    buildLearnPage(entry);
    expect(mockResolveGitDates).toHaveBeenCalledWith(path.resolve(process.cwd(), entry.sourcePath));
  });

  it('copies published and modified when history proved them', () => {
    mockResolveGitDates.mockReturnValue({
      published: '2026-05-01T10:00:00+00:00',
      modified: '2026-06-02T11:00:00+00:00',
    });
    const page = buildLearnPage(entry);
    expect(page.published).toBe('2026-05-01T10:00:00+00:00');
    expect(page.modified).toBe('2026-06-02T11:00:00+00:00');
  });

  it('leaves the date keys absent when history returns none', () => {
    mockResolveGitDates.mockReturnValue({});
    const page = buildLearnPage(entry);
    expect(page).not.toHaveProperty('published');
    expect(page).not.toHaveProperty('modified');
  });

  it('propagates a resolveGitDates failure unchanged (shallow history)', () => {
    const failure = new Error('resolveGitDates: the repository is a shallow clone');
    mockResolveGitDates.mockImplementation(() => {
      throw failure;
    });
    expect(() => buildLearnPage(entry)).toThrow(failure);
  });

  it('ends the breadcrumb at the record h1 and this page', () => {
    mockResolveGitDates.mockReturnValue({});
    const page = buildLearnPage(entry);
    expect(page.breadcrumb).toEqual([
      { name: templateLabels.breadcrumbHome, urlPath: '/' },
      { name: templateLabels.breadcrumbLearn, urlPath: '/learn/' },
      { name: copyBySlug[entry.slug].h1, urlPath: entry.urlPath },
    ]);
  });
});
