import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import listBuiltPages from '../shared/listBuiltPages';
import outDir from '../shared/outDir';
import readCanonicalUrl from '../shared/readCanonicalUrl';
import resolveOutFile from '../shared/resolveOutFile';

const sitemap = fs.readFileSync(path.join(outDir, 'sitemap.xml'), 'utf8');
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => ({
  loc: /<loc>([^<]*)<\/loc>/.exec(match[1])?.[1] ?? '',
  lastmod: /<lastmod>([^<]*)<\/lastmod>/.exec(match[1])?.[1],
}));

test('sitemap <loc> set equals the canonical set of the built pages', () => {
  const canonicals = listBuiltPages().map(readCanonicalUrl).sort();
  const locs = entries.map((entry) => entry.loc).sort();
  expect(locs).toEqual(canonicals);
});

test('sitemap carries no priority or changefreq', () => {
  expect(sitemap).not.toContain('<priority>');
  expect(sitemap).not.toContain('<changefreq>');
});

/** A doc page is any /docs/ URL except /docs/ and the section indexes (exactly one segment after /docs/); a learn page is any /learn/ URL except /learn/. */
function isDocOrLearn(loc: string): boolean {
  const pathname = new URL(loc).pathname;
  if (pathname.startsWith('/learn/')) return pathname !== '/learn/';
  if (!pathname.startsWith('/docs/') || pathname === '/docs/') return false;
  return pathname.split('/').filter(Boolean).length > 2;
}

test('every sitemap URL that carries lastmod is a doc or learn URL', () => {
  const offenders = entries.filter((entry) => entry.lastmod !== undefined && !isDocOrLearn(entry.loc));
  expect(offenders.map((entry) => entry.loc)).toEqual([]);
});

test('a doc or learn URL lacks lastmod only when its built page has no <time dateTime>', () => {
  const offenders = entries
    .filter((entry) => isDocOrLearn(entry.loc) && entry.lastmod === undefined)
    .filter((entry) => {
      const html = fs.readFileSync(resolveOutFile(entry.loc), 'utf8');
      return /<time[^>]*\bdateTime="/.test(html);
    });
  expect(offenders.map((entry) => entry.loc)).toEqual([]);
});

test('a doc or learn URL lastmod names the same calendar day as its built <time dateTime>', () => {
  const offenders = entries
    .filter((entry) => isDocOrLearn(entry.loc) && entry.lastmod !== undefined)
    .filter((entry) => {
      const html = fs.readFileSync(resolveOutFile(entry.loc), 'utf8');
      const visible = /<time[^>]*\bdateTime="([^"]*)"/.exec(html)?.[1];
      return visible === undefined || visible.slice(0, 10) !== (entry.lastmod as string).slice(0, 10);
    });
  expect(offenders.map((entry) => entry.loc)).toEqual([]);
});
