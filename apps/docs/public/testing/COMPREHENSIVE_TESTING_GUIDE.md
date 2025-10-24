# Comprehensive Testing Guide for Auth0-Integrated Full-Stack Applications

**Created**: 2025-10-23
**Last Updated**: 2025-10-23
**Tech Stack**: Auth0, NestJS, React, TanStack Router, Playwright, Jest, Vitest

---

## Table of Contents

1. [Testing Strategy Overview](#1-testing-strategy-overview)
2. [Backend (NestJS) Testing](#2-backend-nestjs-testing)
3. [Frontend (React/TanStack) Testing](#3-frontend-reacttanstack-testing)
4. [E2E Testing with Playwright](#4-e2e-testing-with-playwright)
5. [Auth0-Specific Testing](#5-auth0-specific-testing)
6. [Testing Tools & Libraries](#6-testing-tools--libraries)
7. [Best Practices](#7-best-practices)
8. [Implementation Roadmap](#8-implementation-roadmap)

---

## 1. Testing Strategy Overview

### 1.1 The Testing Pyramid

The testing pyramid guides how we distribute testing effort across different layers:

```
         /\
        /E2E\        <- 10% - Full user flows (Playwright)
       /------\         - Complete OAuth flows
      /  API   \     <- 20% - Integration tests (Supertest)
     /----------\        - Protected endpoint testing
    / Component  \   <- 30% - Component tests (Vitest + Testing Library)
   /--------------\      - Auth-aware components
  /   Unit Tests   \ <- 40% - Business logic (Vitest/Jest)
 /------------------\     - Services, guards, utilities
```

**Key Principle**: Write tests at the lowest level possible where the behavior can be verified.

### 1.2 What to Test at Each Layer

#### Unit Tests (40% of tests)
- **NestJS**: Services, guards, strategies, utilities
- **React**: Hooks, utility functions, helper methods
- **Focus**: Pure business logic, isolated components
- **Speed**: Very fast (milliseconds per test)
- **Example**: JWT validation logic, data transformation utilities

#### Component Tests (30% of tests)
- **React Components**: Isolated rendering with mocked dependencies
- **Focus**: User interactions, rendering logic, state management
- **Speed**: Fast (100-200ms per test)
- **Example**: Login button behavior, protected route components

#### Integration/API Tests (20% of tests)
- **NestJS Endpoints**: Request/response cycles with database
- **Focus**: Multiple components working together
- **Speed**: Medium (500ms-2s per test)
- **Example**: User creation on first login, protected endpoint access

#### E2E Tests (10% of tests)
- **Full Stack**: Browser automation testing complete user journeys
- **Focus**: Critical user paths, authentication flows
- **Speed**: Slow (5-30s per test)
- **Example**: Complete OAuth login, protected data access

### 1.3 Mocking vs Real Authentication

| Test Layer | Authentication Approach | Rationale |
|------------|------------------------|-----------|
| Unit | **Mock** JWTs and Auth0 SDK | Fast, isolated, deterministic |
| Component | **Mock** `useAuth0` hook | Independent of Auth0 service |
| API Integration | **Mock** JWT validation (or use test JWTs) | Control over token contents |
| E2E | **Real** Auth0 (with test tenant) | Validate actual integration |

**Best Practice**: Use real Auth0 only for critical E2E tests. Mock everywhere else for speed and reliability.

---

## 2. Backend (NestJS) Testing

### 2.1 Testing Stack

```json
{
  "devDependencies": {
    "@nestjs/testing": "^11.0.0",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5"
  }
}
```

### 2.2 Unit Testing Guards

**File**: `apps/api/src/auth/jwt-auth.guard.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { createMock } from '@golevelup/ts-jest';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  describe('canActivate', () => {
    it('should return true for public routes', () => {
      // Mock ExecutionContext
      const context = createMock<ExecutionContext>();

      // Mock Reflector to return true for IS_PUBLIC_KEY
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should call super.canActivate for protected routes', () => {
      const context = createMock<ExecutionContext>();
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      // Mock the parent class canActivate
      const superSpy = jest.spyOn(Object.getPrototypeOf(guard), 'canActivate');

      guard.canActivate(context);

      expect(superSpy).toHaveBeenCalledWith(context);
    });
  });
});
```

### 2.3 Unit Testing Services with JWT

**File**: `apps/api/src/users/users.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@repo/database';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  // Mock Prisma client
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreateByAuth0Id', () => {
    const mockAuth0Id = 'auth0|123456';
    const mockEmail = '[email protected]';

    it('should return existing user if found', async () => {
      const existingUser = {
        id: 1,
        auth0Id: mockAuth0Id,
        email: mockEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);

      const result = await service.findOrCreateByAuth0Id(mockAuth0Id, mockEmail);

      expect(result).toEqual(existingUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { auth0Id: mockAuth0Id },
      });
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should create new user if not found', async () => {
      const newUser = {
        id: 2,
        auth0Id: mockAuth0Id,
        email: mockEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(newUser);

      const result = await service.findOrCreateByAuth0Id(mockAuth0Id, mockEmail);

      expect(result).toEqual(newUser);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          auth0Id: mockAuth0Id,
          email: mockEmail,
        },
      });
    });
  });
});
```

### 2.4 Integration Testing Protected Endpoints

**File**: `apps/api/test/auth/auth-integration.spec.ts` (already exists in your project)

Key improvements to add:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@repo/database';

describe('Authentication Integration (Enhanced)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Protected Endpoints', () => {
    it('should return 401 for all protected routes without token', async () => {
      const endpoints = [
        '/courses',
        '/users/me',
        '/assignments',
        '/grades',
        '/submissions',
        '/links',
      ];

      for (const endpoint of endpoints) {
        const response = await request(app.getHttpServer())
          .get(endpoint)
          .expect(401);

        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toMatch(/unauthorized/i);
      }
    });

    it('should accept valid JWT token', async () => {
      // Use a test JWT generated from Auth0 test tenant
      const validToken = await getTestJWT();

      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('auth0Id');
      expect(response.body).toHaveProperty('email');
    });
  });

  describe('CORS Configuration', () => {
    it('should allow requests from frontend origin', async () => {
      const response = await request(app.getHttpServer())
        .options('/courses')
        .set('Origin', 'http://localhost:3001')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Authorization')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3001');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });
});

/**
 * Helper to get test JWT from Auth0 test tenant
 * This should use Machine-to-Machine credentials
 */
async function getTestJWT(): Promise<string> {
  const response = await fetch('https://dev-3ak1hbs2abxn01ak.us.auth0.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.TEST_AUTH0_CLIENT_ID,
      client_secret: process.env.TEST_AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  return data.access_token;
}
```

### 2.5 Mocking JWT Validation

**File**: `apps/api/test/helpers/jwt-mock.ts`

```typescript
import { ExecutionContext } from '@nestjs/common';

/**
 * Mock JWT guard for testing
 * Bypasses Auth0 validation and injects test user
 */
export class MockJwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Inject mock user into request
    request.user = {
      sub: 'auth0|test-user-123',
      email: '[email protected]',
      iat: Date.now() / 1000,
      exp: Date.now() / 1000 + 3600,
    };

    return true;
  }
}

/**
 * Override guard in test module
 */
export function overrideJwtGuard(moduleBuilder: TestingModuleBuilder) {
  return moduleBuilder
    .overrideGuard(JwtAuthGuard)
    .useClass(MockJwtAuthGuard);
}
```

**Usage in tests**:

```typescript
const module: TestingModule = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideGuard(JwtAuthGuard)
  .useClass(MockJwtAuthGuard)
  .compile();
```

### 2.6 Database Testing Strategy

**File**: `apps/api/test/helpers/test-database.ts`

```typescript
import { PrismaClient } from '@prisma/client';

let testPrisma: PrismaClient;

/**
 * Setup test database with clean state
 */
export async function setupTestDatabase(): Promise<PrismaClient> {
  testPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL,
      },
    },
  });

  await testPrisma.$connect();

  // Clear existing data
  await cleanDatabase();

  return testPrisma;
}

/**
 * Clean all tables
 */
async function cleanDatabase() {
  const tables = ['User', 'Course', 'Assignment', 'Submission', 'Grade'];

  for (const table of tables) {
    await testPrisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`
    );
  }
}

/**
 * Seed test data
 */
export async function seedTestData() {
  await testPrisma.user.createMany({
    data: [
      {
        auth0Id: 'auth0|test-student',
        email: '[email protected]',
      },
      {
        auth0Id: 'auth0|test-instructor',
        email: '[email protected]',
      },
    ],
  });
}

/**
 * Cleanup after tests
 */
export async function teardownTestDatabase() {
  await cleanDatabase();
  await testPrisma.$disconnect();
}
```

**Usage**:

```typescript
describe('User Integration Tests', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = await setupTestDatabase();
    await seedTestData();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  it('should find user by auth0Id', async () => {
    const user = await prisma.user.findUnique({
      where: { auth0Id: 'auth0|test-student' },
    });

    expect(user).toBeDefined();
    expect(user?.email).toBe('[email protected]');
  });
});
```

---

## 3. Frontend (React/TanStack) Testing

### 3.1 Testing Stack

```json
{
  "devDependencies": {
    "@testing-library/react": "^16.2.0",
    "@testing-library/dom": "^10.4.0",
    "@testing-library/user-event": "^14.5.2",
    "vitest": "^3.0.5",
    "jsdom": "^27.0.0",
    "msw": "^2.0.0"
  }
}
```

### 3.2 Vitest Configuration

**File**: `apps/web-start/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3.3 Test Setup File

**File**: `apps/web-start/src/test/setup.ts`

```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Auth0 by default
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
  Auth0Provider: ({ children }: { children: React.ReactNode }) => children,
  withAuthenticationRequired: (component: any) => component,
}));
```

### 3.4 Mocking useAuth0 Hook

**File**: `apps/web-start/src/test/mocks/auth0.ts`

```typescript
import { vi } from 'vitest';

/**
 * Mock useAuth0 hook - unauthenticated state
 */
export const mockUseAuth0Unauthenticated = {
  isAuthenticated: false,
  isLoading: false,
  user: undefined,
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getAccessTokenSilently: vi.fn(),
};

/**
 * Mock useAuth0 hook - authenticated state
 */
export const mockUseAuth0Authenticated = {
  isAuthenticated: true,
  isLoading: false,
  user: {
    sub: 'auth0|123456',
    email: '[email protected]',
    name: 'Test User',
    picture: 'https://example.com/avatar.jpg',
  },
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getAccessTokenSilently: vi.fn().mockResolvedValue('mock-access-token'),
};

/**
 * Mock useAuth0 hook - loading state
 */
export const mockUseAuth0Loading = {
  isAuthenticated: false,
  isLoading: true,
  user: undefined,
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getAccessTokenSilently: vi.fn(),
};
```

### 3.5 Component Testing Example

**File**: `apps/web-start/src/components/__tests__/LoginButton.test.tsx`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from '../LoginButton';
import {
  mockUseAuth0Authenticated,
  mockUseAuth0Unauthenticated,
  mockUseAuth0Loading,
} from '../../test/mocks/auth0';

// Mock the hook
vi.mock('@auth0/auth0-react');

describe('LoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when unauthenticated', () => {
    beforeEach(() => {
      vi.mocked(useAuth0).mockReturnValue(mockUseAuth0Unauthenticated);
    });

    it('should render login button', () => {
      render(<LoginButton />);

      const loginButton = screen.getByRole('button', { name: /log in/i });
      expect(loginButton).toBeInTheDocument();
    });

    it('should call loginWithRedirect when clicked', () => {
      render(<LoginButton />);

      const loginButton = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginButton);

      expect(mockUseAuth0Unauthenticated.loginWithRedirect).toHaveBeenCalledOnce();
    });
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      vi.mocked(useAuth0).mockReturnValue(mockUseAuth0Authenticated);
    });

    it('should render logout button', () => {
      render(<LoginButton />);

      const logoutButton = screen.getByRole('button', { name: /log out/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it('should display user email', () => {
      render(<LoginButton />);

      expect(screen.getByText('[email protected]')).toBeInTheDocument();
    });

    it('should call logout when logout button clicked', () => {
      render(<LoginButton />);

      const logoutButton = screen.getByRole('button', { name: /log out/i });
      fireEvent.click(logoutButton);

      expect(mockUseAuth0Authenticated.logout).toHaveBeenCalledWith({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    });
  });

  describe('when loading', () => {
    beforeEach(() => {
      vi.mocked(useAuth0).mockReturnValue(mockUseAuth0Loading);
    });

    it('should show loading state', () => {
      render(<LoginButton />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should disable button while loading', () => {
      render(<LoginButton />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });
});
```

### 3.6 Testing Custom Hooks

**File**: `apps/web-start/src/hooks/__tests__/useAuthFetcher.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthFetcher } from '../useAuthFetcher';
import { mockUseAuth0Authenticated } from '../../test/mocks/auth0';

vi.mock('@auth0/auth0-react');

describe('useAuthFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should include Authorization header when authenticated', async () => {
    vi.mocked(useAuth0).mockReturnValue(mockUseAuth0Authenticated);

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useAuthFetcher());

    await result.current('/api/test');

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-access-token',
          }),
        })
      );
    });
  });

  it('should handle 401 responses gracefully', async () => {
    vi.mocked(useAuth0).mockReturnValue(mockUseAuth0Authenticated);

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
    });

    const { result } = renderHook(() => useAuthFetcher());

    await expect(result.current('/api/test')).rejects.toThrow('Unauthorized');
  });
});
```

### 3.7 Testing Protected Routes

**File**: `apps/web-start/src/routes/__tests__/courses.test.tsx`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { CoursesRoute } from '../courses';
import { mockUseAuth0Authenticated, mockUseAuth0Unauthenticated } from '../../test/mocks/auth0';

vi.mock('@auth0/auth0-react');

describe('Courses Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show login prompt when unauthenticated', () => {
    vi.mocked(useAuth0).mockReturnValue(mockUseAuth0Unauthenticated);

    render(<CoursesRoute />);

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('should fetch and display courses when authenticated', async () => {
    vi.mocked(useAuth0).mockReturnValue(mockUseAuth0Authenticated);

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, name: 'CS 101', code: 'CS101' },
        { id: 2, name: 'CS 202', code: 'CS202' },
      ],
    });

    render(<CoursesRoute />);

    await waitFor(() => {
      expect(screen.getByText('CS 101')).toBeInTheDocument();
      expect(screen.getByText('CS 202')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(useAuth0).mockReturnValue(mockUseAuth0Authenticated);

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(<CoursesRoute />);

    await waitFor(() => {
      expect(screen.getByText(/error loading courses/i)).toBeInTheDocument();
    });
  });
});
```

### 3.8 Mock Service Worker (MSW) Setup

**File**: `apps/web-start/src/test/mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock courses endpoint
  http.get('http://localhost:3000/courses', () => {
    return HttpResponse.json([
      { id: 1, name: 'Test Course 1', code: 'TC1' },
      { id: 2, name: 'Test Course 2', code: 'TC2' },
    ]);
  }),

  // Mock user profile endpoint
  http.get('http://localhost:3000/users/me', () => {
    return HttpResponse.json({
      id: 1,
      auth0Id: 'auth0|123456',
      email: '[email protected]',
    });
  }),

  // Mock unauthorized responses
  http.get('http://localhost:3000/unauthorized', () => {
    return HttpResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }),
];
```

**File**: `apps/web-start/src/test/mocks/server.ts`

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server with handlers
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
```

