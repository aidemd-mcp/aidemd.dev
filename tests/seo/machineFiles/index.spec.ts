import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import siteIdentity from '../../../src/data/siteIdentity';
import outDir from '../shared/outDir';

const DAY_MS = 24 * 60 * 60 * 1000;

const EXPECTED_ROBOTS = [
  'User-agent: *',
  'User-agent: Googlebot',
  'User-agent: Google-Extended',
  'User-agent: Bingbot',
  'User-agent: OAI-SearchBot',
  'User-agent: GPTBot',
  'User-agent: ChatGPT-User',
  'User-agent: ClaudeBot',
  'User-agent: Claude-SearchBot',
  'User-agent: Claude-User',
  'User-agent: PerplexityBot',
  'User-agent: Perplexity-User',
  'Content-Signal: search=yes, ai-input=yes, ai-train=yes',
  'Allow: /',
  '',
  'User-agent: Bytespider',
  'Disallow: /',
  '',
  'Sitemap: https://aidemd.dev/sitemap.xml',
  '',
].join('\n');

function collectHtmlFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

test('robots.txt is the crawler policy text', () => {
  expect(fs.readFileSync(path.join(outDir, 'robots.txt'), 'utf8')).toBe(EXPECTED_ROBOTS);
});

test('security.txt names the identity contact and expires more than 150 days ahead', () => {
  const text = fs.readFileSync(path.join(outDir, '.well-known', 'security.txt'), 'utf8');
  expect(/^Contact: (.*)$/m.exec(text)?.[1]).toBe(siteIdentity.securityContact);
  const expires = /^Expires: (.*)$/m.exec(text)?.[1];
  expect(expires, 'Expires line present').toBeTruthy();
  const daysAhead = (new Date(expires as string).getTime() - Date.now()) / DAY_MS;
  expect(daysAhead).toBeGreaterThan(150);
});

test.describe('machine files exist and are non-empty', () => {
  for (const file of [
    'feed.xml',
    'llms.txt',
    'llms-full.txt',
    'manifest.webmanifest',
    'og.png',
    'icon-512.png',
  ]) {
    test(file, () => {
      const full = path.join(outDir, file);
      expect(fs.existsSync(full), `${file} exists`).toBe(true);
      expect(fs.statSync(full).size, `${file} is non-empty`).toBeGreaterThan(0);
    });
  }
});

test('no built HTML names TetsuKodai or a personal LinkedIn profile', () => {
  const offenders: string[] = [];
  for (const file of collectHtmlFiles(outDir)) {
    const html = fs.readFileSync(file, 'utf8');
    for (const needle of ['TetsuKodai', 'tetsukod', 'linkedin.com/in/']) {
      if (html.includes(needle)) offenders.push(`${path.relative(outDir, file)}: ${needle}`);
    }
  }
  expect(offenders).toEqual([]);
});
