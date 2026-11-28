import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

/**
 * Serves the existing static export in `out/`; never builds. Run
 * `npm run build` first, then `npm run test:seo`.
 */
export default defineConfig({
  testDir: '.',
  testMatch: '**/index.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:4321',
    ...devices['Desktop Chrome'],
  },

  projects: [{ name: 'chromium' }],

  webServer: {
    command: 'npx serve out -p 4321',
    cwd: path.resolve(__dirname, '../..'),
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
