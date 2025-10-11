# Quick Wins Guide - Immediate Improvements

**Time Required**: 2-4 hours
**Risk Level**: 🟢 Low
**Can Stop Anytime**: ✅ Yes

This guide walks you through the highest-impact, lowest-risk improvements you can make **right now** to eliminate the worst technical debt.

---

## Prerequisites

```bash
# 1. Ensure you're in the right directory
cd "/Users/owner/Assignments/Advanced Web Tech/f25-cisc474-individual/apps/web-start"

# 2. Ensure build passes
npm run build

# 3. Ensure lint baseline
npm run lint 2>&1 | tee lint-before.txt

# 4. Create feature branch
git checkout -b feat/quick-wins

# You're ready!
```

---

## Quick Win #1: Constants File (30 minutes)

**Problem**: Same user ID hardcoded in 9 files, colors everywhere
**Solution**: One source of truth

### Step 1: Create the File

```bash
mkdir -p src/config
```

Create `src/config/constants.ts`:

```typescript
/**
 * Centralized constants - Single source of truth
 * Created: 2025-10-10 (Architecture Refactor Phase 1)
 */

// User Authentication
export const CURRENT_USER_ID = 'cmfr0jaxg0001k07ao6mvl0d2';

// API Endpoints
export const API_ENDPOINTS = {
  users: '/users',
  courses: '/courses',
  assignments: '/assignments',
  submissions: '/submissions',
  grades: '/grades',
} as const;

// Design Tokens - Colors
export const COLORS = {
  // Primary
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#2563eb',
    600: '#1d4ed8',
    700: '#1e40af',
    900: '#1e3a8a',
  },
  // Success/Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#15803d',
    600: '#166534',
    700: '#14532d',
  },
  // Gray
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    400: '#9ca3af',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  // Warning/Orange
  warning: {
    100: '#fed7aa',
    500: '#d97706',
    700: '#9a3412',
  },
  // Error/Red
  error: {
    100: '#fecaca',
    200: '#fef2f2',
    500: '#dc2626',
    600: '#dc2626',
    900: '#991b1b',
  },
  // Purple
  purple: {
    100: '#f3e8ff',
    200: '#e9d5ff',
    500: '#7c3aed',
    800: '#6b21a8',
  },
} as const;

// Design Tokens - Spacing
export const SPACING = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
} as const;

// Design Tokens - Typography
export const TYPOGRAPHY = {
  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2rem',     // 32px
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;
```

### Step 2: Test It Works

```typescript
// Test in any route file temporarily
import { CURRENT_USER_ID } from '../config/constants';
console.log(CURRENT_USER_ID); // Should log the ID
```

### Step 3: Commit

```bash
git add src/config/constants.ts
git commit -m "feat: add constants file for centralized configuration"
```

**Impact**: Foundation for all future improvements ✅

---

## Quick Win #2: Auth Context (45 minutes)

**Problem**: User ID hardcoded 9 times
**Solution**: One context, used everywhere

### Step 1: Create AuthContext

```bash
mkdir -p src/contexts
```

Create `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CURRENT_USER_ID } from '../config/constants';
import type { User } from '../types/api';

interface AuthContextType {
  currentUser: User | null;
  currentUserId: string;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, just use the hardcoded ID
    // TODO: Replace with actual session management later
    setIsLoading(false);
  }, []);

  const value = {
    currentUser,
    currentUserId: CURRENT_USER_ID, // From constants!
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Step 2: Add Provider to Root

Update `src/routes/__root.tsx`:

```typescript
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext'; // Add this
import { queryClient } from '../integrations/root-provider';

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider> {/* Add this wrapper */}
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  ),
});
```

### Step 3: Replace in ONE file first (test)

Update `src/routes/index.tsx`:

```typescript
// BEFORE:
const userId = 'cmfr0jaxg0001k07ao6mvl0d2';

// AFTER:
import { useAuth } from '../contexts/AuthContext';
// ...
const { currentUserId } = useAuth();
// Then use currentUserId everywhere instead of userId
```

### Step 4: Test it works

```bash
npm run build
# Should pass

