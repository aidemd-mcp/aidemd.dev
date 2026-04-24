import { describe, it, expect, vi, beforeAll } from 'vitest';

// ---------------------------------------------------------------------------
// Module-level mocks — hoisted before imports.
// ---------------------------------------------------------------------------

// node:fs/promises — intercept readFile so no real filesystem access occurs.
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}));

// @/service/docsRegistry — stub getDocMeta to avoid the registry filesystem walk.
vi.mock('@/service/docsRegistry', () => ({
  getDocMeta: vi.fn(),
}));

import { readFile } from 'node:fs/promises';
import { getDocMeta } from '@/service/docsRegistry';
import loadRouteGroups from './index';
import type { DocRegistry, DocRoute } from '@/types/docs';

const mockReadFile = vi.mocked(readFile);
const mockGetDocMeta = vi.mocked(getDocMeta);

// ---------------------------------------------------------------------------
// The canonical slug order from .aide/docs/index.md.
// index is prepended by loadMethodologySlugOrder; the rest come from the file.
// ---------------------------------------------------------------------------

const INDEX_MD_SLUGS_IN_ORDER = [
  'aide-spec',
  'aide-template',
  'plan-aide',
  'todo-aide',
  'progressive-disclosure',
  'agent-readable-code',
  'automated-qa',
  'cascading-alignment',
];