**Update test setup** (`apps/web-start/src/test/setup.ts`):

```typescript
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// Start MSW server
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 4. E2E Testing with Playwright

### 4.1 Enhanced Playwright Configuration

Your existing `playwright.config.ts` is good. Here are recommended additions:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : '80%',
  reporter: [
    ['html'],
    ['line'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  timeout: 15000,
  globalTimeout: 5 * 60 * 1000,

  use: {
    baseURL: 'http://localhost:3001',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 10000,
    navigationTimeout: 15000,
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
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

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
    },
  ],
});
```

### 4.2 Auth0 OAuth Flow Testing

**File**: `tests/e2e/auth/oauth-flow.spec.ts`

```typescript
import { test, expect, Page } from '@playwright/test';

// Test credentials from environment
const TEST_EMAIL = process.env.TEST_AUTH0_EMAIL;
const TEST_PASSWORD = process.env.TEST_AUTH0_PASSWORD;

test.describe('Auth0 OAuth Flow', () => {
  test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'Test credentials not configured');

  test('should complete full OAuth login flow', async ({ page }) => {
    // 1. Start at home page
    await page.goto('/');

    // 2. Click login button
    await page.click('button:has-text("Log In")');

    // 3. Wait for Auth0 redirect
    await page.waitForURL(/dev-3ak1hbs2abxn01ak\.us\.auth0\.com/, {
      timeout: 15000,
    });

    // 4. Fill in Auth0 login form
    const emailInput = page.locator('input[type="email"], input[name="username"]');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(TEST_EMAIL!);

    await page.fill('input[type="password"]', TEST_PASSWORD!);

    // 5. Submit form
    await page.click('button[type="submit"]');

    // 6. Wait for redirect back to app
    await page.waitForURL('http://localhost:3001/home', {
      timeout: 20000,
    });

    // 7. Verify successful login
    await expect(page.getByRole('button', { name: /log out/i })).toBeVisible();
  });

  test('should include JWT token in API requests after login', async ({ page }) => {
    // Login first
    await loginWithAuth0(page, TEST_EMAIL!, TEST_PASSWORD!);

    // Intercept API calls
    const apiRequests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('localhost:3000')) {
        const authHeader = request.headers()['authorization'];
        if (authHeader?.startsWith('Bearer ')) {
          apiRequests.push(request.url());
        }
      }
    });

    // Navigate to page that makes API calls
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');

    // Verify JWT was included
    expect(apiRequests.length).toBeGreaterThan(0);
  });

  test('should handle logout correctly', async ({ page }) => {
    // Login first
    await loginWithAuth0(page, TEST_EMAIL!, TEST_PASSWORD!);

    // Click logout
    await page.click('button:has-text("Log Out")');

    // Should redirect to login/home
    await page.waitForURL(/\/(home|login)?$/);

    // Should show login button again
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });
});

/**
 * Helper function to login via Auth0
 */
async function loginWithAuth0(page: Page, email: string, password: string) {
  await page.goto('/');
  await page.click('button:has-text("Log In")');
  await page.waitForURL(/auth0\.com/, { timeout: 15000 });

  const emailInput = page.locator('input[type="email"], input[name="username"]');
  await emailInput.waitFor({ state: 'visible' });
  await emailInput.fill(email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForURL('http://localhost:3001/home', { timeout: 20000 });
}
```

