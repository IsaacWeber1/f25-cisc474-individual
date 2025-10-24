# Testing Quick Reference

**Last Updated**: 2025-10-23

Quick reference for common testing tasks in this Auth0-integrated full-stack application.

---

## Table of Contents

1. [Running Tests](#running-tests)
2. [Writing Tests](#writing-tests)
3. [Common Patterns](#common-patterns)
4. [Troubleshooting](#troubleshooting)

---

## Running Tests

### All Tests

```bash
# Run all test suites
npm run test:all

# Run with coverage
npm run test:all -- --coverage
```

### Unit Tests

```bash
# Backend (Jest)
npm run test --filter=api

# Frontend (Vitest)
npm run test --filter=web-start

# Watch mode
npm run test:watch
```

### Integration Tests

```bash
# API integration tests
npm run test:api

# With database
DATABASE_URL="postgresql://..." npm run test:api
```

### E2E Tests

```bash
# All E2E tests
npm run test:e2e

# Auth tests only
npm run test:e2e:auth

# Frontend integration tests
npm run test:e2e:frontend

# Interactive UI mode
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# Parallel execution (fast)
npm run test:e2e:parallel

# Show report
npm run test:e2e:report
```

### Specific Test Files

```bash
# Run single test file (Vitest)
npm run test -- path/to/file.test.ts

# Run single test file (Jest)
npm run test --filter=api -- auth.spec.ts

# Run single E2E test
npx playwright test tests/e2e/auth/login.spec.ts
```

---

## Writing Tests

### Backend Unit Test Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your-service';

describe('YourService', () => {
  let service: YourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourService],
    }).compile();

    service = module.get<YourService>(YourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should do something', () => {
    const result = service.doSomething();
    expect(result).toBe('expected value');
  });
});
```

### Backend Integration Test Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('YourController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/endpoint (GET)', () => {
    return request(app.getHttpServer())
      .get('/endpoint')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
      });
  });
});
```

### Frontend Component Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { YourComponent } from './YourComponent';

vi.mock('@auth0/auth0-react');

