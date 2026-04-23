[![AIDE](https://img.shields.io/badge/AIDE-intent--driven-0D9488?style=flat&logo=markdown&logoColor=white)](https://github.com/aidemd-mcp/server)

# Aidemd.dev

Marketing landing + canonical docs site for the AIDE methodology and the `@aidemd-mcp/server` package. Statically exported via Next.js and deployed as the authoritative public reference.

## Development

```bash
npm install
npm run dev          # starts on port 3001
npm run build        # static export → out/
npm run preview      # build + serve out/ on port 4321
```

## Testing

```bash
npm run test:unit    # Vitest unit tests (service + lib)
npm run test:visual  # Playwright visual regression tests at 1440px
```

## Visual regression

Pixel-fidelity gate enforcing the Terminal design at 1440px desktop viewport. Three golden PNGs live in `tests/visual/` and are committed to the repo. Every PR must pass them within the configured threshold (`maxDiffPixelRatio: 0.005`).

**Run the suite:**

```bash
npm run test:visual
```

Playwright builds the static export, serves it on port 4321, and compares screenshots against the committed goldens. The server is ephemeral — started and stopped by Playwright for the duration of the test run. Port 4321 is deliberate (avoids the dev server on 3001).

**Regenerate goldens after an approved visual change:**

```bash
npm run test:visual -- --update-snapshots
# or equivalently:
npx playwright test --config=tests/playwright.config.ts --update-snapshots
```

Run this only after reviewing and approving the visual change. Commit the updated PNGs alongside the code change.