### 4.3 Handling OAuth Redirects

**File**: `tests/e2e/helpers/auth-state.ts`

```typescript
import { Page, BrowserContext } from '@playwright/test';

/**
 * Save authenticated session state
 * Allows reusing auth across tests without re-login
 */
export async function saveAuthState(page: Page, path: string) {
  await page.context().storageState({ path });
}

/**
 * Load authenticated session state
 */
export async function loadAuthState(context: BrowserContext, path: string) {
  // This is done when creating the context
  // See usage example below
}
```

**Usage**:

```typescript
import { test as base } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

// Create authenticated test fixture
const test = base.extend({
  // Use saved auth state for all tests
  context: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: authFile,
    });
    await use(context);
    await context.close();
  },
});

// Setup: Login once and save state
test('setup: authenticate', async ({ page }) => {
  await loginWithAuth0(page, TEST_EMAIL, TEST_PASSWORD);
  await page.context().storageState({ path: authFile });
});

// All subsequent tests use the saved auth state
test('authenticated: access protected route', async ({ page }) => {
  await page.goto('/courses');
  // Already authenticated!
  await expect(page.getByText(/courses/i)).toBeVisible();
});
```

### 4.4 Test User Management

**File**: `tests/e2e/fixtures/test-users.json`

```json
{
  "users": [
    {
      "email": "test-student@example.com",
      "password": "SecurePassword123!",
      "role": "student",
      "auth0Id": "auth0|student123"
    },
    {
      "email": "test-instructor@example.com",
      "password": "SecurePassword456!",
      "role": "instructor",
      "auth0Id": "auth0|instructor456"
    }
  ]
}
```

