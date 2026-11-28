import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import listBuiltPages from '../shared/listBuiltPages';
import resolveOutFile from '../shared/resolveOutFile';

const ORIGIN = 'https://aidemd.dev';

for (const urlPath of listBuiltPages()) {
  test(`canonical and share tags: ${urlPath}`, async ({ page }) => {
    await page.goto(urlPath);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical, `${urlPath}: exactly one canonical`).toHaveCount(1);
    await expect(canonical, `${urlPath}: canonical equals origin + path`).toHaveAttribute(
      'href',
      `${ORIGIN}${urlPath}`,
    );

    await expect(
      page.locator('meta[property="og:url"]'),
      `${urlPath}: og:url equals canonical`,
    ).toHaveAttribute('content', `${ORIGIN}${urlPath}`);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage, `${urlPath}: og:image present`).toHaveCount(1);
    const imageUrl = await ogImage.getAttribute('content');
    expect(imageUrl, `${urlPath}: og:image has a value`).toBeTruthy();
    expect(
      fs.existsSync(resolveOutFile(imageUrl as string)),
      `${urlPath}: og:image ${imageUrl} exists under out/`,
    ).toBe(true);

    const markdownHrefs = await page
      .locator('link[rel="alternate"][type="text/markdown"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    for (const href of markdownHrefs) {
      const file = resolveOutFile(href);
      expect(fs.existsSync(file), `${urlPath}: markdown alternate ${href} exists under out/`).toBe(true);
      expect(fs.statSync(file).size, `${urlPath}: markdown alternate ${href} is non-empty`).toBeGreaterThan(0);
    }

    await expect(
      page.locator('link[rel="alternate"][type="application/atom+xml"]'),
      `${urlPath}: atom feed alternate present`,
    ).not.toHaveCount(0);
  });
}
