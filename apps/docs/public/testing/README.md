# Testing Documentation

**Last Updated**: 2025-10-23

This directory contains comprehensive testing documentation for the full-stack course management application with Auth0 authentication.

---

## Documentation Structure

### 📘 [Comprehensive Testing Guide](./COMPREHENSIVE_TESTING_GUIDE.md)
**The main testing guide** - Start here for a complete understanding of testing strategy.

**Contents**:
- Testing pyramid and strategy overview
- Backend (NestJS) testing with code examples
- Frontend (React/TanStack) testing with code examples
- E2E testing with Playwright
- Auth0-specific testing strategies
- Testing tools comparison and setup
- Best practices and common pitfalls
- Implementation roadmap

**When to use**: Learning the testing strategy, implementing new tests, understanding best practices.

---

### 📋 [Quick Reference](./QUICK_REFERENCE.md)
**Command cheat sheet and common patterns** - Use this as a daily reference.

**Contents**:
- Common test commands
- Test template code snippets
- Mocking patterns (Auth0, APIs, database)
- Troubleshooting guide
- Environment variable setup

**When to use**: Daily development, quick lookups, troubleshooting.

---

### 🏗️ [Testing Architecture](./TESTING_ARCHITECTURE.md)
**High-level testing architecture and philosophy** - Reference for architectural decisions.

**Contents**:
- Testing philosophy and principles
- Test pyramid structure
- Testing stack overview
- Test suite descriptions
- CI/CD integration
- Coverage goals

**When to use**: Understanding the big picture, planning test implementation, team onboarding.

---

### ⚖️ [Tools Comparison](./TOOLS_COMPARISON.md)
**Comparison of testing tools and recommendations** - Help choosing the right tools.

**Contents**:
- Jest vs Vitest comparison
- Playwright vs Cypress for E2E
- MSW vs alternatives for API mocking
- Performance benchmarks
- Compatibility matrix
- Migration guides

**When to use**: Choosing testing tools, justifying tool decisions, evaluating alternatives.

---

## Getting Started

### Prerequisites

```bash
# 1. Node.js 18+
node --version  # Should be v18 or higher

# 2. Dependencies installed
npm install

# 3. Playwright browsers
npx playwright install
```

### Quick Start (3 steps)

```bash
# 1. Set up test environment
cp .env.example .env.test
# Edit .env.test with test credentials

# 2. Run unit tests
npm run test

# 3. Run E2E tests
npm run test:e2e
```

### Full Setup