# Check the page loads
# Navigate to localhost:3001
```

### Step 5: Replace in remaining 8 files

Update these files (same pattern):
- `src/routes/profile.tsx`
- `src/routes/users.tsx`
- `src/routes/course.$id.tsx`
- `src/routes/course.$id.assignments.tsx`
- `src/routes/course.$id.assignments.$assignmentId.tsx`
- `src/routes/course.$id.grades.tsx`
- `src/routes/course.$id.reflections.tsx`
- `src/routes/course.$id.reflections.$reflectionId.tsx`

### Step 6: Verify zero hardcoded IDs

```bash
grep -r "cmfr0jaxg0001k07ao6mvl0d2" src/ --include="*.tsx"
# Should ONLY show: src/config/constants.ts
```

### Step 7: Commit

```bash
git add .
git commit -m "feat: add AuthContext and replace all hardcoded user IDs"
```

**Impact**: Zero hardcoded IDs, ready for real auth later ✅

---

## Quick Win #3: Shared Components (1 hour)

**Problem**: Loading spinner duplicated 5+ times, error handling duplicated 10+ times
**Solution**: One component each

### Step 1: Create LoadingSpinner

```bash
mkdir -p src/components/common
```

Create `src/components/common/LoadingSpinner.tsx`:

```typescript
import { ReactNode } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message = 'Loading...', fullScreen = true }: LoadingSpinnerProps) {
  const containerClass = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div
          className="inline-block w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
        {message && (
          <p className="mt-4 text-gray-600 text-lg">{message}</p>
        )}
      </div>
    </div>
  );
}
```

**Note**: This uses Tailwind classes. If you haven't installed Tailwind yet, use inline styles temporarily:

```typescript
// Temporary version without Tailwind:
export function LoadingSpinner({ message = 'Loading...', fullScreen = true }: LoadingSpinnerProps) {
  return (
    <div style={{
      minHeight: fullScreen ? '100vh' : 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: fullScreen ? 0 : '2rem',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          width: '3rem',
          height: '3rem',
          border: '4px solid #e5e7eb',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        {message && <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '1.125rem' }}>{message}</p>}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
```

### Step 2: Create ErrorMessage

Create `src/components/common/ErrorMessage.tsx`:

```typescript
interface ErrorMessageProps {
  error: Error | unknown;
  title?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  error,
  title = 'Error Loading Data',
  onRetry,
}: ErrorMessageProps) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: '#dc2626',
        }}>
          {title}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          {errorMessage}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
```

### Step 3: Create PageLayout

Create `src/components/common/PageLayout.tsx`:

```typescript
import { ReactNode } from 'react';
import Navigation from '../Navigation';
import type { User } from '../../types/api';

interface PageLayoutProps {
  children: ReactNode;
  currentUser?: User | null;
}

export function PageLayout({ children, currentUser = null }: PageLayoutProps) {
  return (
    <>
      <Navigation currentUser={currentUser} />
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
      }}>
        {children}
      </main>
    </>
  );
}
```

### Step 4: Use in ONE file first (test)

Update `src/routes/index.tsx`:

```typescript
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { PageLayout } from '../components/common/PageLayout';

// Replace loading state:
if (userLoading) return <LoadingSpinner message="Loading dashboard..." />;

// Replace error state:
if (userError) return <ErrorMessage error={userError} title="Error Loading Dashboard" />;

// Replace layout:
return (
  <PageLayout currentUser={user}>
    {/* Your existing content */}
  </PageLayout>
);
```

### Step 5: Test it works

```bash
npm run build
# Check localhost:3001
```

### Step 6: Replace in all other files

Update loading/error states in:
- All course routes
- All assignment routes
- All reflection routes
- Profile, users, etc.

### Step 7: Verify no duplicates

```bash
# Should find very few or zero results:
grep -r "minHeight.*100vh" src/routes/ --include="*.tsx"
```

### Step 8: Commit

```bash
git add .
git commit -m "feat: extract shared LoadingSpinner, ErrorMessage, and PageLayout components"
```

**Impact**: DRY principle applied, consistent UX ✅

---

## Quick Win #4: Route Constants (30 minutes)

**Problem**: Route strings scattered in 17+ places
**Solution**: Type-safe route builders

### Step 1: Create routes.ts

Create `src/config/routes.ts`:

```typescript
/**
 * Type-safe route builders
 * Prevents typos and provides auto-complete
 */

