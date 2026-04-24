import { describe, it, expect } from 'vitest';
import llmsTxtConfig from './index';

describe('llmsTxtConfig', () => {
  it('returns the correct productName verbatim', () => {
    const config = llmsTxtConfig();
    expect(config.productName).toBe('AIDE — Autonomous Intent-Driven Engineering');
  });

  it('returns the correct origin verbatim', () => {
    const config = llmsTxtConfig();
    expect(config.origin).toBe('https://aidemd.dev');
  });

  it('returns the correct outputPath verbatim', () => {
    const config = llmsTxtConfig();
    expect(config.outputPath).toBe('/llms.txt');
  });

  it('returns a frozen object', () => {
    const config = llmsTxtConfig();
    expect(Object.isFrozen(config)).toBe(true);
  });

  it('throws when a property is mutated (frozen object guard)', () => {
    const config = llmsTxtConfig();
    expect(() => {
      'use strict';
      config.productName = 'Something Else';
    }).toThrow();
  });

  describe('brand-voice guard — preamble paragraphs must not contain forbidden words or characters', () => {
    const FORBIDDEN_PATTERNS = [
      { label: 'AIDEY',          re: /AIDEY/i },
      { label: ' AID ',          re: / AID / },
      { label: '!',              re: /!/  },
      { label: 'seamless',       re: /seamless/i },
      { label: 'revolutionary',  re: /revolutionary/i },
      { label: 'cutting-edge',   re: /cutting-edge/i },
      { label: 'game-changing',  re: /game-changing/i },
    ];

    const PREAMBLE_FIELDS = ['overview', 'whyItMatters', 'gettingStarted'] as const;

    for (const { label, re } of FORBIDDEN_PATTERNS) {
      it(`preamble paragraphs do not contain "${label}"`, () => {
        const config = llmsTxtConfig();
        for (const field of PREAMBLE_FIELDS) {
          expect(config[field], `field "${field}" must not contain "${label}"`).not.toMatch(re);
        }
      });
    }
  });
});
