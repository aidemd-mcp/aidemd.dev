import { describe, it, expect, vi } from 'vitest';
import type { SitePage } from '@/types/sitePage';

vi.mock('..', () => ({ default: vi.fn() }));

import listSitePages from '..';
import findSitePage from './index';

function makePage(urlPath: string, kind: SitePage['kind']): SitePage {
  return {
    urlPath,
    kind,
    title: urlPath,
    description: `About ${urlPath}`,
    ogImage: '/og.png',
    breadcrumb: [{ name: 'home', urlPath: '/' }],
  };
}

describe('findSitePage', () => {
  it('returns the page whose urlPath equals the argument', async () => {
    const home = makePage('/', 'home');
    const privacy = makePage('/privacy/', 'privacy');
    vi.mocked(listSitePages).mockResolvedValue([home, privacy]);

    expect(await findSitePage('/privacy/')).toBe(privacy);
    expect(await findSitePage('/')).toBe(home);
  });

  it('throws naming the path when it is not in the list', async () => {
    vi.mocked(listSitePages).mockResolvedValue([makePage('/', 'home'), makePage('/privacy/', 'privacy')]);

    await expect(findSitePage('/privacy')).rejects.toThrow('listSitePages: no page at /privacy');
  });
});
