import path from 'node:path';
import { describe, it, expect, vi, afterEach } from 'vitest';
import absolutizeDocLinks from './index';
import type { WalkedDocRoute } from '@/types/docs';

function makeRoute(overrides: Partial<WalkedDocRoute> = {}): WalkedDocRoute {
  return {
    section: 'hooks',
    slug: 'Stop',
    title: 'Stop',
    urlPath: '/docs/hooks/stop',
    absPath: path.resolve('/repo', '.aide/reference/hooks/Stop.md'),
    order: 0,
    ...overrides,
  };
}

const routes: WalkedDocRoute[] = [
  makeRoute({
    slug: 'index',
    urlPath: '/docs/hooks/index',
    absPath: path.resolve('/repo', '.aide/reference/hooks/index.md'),
  }),
  makeRoute(),
  makeRoute({
    section: 'tools',
    slug: 'aide_observer_event',
    urlPath: '/docs/tools/aide_observer_event',
    absPath: path.resolve('/repo', '.aide/reference/tools/aide_observer_event.md'),
  }),
  makeRoute({
    section: 'methodology',
    slug: 'aide-spec',
    urlPath: '/docs/methodology/aide-spec',
    absPath: path.resolve('/repo', '.aide/docs/aide-spec.md'),
  }),
];

const routesByPath = new Map(routes.map((route) => [path.normalize(route.absPath), route]));
const hooksIndex = path.resolve('/repo', '.aide/reference/hooks/index.md');

function run(markdown: string, fromPath = hooksIndex): string {
  return absolutizeDocLinks({ markdown, fromPath, routesByPath });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('absolutizeDocLinks — resolvable links', () => {
  it('rewrites a sibling link to the absolute canonical page', () => {
    expect(run('[Stop](./Stop.md)')).toBe('[Stop](https://aidemd.dev/docs/hooks/stop/)');
  });

  it('rewrites a cross-root link', () => {
    expect(run('[e](../tools/aide_observer_event.md)')).toBe(
      '[e](https://aidemd.dev/docs/tools/aide_observer_event/)',
    );
  });

  it('keeps the anchor', () => {
    expect(run('[b](../../docs/aide-spec.md#brevity-contract)')).toBe(
      '[b](https://aidemd.dev/docs/methodology/aide-spec/#brevity-contract)',
    );
  });

  it('keeps the title', () => {
    expect(run('[s](./Stop.md "Stop hook")')).toBe(
      '[s](https://aidemd.dev/docs/hooks/stop/ "Stop hook")',
    );
  });

  it('rewrites inside an angle-bracketed destination', () => {
    expect(run('[s](<./Stop.md>)')).toBe('[s](<https://aidemd.dev/docs/hooks/stop/>)');
  });

  it('rewrites a reference definition', () => {
    expect(run('[s]: ./Stop.md')).toBe('[s]: https://aidemd.dev/docs/hooks/stop/');
  });

  it('rewrites a raw HTML href', () => {
    expect(run('<a href="./Stop.md">Stop</a>')).toBe(
      '<a href="https://aidemd.dev/docs/hooks/stop/">Stop</a>',
    );
  });
});

describe('absolutizeDocLinks — links left alone', () => {
  it.each([
    ['an absolute URL', '[x](https://example.com/x.md)'],
    ['a local anchor', '[x](#local)'],
    ['a root-relative link', '[x](/docs/hooks/)'],
    ['inline code', '`./Stop.md` and `[Stop](./Stop.md)`'],
    ['a fenced block', '```md\n[Stop](./Stop.md)\n```'],
    ['an image', '![i](./pic.png)'],
  ])('leaves %s as written', (_label, markdown) => {
    expect(run(markdown)).toBe(markdown);
  });
});

describe('absolutizeDocLinks — missing targets', () => {
  it('leaves the link as written and warns exactly once naming the link and the linking file', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fromPath = path.resolve('/repo', '.aide/reference/hooks/missing-case.md');

    expect(absolutizeDocLinks({ markdown: '[g](./Gone.md)', fromPath, routesByPath })).toBe(
      '[g](./Gone.md)',
    );
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('./Gone.md');
    expect(warn.mock.calls[0][0]).toContain('missing-case.md');
  });
});

describe('absolutizeDocLinks — byte fidelity', () => {
  it('changes only the one destination in a multi-line CRLF document', () => {
    const lines = [
      '# Hooks reference',
      '',
      'Some *emphasis* and **strong** text.',
      '',
      '| Hook | Doc |',
      '| ---- | --- |',
      '| Stop | [Stop](./Stop.md) |',
      '',
      '- one',
      '- two',
      '',
    ];
    const input = lines.join('\r\n');
    const expected = input.replace('(./Stop.md)', '(https://aidemd.dev/docs/hooks/stop/)');

    expect(expected).not.toBe(input);
    expect(run(input)).toBe(expected);
  });
});
