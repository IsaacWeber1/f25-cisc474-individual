import { test, expect, Page, BrowserContext } from '@playwright/test';

/**
 * Complete Authentication Flow Tests
 * Tests the full OAuth flow with actual authentication
 *
 * NOTE: Requires test credentials to be set in environment variables:
 * - TEST_AUTH0_EMAIL
 * - TEST_AUTH0_PASSWORD
 */

test.describe('Complete Authentication Flow', () => {
  let page: Page;
  let context: BrowserContext;

  // Skip these tests if no test credentials are provided
  const hasTestCredentials = process.env.TEST_AUTH0_EMAIL && process.env.TEST_AUTH0_PASSWORD;

  test.beforeAll(() => {
    if (!hasTestCredentials) {
      console.log('⚠️ Skipping auth flow tests - no test credentials provided');
      console.log('Set TEST_AUTH0_EMAIL and TEST_AUTH0_PASSWORD to run these tests');
    }
  });

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    // Set up request/response interceptors
    await setupInterceptors(page);
  });

  test.afterEach(async () => {
    await context.close();
  });

  test.skip(!hasTestCredentials, 'Test credentials not configured');

  test('should complete full OAuth login flow', async () => {
    const testEmail = process.env.TEST_AUTH0_EMAIL!;
    const testPassword = process.env.TEST_AUTH0_PASSWORD!;

    // 1. Start on home page
    await page.goto('/');
    await expect(page).toHaveURL('http://localhost:3001/');

    // 2. Click login button
    const loginButton = page.getByRole('button', { name: /log in/i });
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    // 3. Wait for redirect to Auth0
    await page.waitForURL(/dev-3ak1hbs2abxn01ak\.us\.auth0\.com/, {
      timeout: 15000
    });

    // 4. Fill in Auth0 login form
    await page.fill('input[type="email"], input[name="username"]', testEmail);
    await page.fill('input[type="password"]', testPassword);

    // 5. Submit login form
    await page.click('button[type="submit"], button[name="action"][value="default"]');

    // 6. Wait for redirect back to app
    await page.waitForURL('http://localhost:3001/home', {
      timeout: 20000
    });

    // 7. Verify we're logged in
    await expect(page).toHaveURL('http://localhost:3001/home');

    // 8. Check for logout button (indicates successful auth)
    const logoutButton = page.getByRole('button', { name: /log out/i });
    await expect(logoutButton).toBeVisible();

    // 9. Verify user info is displayed
    await page.goto('/profile');
    await expect(page.getByText(testEmail)).toBeVisible();
  });

  test('should include JWT token in API requests after login', async () => {
    // This test requires being logged in first
    await loginWithTestAccount(page);

    // Track API calls
    const authorizedApiCalls: string[] = [];

    page.on('request', request => {
      if (request.url().includes('localhost:3000')) {
        const authHeader = request.headers()['authorization'];
        if (authHeader?.startsWith('Bearer ')) {
          authorizedApiCalls.push(request.url());
        }
      }
    });

    // Navigate to a page that makes API calls
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');

    // Should have made authorized API calls
    expect(authorizedApiCalls.length).toBeGreaterThan(0);
    expect(authorizedApiCalls.some(url => url.includes('/courses'))).toBeTruthy();
  });

  test('should access protected routes after authentication', async () => {
    await loginWithTestAccount(page);

    // Test all protected routes
    const protectedRoutes = [
      { path: '/courses', expectedContent: /(courses|course list|no courses)/i },
      { path: '/users', expectedContent: /(users|user list|no users)/i },
      { path: '/profile', expectedContent: /(profile|user info|email)/i },
    ];

    for (const route of protectedRoutes) {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      // Should not show login button on protected pages when authenticated
      const loginButton = page.getByRole('button', { name: /log in/i });
      await expect(loginButton).not.toBeVisible();

      // Should show relevant content
      const content = page.getByText(route.expectedContent);
      await expect(content).toBeVisible();
    }
  });

  test('should maintain session across page refreshes', async () => {
    await loginWithTestAccount(page);

    // Navigate to protected route
    await page.goto('/courses');

    // Verify logged in state
    const logoutButton = page.getByRole('button', { name: /log out/i });
    await expect(logoutButton).toBeVisible();

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be logged in
    await expect(logoutButton).toBeVisible();

    // Should still have access to protected content
    const loginButton = page.getByRole('button', { name: /log in/i });
    await expect(loginButton).not.toBeVisible();
  });

  test('should successfully logout', async () => {
    await loginWithTestAccount(page);

    // Click logout
    const logoutButton = page.getByRole('button', { name: /log out/i });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    // Should redirect to home or login page
    await page.waitForURL(/\/(home|login)?$/);

    // Should show login button again
    const loginButton = page.getByRole('button', { name: /log in/i });
    await expect(loginButton).toBeVisible();

    // Should no longer have access to protected routes
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');

    // Should either redirect to login or show no data
    const noAccess =
      await loginButton.isVisible() ||
      await page.getByText(/please log in|unauthorized/i).isVisible();

    expect(noAccess).toBeTruthy();
  });

  test('should handle token expiry gracefully', async () => {
    await loginWithTestAccount(page);

    // Simulate token expiry by manipulating localStorage/cookies
    await page.evaluate(() => {
      // Clear any auth tokens from storage
      localStorage.clear();
      sessionStorage.clear();
    });

    // Try to access protected route
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');

    // Should handle gracefully - either redirect to login or show appropriate message
    const gracefulHandling =
      await page.getByRole('button', { name: /log in/i }).isVisible() ||
      await page.getByText(/session expired|please log in again/i).isVisible();

    expect(gracefulHandling).toBeTruthy();
  });
});

/**
 * Helper function to log in with test account
 */
async function loginWithTestAccount(page: Page): Promise<void> {
  const testEmail = process.env.TEST_AUTH0_EMAIL;
  const testPassword = process.env.TEST_AUTH0_PASSWORD;

  if (!testEmail || !testPassword) {
    throw new Error('Test credentials not configured');
  }

  await page.goto('/');
  await page.click('button:has-text("Log In")');
  await page.waitForURL(/auth0\.com/, { timeout: 15000 });
  await page.fill('input[type="email"], input[name="username"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');
  await page.waitForURL('http://localhost:3001/home', { timeout: 20000 });
}

/**
 * Set up request/response interceptors for debugging
 */
async function setupInterceptors(page: Page): Promise<void> {
  // Log all API calls for debugging
  page.on('request', request => {
    if (request.url().includes('localhost:3000')) {
      console.log(`API Request: ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', response => {
    if (response.url().includes('localhost:3000')) {
      console.log(`API Response: ${response.status()} ${response.url()}`);
    }
  });

  // Log console messages from the page
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`Browser console error: ${msg.text()}`);
    }
  });
}