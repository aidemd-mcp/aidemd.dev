import { describe, expect, it } from 'vitest';
import richRecordSlugs from './index';

describe('richRecordSlugs', () => {
  it('lists exactly the definition page and the SDLC page, in that order', () => {
    expect(richRecordSlugs).toEqual([
      'intent-driven-engineering',
      'open-source-agentic-sdlc-framework',
    ]);
  });
});