**Important**: These users must be created in your Auth0 test tenant.

### 4.5 CI/CD Considerations

**File**: `.github/workflows/e2e-tests.yml`

```yaml
name: E2E Tests

on:
  push:
    branches: [main, feat/*]
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run database migrations
        run: npm run db:migrate:deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          TEST_AUTH0_EMAIL: ${{ secrets.TEST_AUTH0_EMAIL }}
          TEST_AUTH0_PASSWORD: ${{ secrets.TEST_AUTH0_PASSWORD }}
          AUTH0_ISSUER_URL: ${{ secrets.AUTH0_ISSUER_URL }}
          AUTH0_AUDIENCE: ${{ secrets.AUTH0_AUDIENCE }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### 4.6 Example E2E Test Scenarios

**File**: `tests/e2e/scenarios/course-enrollment.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Course Enrollment Flow', () => {
  test.use({ storageState: '.auth/student.json' });

  test('student can view and enroll in courses', async ({ page }) => {
    // 1. Navigate to courses page
    await page.goto('/courses');

    // 2. Verify courses are displayed
    await expect(page.getByRole('heading', { name: /courses/i })).toBeVisible();

    // 3. Click on a course
    await page.click('text=CS 101');

    // 4. Verify course details load
    await expect(page.getByRole('heading', { name: /cs 101/i })).toBeVisible();

    // 5. View assignments
    await page.click('text=Assignments');

    // 6. Verify assignments list
    await expect(page.getByText(/assignment/i)).toBeVisible();
  });
});
```

---

## 5. Auth0-Specific Testing

### 5.1 Test Environments vs Production

**Best Practice**: Always use a separate Auth0 tenant for testing.

**Setup**:
1. Create Auth0 test tenant: `your-app-test.us.auth0.com`
2. Mirror production configuration
3. Create test users
4. Use environment variables to switch between environments

**File**: `.env.test`

```env
# Auth0 Test Environment
VITE_AUTH0_DOMAIN=your-app-test.us.auth0.com
VITE_AUTH0_CLIENT_ID=test_client_id
VITE_AUTH0_AUDIENCE=http://localhost:3000/

