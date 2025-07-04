import { defineConfig } from '@playwright/test';

export default defineConfig({
testDir: './src/tests/e2e',
  use: {
    headless: false, // show browser
    viewport: { width: 1280, height: 720 },
    screenshot: 'on',
    video: 'retain-on-failure',
    baseURL: 'http://localhost:3002',
  },
});