export const ROUTES = {
  // Static routes
  home: '/',
  courses: '/courses',
  profile: '/profile',
  users: '/users',

  // Dynamic routes - type-safe builders
  course: (id: string) => `/course/${id}`,
  courseAssignments: (id: string) => `/course/${id}/assignments`,
  courseAssignment: (courseId: string, assignmentId: string) =>
    `/course/${courseId}/assignments/${assignmentId}`,
  courseGrades: (id: string) => `/course/${id}/grades`,
  courseReflections: (id: string) => `/course/${id}/reflections`,
  courseReflection: (courseId: string, reflectionId: string) =>
    `/course/${courseId}/reflections/${reflectionId}`,
} as const;

// Type helpers for params
export type CourseParams = { id: string };
export type AssignmentParams = { id: string; assignmentId: string };
export type ReflectionParams = { id: string; reflectionId: string };
```

### Step 2: Use in Navigation

Update `src/components/Navigation.tsx`:

```typescript
import { ROUTES } from '../config/routes';

// Replace:
<Link to="/">Dashboard</Link>
// With:
<Link to={ROUTES.home}>Dashboard</Link>

<Link to="/courses">Courses</Link>
// With:
<Link to={ROUTES.courses}>Courses</Link>

// Etc for all links
```

### Step 3: Use in Routes

Update course detail page `src/routes/course.$id.tsx`:

```typescript
import { ROUTES } from '../config/routes';

// Replace:
<Link to="/course/$id/assignments" params={{ id: courseId }}>
// With:
<Link to={ROUTES.courseAssignments(courseId)}>
```

### Step 4: Commit

```bash
git add .
git commit -m "feat: add route constants and type-safe builders"
```

**Impact**: Type safety, no route typos ✅

---

## Verification Checklist

After completing all quick wins:

```bash
# 1. Build passes
npm run build

# 2. Lint status (should be same or better)
npm run lint

# 3. No hardcoded user IDs
grep -r "cmfr0jaxg0001k07ao6mvl0d2" src/ --include="*.tsx"
# Should only show in constants.ts

# 4. Components exist
ls src/components/common/
# Should show: LoadingSpinner.tsx ErrorMessage.tsx PageLayout.tsx

# 5. Config exists
ls src/config/
# Should show: constants.ts routes.ts

# 6. Context exists
ls src/contexts/
# Should show: AuthContext.tsx

# 7. Manual test
# Open localhost:3001
# Navigate through all pages
# Verify loading states work
# Verify error states work (disable backend to test)
```

---

## What's Next?

You've completed the **critical fixes** (Phase 1 foundation)!

**Next steps**:
1. See `planning/IMPLEMENTATION_ROADMAP.md` for Phase 2 (Tailwind CSS)
2. Read `output/ARCHITECTURE_PROPOSAL.md` for full vision
3. Check `CURRENT_STATE.md` for latest status

**Quick wins completed** means:
- ✅ Foundation for all future work established
- ✅ No more hunting through 9 files to change user ID
- ✅ Consistent loading and error UI
- ✅ Type-safe routing
- ✅ Ready for Tailwind migration

---

## Troubleshooting

### Build fails after AuthContext
- Check __root.tsx has AuthProvider wrapper
- Check all routes import useAuth correctly
- Check TypeScript types match

### Components not rendering
- Check import paths are correct
- Check component exports are named exports
- Try restarting dev server

### Routes not working
- Check ROUTES import path
- Check route builder functions match your routes
- Check TanStack Router regenerated (automatic)

---

**Completion time**: 2-4 hours
**Impact**: Massive (foundation for everything)
**Risk**: Low (all backwards compatible)
**Ready for**: Phase 2 (Tailwind CSS migration)
