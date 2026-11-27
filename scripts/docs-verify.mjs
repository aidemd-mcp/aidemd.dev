#!/usr/bin/env node
/**
 * docs-verify.mjs
 *
 * Dynamic-imports the docs registry and prints a table of
 * (section, slug, urlPath, commit) for human diffing against
 * `ls -R .aide/docs .claude/commands .claude/agents .claude/skills .aide/reference/tools .aide/reference/hooks`.
 *
 * Usage: npm run docs:verify
 */

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { execSync } from 'node:child_process';

// ── Resolve commit hash for a given absolute file path ──────────────────────

function resolveCommit(absPath) {
  try {
    const hash = execSync(
      `git log -1 --format=%h -- ${JSON.stringify(absPath)}`,
      { encoding: 'utf8' },
    ).trim();
    return hash.length > 0 ? hash : 'uncommitted';
  } catch {
    return 'uncommitted';
  }
}

// ── Walk a single content root ───────────────────────────────────────────────

import { readdir } from 'node:fs/promises';

async function walkRoot({ section, urlSegment, absRoot }) {
  let entries;
  try {
    entries = await readdir(absRoot, { recursive: true, withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .filter((d) => d.isFile() && d.name.endsWith('.md'))
    .map((d) => {
      const dir = d.parentPath ?? d.path ?? absRoot;
      const absPath = path.join(dir, d.name);
      const rel = path.relative(absRoot, absPath);
      const slug = rel.replace(/\\/g, '/').replace(/\.md$/, '');
      return {
        section,
        slug,
        urlPath: `/docs/${urlSegment}/${slug.toLowerCase()}`,
        absPath,
        commit: resolveCommit(absPath),
        order: 0,
      };
    });
}

// ── Order routes ─────────────────────────────────────────────────────────────

const SECTION_PRIORITY = {
  methodology: 0,
  commands: 1,
  agents: 2,
  skills: 3,
  tools: 4,
  hooks: 5,
};

function orderRoutes(routes) {
  routes.sort((a, b) => {
    const ap = SECTION_PRIORITY[a.section] ?? 99;
    const bp = SECTION_PRIORITY[b.section] ?? 99;
    if (ap !== bp) return ap - bp;
    const ai = a.slug === 'index' ? 0 : 1;
    const bi = b.slug === 'index' ? 0 : 1;
    if (ai !== bi) return ai - bi;
    return a.urlPath.localeCompare(b.urlPath);
  });
  routes.forEach((r, i) => { r.order = i; });
  return routes;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const cwd = process.cwd();

const CATEGORIES = [
  { section: 'methodology', urlSegment: 'methodology', absRoot: path.resolve(cwd, '.aide/docs') },
  { section: 'commands',    urlSegment: 'commands',    absRoot: path.resolve(cwd, '.claude/commands') },
  { section: 'agents',      urlSegment: 'agents',      absRoot: path.resolve(cwd, '.claude/agents') },
  { section: 'skills',      urlSegment: 'skills',      absRoot: path.resolve(cwd, '.claude/skills') },
  { section: 'tools',       urlSegment: 'tools',       absRoot: path.resolve(cwd, '.aide/reference/tools') },
  { section: 'hooks',       urlSegment: 'hooks',       absRoot: path.resolve(cwd, '.aide/reference/hooks') },
];

const allNested = await Promise.all(CATEGORIES.map(walkRoot));
const routes = orderRoutes(allNested.flat());

// ── Print table ───────────────────────────────────────────────────────────────

const COL = {
  order:   5,
  section: 12,
  slug:    40,
  urlPath: 55,
  commit:  12,
};

function pad(str, len) {
  return String(str).padEnd(len).slice(0, len);
}

const header = [
  pad('#',       COL.order),
  pad('section', COL.section),
  pad('slug',    COL.slug),
  pad('urlPath', COL.urlPath),
  pad('commit',  COL.commit),
].join('  ');

const divider = '-'.repeat(header.length);

console.log('\ndocs registry — ' + routes.length + ' routes total\n');
console.log(header);
console.log(divider);

for (const r of routes) {
  console.log([
    pad(r.order,   COL.order),
    pad(r.section, COL.section),
    pad(r.slug,    COL.slug),
    pad(r.urlPath, COL.urlPath),
    pad(r.commit,  COL.commit),
  ].join('  '));
}

console.log(divider);

const breakdown = CATEGORIES
  .map(({ section }) => `${section}=${routes.filter((r) => r.section === section).length}`)
  .join('  ');

console.log(`\nBreakdown: ${breakdown}`);
console.log(`Total: ${routes.length}\n`);