describe('YourComponent', () => {
  beforeEach(() => {
    vi.mocked(useAuth0).mockReturnValue({
      isAuthenticated: true,
      user: { email: '[email protected]' },
      isLoading: false,
    } as any);
  });

  it('should render', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });

  it('should handle click', () => {
    const handleClick = vi.fn();
    render(<YourComponent onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/some-page');

    // Act
    await page.click('button:has-text("Click Me")');

    // Assert
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

---

## Common Patterns

### Mocking Auth0 (Frontend)

```typescript
import { vi } from 'vitest';
import { useAuth0 } from '@auth0/auth0-react';

vi.mock('@auth0/auth0-react');

// Unauthenticated
vi.mocked(useAuth0).mockReturnValue({
  isAuthenticated: false,
  isLoading: false,
  user: undefined,
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getAccessTokenSilently: vi.fn(),
} as any);

// Authenticated
vi.mocked(useAuth0).mockReturnValue({
  isAuthenticated: true,
  isLoading: false,
  user: {
    sub: 'auth0|123',
    email: '[email protected]',
    name: 'Test User',
  },
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token'),
} as any);
```

### Mocking JWT Guard (Backend)

```typescript
import { ExecutionContext } from '@nestjs/common';

const mockGuard = {
  canActivate: (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    request.user = {
      sub: 'auth0|test',
      email: '[email protected]',
    };
    return true;
  },
};

const module: TestingModule = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideGuard(JwtAuthGuard)
  .useValue(mockGuard)
  .compile();
```

### Mocking API Responses (MSW)

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('http://localhost:3000/api/courses', () => {
    return HttpResponse.json([
      { id: 1, name: 'Course 1' },
      { id: 2, name: 'Course 2' },
    ]);
  }),

  http.get('http://localhost:3000/api/error', () => {
    return HttpResponse.json(
      { message: 'Error occurred' },
      { status: 500 }
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Playwright Auth Helper

```typescript
async function loginWithAuth0(page: Page) {
  await page.goto('/');
  await page.click('button:has-text("Log In")');
  await page.waitForURL(/auth0\.com/);

  await page.fill('input[type="email"]', process.env.TEST_AUTH0_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_AUTH0_PASSWORD!);
  await page.click('button[type="submit"]');

  await page.waitForURL('http://localhost:3001/home');
}

// Usage
test('authenticated test', async ({ page }) => {
  await loginWithAuth0(page);
  // Now authenticated
});
```

### Database Test Helpers

```typescript
// Clean database
async function cleanDatabase(prisma: PrismaClient) {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
}

// Seed test data
async function seedTestData(prisma: PrismaClient) {
  await prisma.user.create({
    data: {
      auth0Id: 'auth0|test',
      email: '[email protected]',
    },
  });
}

// Usage
beforeEach(async () => {
  await cleanDatabase(prisma);
  await seedTestData(prisma);
});
```

---

## Troubleshooting

### "Cannot find module" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear test cache
npm run test -- --clearCache
```

### Playwright browser not found

```bash
# Install browsers
npx playwright install

# With system dependencies
npx playwright install --with-deps
```

### Tests pass locally but fail in CI

**Check**:
1. Environment variables set in CI
2. Database URL correct
3. Ports not conflicting
4. Timeouts sufficient for CI

```yaml
# .github/workflows/test.yml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  TEST_AUTH0_EMAIL: ${{ secrets.TEST_AUTH0_EMAIL }}
  TEST_AUTH0_PASSWORD: ${{ secrets.TEST_AUTH0_PASSWORD }}
```

### Auth0 rate limiting in tests

**Solution**: Cache tokens

```typescript
let cachedToken: string | null = null;

async function getToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  cachedToken = await fetchNewToken();
  return cachedToken;
}
```

### Flaky E2E tests

**Common causes**:
- Not waiting for elements
- Race conditions
- Network timing

**Solutions**:

```typescript
// Use waitFor
await page.waitForSelector('text=Expected');

// Use expect with timeout
await expect(page.getByText('Expected')).toBeVisible({ timeout: 10000 });

// Wait for network idle
await page.waitForLoadState('networkidle');
```

### TypeScript errors in tests

```bash
# Check tsconfig.json includes test files
{
  "include": ["src/**/*", "test/**/*"]
}

# Install type definitions
npm install --save-dev @types/jest @types/node
```

### Coverage not generating

```bash
# Vitest
npm run test -- --coverage

# Jest
npm run test -- --coverage

# Check coverage config in vitest.config.ts or jest.config.ts
```

---

## Test File Locations

```
Project Structure:
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   └── **/*.spec.ts          # Unit tests
│   │   └── test/
│   │       ├── **/*.e2e.ts           # Integration tests
│   │       └── helpers/              # Test helpers
│   │
│   └── web-start/
│       └── src/
│           ├── **/*.test.tsx         # Component tests
│           ├── **/*.test.ts          # Hook/util tests
│           └── test/
│               ├── setup.ts          # Test setup
│               └── mocks/            # Mock data
│
└── tests/
    └── e2e/
        ├── auth/                     # Auth E2E tests
        ├── features/                 # Feature E2E tests
        └── helpers/                  # E2E helpers
```

---

## Environment Variables

```bash
# .env.test
# Auth0 Test Tenant
VITE_AUTH0_DOMAIN=your-app-test.us.auth0.com
VITE_AUTH0_CLIENT_ID=test_client_id
VITE_AUTH0_AUDIENCE=http://localhost:3000/

# Backend
AUTH0_ISSUER_URL=https://your-app-test.us.auth0.com/
AUTH0_AUDIENCE=http://localhost:3000/

# Test Credentials
TEST_AUTH0_EMAIL=test@example.com
TEST_AUTH0_PASSWORD=SecureTestPassword123!

# M2M for API tests
TEST_M2M_CLIENT_ID=m2m_client_id
TEST_M2M_CLIENT_SECRET=m2m_client_secret

# Test Database
TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/test_db
```

---

## Cheat Sheet

| Task | Command |
|------|---------|
| Run all tests | `npm run test:all` |
| Run unit tests | `npm run test` |
| Run E2E tests | `npm run test:e2e` |
| Run auth E2E | `npm run test:e2e:auth` |
| Watch mode | `npm run test:watch` |
| Coverage | `npm run test -- --coverage` |
| Debug E2E | `npm run test:e2e:debug` |
| Interactive E2E | `npm run test:e2e:ui` |
| Single file | `npm run test -- file.test.ts` |
| Update snapshots | `npm run test -- -u` |

---

## Related Documentation

- [Comprehensive Testing Guide](./COMPREHENSIVE_TESTING_GUIDE.md) - Full testing strategy
- [Testing Architecture](./TESTING_ARCHITECTURE.md) - Overall architecture
- [Auth0 Testing Guide](../authentication/TESTING_GUIDE.md) - Manual Auth0 testing

---

## Quick Examples

### Assert element is visible
```typescript
await expect(page.getByText('Hello')).toBeVisible();
```

### Assert API response
```typescript
expect(response.body).toHaveProperty('data');
expect(response.status).toBe(200);
```

### Mock function called
```typescript
expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFunction).toHaveBeenCalledTimes(1);
```

### Wait for async
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Test async hooks
```typescript
const { result } = renderHook(() => useMyHook());
await waitFor(() => {
  expect(result.current.data).toBeDefined();
});
```

---

**For detailed explanations, see the [Comprehensive Testing Guide](./COMPREHENSIVE_TESTING_GUIDE.md)**
