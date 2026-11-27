import { describe, it, expect, vi, beforeAll } from 'vitest';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Module-level mocks
// vi.mock calls are hoisted by Vitest before any imports. The factory runs
// once and returns mock implementations that we configure in beforeAll.
// ---------------------------------------------------------------------------

vi.mock('node:fs/promises', () => ({
  readdir: vi.fn(),
  readFile: vi.fn().mockResolvedValue('# Title\n\nBody text.'),
}));

vi.mock('node:child_process', () => ({
  execSync: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Import mocked modules to configure them.
// ---------------------------------------------------------------------------

import { readdir, readFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';

const readdirMock = vi.mocked(readdir);
const execSyncMock = vi.mocked(execSync);
// readFile mock is already set up in the factory (returns '# Title\n\nBody text.')
vi.mocked(readFile);

// ---------------------------------------------------------------------------
// Helpers — fixture data
// ---------------------------------------------------------------------------

/** Creates a minimal mock Dirent for a file entry. */
function fileDirent(name: string, parentPath: string): object {
  return {
    // @types/node types Dirent.name as Buffer in the generic variant; at
    // runtime it is always a string. Cast through object to avoid
    // incompatible generic parameter errors in the test.
    name,
    parentPath,
    isFile: () => true,
    isDirectory: () => false,
  };
}

/**
 * Builds the complete set of mock Dirent fixtures, one group per content root:
 *   - methodology (.aide/docs/): flat reference pages including index.md
 *   - commands (.claude/commands/): a top-level page plus nested pages under aide/
 *   - agents (.claude/agents/): nested pages under aide/
 *   - skills (.claude/skills/): SKILL.md in subfolders (mixed-case file names)
 *   - tools (.aide/reference/tools/): reference pages with underscores in their
 *     names, listed out of order on purpose
 *   - hooks (.aide/reference/hooks/): mixed-case reference pages (Stop,
 *     SessionStart), listed out of order on purpose
 *
 * Uses path.resolve(process.cwd(), absRoot) so that parentPath values align
 * with the absRoot that walkDocsRoot receives — required for path.relative()
 * to produce correct slugs on both Windows and POSIX.
 */
function buildFixtures() {
  const cwd = process.cwd();
  const roots = {
    methodology: path.resolve(cwd, '.aide/docs'),
    commands:    path.resolve(cwd, '.claude/commands'),
    agents:      path.resolve(cwd, '.claude/agents'),
    skills:      path.resolve(cwd, '.claude/skills'),
    tools:       path.resolve(cwd, '.aide/reference/tools'),
    hooks:       path.resolve(cwd, '.aide/reference/hooks'),
  };

  const methodology = [
    'index.md', 'aide-spec.md', 'aide-template.md', 'automated-qa.md',
    'cascading-alignment.md', 'plan-aide.md', 'progressive-disclosure.md',
    'todo-aide.md', 'agent-readable-code.md',
  ].map((name) => fileDirent(name, roots.methodology));

  const commands = [
    fileDirent('aide.md', roots.commands),
    ...['align.md', 'build.md', 'fix.md', 'init.md', 'plan.md', 'qa.md',
      'refactor.md', 'research.md', 'spec.md', 'synthesize.md',
      'update-playbook.md', 'upgrade.md',
    ].map((name) => fileDirent(name, path.join(roots.commands, 'aide'))),
  ];

  const agents = [
    'aide-aligner.md', 'aide-architect.md', 'aide-auditor.md',
    'aide-domain-expert.md', 'aide-explorer.md', 'aide-implementor.md',
    'aide-qa.md', 'aide-spec-writer.md', 'aide-strategist.md',
  ].map((name) => fileDirent(name, path.join(roots.agents, 'aide')));

  const skills = [
    fileDirent('SKILL.md', path.join(roots.skills, 'brain')),
    fileDirent('SKILL.md', path.join(roots.skills, 'study-playbook')),
  ];

  const tools = ['index.md', 'aide_read.md', 'aide_observer_start.md']
    .map((name) => fileDirent(name, roots.tools));

  const hooks = ['index.md', 'Stop.md', 'SessionStart.md']
    .map((name) => fileDirent(name, roots.hooks));

  return { methodology, commands, agents, skills, tools, hooks };
}

// ---------------------------------------------------------------------------
// Suite — configure mocks once and share the registry across all tests.
// ---------------------------------------------------------------------------

import buildRegistry from './index';
import parseDocFrontmatter from './parseDocFrontmatter';
import walkDocsRoot from './walkDocsRoot';
import { DOCS_CATEGORIES } from '@/data/docsCategories';
import type { DocRegistry } from '@/types/docs';

let registry: DocRegistry;
let fixtures: ReturnType<typeof buildFixtures>;

beforeAll(async () => {
  // Default git stub — short hash for every file.
  execSyncMock.mockReturnValue('b75834c\n' as unknown as ReturnType<typeof execSync>);

  fixtures = buildFixtures();
  const { methodology, commands, agents, skills, tools, hooks } = fixtures;

  readdirMock.mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (dirPath: any, _options?: any): Promise<any> => {
      // Normalise to forward slashes so the match works on both Windows and
      // POSIX — path.resolve() returns OS-native separators.
      const p = String(dirPath).replace(/\\/g, '/');
      if (p.includes('.aide/docs'))       return methodology;
      if (p.includes('.claude/commands')) return commands;
      if (p.includes('.claude/agents'))   return agents;
      if (p.includes('.claude/skills'))   return skills;
      if (p.includes('.aide/reference/tools')) return tools;
      if (p.includes('.aide/reference/hooks')) return hooks;
      return [];
    },
  );

  registry = await buildRegistry();
});

describe('buildRegistry', () => {
  it('(i) produces one route per fixture file in every section', () => {
    const countBySection = (section: string) =>
      registry.routes.filter((r) => r.section === section).length;

    expect(countBySection('methodology')).toBe(fixtures.methodology.length);
    expect(countBySection('commands')).toBe(fixtures.commands.length);
    expect(countBySection('agents')).toBe(fixtures.agents.length);
    expect(countBySection('skills')).toBe(fixtures.skills.length);
    expect(countBySection('tools')).toBe(fixtures.tools.length);
    expect(countBySection('hooks')).toBe(fixtures.hooks.length);

    const total = Object.values(fixtures).reduce((sum, group) => sum + group.length, 0);
    expect(registry.routes).toHaveLength(total);

    for (const category of DOCS_CATEGORIES) {
      expect(countBySection(category.section)).toBeGreaterThan(0);
    }
  });

  it('(ii) every urlPath is the lowercased /docs/{section}/<slug>', () => {
    const validSections = DOCS_CATEGORIES.map((c) => c.section);
    const pattern = /^\/docs\/(methodology|commands|agents|skills|tools|hooks)\/.+$/;

    for (const route of registry.routes) {
      expect(validSections).toContain(route.section);
      expect(route.urlPath).toMatch(pattern);
      expect(route.urlPath).toBe(route.urlPath.toLowerCase());
      expect(route.urlPath).toBe(`/docs/${route.section}/${route.slug.toLowerCase()}`);
    }
  });

  it('(iii) methodology/index is the first route overall (order 0)', () => {
    const first = registry.routes[0];
    expect(first.section).toBe('methodology');
    expect(first.slug).toBe('index');
    expect(first.order).toBe(0);
  });

  it('(vi) sections appear in DOCS_CATEGORIES order', () => {
    const sequence = registry.routes
      .map((r) => r.section)
      .filter((section, i, all) => i === 0 || section !== all[i - 1]);

    expect(sequence).toEqual(['methodology', 'commands', 'agents', 'skills', 'tools', 'hooks']);
  });

  it('(vii) routes order index first, then by lowercased urlPath', () => {
    const slugsIn = (section: string) =>
      registry.routes.filter((r) => r.section === section).map((r) => r.slug);

    expect(slugsIn('tools')).toEqual(['index', 'aide_observer_start', 'aide_read']);
    expect(slugsIn('hooks')).toEqual(['index', 'SessionStart', 'Stop']);
  });

  it('(viii) slugs keep the file case while urlPaths are lowercase', () => {
    const stop = registry.routes.find((r) => r.section === 'hooks' && r.slug === 'Stop');
    expect(stop).toBeDefined();
    expect(stop!.urlPath).toBe('/docs/hooks/stop');
    expect(stop!.absPath.replace(/\\/g, '/').endsWith('.aide/reference/hooks/Stop.md')).toBe(true);

    const brainSkill = registry.routes.find(
      (r) => r.section === 'skills' && r.slug === 'brain/SKILL',
    );
    expect(brainSkill).toBeDefined();
    expect(brainSkill!.urlPath).toBe('/docs/skills/brain/skill');
  });

  it('(ix) getByKey matches case-insensitively on section/slug', () => {
    expect(registry.getByKey('hooks/index')?.urlPath).toBe('/docs/hooks/index');

    const stop = registry.routes.find((r) => r.slug === 'Stop');
    expect(registry.getByKey('hooks/stop')).toBe(stop);
    expect(registry.getByKey('hooks/Stop')).toBe(stop);

    expect(registry.getByKey('tools/aide_read')?.urlPath).toBe('/docs/tools/aide_read');
    expect(registry.getByKey('hooks/missing')).toBeUndefined();
  });

  it('(iii-b) every route carries a commit hash or the "uncommitted" sentinel', () => {
    for (const route of registry.routes) {
      // The registry populates commit hashes lazily via renderDoc, not buildRegistry.
      // This assertion confirms the registry produces DocRoute objects with the
      // expected shape — absPath must be a non-empty string so renderDoc can resolve it.
      expect(typeof route.absPath).toBe('string');
      expect(route.absPath.length).toBeGreaterThan(0);
    }
  });

  it('(iv) resolveCommitHash returns "uncommitted" when git stdout is empty', async () => {
    // Override the stub to return empty stdout for this specific assertion.
    // resolveCommitHash has an internal Map cache keyed on absPath; use a
    // path that has never been resolved in this process to bypass the cache.
    execSyncMock.mockReturnValueOnce('' as unknown as ReturnType<typeof execSync>);

    const { default: resolveCommitHash } = await import('./resolveCommitHash');
    const result = resolveCommitHash('/never-seen-before/path/for-iv-test.md');
    expect(result).toBe('uncommitted');
  });
});

// ---------------------------------------------------------------------------
// Suite — parseDocFrontmatter: files with and without frontmatter (plan 13b-iv)
// ---------------------------------------------------------------------------

describe('parseDocFrontmatter', () => {
  it('(iv-a) returns the YAML title when a frontmatter block is present', () => {
    const raw = '---\ntitle: Foo Bar\n---\nSome body text.';
    const { frontmatter, body } = parseDocFrontmatter(raw, 'some/slug');

    expect(frontmatter.title).toBe('Foo Bar');
    // The body should not contain the frontmatter delimiters.
    expect(body).not.toContain('---');
    expect(body).toContain('Some body text.');
  });

  it('(iv-b) synthesizes a title from the first H1 when no frontmatter is present', () => {
    const raw = '# My Heading\n\nBody paragraph.';
    const { frontmatter, body } = parseDocFrontmatter(raw, 'fallback-slug');

    // Title must be derived from the H1, not the slug.
    expect(frontmatter.title).toBe('My Heading');
    // The H1 line is stripped from the body so DocsTemplate does not double-render it.
    expect(body).not.toContain('# My Heading');
    expect(body).toContain('Body paragraph.');
  });

  it('(iv-c) falls back to the slug when there is neither frontmatter nor an H1', () => {
    const raw = 'Plain prose without a heading.';
    const { frontmatter, body } = parseDocFrontmatter(raw, 'my-slug');

    expect(frontmatter.title).toBe('my-slug');
    expect(body).toBe(raw);
  });

  // Regression: gray-matter leaves a leading \n (sometimes \n\n) before the
  // body when a frontmatter block is present. The old stripFirstH1 regex used
  // /^#\s+.+\n?/ without the `m` flag, so `^` only matched position 0 of the
  // string — never the `#` that followed the leading newline. Both SKILL.md
  // files (brain, study-playbook) hit this path: they have non-title frontmatter
  // keys (name, description) and bodies that begin with `\n# Heading`, causing a
  // duplicate H1 in DocsTemplate. The fix adds the `m` flag so `^` matches any
  // line start. This test FAILS against the old regex and PASSES with the fix.
  it('(iv-d) strips the H1 from body when frontmatter is present but has no title key (SKILL.md shape)', () => {
    // Simulate what gray-matter returns for a SKILL.md file: frontmatter has
    // name/description but no title, and content begins with a leading \n
    // before the first heading (as gray-matter inserts it).
    const raw = '---\nname: study-playbook\ndescription: Load playbook context\n---\n\n# /study-playbook — Load Coding Playbook Context\n\nSome body content.';
    const { frontmatter, body } = parseDocFrontmatter(raw, 'skills/study-playbook/SKILL');

    // Title should be derived from the H1.
    expect(frontmatter.title).toBe('/study-playbook — Load Coding Playbook Context');
    // The H1 must NOT appear in the body — DocsTemplate renders its own <h1>.
    // Before the fix, body still contained the # line, causing a double H1 in the page.
    expect(body).not.toContain('# /study-playbook');
    expect(body).toContain('Some body content.');
  });
});

// ---------------------------------------------------------------------------
// Suite — walkDocsRoot: nested slug derivation (plan 13b-v)
// ---------------------------------------------------------------------------

describe('walkDocsRoot — nested slug derivation', () => {
  it('(v) derives a forward-slash slug for deeply nested files (.claude/commands/aide/build.md → aide/build)', async () => {
    const cwd = process.cwd();
    const absRoot = path.resolve(cwd, '.claude/commands');

    // Override readdir for this test — return only the nested aide/build.md file.
    const nestedParent = path.join(absRoot, 'aide');
    readdirMock.mockResolvedValueOnce([
      fileDirent('build.md', nestedParent),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any);

    const routes = await walkDocsRoot({
      section: 'commands',
      urlSegment: 'commands',
      absRoot,
    });

    expect(routes).toHaveLength(1);
    // Slug must use forward slashes even on Windows.
    expect(routes[0]!.slug).toBe('aide/build');
    expect(routes[0]!.urlPath).toBe('/docs/commands/aide/build');
  });
});
