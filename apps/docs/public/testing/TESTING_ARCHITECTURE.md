# Comprehensive Testing Architecture

**Created**: 2025-10-23
**Purpose**: Dynamic, generalized testing suite for all development with immediate Auth0 focus

## Testing Philosophy

### Principles
1. **Automated First**: Prefer automated tests over manual verification
2. **Fast Feedback**: Quick tests run on every commit, comprehensive tests before merge
3. **Real User Flows**: Test actual user journeys, not just technical implementation
4. **Fail Fast**: Catch issues early in development cycle
5. **Maintainable**: Tests should be as maintainable as production code

### Test Pyramid

```
         /\
        /E2E\        <- Full user flows (Playwright)
       /------\
      /  API   \     <- Integration tests (Supertest)
     /----------\
    / Component  \   <- Component tests (Vitest + Testing Library)
   /--------------\
  /   Unit Tests   \ <- Business logic (Vitest)
 /------------------\
```

## Testing Stack

### Core Technologies

| Layer | Tool | Purpose | Location |
|-------|------|---------|----------|
| E2E | Playwright | Browser automation | `/tests/e2e/` |
| API | Supertest + Jest | Backend integration | `/apps/api/test/` |
| Component | Vitest + Testing Library | React components | `/apps/web-start/src/__tests__/` |
| Unit | Vitest | Pure functions/utilities | `*.test.ts` files |
| Performance | Lighthouse CI | Performance metrics | `/tests/performance/` |
| Security | OWASP ZAP | Security scanning | `/tests/security/` |

## Test Structure

```
f25-cisc474-individual/
├── tests/                          # Root-level test suites
│   ├── e2e/                       # End-to-end tests
│   │   ├── auth/                  # Authentication flows
│   │   │   ├── login.spec.ts     # Login flow tests
│   │   │   ├── logout.spec.ts    # Logout flow tests
│   │   │   ├── jwt.spec.ts       # JWT token handling
│   │   │   └── protected.spec.ts # Protected route access
│   │   ├── courses/               # Course management flows
│   │   ├── assignments/           # Assignment workflows
│   │   └── fixtures/              # Test data and helpers
│   │       ├── users.json        # Test user accounts
│   │       └── auth-helper.ts    # Auth utility functions
│   │
│   ├── integration/               # Cross-service integration
│   │   ├── api-auth.test.ts      # API authentication
│   │   └── database.test.ts      # Database operations
│   │
│   ├── performance/               # Performance benchmarks
│   │   ├── lighthouse.config.js  # Lighthouse configuration
│   │   └── load-test.js          # K6 load testing scripts
│   │
│   └── security/                  # Security testing
│       ├── owasp-scan.yaml       # OWASP ZAP configuration
│       └── auth-penetration.ts   # Auth-specific security tests
│
├── apps/
│   ├── api/
│   │   └── test/                  # Backend tests
│   │       ├── auth/              # Auth module tests
│   │       │   ├── auth.e2e.ts   # Auth E2E tests
│   │       │   └── jwt.spec.ts   # JWT strategy tests
│   │       └── setup.ts           # Test configuration
│   │
│   └── web-start/
│       └── src/
│           └── __tests__/         # Frontend tests
│               ├── components/    # Component tests
│               │   ├── LoginButton.test.tsx
│               │   └── AuthProvider.test.tsx
│               ├── hooks/         # Hook tests
│               │   └── useAuthFetcher.test.ts
│               └── utils/         # Utility tests
```

## Test Suites

### 1. Authentication Test Suite (Priority 1)

```typescript
// tests/e2e/auth/login.spec.ts
describe('Authentication Flow', () => {
  test('Complete OAuth flow')
  test('JWT token included in API calls')
  test('Protected routes require authentication')
  test('Logout clears session')
  test('Token refresh on expiry')
  test('Remember me functionality')
  test('Social login providers')
})
```

### 2. API Security Suite

```typescript
// apps/api/test/auth/auth.e2e.ts
describe('API Authentication', () => {
  test('Endpoints return 401 without token')
  test('Valid JWT grants access')
  test('Expired token rejected')
  test('Malformed token rejected')
  test('User sync on first login')
  test('Rate limiting enforced')
})
```

### 3. Component Test Suite

```typescript
// apps/web-start/src/__tests__/components/LoginButton.test.tsx
describe('LoginButton Component', () => {
  test('Renders login when unauthenticated')
  test('Renders logout when authenticated')
  test('Triggers Auth0 redirect on click')
  test('Handles loading states')
  test('Displays user info when logged in')
})
```

## Test Commands

### Package.json Scripts

