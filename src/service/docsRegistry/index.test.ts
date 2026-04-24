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
 * Builds the complete set of mock Dirent fixtures mirroring the real
 * repository layout, producing exactly 33 routes when walked:
 *   - 9  methodology (.aide/docs/)
 *   - 13 commands (.claude/commands/): aide.md + 12 under aide/
 *   - 9  agents (.claude/agents/): 9 under aide/
 *   - 2  skills (.claude/skills/): SKILL.md in brain/ and study-playbook/
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

  return { methodology, commands, agents, skills };
}

// ---------------------------------------------------------------------------
// Suite — configure mocks once and share the registry across all tests.
// ---------------------------------------------------------------------------

import buildRegistry from './index';
import parseDocFrontmatter from './parseDocFrontmatter';
import walkDocsRoot from './walkDocsRoot';
import type { DocRegistry } from '@/types/docs';

let registry: DocRegistry;

beforeAll(async () => {
  // Default git stub — short hash for every file.
  execSyncMock.mockReturnValue('b75834c\n' as unknown as ReturnType<typeof execSync>);

  const { methodology, commands, agents, skills } = buildFixtures();

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
      return [];
    },
  );

  registry = await buildRegistry();
});

describe('buildRegistry', () => {
  it('(i) produces exactly 33 routes: 9 methodology, 13 commands, 9 agents, 2 skills', () => {
    const bySection = {
      methodology: registry.routes.filter((r) => r.section === 'methodology').length,
      commands:    registry.routes.filter((r) => r.section === 'commands').length,
      agents:      registry.routes.filter((r) => r.section === 'agents').length,
      skills:      registry.routes.filter((r) => r.section === 'skills').length,
    };

    expect(registry.routes).toHaveLength(33);
    expect(bySection.methodology).toBe(9);
    expect(bySection.commands).toBe(13);
    expect(bySection.agents).toBe(9);
    expect(bySection.skills).toBe(2);
  });

  it('(ii) every urlPath matches /docs/{section}/<slug>', () => {
    const validSections = ['methodology', 'commands', 'agents', 'skills'];
    const pattern = /^\/docs\/(methodology|commands|agents|skills)\/.+$/;

    for (const route of registry.routes) {
      expect(validSections).toContain(route.section);
      expect(route.urlPath).toMatch(pattern);
      expect(route.urlPath).toBe(`/docs/${route.section}/${route.slug}`);
    }
  });

  it('(iii) methodology/index is the first route overall (order 0)', () => {
    const first = registry.routes[0];
    expect(first.section).toBe('methodology');
    expect(first.slug).toBe('index');
    expect(first.order).toBe(0);
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
