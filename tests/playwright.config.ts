import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './fixtures',
  snapshotPathTemplate: '{testDir}/../visual/{arg}{ext}',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:4321',
    viewport: { width: 1440, height: 900 },
    trace: 'on-first-retry',
    // Start every test with a clean browser storage state so sessionStorage
    // values from prior runs (e.g. expo-dismissed='1') do not leak in and
    // hide the Expo speech bubble, causing golden-snapshot drift.
    storageState: { cookies: [], origins: [] },
  },

  expect: {
    toHaveScreenshot: { threshold: 0.2, maxDiffPixelRatio: 0.005 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run build && npx serve out -p 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