# Backend
AUTH0_ISSUER_URL=https://your-app-test.us.auth0.com/
AUTH0_AUDIENCE=http://localhost:3000/

# Test Credentials
TEST_AUTH0_EMAIL=test@example.com
TEST_AUTH0_PASSWORD=SecureTestPassword123!
```

### 5.2 Machine-to-Machine Tokens for Testing

**Use Case**: Automated API testing without browser interaction

**Setup**:
1. Create M2M application in Auth0
2. Authorize it for your API
3. Save Client ID and Secret

**File**: `tests/helpers/get-m2m-token.ts`

```typescript
/**
 * Get Machine-to-Machine token from Auth0
 * Used for automated API testing
 */
export async function getM2MToken(): Promise<string> {
  const response = await fetch(
    `${process.env.AUTH0_ISSUER_URL}oauth/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.TEST_M2M_CLIENT_ID,
        client_secret: process.env.TEST_M2M_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: 'client_credentials',
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get M2M token');
  }

  const data = await response.json();
  return data.access_token;
}
```

**Usage in tests**:

```typescript
describe('API Tests with M2M Token', () => {
  let token: string;

  beforeAll(async () => {
    token = await getM2MToken();
  });

  it('should access protected endpoint', async () => {
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
```

### 5.3 Testing Auth0 Rules/Actions

**Note**: Auth0 Actions run on the Auth0 server, not in your app.

**Testing Approach**:
1. **Unit test the logic**: Extract testable code
2. **Integration test**: Verify effects in your app
3. **Manual test**: Use Auth0 Dashboard testing tools

**Example Action** (User metadata enrichment):

```javascript
// Auth0 Action code
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://yourapp.com';

  if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}/roles`, event.user.app_metadata.roles);
  }
};
```

**Testing in your app**:

```typescript
test('should receive custom claims in token', async () => {
  const token = await getTestToken(); // Login via Auth0

  const decoded = decodeJWT(token);

  expect(decoded).toHaveProperty('https://yourapp.com/roles');
  expect(decoded['https://yourapp.com/roles']).toContain('student');
});
```

### 5.4 Rate Limiting Considerations

**Problem**: Auth0 has rate limits for token requests

**Solutions**:

1. **Cache tokens** in tests:
```typescript
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getTestToken(): Promise<string> {
  const now = Date.now() / 1000;

  if (cachedToken && tokenExpiry > now + 300) {
    return cachedToken;
  }

  cachedToken = await fetchNewToken();
  tokenExpiry = decodeJWT(cachedToken).exp;

  return cachedToken;
}
```

2. **Use auth state files** (Playwright):
```typescript
// Save auth once, reuse for all tests
await page.context().storageState({ path: 'auth.json' });