Follow the [Comprehensive Testing Guide - Implementation Roadmap](./COMPREHENSIVE_TESTING_GUIDE.md#8-implementation-roadmap) for detailed setup instructions.

---

## Testing Stack Summary

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit Tests** | Vitest/Jest | Test individual functions/classes |
| **Component Tests** | Vitest + Testing Library | Test React components |
| **Integration Tests** | Jest + Supertest | Test API endpoints |
| **E2E Tests** | Playwright | Test complete user flows |
| **API Mocking** | MSW | Mock API responses |
| **Auth Mocking** | Custom mocks | Mock Auth0 SDK |

---

## Common Commands

```bash
# Run all tests
npm run test:all

# Run specific test suites
npm run test                    # Unit tests
npm run test:e2e                # E2E tests
npm run test:e2e:auth           # Auth E2E tests only
npm run test:api                # Backend integration tests

# Development workflows
npm run test:watch              # Watch mode
npm run test:e2e:ui             # Interactive E2E UI
npm run test:e2e:debug          # Debug E2E tests

# Coverage
npm run test -- --coverage      # Generate coverage report
```

See [Quick Reference](./QUICK_REFERENCE.md) for more commands.

---

## Test File Organization

```
Project Structure:
├── apps/
│   ├── api/                    # Backend
│   │   ├── src/
│   │   │   └── **/*.spec.ts   # Unit tests (co-located)
│   │   └── test/
│   │       └── **/*.e2e.ts    # Integration tests
│   │
│   └── web-start/              # Frontend
│       └── src/
│           ├── **/*.test.tsx  # Component tests (co-located)
│           └── test/
│               ├── setup.ts   # Test configuration
│               └── mocks/     # Mock data/handlers
│
├── tests/                      # Root-level tests
│   └── e2e/
│       ├── auth/              # Auth E2E tests
│       ├── features/          # Feature E2E tests
│       └── helpers/           # Test utilities
│
└── apps/docs/public/testing/   # This directory
    ├── README.md              # You are here
    ├── COMPREHENSIVE_TESTING_GUIDE.md
    ├── QUICK_REFERENCE.md
    └── TESTING_ARCHITECTURE.md
```

---

## Testing Workflow

### During Development

```bash
# 1. Write test first (TDD)
# Create test file: feature.test.ts

# 2. Run in watch mode
npm run test:watch

# 3. Implement feature until test passes

# 4. Run all tests before commit
npm run test:all
```

### Before Pull Request

```bash
# 1. Run full test suite
npm run test:all

# 2. Check coverage
npm run test -- --coverage

# 3. Run linter
npm run lint

# 4. Run E2E tests
npm run test:e2e
```

### CI/CD Pipeline

Tests run automatically on:
- Every push to feature branches
- Every pull request to main
- Before deployment

See `.github/workflows/` for CI configuration.

---

## Key Testing Principles

1. **Follow the Testing Pyramid**: 70% unit, 20% integration, 10% E2E
2. **Mock Auth0 for speed**: Use real Auth0 only for critical E2E tests
3. **Test behavior, not implementation**: Focus on what users see/do
4. **Make tests independent**: Each test should run in isolation
5. **Use descriptive test names**: Tests are documentation
6. **Keep tests fast**: Slow tests won't get run

---

## Auth0 Testing Strategy

### Unit & Component Tests
- **Mock** the `useAuth0` hook
- **Mock** JWT validation
- **Fast** and **deterministic**

### Integration Tests
- **Mock** Auth0 or use test JWTs
- Test your app's auth logic
- Don't test Auth0 internals

### E2E Tests
- **Real** Auth0 test tenant
- Test complete OAuth flows
- Use test user credentials
- Cache auth state for speed

See [Comprehensive Testing Guide - Auth0 Testing](./COMPREHENSIVE_TESTING_GUIDE.md#5-auth0-specific-testing) for details.

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Tests fail locally | Check environment variables, database connection |
| Tests pass locally, fail in CI | Verify CI environment variables and timeouts |
| Playwright browser not found | Run `npx playwright install` |
| Auth0 rate limiting | Cache tokens, use saved auth state |
| Flaky E2E tests | Add proper waits, use `waitFor` |

See [Quick Reference - Troubleshooting](./QUICK_REFERENCE.md#troubleshooting) for more.

---

## Code Examples

### Quick Test Examples

**Backend Unit Test**:
```typescript
describe('UsersService', () => {
  it('should create user', async () => {
    const user = await service.create({ email: '[email protected]' });
    expect(user.email).toBe('[email protected]');
  });
});
```

**Frontend Component Test**:
```typescript
it('should show login button when unauthenticated', () => {
  render(<LoginButton />);
  expect(screen.getByText('Log In')).toBeInTheDocument();
});
```

**E2E Test**:
```typescript
test('should login successfully', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Log In');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

For complete examples, see the [Comprehensive Testing Guide](./COMPREHENSIVE_TESTING_GUIDE.md).

---

## Coverage Goals

| Test Type | Target | Current |
|-----------|--------|---------|
| Unit Tests | 80% | TBD |
| Integration Tests | 70% | TBD |
| E2E Critical Paths | 100% | TBD |
| Overall | 75% | TBD |

Run `npm run test -- --coverage` to check current coverage.

---

## Resources

### Internal Documentation
- [Comprehensive Testing Guide](./COMPREHENSIVE_TESTING_GUIDE.md) - Main testing guide
- [Quick Reference](./QUICK_REFERENCE.md) - Command reference
- [Testing Architecture](./TESTING_ARCHITECTURE.md) - High-level architecture
- [Tools Comparison](./TOOLS_COMPARISON.md) - Tool selection guide
- [Auth0 Testing Guide](../authentication/TESTING_GUIDE.md) - Manual Auth0 testing

### External Resources
- [Playwright Documentation](https://playwright.dev)
- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [MSW Documentation](https://mswjs.io)
- [Auth0 Testing Best Practices](https://auth0.com/docs/testing)

---

## Contributing to Tests

### Adding New Tests

1. **Choose the right test type**:
   - Unit test for isolated logic
   - Component test for UI components
   - Integration test for API endpoints
   - E2E test for critical user flows

2. **Follow naming conventions**:
   - `*.test.ts` for unit tests
   - `*.test.tsx` for component tests
   - `*.spec.ts` for E2E tests

3. **Use existing patterns**:
   - See [Quick Reference](./QUICK_REFERENCE.md) for templates
   - Follow existing test structure in codebase

4. **Update documentation**:
   - Document new test utilities
   - Update this README if adding new test types

### Test Code Quality

- Write descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- One assertion per test (when possible)
- Clean up after tests (database, mocks, etc.)
- Keep tests DRY with helper functions

---

## Next Steps

1. **New to testing?** Start with [Comprehensive Testing Guide](./COMPREHENSIVE_TESTING_GUIDE.md)
2. **Ready to write tests?** Use [Quick Reference](./QUICK_REFERENCE.md) templates
3. **Planning test strategy?** Review [Testing Architecture](./TESTING_ARCHITECTURE.md)
4. **Need to test Auth0?** See [Auth0 Testing Guide](../authentication/TESTING_GUIDE.md)

---

## Summary

This testing documentation provides everything needed to test a modern full-stack application with Auth0 authentication:

- ✅ Comprehensive testing strategy
- ✅ Code examples for all test types
- ✅ Auth0-specific testing patterns
- ✅ Quick reference for daily use
- ✅ Troubleshooting guides
- ✅ Best practices and pitfalls

**Main Documents**:
1. **[Comprehensive Testing Guide](./COMPREHENSIVE_TESTING_GUIDE.md)** - Complete guide (START HERE)
2. **[Quick Reference](./QUICK_REFERENCE.md)** - Daily reference
3. **[Testing Architecture](./TESTING_ARCHITECTURE.md)** - Big picture

---

**Questions or issues?** Check the troubleshooting sections or review the comprehensive guide.
