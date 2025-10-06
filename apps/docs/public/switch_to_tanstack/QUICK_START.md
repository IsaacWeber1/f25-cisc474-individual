# TanStack Migration - Quick Start Guide

## Step 1: Pull the web-start Directory

Since the fork is detached, we've already added the upstream remote. Now copy the web-start app:

```bash
# From project root
cd "/Users/owner/Assignments/Advanced Web Tech/f25-cisc474-individual"

# Copy web-start from upstream
git checkout upstream/main -- apps/web-start

# Check what was added
git status
```

## Step 2: Install Dependencies

```bash
# From project root
npm install
```

This will install all TanStack dependencies for the web-start workspace.

## Step 3: Create Environment File

Create `apps/web-start/.env`:

```bash
echo 'VITE_BACKEND_URL=http://localhost:3000' > apps/web-start/.env
```

## Step 4: Test the Base Setup

```bash
# From project root - start both backend and new frontend
npm run dev
```

The new TanStack app should start on port 3001 alongside the backend on port 3000.

Open: http://localhost:3001

You should see a basic TanStack Start app with a courses page.

## Step 5: Verify Devtools Work

1. Open http://localhost:3001/courses
2. Open browser DevTools (F12)
3. Look for TanStack Router and Query devtools panels at the bottom-right
4. You should see query status and router state

## Step 6: Start Migrating Your First Page

Let's start with the simplest page - the dashboard:

### 6.1: Copy Your Current Dashboard Logic

Look at: `apps/web/app/page.tsx`

### 6.2: Create New Route File

Create: `apps/web-start/src/routes/index.tsx`

Basic template:
```typescript
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { backendFetcher } from '../integrations/fetcher';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  // Your dashboard logic here using useQuery instead of useEffect

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Your dashboard UI */}
    </div>
  );
}
```

### 6.3: Replace useEffect with useQuery

**OLD (Next.js)**:
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    const result = await fetch('/api/endpoint');
    setData(result);
    setLoading(false);
  }
  fetchData();
}, []);
```

**NEW (TanStack)**:
```typescript
const { data, isFetching } = useQuery({
  queryKey: ['endpoint'],
  queryFn: backendFetcher('/endpoint'),
});
```

That's it! TanStack Query handles loading, errors, and caching automatically.

## Step 7: Understanding the Key Files

### `src/integrations/fetcher.ts`
Your centralized backend API client. Already has retry logic for Render.com spin-up.

### `src/integrations/root-provider.tsx`
Sets up React Query client. Configuration is already done.

### `src/routes/__root.tsx`
Root layout with navigation. Add your nav menu here.

### `src/routes/[filename].tsx`
Each file becomes a route automatically:
- `index.tsx` → `/`
- `courses.tsx` → `/courses`
- `course.$id.tsx` → `/course/:id`
- `course.$id.assignments.tsx` → `/course/:id/assignments`

## Step 8: Deploy to Vercel

When ready to deploy:

```bash
# Build
cd apps/web-start
npm run build

# Deploy
vercel --prod
```

Set environment variable in Vercel:
```
VITE_BACKEND_URL=https://f25-cisc474-individual-n1wv.onrender.com
```

## Common Patterns

### Pattern 1: Fetch Single Item
```typescript
const { data: course } = useQuery({
  queryKey: ['course', courseId],
  queryFn: backendFetcher(`/courses/${courseId}`),
});
```

### Pattern 2: Fetch List
```typescript
const { data: courses = [] } = useQuery({
  queryKey: ['courses'],
  queryFn: backendFetcher('/courses'),
  initialData: [],
});
```

### Pattern 3: Dependent Queries
```typescript
// First query
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: backendFetcher(`/users/${userId}`),
});

// Second query depends on first
const { data: courses } = useQuery({
  queryKey: ['courses', user?.id],
  queryFn: backendFetcher(`/courses?userId=${user?.id}`),
  enabled: !!user?.id, // Only run when user.id exists
});
```

### Pattern 4: Parallel Queries
```typescript
const { data: course } = useQuery({
  queryKey: ['course', id],
  queryFn: backendFetcher(`/courses/${id}`),
});

const { data: assignments } = useQuery({
  queryKey: ['assignments', id],
  queryFn: backendFetcher(`/assignments?courseId=${id}`),
});

// Both queries run in parallel!
```

### Pattern 5: Route Parameters
```typescript
export const Route = createFileRoute('/course/$id')({
  component: CourseDetail,
});

function CourseDetail() {
  const { id } = Route.useParams(); // Get route param

  const { data } = useQuery({
    queryKey: ['course', id],
    queryFn: backendFetcher(`/courses/${id}`),
  });

  return <div>{data?.title}</div>;
}
```

### Pattern 6: Navigation
```typescript
import { Link } from '@tanstack/react-router';

// Simple link
<Link to="/courses">View Courses</Link>

// Link with params
<Link to="/course/$id" params={{ id: course.id }}>
  {course.title}
</Link>

// Link with search params
<Link to="/courses" search={{ filter: 'active' }}>
  Active Courses
</Link>
```

## Debugging Tips

### Check Query Status in Devtools
1. Open TanStack Query Devtools (bottom-right)
2. See all queries, their status, and cached data
3. Click "Refetch" to manually trigger a query
4. See query errors in the "Errors" tab

### Check Route State in Devtools
1. Open TanStack Router Devtools (bottom-right)
2. See current route, params, and search
3. Navigate through route tree

### Console Logging
The fetcher already logs all requests:
```
[fetcher] Making request to: http://localhost:3000/courses
```

## Next Steps

1. ✅ Copy web-start directory
2. ✅ Install dependencies
3. ✅ Create .env file
4. ✅ Test base setup
5. ⏳ Migrate dashboard page
6. ⏳ Migrate courses list
7. ⏳ Migrate course detail
8. ⏳ Migrate remaining pages
9. ⏳ Test thoroughly
10. ⏳ Deploy to Vercel

## Need Help?

- Full migration plan: `MIGRATION_PLAN.md`
- TanStack Router: https://tanstack.com/router/latest
- TanStack Query: https://tanstack.com/query/latest
- Reference repo: https://github.com/acbart/cisc474-f25-individual-project-starter

## Assignment Requirement

You need to:
1. ✅ Sync the changes (copy web-start)
2. ✅ Update frontend to use new approach (TanStack)
3. ✅ Deploy new frontend
4. ✅ Wire up at least ONE page to backend API
5. ✅ Submit deployment URL

**Minimum viable submission**: Get the `/courses` page working and deployed.

That's already implemented in the upstream! Just copy, configure, and deploy.