// Later tests
const context = await browser.newContext({ storageState: 'auth.json' });
```

3. **Limit parallel tests** that hit Auth0:
```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : 4, // Limit workers
  projects: [
    {
      name: 'auth-tests',
      testMatch: /auth.*\.spec\.ts/,
      use: { workers: 1 }, // Serial execution for auth tests
    },
  ],
});
```

---

## 6. Testing Tools & Libraries

### 6.1 Recommended Packages

**Install all testing dependencies**:

```bash
# Root workspace
npm install --save-dev \
  @playwright/test \
  playwright

# Backend (API)
cd apps/api
npm install --save-dev \
  @nestjs/testing \
  @types/supertest \
  supertest \
  @golevelup/ts-jest

# Frontend (web-start)
cd apps/web-start
npm install --save-dev \
  @testing-library/react \
  @testing-library/dom \
  @testing-library/user-event \
  @testing-library/jest-dom \
  vitest \
  jsdom \
  msw
```

### 6.2 Tool Comparison

#### Jest vs Vitest

| Feature | Jest | Vitest |
|---------|------|--------|
| Speed | Slower | 5-10x faster |
| ES Modules | Requires config | Native support |
| TypeScript | Via ts-jest | Native |
| Watch Mode | Good | Excellent |
| Vite Integration | No | Perfect |
| **Recommendation** | Backend (NestJS) | Frontend (React/Vite) |

**Why this split?**
- NestJS ecosystem uses Jest extensively
- React/Vite apps benefit from Vitest's speed

#### Playwright vs Cypress

| Feature | Playwright | Cypress |
|---------|-----------|----------|
| Multi-tab support | Excellent | Limited |
| Cross-domain | Full support | Restricted |
| Auth0 OAuth | Easy | Requires workarounds |
| Speed | Fast | Medium |
| Mobile testing | Built-in | Via Viewport |
| **Recommendation** | **Use Playwright** | - |

**For Auth0 OAuth testing, Playwright is strongly recommended** due to:
- Native multi-tab/window support
- Cross-domain testing without workarounds
- Better handling of redirects

### 6.3 Mock Service Worker (MSW)

**Why MSW?**
- Industry standard for API mocking
- Works in both browser and Node.js
- Reusable mocks across testing tools
- No library-specific adapters needed

**Setup** (already covered in section 3.8):

```bash
npm install --save-dev msw
```

**Key benefits**:
- Test components with realistic API responses
- No need to mock fetch/axios directly
- Simulate error scenarios easily
- Fast tests without real API calls

---

## 7. Best Practices

### 7.1 Test Data Management

**Principle**: Tests should be independent and reproducible.

**Strategies**:

1. **Use factories** for test data:

```typescript
// tests/factories/user.factory.ts
export function createTestUser(overrides?: Partial<User>): User {
  return {
    id: Math.floor(Math.random() * 10000),
    auth0Id: `auth0|${Math.random().toString(36).substr(2, 9)}`,
    email: `test-${Date.now()}@example.com`,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
```

2. **Clean database between tests**:

```typescript
beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
});
```

3. **Use unique identifiers**:

```typescript
const testEmail = `test-${Date.now()}@example.com`; // Prevents conflicts
```

### 7.2 Secrets Handling in Tests

**NEVER commit secrets to git!**

**Use environment variables**:

```typescript
// .env.test (NOT committed)
TEST_AUTH0_EMAIL=test@example.com
TEST_AUTH0_PASSWORD=SecurePassword123!
TEST_M2M_CLIENT_ID=abc123
TEST_M2M_CLIENT_SECRET=xyz789

