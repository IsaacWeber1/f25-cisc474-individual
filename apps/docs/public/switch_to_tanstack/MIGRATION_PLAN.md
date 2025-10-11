# TanStack Start Migration Plan

## Executive Summary

Migrating from Next.js 15 to TanStack Start/Router with TanStack Query (React Query). This migration will modernize the data fetching strategy and routing approach while maintaining all existing functionality.

## Current Stack vs Target Stack

### Current (Next.js)
- **Framework**: Next.js 15 with App Router
- **Routing**: File-based routing with `app/` directory
- **Data Fetching**: Client-side with `useEffect` + `fetch`
- **State Management**: React `useState` hooks
- **Styling**: Inline styles
- **Port**: 3001

### Target (TanStack)
- **Framework**: TanStack Start (Vite-based)
- **Routing**: TanStack Router with file-based routing
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: TanStack Query cache + React hooks
- **Styling**: CSS modules (or Tailwind CSS)
- **Port**: 3001 (same)

## Key Benefits of Migration

1. **Better Data Fetching**: TanStack Query provides caching, background refetching, optimistic updates
2. **Developer Experience**: Built-in devtools for routing and queries
3. **Performance**: Automatic query deduplication and intelligent refetching
4. **Type Safety**: Better TypeScript support with TanStack Router
5. **Simpler Code**: No more manual `useEffect` + `loading` + `error` state management

## Architecture Overview

### Directory Structure
```
apps/
├── web/                    # OLD: Next.js app (keep for reference)
├── web-start/             # NEW: TanStack Start app
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── integrations/  # App-wide integrations
│   │   │   ├── devtools.tsx        # Dev tools configuration
│   │   │   ├── fetcher.ts          # Backend API client
│   │   │   └── root-provider.tsx   # React Query provider
│   │   ├── routes/        # File-based routes
│   │   │   ├── __root.tsx          # Root layout
│   │   │   ├── index.tsx           # Home page
│   │   │   └── courses.tsx         # Courses page (example)
│   │   ├── router.tsx     # Router configuration
│   │   ├── routeTree.gen.ts  # Auto-generated route tree
│   │   └── styles.css     # Global styles
│   ├── vite.config.ts     # Vite configuration
│   ├── package.json
│   └── tsconfig.json
```

## Phase 1: Setup & Infrastructure

### Step 1.1: Copy web-start from Upstream

```bash
# Ensure upstream is configured
git remote add upstream https://github.com/acbart/cisc474-f25-individual-project-starter.git
git fetch upstream

# Copy the entire web-start directory from upstream
git checkout upstream/main -- apps/web-start

# Review what was copied
git status
```

### Step 1.2: Install Dependencies

```bash
# From project root
npm install

# This will install all dependencies for web-start workspace
```

### Step 1.3: Configure Environment Variables

Create `apps/web-start/.env`:
```env
VITE_BACKEND_URL=http://localhost:3000
```

For production deployment:
```env
VITE_BACKEND_URL=https://f25-cisc474-individual-n1wv.onrender.com
```

### Step 1.4: Update Turbo Configuration

