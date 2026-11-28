import { writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

export default async function auditPage({ url, outFile }) {
  const chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox'],
  });
  try {
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        output: 'json',
        onlyCategories: CATEGORIES,
        formFactor: 'desktop',
        screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
      },
      desktopConfig,
    );
    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(outFile, result.report);
    return Object.fromEntries(
      CATEGORIES.map((id) => [id, result.lhr.categories[id].score]),
    );
  } finally {
    await chrome.kill();
  }
}