```json
{
  "scripts": {
    // Quick Tests (run frequently)
    "test": "npm run test:unit && npm run test:component",
    "test:unit": "vitest run",
    "test:component": "vitest run --config vitest.component.config.ts",

    // Integration Tests (run before commit)
    "test:api": "npm run test --filter=api",
    "test:integration": "vitest run --config vitest.integration.config.ts",

    // E2E Tests (run before merge)
    "test:e2e": "playwright test",
    "test:e2e:auth": "playwright test tests/e2e/auth",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",

    // Full Test Suite (run in CI)
    "test:all": "npm run test && npm run test:api && npm run test:e2e",
    "test:ci": "npm run test:all -- --coverage",

    // Specialized Tests
    "test:security": "zap-cli quick-scan --self-contained http://localhost:3001",
    "test:performance": "lighthouse http://localhost:3001 --output=json",
    "test:load": "k6 run tests/performance/load-test.js",

    // Watch Mode (during development)
    "test:watch": "vitest watch",
    "test:e2e:watch": "playwright test --ui --watch"
  }
}
```

## Test Configurations

### Playwright Config (E2E)

```typescript
// playwright.config.ts
export default {
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3001',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' }
  ],
  webServer: {
    command: 'npm run dev',
    port: 3001,
    reuseExistingServer: !process.env.CI
  }
}
```

### Vitest Config (Unit/Component)

```typescript
// vitest.config.ts
export default {
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './tests/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  }
}
```

## Test Data Management

### Fixtures

```typescript
// tests/e2e/fixtures/users.json
{
  "testUsers": [
    {
      "email": "test-student@example.com",
      "password": "Test123!@#",
      "role": "student"
    },
    {
      "email": "test-instructor@example.com",
      "password": "Test456!@#",
      "role": "instructor"
    }
  ]
}
```

### Test Database

```typescript
// tests/helpers/test-db.ts
export async function setupTestDatabase() {
  // Create isolated test database
  // Run migrations
  // Seed test data
}

export async function cleanupTestDatabase() {
  // Remove test data
  // Reset sequences
}
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:unit

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:api

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-artifacts
          path: test-results/
```

## Test Environments

### Local Development

```bash
# Quick feedback loop
npm run test:watch         # Unit tests in watch mode
npm run test:e2e:ui       # E2E with interactive UI
```

### Pre-commit

```bash
# Git hook runs
npm run test:unit         # Fast unit tests
npm run lint              # Code quality
```

### Pre-merge

```bash
# Full validation
npm run test:all          # All test suites
npm run test:security     # Security scan
```

### Production

```bash
# Continuous monitoring
npm run test:performance  # Performance benchmarks
npm run test:load        # Load testing
```

## Test Patterns

### Page Object Model (E2E)

```typescript
// tests/e2e/pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }
}
```

### Test Helpers

```typescript
// tests/helpers/auth.ts
export async function authenticateUser(page: Page) {
  // Reusable authentication logic
}

export async function getAuthToken(): Promise<string> {
  // Get valid JWT for API tests
}
```

## Coverage Goals

| Type | Target | Current |
|------|--------|---------|
| Unit Tests | 80% | TBD |
| Integration | 70% | TBD |
| E2E Critical Paths | 100% | TBD |
| Overall | 75% | TBD |

## Test Execution Strategy

### Development Phase
1. **Write tests first** (TDD when possible)
2. **Run tests locally** before committing
3. **Fix immediately** when tests fail

### Review Phase
1. **All tests must pass** in CI
2. **Coverage must not decrease**
3. **New features need tests**

### Release Phase
1. **Full regression suite** runs
2. **Performance benchmarks** compared
3. **Security scans** completed

## Monitoring & Reporting

### Test Reports
- **HTML Coverage Reports**: `coverage/index.html`
- **Playwright Reports**: `playwright-report/index.html`
- **Performance Reports**: `lighthouse-reports/`

### Dashboards
- CI/CD pipeline status
- Coverage trends
- Performance metrics
- Test execution time

## Maintenance

### Weekly
- Review flaky tests
- Update test data
- Optimize slow tests

### Monthly
- Review coverage gaps
- Update security tests
- Performance baseline updates

### Quarterly
- Test architecture review
- Tool updates
- Training/documentation updates

---

## Quick Start for Auth Testing

```bash
# Install dependencies
npm install --save-dev @playwright/test vitest @testing-library/react

# Run auth-specific tests
npm run test:e2e:auth      # E2E auth flow
npm run test:api -- auth    # API auth tests
npm run test:component -- LoginButton  # Component tests

# Full test suite
npm run test:all
```

## Next Steps

1. ✅ Architecture designed
2. ✅ Comprehensive testing guide created
3. ⏳ Install testing dependencies
4. ⏳ Implement auth test suite
5. ⏳ Run tests and document results
6. ⏳ Integrate with CI pipeline
7. ⏳ Create test data fixtures
8. ⏳ Set up test environments

## Related Documentation

- **[Comprehensive Testing Guide](./COMPREHENSIVE_TESTING_GUIDE.md)** - Complete guide with code examples for Auth0, NestJS, and React testing
- **[Quick Reference](./QUICK_REFERENCE.md)** - Common commands and patterns
- **[Auth0 Testing Guide](../authentication/TESTING_GUIDE.md)** - Manual Auth0 testing procedures