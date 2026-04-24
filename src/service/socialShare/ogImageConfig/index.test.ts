import { describe, it, expect } from 'vitest';
import ogImageConfig from './index';

describe('ogImageConfig', () => {
  it('(a) returns the spec-mandated title', () => {
    const config = ogImageConfig();
    expect(config.title).toBe('AIDEMD.DEV — intent is the source');
  });

  it('(b) returns the spec-mandated description', () => {
    const config = ogImageConfig();
    expect(config.description).toBe(
      'A byte-faithful record of the .aide methodology. Every .aide is a contract — scope, outcomes, guardrails — that cascades through your stack.',
    );
  });

  it('(c) returns the spec-mandated siteName', () => {
    const config = ogImageConfig();
    expect(config.siteName).toBe('AIDEMD.DEV');
  });

  it('(d) returns the spec-mandated url', () => {
    const config = ogImageConfig();
    expect(config.url).toBe('https://aidemd.dev/');
  });

  it('(e) returns the spec-mandated imageUrl', () => {
    const config = ogImageConfig();
    expect(config.imageUrl).toBe('https://aidemd.dev/og.png');
  });

  it('(f) returns the spec-mandated imagePath', () => {
    const config = ogImageConfig();
    expect(config.imagePath).toBe('/og.png');
  });

  it('(g) returns the spec-mandated alt', () => {
    const config = ogImageConfig();
    expect(config.alt).toBe(
      "Expo, the AIDEMD mascot, waving next to the tagline 'intent is the source.'",
    );
  });

  it('(h) width === 1200', () => {
    const config = ogImageConfig();
    expect(config.width).toBe(1200);
  });

  it('(i) height === 630', () => {
    const config = ogImageConfig();
    expect(config.height).toBe(630);
  });

  it('(j) alt contains the substring "Expo"', () => {
    const config = ogImageConfig();
    expect(config.alt).toContain('Expo');
  });

  it('(k) alt does NOT contain "Aidey" (abandoned-name prohibition, case-sensitive)', () => {
    const config = ogImageConfig();
    expect(config.alt).not.toMatch(/Aidey/);
  });

  it('(l) alt does NOT contain " AID " (abandoned-name prohibition, case-sensitive)', () => {
    const config = ogImageConfig();
    expect(config.alt).not.toMatch(/ AID /);
  });

  it('(m) returned object is frozen — repeated calls return frozen references', () => {
    const first = ogImageConfig();
    const second = ogImageConfig();
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(second)).toBe(true);
  });
});
