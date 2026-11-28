import type { Page } from '@playwright/test';

export type JsonLdNode = Record<string, unknown> & { '@type': string };

/** Every node of every `application/ld+json` script on the page, `@graph` members flattened in. */
export default async function readJsonLd(page: Page): Promise<JsonLdNode[]> {
  const bodies = await page.locator('script[type="application/ld+json"]').allTextContents();
  return bodies.flatMap((body) => {
    const parsed = JSON.parse(body) as JsonLdNode & { '@graph'?: JsonLdNode[] };
    return parsed['@graph'] ?? [parsed];
  });
}
