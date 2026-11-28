import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DocRoute } from '@/types/docs';
import type { SitePage } from '@/types/sitePage';

vi.mock('@/service/docsRegistry', () => ({
  default: vi.fn(),
  renderDocMarkdown: vi.fn(),
}));
vi.mock('../renderLearnMarkdown', () => ({ default: vi.fn() }));

import buildRegistry, { renderDocMarkdown } from '@/service/docsRegistry';
import copyBySlug from '@/data/learn/copyBySlug';
import renderLearnMarkdown from '../renderLearnMarkdown';
import collectMarkdown from './index';

const mockBuildRegistry = buildRegistry as ReturnType<typeof vi.fn>;
const mockRenderDoc = renderDocMarkdown as ReturnType<typeof vi.fn>;
const mockRenderLearn = renderLearnMarkdown as ReturnType<typeof vi.fn>;

function makePage(overrides: Partial<SitePage> & Pick<SitePage, 'urlPath' | 'kind'>): SitePage {
  return { title: 't', description: 'd', breadcrumb: [], ...overrides } as SitePage;
}

function makeRoute(urlPath: string): DocRoute {
  return { urlPath } as DocRoute;
}

const docPage = makePage({ urlPath: '/docs/hooks/stop/', kind: 'doc' });
const learnPage = makePage({ urlPath: '/learn/intent-driven-engineering/', kind: 'learn' });
const indexPage = makePage({ urlPath: '/learn/', kind: 'learnIndex' });

beforeEach(() => {
  vi.clearAllMocks();
  mockBuildRegistry.mockResolvedValue({ routes: [makeRoute('/docs/hooks/stop')] });
  mockRenderDoc.mockResolvedValue('# Stop\n');
  mockRenderLearn.mockReturnValue('# Learn\n');
});

describe('collectMarkdown', () => {
  it('keys the map by the urlPath of every doc and learn page only', async () => {
    const result = await collectMarkdown([indexPage, docPage, learnPage]);

    expect([...result.keys()]).toEqual(['/docs/hooks/stop/', '/learn/intent-driven-engineering/']);
    expect(result.get('/docs/hooks/stop/')).toBe('# Stop\n');
    expect(result.get('/learn/intent-driven-engineering/')).toBe('# Learn\n');
  });

  it('renders a learn page from the copy record named by its urlPath', async () => {
    await collectMarkdown([learnPage]);

    expect(mockRenderLearn).toHaveBeenCalledWith({
      copy: copyBySlug['intent-driven-engineering'],
      page: learnPage,
    });
  });

  it('throws naming the page when a doc has no route', async () => {
    const orphan = makePage({ urlPath: '/docs/hooks/missing/', kind: 'doc' });

    await expect(collectMarkdown([orphan])).rejects.toThrow('no doc route for /docs/hooks/missing/');
  });

  it('throws naming the page when a learn page has no copy record', async () => {
    const unknown = makePage({ urlPath: '/learn/not-a-slug/', kind: 'learn' });

    await expect(collectMarkdown([unknown])).rejects.toThrow('no learn copy for /learn/not-a-slug/');
  });

  it.each([
    ['doc', () => mockRenderDoc.mockResolvedValue('  \n'), docPage],
    ['learn', () => mockRenderLearn.mockReturnValue(''), learnPage],
  ])('throws naming the page when a %s body is blank', async (_kind, blank, page) => {
    blank();

    await expect(collectMarkdown([page])).rejects.toThrow(`blank markdown for ${page.urlPath}`);
  });
});