Update `turbo.json` to include web-start:
```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

Update root `package.json` to add web-start dev script:
```json
{
  "scripts": {
    "dev:tanstack": "turbo run dev --filter=web-start --filter=api",
    "dev:all": "turbo run dev"
  }
}
```

## Phase 2: Core Infrastructure Setup

### Step 2.1: Backend API Client (`src/integrations/fetcher.ts`)

**Purpose**: Centralized backend communication with retry logic

```typescript
// Enhanced version with retry logic (similar to current apiClient.ts)
export function backendFetcher<T>(
  endpoint: string,
  retryCount = 0
): () => Promise<T> {
  const maxRetries = 3;
  const retryDelay = 2000;

  return async () => {
    const url = import.meta.env.VITE_BACKEND_URL + endpoint;

    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      // Handle 502 (Render.com spin-up)
      if (response.status === 502 && retryCount < maxRetries) {
        const delay = retryDelay * (retryCount + 1);
        console.log(`[fetcher] 502 error. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return backendFetcher<T>(endpoint, retryCount + 1)();
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // Retry on network errors
      if (error instanceof TypeError && retryCount < maxRetries) {
        const delay = retryDelay * (retryCount + 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return backendFetcher<T>(endpoint, retryCount + 1)();
      }
      throw error;
    }
  };
}
```

### Step 2.2: React Query Provider (`src/integrations/root-provider.tsx`)

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  return { queryClient };
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

## Phase 3: Page-by-Page Migration

### Migration Pattern

For each Next.js page, follow this pattern:

#### Next.js Pattern (OLD)
```typescript
'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetch('/api/endpoint');
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{/* render data */}</div>;
}
```

#### TanStack Pattern (NEW)
```typescript
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { backendFetcher } from '../integrations/fetcher';

export const Route = createFileRoute('/page')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, error, isFetching } = useQuery({
    queryKey: ['endpoint'],
    queryFn: backendFetcher('/endpoint'),
  });

  if (isFetching) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{/* render data */}</div>;
}
```

### Page Migration Mapping

| Next.js Route | TanStack Route | Priority | Complexity |
|--------------|----------------|----------|------------|
| `/` (Dashboard) | `src/routes/index.tsx` | HIGH | Medium |
| `/login` | `src/routes/login.tsx` | HIGH | Low |
| `/profile` | `src/routes/profile.tsx` | HIGH | Low |
| `/courses` | `src/routes/courses.tsx` | HIGH | Low |
| `/course/$id` | `src/routes/course.$id.tsx` | HIGH | Medium |
| `/course/$id/assignments` | `src/routes/course.$id.assignments.tsx` | MEDIUM | Medium |
| `/course/$id/assignments/$assignmentId` | `src/routes/course.$id.assignments.$assignmentId.tsx` | MEDIUM | High |
| `/course/$id/grades` | `src/routes/course.$id.grades.tsx` | MEDIUM | High |
| `/course/$id/reflections` | `src/routes/course.$id.reflections.tsx` | MEDIUM | Medium |
| `/course/$id/reflections/$reflectionId` | `src/routes/course.$id.reflections.$reflectionId.tsx` | LOW | High |

### Step 3.1: Migrate Dashboard (`/`)

**File**: `apps/web-start/src/routes/index.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { backendFetcher } from '../integrations/fetcher';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

interface User {
  id: string;
  name: string;
  email: string;
  enrollments: Array<{
    role: string;
    course: {
      id: string;
      code: string;
      title: string;
      description?: string;
    };
  }>;
}

function Dashboard() {
  // Get current user (from cookie/session)
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: backendFetcher('/api/auth/session'),
  });

  const userId = session?.userId;

  // Fetch user data
  const { data: user, isFetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: backendFetcher(`/users/${userId}`),
    enabled: !!userId,
  });

  if (isFetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  const courses = user.enrollments.map(e => e.course);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {user.name}!</h1>
      <h2>Your Courses</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {courses.map(course => (
          <Link
            key={course.id}
            to="/course/$id"
            params={{ id: course.id }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <h3>{course.code}: {course.title}</h3>
            <p>{course.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### Step 3.2: Migrate Course Detail Page

**File**: `apps/web-start/src/routes/course.$id.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { backendFetcher } from '../integrations/fetcher';

export const Route = createFileRoute('/course/$id')({
  component: CourseDetail,
});

function CourseDetail() {
  const { id } = Route.useParams();

  // Parallel queries
  const { data: course, isFetching: courseLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: backendFetcher(`/courses/${id}`),
  });

  const { data: assignments } = useQuery({
    queryKey: ['assignments', id],
    queryFn: backendFetcher(`/assignments?courseId=${id}`),
    enabled: !!course,
  });

  if (courseLoading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{course.code}: {course.title}</h1>
      <p>{course.description}</p>

      <nav style={{ display: 'flex', gap: '1rem', margin: '2rem 0' }}>
        <Link to="/course/$id/assignments" params={{ id }}>
          Assignments
        </Link>
        <Link to="/course/$id/grades" params={{ id }}>
          Grades
        </Link>
        <Link to="/course/$id/reflections" params={{ id }}>
          Reflections
        </Link>
      </nav>

      <h2>Recent Assignments</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {assignments?.slice(0, 3).map(assignment => (
          <div key={assignment.id} style={{ padding: '1rem', border: '1px solid #ccc' }}>
            <h3>{assignment.title}</h3>
            <p>{assignment.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 3.3: Create Shared Layouts

**File**: `apps/web-start/src/routes/__root.tsx` (already exists)

Add navigation:
```typescript
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <nav style={{
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
          <Link to="/courses" style={{ marginRight: '1rem' }}>Courses</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        {children}
        {/* Devtools */}
        <Scripts />
      </body>
    </html>
  );
}
```

## Phase 4: Advanced Features

### Step 4.1: Add Authentication Check

Create `src/integrations/auth.ts`:
```typescript
import { backendFetcher } from './fetcher';

export function useAuth() {
  return useQuery({
    queryKey: ['session'],
    queryFn: backendFetcher('/api/auth/session'),
    retry: false,
  });
}
```

### Step 4.2: Add Optimistic Updates

For mutations (future assignment submission):
```typescript
const mutation = useMutation({
  mutationFn: (data) =>
    fetch(url, { method: 'POST', body: JSON.stringify(data) }),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['assignments'] });

    // Snapshot previous value
    const previousData = queryClient.getQueryData(['assignments']);

    // Optimistically update
    queryClient.setQueryData(['assignments'], old => [...old, newData]);

    return { previousData };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['assignments'], context.previousData);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ['assignments'] });
  },
});
```

## Phase 5: Testing Strategy

### Step 5.1: Local Testing

```bash
# Terminal 1: Start backend
cd apps/api
npm run dev

# Terminal 2: Start TanStack frontend
cd apps/web-start
npm run dev

# Navigate to http://localhost:3001
```

### Step 5.2: Testing Checklist

- [ ] Dashboard loads with user data
- [ ] Course list displays correctly
- [ ] Navigation between pages works
- [ ] API calls show in React Query Devtools
- [ ] Loading states display during fetches
- [ ] Error states display on failures
- [ ] Back button works correctly
- [ ] URL parameters work (course ID, assignment ID)
- [ ] Data caching works (no re-fetch on navigation back)

### Step 5.3: Performance Testing

- [ ] Check Network tab: queries should be deduplicated
- [ ] Verify React Query cache in devtools
- [ ] Test with slow 3G throttling
- [ ] Verify retry logic works with backend down

## Phase 6: Deployment

### Step 6.1: Build Configuration

Update `vite.config.ts` for production:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3001,
  },
});
```

### Step 6.2: Environment Variables for Vercel

Create `.env.production`:
```env
VITE_BACKEND_URL=https://f25-cisc474-individual-n1wv.onrender.com
```

### Step 6.3: Deploy to Vercel

```bash
# Build locally first
npm run build

# Deploy
vercel --prod
```

Vercel configuration (auto-detected or create `vercel.json`):
```json
{
  "buildCommand": "cd ../.. && npm run build --filter=web-start",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Phase 7: Cleanup & Documentation

### Step 7.1: Update README

Add to root README.md:
```markdown
## TanStack Start Frontend

The new frontend uses TanStack Start with React Query.

### Development
\`\`\`bash
npm run dev:tanstack
\`\`\`

### Key Features
- TanStack Router for type-safe routing
- TanStack Query for data fetching with caching
- Built-in devtools
- Automatic retry logic
- Optimistic updates
```

### Step 7.2: Keep Old Frontend (Optional)

Don't delete `apps/web` immediately - keep it for reference during migration.

Rename in `turbo.json` to disable old web:
```json
{
  "tasks": {
    "dev": {
      "dependsOn": ["^build"],
      "cache": false
    }
  }
}
```

## Troubleshooting

### Issue: "Cannot find module '@tanstack/react-query'"

**Solution**:
```bash
cd apps/web-start
npm install
```

### Issue: "VITE_BACKEND_URL is undefined"

**Solution**: Create `.env` file in `apps/web-start/`

### Issue: Routes not updating

**Solution**: Restart dev server to regenerate `routeTree.gen.ts`

### Issue: CORS errors

**Solution**: Backend CORS already configured for localhost:3001

### Issue: TypeScript errors in routes

**Solution**: Run `npm run typecheck` and fix types incrementally

## Timeline Estimate

- **Phase 1 (Setup)**: 1 hour
- **Phase 2 (Infrastructure)**: 2 hours
- **Phase 3 (Page Migration)**: 8-12 hours (depends on page complexity)
- **Phase 4 (Advanced Features)**: 2-4 hours
- **Phase 5 (Testing)**: 2-3 hours
- **Phase 6 (Deployment)**: 1-2 hours
- **Phase 7 (Cleanup)**: 1 hour

**Total**: 17-25 hours of development time

## Success Criteria

✅ All pages from Next.js app migrated to TanStack Start
✅ React Query handling all data fetching
✅ No manual `useEffect` for data fetching
✅ Loading and error states working
✅ Navigation works correctly
✅ Deployed to Vercel successfully
✅ At least one page connected to database via backend API

## Resources

- [TanStack Router Docs](https://tanstack.com/router/latest)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Reference Repository](https://github.com/acbart/cisc474-f25-individual-project-starter)
- [Vite Docs](https://vitejs.dev/)
