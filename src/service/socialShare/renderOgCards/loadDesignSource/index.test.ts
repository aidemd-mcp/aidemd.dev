import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

const socialShareDir = path.resolve(__dirname, '..', '..');
const designHtml = readFileSync(
  path.join(socialShareDir, 'design', 'design.html'),
  'utf8',
);
const fitTitleSource = readFileSync(
  path.join(socialShareDir, 'renderOgCards', 'fitTitle', 'index.ts'),
  'utf8',
);

describe('design.html — cards and slots', () => {
  it.each([
    'id="og"',
    'id="og-page"',
    'data-slot="title"',
    'data-slot="section"',
    'data-slot="section-row"',
    'data-slot="path"',
  ])('contains %s', (marker) => {
    expect(designHtml).toContain(marker);
  });

  it('carries the site card copyright line', () => {
    expect(designHtml).toContain('© 2026 Lowmeadow LLC');
  });
});

describe('design.html — fonts', () => {
  const faces = [...designHtml.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(
    (match) => match[1],
  );

  it('declares exactly four @font-face rules', () => {
    expect(faces).toHaveLength(4);
  });

  it.each([
    [400, 'Regular'],
    [500, 'Medium'],
    [600, 'SemiBold'],
    [700, 'Bold'],
  ])('declares weight %i from the local %s file with font-display: block', (weight, file) => {
    const face = faces.find((body) => new RegExp(`font-weight:\\s*${weight}\\s*;`).test(body));
    expect(face).toBeDefined();
    expect(face).toContain(`url('./fonts/JetBrainsMono-${file}.woff2')`);
    expect(face).toMatch(/font-display:\s*block\s*;/);
  });
});

describe('design.html — no network loads', () => {
  it.each([
    ['<link', /<link/i],
    ['<script src', /<script[^>]*\ssrc=/i],
    ['url(http', /url\(\s*['"]?https?:/i],
    ['src="http', /\ssrc=["']https?:/i],
  ])('contains no %s', (_label, pattern) => {
    expect(designHtml).not.toMatch(pattern);
  });
});

describe('design.html — title metrics', () => {
  it('sets the page title line-height to the value fitTitle measures with', () => {
    const rule = designHtml.match(/\.page-title\s*\{([^}]*)\}/);
    expect(rule).not.toBeNull();
    const cssLineHeight = rule![1].match(/line-height:\s*([\d.]+)\s*;/);
    const constant = fitTitleSource.match(/const LINE_HEIGHT = ([\d.]+);/);
    expect(cssLineHeight?.[1]).toBe('1.08');
    expect(constant?.[1]).toBe(cssLineHeight?.[1]);
  });

  it('lets the title track shrink to zero so an unbreakable word overflows the title box instead of widening it', () => {
    const rule = designHtml.match(/\.page-stage\s*\{([^}]*)\}/);
    expect(rule).not.toBeNull();
    const columns = rule![1].match(/grid-template-columns:\s*([^;]+);/);
    expect(columns?.[1].trim()).toBe('minmax(0, 1fr) 300px');
  });
});

describe('design.html — forbidden names', () => {
  it.each([/Aidey/, /AIDEY/, /\bAID\b/, /tetsukod/i])('does not match %s', (pattern) => {
    expect(designHtml).not.toMatch(pattern);
  });
});