// .gitignore
.env.test
.env.local
.auth/
```

**CI/CD secrets**:
- Store in GitHub Secrets
- Inject via environment variables
- Never print in logs

```yaml
# .github/workflows/test.yml
env:
  TEST_AUTH0_EMAIL: ${{ secrets.TEST_AUTH0_EMAIL }}
  TEST_AUTH0_PASSWORD: ${{ secrets.TEST_AUTH0_PASSWORD }}
```

### 7.3 Parallel Test Execution

**Benefits**: Faster test runs, better CI performance

**Vitest** (automatic):

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    threads: true, // Run tests in parallel
    maxThreads: 4,
  },
});
```

**Playwright** (configured):

```typescript
// playwright.config.ts
export default defineConfig({
  workers: '80%', // Use 80% of CPU cores
  fullyParallel: true,
});
```

**Database considerations**:
- Use separate database per worker
- Or use transactions that rollback

```typescript
// Per-worker database
const dbUrl = `${process.env.DATABASE_URL}_${process.env.TEST_WORKER_INDEX}`;
```

### 7.4 Test Coverage Metrics

**Target coverage**:
- Unit tests: 80%+
- Integration: 70%+
- E2E critical paths: 100%

**Generate coverage**:

```bash
# Vitest
npm run test -- --coverage

# Jest
npm run test -- --coverage

# Playwright (via Istanbul)
npx playwright test --project=coverage
```

**Review coverage**:

```bash
# Open HTML report
open coverage/index.html
```

