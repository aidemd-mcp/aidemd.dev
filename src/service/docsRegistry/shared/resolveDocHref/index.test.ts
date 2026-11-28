import path from 'node:path';
import { describe, it, expect } from 'vitest';
import resolveDocHref from './index';
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

function makeRoutesByPath(routes: WalkedDocRoute[]): Map<string, WalkedDocRoute> {
  return new Map(routes.map((route) => [path.normalize(route.absPath), route]));
}

const routesByPath = makeRoutesByPath([
  makeRoute({
    section: 'methodology',
    slug: 'index',
    urlPath: '/docs/methodology/index',
    absPath: path.resolve('/repo', '.aide/docs/index.md'),
  }),
  makeRoute({
    section: 'methodology',
    slug: 'aide-spec',
    urlPath: '/docs/methodology/aide-spec',
    absPath: path.resolve('/repo', '.aide/docs/aide-spec.md'),
  }),
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
    section: 'skills',
    slug: 'aide/SKILL',
    urlPath: '/docs/skills/aide/skill',
    absPath: path.resolve('/repo', '.claude/skills/aide/SKILL.md'),
  }),
]);

const hooksIndex = path.resolve('/repo', '.aide/reference/hooks/index.md');
const methodologyIndex = path.resolve('/repo', '.aide/docs/index.md');
const aideSkill = path.resolve('/repo', '.claude/skills/aide/SKILL.md');

describe('resolveDocHref — rewritten', () => {
  it.each([
    ['./Stop.md', '/docs/hooks/stop/'],
    ['../tools/aide_observer_event.md', '/docs/tools/aide_observer_event/'],
    ['./index.md', '/docs/hooks/index/'],
    ['./Sto%70.md', '/docs/hooks/stop/'],
  ])('resolves %s from the hooks index to %s', (href, expected) => {
    const resolution = resolveDocHref({ href, fromPath: hooksIndex, routesByPath });

    expect(resolution).toEqual({ status: 'rewritten', href: expected });
  });

  it.each(['./aide-spec.md', 'aide-spec.md'])(
    'resolves %s from the methodology index to the aide-spec route',
    (href) => {
      const resolution = resolveDocHref({ href, fromPath: methodologyIndex, routesByPath });

      expect(resolution).toEqual({ status: 'rewritten', href: '/docs/methodology/aide-spec/' });
    },
  );

  it('keeps the anchor when the link carries a fragment', () => {
    const resolution = resolveDocHref({
      href: '../../../.aide/docs/aide-spec.md#when-to-fill-body-sections--the-pipeline-test',
      fromPath: aideSkill,
      routesByPath,
    });

    expect(resolution).toEqual({
      status: 'rewritten',
      href: '/docs/methodology/aide-spec/#when-to-fill-body-sections--the-pipeline-test',
    });
  });

  it('keeps the query and the fragment, in that order', () => {
    const resolution = resolveDocHref({
      href: './Stop.md?v=2#usage',
      fromPath: hooksIndex,
      routesByPath,
    });

    expect(resolution).toEqual({ status: 'rewritten', href: '/docs/hooks/stop/?v=2#usage' });
  });
});

describe('resolveDocHref — untouched', () => {
  it.each([
    '',
    '#guarantees',
    '/docs/methodology/aide-spec/',
    'https://github.com/aidemd-mcp/server',
    'mailto:a@b.c',
    '//cdn.example.com/x.md',
    './diagram.png',
  ])('leaves %j as written', (href) => {
    const resolution = resolveDocHref({ href, fromPath: hooksIndex, routesByPath });

    expect(resolution).toEqual({ status: 'untouched' });
  });

  it('leaves a link with a malformed percent escape as written instead of throwing', () => {
    const resolution = resolveDocHref({ href: './Stop%.md', fromPath: hooksIndex, routesByPath });

    expect(resolution).toEqual({ status: 'untouched' });
  });
});

describe('resolveDocHref — missing', () => {
  it.each([
    ['./missing.md', hooksIndex, path.resolve('/repo', '.aide/reference/hooks/missing.md')],
    ['./stop.md', hooksIndex, path.resolve('/repo', '.aide/reference/hooks/stop.md')],
    [
      '../../.aide/docs/todo-aide.md',
      path.resolve('/repo', '.claude/commands/aide/fix.md'),
      path.resolve('/repo', '.claude/.aide/docs/todo-aide.md'),
    ],
  ])('reports %s as missing at its resolved path', (href, fromPath, resolvedPath) => {
    const resolution = resolveDocHref({ href, fromPath, routesByPath });

    expect(resolution).toEqual({ status: 'missing', resolvedPath });
  });
});