/** Simulated .aide/docs/index.md content with bullets in canonical order. */
const MOCK_INDEX_MD = `# AIDE Methodology Doc Hub

${INDEX_MD_SLUGS_IN_ORDER.map(s => `- [${s}.md](./${s}.md)`).join('\n')}
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRoute(section: DocRoute['section'], slug: string): DocRoute {
  const urlSegment =
    section === 'methodology' ? 'methodology' :
    section === 'commands'    ? 'commands'    :
    section === 'agents'      ? 'agents'      :
                                'skills';
  return {
    section,
    slug,
    title: slug,
    urlPath: `/docs/${urlSegment}/${slug}`,
    absPath: `/repo/.aide/docs/${slug}.md`,
    order: 0,
  };
}

/** Builds a minimal DocRegistry with the supplied routes. */
function makeRegistry(routes: DocRoute[]): DocRegistry {
  return {
    routes,
    getByKey: (key) => routes.find((r) => `${r.section}/${r.slug}` === key),
  };
}

// ---------------------------------------------------------------------------
// Set up mocks once before all tests.
// ---------------------------------------------------------------------------

beforeAll(() => {
  // readFile is called for .aide/docs/index.md — return the mock content.
  mockReadFile.mockResolvedValue(MOCK_INDEX_MD as unknown as Awaited<ReturnType<typeof readFile>>);

  // getDocMeta — return a trivial meta object keyed on the route's slug.
  mockGetDocMeta.mockImplementation(async (route) => ({
    title: route.slug,
    description: `Description for ${route.slug}.`,
  }));
});

// ---------------------------------------------------------------------------
// Fixtures — deliberately alphabetical order (what the registry produces
// before the canonical re-sort) so the test proves the re-sort fires.
// ---------------------------------------------------------------------------

const METHODOLOGY_SLUGS_ALPHA_ORDER = [
  'index',
  'agent-readable-code',   // alpha first
  'aide-spec',
  'aide-template',
  'automated-qa',
  'cascading-alignment',
  'plan-aide',
  'progressive-disclosure',
  'todo-aide',
];

const EXPECTED_METHODOLOGY_ORDER = [
  'index',
  'aide-spec',
  'aide-template',
  'plan-aide',
  'todo-aide',
  'progressive-disclosure',
  'agent-readable-code',
  'automated-qa',
  'cascading-alignment',
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('loadRouteGroups — Methodology section ordering', () => {
  it('emits methodology entries in the canonical .aide/docs/index.md order, not alphabetically', async () => {
    const methodologyRoutes = METHODOLOGY_SLUGS_ALPHA_ORDER.map((s) =>
      makeRoute('methodology', s),
    );
    const registry = makeRegistry(methodologyRoutes);

    const groups = await loadRouteGroups(registry);
    const methodologyGroup = groups.find((g) => g.section === 'methodology');
    expect(methodologyGroup).toBeDefined();

    const actualSlugs = methodologyGroup!.entries.map((e) => e.absoluteUrl.split('/').pop());
    expect(actualSlugs).toEqual(EXPECTED_METHODOLOGY_ORDER);
  });

  it('places index slug first regardless of its position in the alphabetical registry output', async () => {
    const routes = METHODOLOGY_SLUGS_ALPHA_ORDER.map((s) => makeRoute('methodology', s));
    const registry = makeRegistry(routes);

    const groups = await loadRouteGroups(registry);
    const methodologyGroup = groups.find((g) => g.section === 'methodology');

    const firstSlug = methodologyGroup!.entries[0].absoluteUrl.split('/').pop();
    expect(firstSlug).toBe('index');
  });

  it('routes not present in index.md sort after the known ordered entries', async () => {
    const unknownRoute = makeRoute('methodology', 'some-future-doc');
    const routes = [
      ...METHODOLOGY_SLUGS_ALPHA_ORDER.map((s) => makeRoute('methodology', s)),
      unknownRoute,
    ];
    const registry = makeRegistry(routes);

    const groups = await loadRouteGroups(registry);
    const methodologyGroup = groups.find((g) => g.section === 'methodology');
    const slugs = methodologyGroup!.entries.map((e) => e.absoluteUrl.split('/').pop());

    // All canonical slugs appear before the unknown one.
    const canonicalPositions = EXPECTED_METHODOLOGY_ORDER.map((s) => slugs.indexOf(s));
    const unknownPosition = slugs.indexOf('some-future-doc');
    expect(unknownPosition).toBeGreaterThan(Math.max(...canonicalPositions));
  });
});

describe('loadRouteGroups — non-Methodology sections keep registry order', () => {
  it('commands section preserves the registry order unchanged', async () => {
    // Registry order: index first then alphabetical is the registry's deterministic order.
    const commandRoutes = [
      makeRoute('commands', 'index'),
      makeRoute('commands', 'aide/align'),
      makeRoute('commands', 'aide/build'),
    ];
    const registry = makeRegistry(commandRoutes);

    const groups = await loadRouteGroups(registry);
    const commandsGroup = groups.find((g) => g.section === 'commands');
    expect(commandsGroup).toBeDefined();

    const slugs = commandsGroup!.entries.map((e) => e.absoluteUrl.split('/').pop());
    // Order must match the registry's input order exactly.
    expect(slugs).toEqual(['index', 'align', 'build']);
  });

  it('agents section preserves the registry order unchanged', async () => {
    const agentRoutes = [
      makeRoute('agents', 'index'),
      makeRoute('agents', 'aide-architect'),
      makeRoute('agents', 'aide-qa'),
    ];
    const registry = makeRegistry(agentRoutes);

    const groups = await loadRouteGroups(registry);
    const agentsGroup = groups.find((g) => g.section === 'agents');
    expect(agentsGroup).toBeDefined();

    const slugs = agentsGroup!.entries.map((e) => e.absoluteUrl.split('/').pop());
    expect(slugs).toEqual(['index', 'aide-architect', 'aide-qa']);
  });
});

describe('loadRouteGroups — link entry shape', () => {
  it('absolute URLs use the https://aidemd.dev origin', async () => {
    const routes = [makeRoute('methodology', 'aide-spec')];
    const registry = makeRegistry(routes);

    const groups = await loadRouteGroups(registry);
    const methodologyGroup = groups.find((g) => g.section === 'methodology');

    expect(methodologyGroup!.entries[0].absoluteUrl).toBe(
      'https://aidemd.dev/docs/methodology/aide-spec',
    );
  });

  it('description is trimmed to the first line', async () => {
    mockGetDocMeta.mockResolvedValueOnce({
      title: 'aide-spec',
      description: 'First line.\n\nSecond paragraph with examples.',
    });

    const routes = [makeRoute('methodology', 'aide-spec')];
    const registry = makeRegistry(routes);

    const groups = await loadRouteGroups(registry);
    const methodologyGroup = groups.find((g) => g.section === 'methodology');

    expect(methodologyGroup!.entries[0].description).toBe('First line.');
  });
});
