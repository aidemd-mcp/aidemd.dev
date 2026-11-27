import { describe, it, expect } from 'vitest';
import assertUniqueUrlPaths from './index';
import type { DocRoute } from '@/types/docs';

function makeRoute(overrides: Partial<DocRoute> = {}): DocRoute {
  return {
    section: 'hooks',
    slug: 'Stop',
    title: 'Stop',
    urlPath: '/docs/hooks/stop',
    absPath: '/repo/.aide/reference/hooks/Stop.md',
    order: 0,
    ...overrides,
  };
}

describe('assertUniqueUrlPaths', () => {
  it('does not throw when every urlPath is distinct', () => {
    const routes = [
      makeRoute(),
      makeRoute({
        slug: 'SessionStart',
        urlPath: '/docs/hooks/sessionstart',
        absPath: '/repo/.aide/reference/hooks/SessionStart.md',
      }),
    ];

    expect(() => assertUniqueUrlPaths(routes)).not.toThrow();
  });

  it('throws when two routes differ only by case, naming both files and the URL', () => {
    const routes = [
      makeRoute({ absPath: '/repo/.aide/reference/hooks/Stop.md' }),
      makeRoute({ slug: 'stop', absPath: '/repo/.aide/reference/hooks/stop.md' }),
    ];

    expect(() => assertUniqueUrlPaths(routes)).toThrow('/docs/hooks/stop');
    expect(() => assertUniqueUrlPaths(routes)).toThrow('/repo/.aide/reference/hooks/Stop.md');
    expect(() => assertUniqueUrlPaths(routes)).toThrow('/repo/.aide/reference/hooks/stop.md');
  });

  it('does not throw for index pages in different sections', () => {
    const routes = [
      makeRoute({
        section: 'tools',
        slug: 'index',
        urlPath: '/docs/tools/index',
        absPath: '/repo/.aide/reference/tools/index.md',
      }),
      makeRoute({
        section: 'hooks',
        slug: 'index',
        urlPath: '/docs/hooks/index',
        absPath: '/repo/.aide/reference/hooks/index.md',
      }),
    ];

    expect(() => assertUniqueUrlPaths(routes)).not.toThrow();
  });
});