**Coverage rules**:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
      exclude: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/test/**',
      ],
    },
  },
});
```

### 7.5 Common Pitfalls to Avoid

#### Pitfall 1: Testing Implementation Details

**Bad**:
```typescript
it('should update state variable', () => {
  const { result } = renderHook(() => useAuth());
  expect(result.current.internalState).toBe('loading');
});
```

**Good**:
```typescript
it('should show loading indicator', () => {
  render(<LoginButton />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
```

#### Pitfall 2: Not Waiting for Async Operations

**Bad**:
```typescript
it('should display user data', () => {
  render(<UserProfile />);
  expect(screen.getByText('[email protected]')).toBeInTheDocument(); // Fails!
});
```

**Good**:
```typescript
it('should display user data', async () => {
  render(<UserProfile />);
  expect(await screen.findByText('[email protected]')).toBeInTheDocument();
});
```

#### Pitfall 3: Shared Mutable State

**Bad**:
```typescript
let user = { id: 1, email: 'test@example.com' };

it('test 1', () => {
  user.email = 'changed@example.com'; // Affects other tests!
});
```

**Good**:
```typescript
beforeEach(() => {
  user = createTestUser(); // Fresh instance each time
});
```

#### Pitfall 4: Testing Auth0 Internals

**Bad**:
```typescript
it('should validate Auth0 JWT signature', () => {
  // Don't test Auth0's JWT validation
});
```

**Good**:
```typescript
it('should reject request without valid token', () => {
  // Test your app's behavior
});
```

#### Pitfall 5: Flaky Tests

**Causes**:
- Race conditions
- Time-dependent code
- External dependencies
- Shared state

**Solutions**:
- Use `waitFor` for async assertions
- Mock timers
- Mock external APIs
- Clean state between tests

```typescript
// Mock timers
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('should expire after 1 hour', () => {
  const token = createToken();
  vi.advanceTimersByTime(3600000); // 1 hour
  expect(token.isExpired()).toBe(true);
});
```

### 7.6 Test Organization

**Structure by feature**:

```
apps/web-start/src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginButton.tsx
│   │   │   └── LoginButton.test.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useAuth.test.ts
│   │   └── utils/
│   │       ├── token.ts
│   │       └── token.test.ts
```

**Naming conventions**:
- Unit tests: `*.test.ts`
- Component tests: `*.test.tsx`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.spec.ts`

---

## 8. Implementation Roadmap

### Phase 1: Setup (Week 1)

**Tasks**:
1. Install testing dependencies
2. Configure Vitest for frontend
3. Configure Jest for backend
4. Set up Playwright
5. Create test utility files

**Validation**:
```bash
npm run test:unit     # Should run
npm run test:e2e      # Should run
```

### Phase 2: Backend Tests (Week 2)

**Tasks**:
1. Write unit tests for guards
2. Write unit tests for services
3. Write integration tests for endpoints
4. Set up test database
5. Achieve 70% coverage

**Validation**:
```bash
npm run test --filter=api -- --coverage
# Coverage: >70%
```

### Phase 3: Frontend Tests (Week 3)

**Tasks**:
1. Mock useAuth0 hook
2. Write component tests
3. Write hook tests
4. Set up MSW
5. Achieve 70% coverage

**Validation**:
```bash
npm run test --filter=web-start -- --coverage
# Coverage: >70%
```

### Phase 4: E2E Tests (Week 4)

**Tasks**:
1. Set up test users in Auth0
2. Write OAuth flow tests
3. Write protected route tests
4. Configure CI/CD
5. Implement auth state caching

**Validation**:
```bash
npm run test:e2e
# All critical paths pass
```

### Phase 5: CI/CD Integration (Week 5)

**Tasks**:
1. Create GitHub Actions workflow
2. Configure test database in CI
3. Add secrets management
4. Set up test reporting
5. Configure branch protection

**Validation**:
- PR checks run automatically
- Tests pass in CI
- Coverage reports generated

### Quick Start Commands

```bash
# 1. Install all dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Set up test environment
cp .env.example .env.test
# Edit .env.test with test credentials

# 4. Run all tests
npm run test:all

# 5. Run specific test suites
npm run test:unit              # Unit tests
npm run test:component         # Component tests
npm run test:api               # API integration tests
npm run test:e2e               # E2E tests
npm run test:e2e:auth          # Auth E2E tests only

# 6. Development mode
npm run test:watch             # Watch mode for unit tests
npm run test:e2e:ui            # Interactive E2E testing
```

---

## Related Documentation

- [Testing Architecture](./TESTING_ARCHITECTURE.md) - Overall testing strategy
- [Auth0 Testing Guide](../authentication/TESTING_GUIDE.md) - Manual testing with Auth0
- [Playwright Documentation](https://playwright.dev)
- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [MSW Documentation](https://mswjs.io)

---

## Summary

This guide provides a complete testing strategy for Auth0-integrated full-stack applications:

**Key Takeaways**:
1. Follow the testing pyramid: More unit tests, fewer E2E tests
2. Mock Auth0 for unit/component tests, use real Auth0 for critical E2E tests
3. Use Playwright for E2E (better OAuth support than Cypress)
4. Leverage MSW for API mocking in frontend tests
5. Use separate Auth0 test tenant
6. Cache auth tokens to avoid rate limits
7. Store secrets in environment variables, not code
8. Aim for 70-80% code coverage
9. Run tests in parallel for speed
10. Test behavior, not implementation

**Testing Stack Summary**:
- **Unit/Component**: Vitest + Testing Library
- **Backend Integration**: Jest + Supertest
- **E2E**: Playwright
- **API Mocking**: MSW
- **Auth0**: Real for E2E, mocked for unit/component

With this comprehensive testing strategy, you can ensure your Auth0-integrated application is reliable, secure, and maintainable.
