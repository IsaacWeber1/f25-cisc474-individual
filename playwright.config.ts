import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E testing
 * Focus: Authentication and frontend integration testing
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true, // Enable full parallelization for speed
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : '80%', // Use 80% of CPU cores for local testing
  reporter: [['html'], ['line']], // Both HTML and inline reporting

  // Timeout optimizations
  timeout: 15000, // Reduce test timeout for faster failures
  globalTimeout: 5 * 60 * 1000, // 5 minute max total runtime

  use: {
    baseURL: 'http://localhost:3001',
    trace: 'retain-on-failure', // Only trace failures to save time
    screenshot: 'only-on-failure',
    video: 'off', // Disable video for speed
    // Reduced timeouts for faster test execution
    actionTimeout: 10000,
    navigationTimeout: 15000,

    // Optimize browser context
    launchOptions: {
      args: ['--disable-dev-shm-usage', '--no-sandbox'],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  // Start both frontend and backend servers
  webServer: [
    {
      command: 'npm run dev --filter=web-start',
      port: 3001,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'npm run dev --filter=api',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    }
  ],
});