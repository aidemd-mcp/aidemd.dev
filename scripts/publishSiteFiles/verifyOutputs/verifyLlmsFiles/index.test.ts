import { describe, expect, it } from 'vitest';
import type { SitePage } from '@/types/sitePage';
import verifyLlmsFiles from './index';

function makePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/',
    title: 'Home',
    description: 'Home page',
    kind: 'home',
    ogImage: '/og.png',
    breadcrumb: [],
    ...overrides,
  };
}

const pages: SitePage[] = [
  makePage(),
  makePage({ urlPath: '/docs/hooks/', kind: 'docsSection' }),
  makePage({ urlPath: '/docs/hooks/stop/', kind: 'doc' }),
  makePage({ urlPath: '/learn/', kind: 'learnIndex' }),
  makePage({ urlPath: '/learn/intent/', kind: 'learn' }),
  makePage({ urlPath: '/observer/', kind: 'observer' }),
  makePage({ urlPath: '/brain/', kind: 'brain' }),
  makePage({ urlPath: '/privacy/', kind: 'privacy' }),
];

const links = [
  '- [Hooks](https://aidemd.dev/docs/hooks/)',
  '- [Stop](https://aidemd.dev/docs/hooks/stop/): the stop hook',
  '- [Learn](https://aidemd.dev/learn/)',
  '- [Intent](https://aidemd.dev/learn/intent/)',
  '- [Observer](https://aidemd.dev/observer/)',
  '- [Brain](https://aidemd.dev/brain/)',
];
const llmsTxt = `# AIDE\n\n## Docs\n${links.join('\n')}\n`;
const llmsFullTxt =
  '# AIDE\n\n# Stop\nSource: https://aidemd.dev/docs/hooks/stop/\n\nbody\n\n# Intent\nSource: https://aidemd.dev/learn/intent/\n\nbody\n';

const run = (overrides: Partial<{ llmsTxt: string; llmsFullTxt: string }> = {}) =>
  verifyLlmsFiles({ llmsTxt, llmsFullTxt, pages, ...overrides });

describe('verifyLlmsFiles', () => {
  it('passes a clean pair', () => {
    expect(() => run()).not.toThrow();
  });

  it.each([
    ['missing link', { llmsTxt: llmsTxt.replace('- [Brain](https://aidemd.dev/brain/)', '') }, 'llms.txt: does not link to https://aidemd.dev/brain/'],
    ['extra link', { llmsTxt: `${llmsTxt}- [Priv](https://aidemd.dev/privacy/)\n` }, 'llms.txt: links to https://aidemd.dev/privacy/'],
    ['.md link', { llmsTxt: `${llmsTxt}- [Raw](https://aidemd.dev/docs/hooks/stop.md)\n` }, 'llms.txt: links to a markdown address'],
    ['missing Source', { llmsFullTxt: llmsFullTxt.replace('Source: https://aidemd.dev/learn/intent/', '') }, 'llms-full.txt: has no "Source: https://aidemd.dev/learn/intent/"'],
    ['extra Source', { llmsFullTxt: `${llmsFullTxt}\n# Home\nSource: https://aidemd.dev/\n` }, 'llms-full.txt: has "Source: https://aidemd.dev/"'],
    ['repeated Source', { llmsFullTxt: `${llmsFullTxt}\nSource: https://aidemd.dev/docs/hooks/stop/\n` }, 'llms-full.txt: has more than one'],
    ['empty llms.txt', { llmsTxt: '' }, 'llms.txt: is empty'],
    ['empty llms-full.txt', { llmsFullTxt: '  \n' }, 'llms-full.txt: is empty'],
    ['no heading', { llmsTxt: 'plain\n' }, 'llms.txt: does not start with "# "'],
  ])('throws on %s', (_name, overrides, message) => {
    expect(() => run(overrides)).toThrow(`publishSiteFiles: ${message}`);
  });
});
