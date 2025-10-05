# Frontend-Backend Connection Assignment - Completion Report

## Assignment Requirements

✅ All requirements have been successfully implemented.

## Demo Page URL

**Main Submission URL:** [http://localhost:3001/api-demo](http://localhost:3001/api-demo)

This page contains:
- Clear identification of both demo pages
- Direct links to the two backend-connected pages
- Full explanation of the implementation
- List of all requirements met

## Two Backend-Connected Pages

### 1. Users Directory Page
- **Frontend URL:** [http://localhost:3001/users](http://localhost:3001/users)
- **Backend Route:** `GET /users` (http://localhost:3000/users)
- **Implementation:**
  - Client component with `'use client'` directive
  - Uses `fetch()` to retrieve user data from backend
  - Implements React Suspense with loading spinner fallback
  - File: `/apps/web/app/users/page.tsx`

### 2. Courses Catalog Page
- **Frontend URL:** [http://localhost:3001/courses](http://localhost:3001/courses)
- **Backend Route:** `GET /courses` (http://localhost:3000/courses)
- **Implementation:**
  - Client component with `'use client'` directive
  - Uses `fetch()` to retrieve course data from backend
  - Implements React Suspense with loading spinner fallback
  - File: `/apps/web/app/courses/page.tsx`

## Technical Implementation Details

### Frontend (Next.js)
- **Port:** 3001
- **Framework:** Next.js 15.4.6 with App Router
- **Environment Variable:** `NEXT_PUBLIC_API_URL=http://localhost:3000`

### Backend (NestJS)
- **Port:** 3000
- **Framework:** NestJS with Prisma ORM
- **Database:** PostgreSQL (Supabase)

### CORS Configuration
Located in `/apps/api/src/main.ts`:
```typescript
app.enableCors({
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://f25-cisc474-individual-web-henna.vercel.app'
  ],
  credentials: true,
});
```
✅ **No wildcard used** - specific origins only

### Client Components with Suspense

Both demo pages implement the required pattern:

**Users Page (`/apps/web/app/users/page.tsx`):**
```tsx
'use client';

import { Suspense } from 'react';
import UsersList from './UsersList';

export default function UsersPage() {
  return (
    <>
      <Navigation currentUser={null} />
      <main>
        <Suspense fallback={<UsersLoading />}>
          <UsersList />
        </Suspense>
      </main>
    </>
  );
}
```

**Courses Page (`/apps/web/app/courses/page.tsx`):**
```tsx
'use client';

import { Suspense } from 'react';
import CoursesList from './CoursesList';

export default function CoursesPage() {
  return (
    <>
      <Navigation currentUser={null} />
      <main>
        <Suspense fallback={<CoursesLoading />}>
          <CoursesList />
        </Suspense>
      </main>
    </>
  );
}
```

## Verification Checklist

- ✅ Uses `fetch()` function to access backend API data
- ✅ At least two backend routes accessible (`/users` and `/courses`)
- ✅ Client components with `'use client'` directive
- ✅ Suspense boundaries with visual loading fallbacks (animated spinners)
- ✅ CORS configured without wildcard
- ✅ Environment variables for API URL configuration
- ✅ Accessible page linking to both demo pages with clear URLs
- ✅ Backend deployed and functional
- ✅ Frontend deployed and functional

## Deployment Status

### Local Development (Current)
- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:3001
- **Demo Page:** http://localhost:3001/api-demo

### Production Deployment
- **Backend:** https://f25-cisc474-individual-n1wv.onrender.com
- **Frontend:** https://f25-cisc474-individual-web-henna.vercel.app
- **Demo Page:** https://f25-cisc474-individual-web-henna.vercel.app/api-demo

## Testing Instructions

1. Visit the demo page: http://localhost:3001/api-demo
2. Click "View Users Demo →" button to see `/users` page
3. Observe the loading spinner (Suspense fallback) while data fetches
4. Verify user data displays from backend
5. Return to demo page and click "View Courses Demo →"
6. Observe the loading spinner while data fetches
7. Verify course data displays from backend

## Files Modified/Created

### New Files
- `/apps/web/app/api-demo/page.tsx` - Assignment demo landing page
- `/apps/web/app/users/page.tsx` - Users client component page
- `/apps/web/app/users/UsersList.tsx` - Users list client component
- `/apps/web/app/courses/page.tsx` - Courses client component page
- `/apps/web/app/courses/CoursesList.tsx` - Courses list client component

### Modified Files
- `/apps/api/src/main.ts` - CORS configuration
- `/apps/web/app/_lib/apiClient.ts` - Fetch functions for API calls
- `/apps/web/.env.local` - Environment variables

## Submission

**Primary Submission URL:** http://localhost:3001/api-demo

This page clearly identifies:
1. The two demo pages (`/users` and `/courses`)
2. The backend routes they connect to
3. The technical implementation details
4. All assignment requirements met
