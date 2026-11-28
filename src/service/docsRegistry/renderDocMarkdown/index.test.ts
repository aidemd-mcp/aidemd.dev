import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'node:path';

vi.mock('node:fs/promises', () => ({ readFile: vi.fn() }));

import { readFile } from 'node:fs/promises';
import type { DocRoute } from '@/types/docs';

const readFileMock = vi.mocked(readFile);

function makeRoute(relPath: string, urlPath: string): DocRoute {
  return {
    section: 'hooks',
    slug: path.basename(relPath, '.md'),
    title: path.basename(relPath, '.md'),
    urlPath,
    absPath: path.resolve('/repo', relPath),
    order: 0,
    commit: 'b75834c',
  };
}

const indexRoute = makeRoute('.aide/reference/hooks/index.md', '/docs/hooks');
const stopRoute = makeRoute('.aide/reference/hooks/Stop.md', '/docs/hooks/stop');
const routes = [indexRoute, stopRoute];

const INDEX_DOC =
  '---\nname: hooks\ndescription: Hook reference\n---\n\n# Hooks\n\nSee [Stop](./Stop.md).\n';
const STOP_DOC = '# Stop\n\nStop hook.\n';

/** Loads a fresh copy of the helper, because its memo is module-level. */
async function loadHelper() {
  vi.resetModules();
  const { default: renderDocMarkdown } = await import('./index');
  return renderDocMarkdown;
}

describe('renderDocMarkdown', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    readFileMock.mockImplementation(async (file) =>
      (String(file) === indexRoute.absPath ? INDEX_DOC : STOP_DOC) as never,
    );
  });

  it('strips the frontmatter, keeps the H1 and makes the doc link absolute', async () => {
    const renderDocMarkdown = await loadHelper();

    await expect(renderDocMarkdown({ route: indexRoute, routes })).resolves.toBe(
      '# Hooks\n\nSee [Stop](https://aidemd.dev/docs/hooks/stop/).\n',
    );
  });

  it('two sequential calls for one route read the file once and return equal text', async () => {
    const renderDocMarkdown = await loadHelper();

    const first = await renderDocMarkdown({ route: indexRoute, routes });
    const second = await renderDocMarkdown({ route: indexRoute, routes });

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });

  it('two concurrent calls for one route read the file once', async () => {
    const renderDocMarkdown = await loadHelper();

    const [first, second] = await Promise.all([
      renderDocMarkdown({ route: indexRoute, routes }),
      renderDocMarkdown({ route: indexRoute, routes }),
    ]);

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });

  it('calls for two different routes read each file once', async () => {
    const renderDocMarkdown = await loadHelper();

    await renderDocMarkdown({ route: indexRoute, routes });
    await renderDocMarkdown({ route: stopRoute, routes });
    await renderDocMarkdown({ route: indexRoute, routes });
    await renderDocMarkdown({ route: stopRoute, routes });

    expect(readFileMock).toHaveBeenCalledTimes(2);
    expect(readFileMock).toHaveBeenCalledWith(indexRoute.absPath, 'utf8');
    expect(readFileMock).toHaveBeenCalledWith(stopRoute.absPath, 'utf8');
  });

  it('a file that cannot be read rejects with that error', async () => {
    const renderDocMarkdown = await loadHelper();
    readFileMock.mockRejectedValue(new Error('ENOENT: no such file'));

    await expect(renderDocMarkdown({ route: indexRoute, routes })).rejects.toThrow(
      'ENOENT: no such file',
    );
  });
});
