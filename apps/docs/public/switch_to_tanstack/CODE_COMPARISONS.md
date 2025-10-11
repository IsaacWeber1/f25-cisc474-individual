# Next.js vs TanStack: Side-by-Side Code Comparisons

This document shows exactly how your current Next.js code translates to TanStack Start.

## Example 1: Simple Data Fetching (Courses List)

### Current Next.js Implementation
**File**: `apps/web/app/courses/CoursesList.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllCourses } from '../_lib/dataProviderClient';

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '2rem' }}>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Courses</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {courses.map(course => (
          <Link key={course.id} href={`/course/${course.id}`}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
            }}>
              <h2>{course.code}: {course.title}</h2>
              <p>{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### New TanStack Implementation
**File**: `apps/web-start/src/routes/courses.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { backendFetcher } from '../integrations/fetcher';

export const Route = createFileRoute('/courses')({
  component: CoursesList,
});

function CoursesList() {
  const { data: courses = [], error, isFetching, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: backendFetcher('/courses'),
    initialData: [],
  });

  if (isFetching) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '2rem' }}>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Courses</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {courses.map(course => (
          <Link
            key={course.id}
            to="/course/$id"
            params={{ id: course.id }}
          >
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
            }}>
              <h2>{course.code}: {course.title}</h2>
              <p>{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### Key Differences
| Feature | Next.js | TanStack |
|---------|---------|----------|
| **Lines of code** | 60+ lines | 45 lines |
| **Manual state** | `useState` × 3 | None needed |
| **Manual effects** | `useEffect` | None needed |
| **Retry logic** | Manual reload | Built-in `refetch()` |
| **Caching** | None | Automatic |
| **Background refetch** | None | Automatic |
| **Deduplication** | None | Automatic |
| **Route definition** | Folder structure | `createFileRoute()` |
| **Links** | `<Link href="">` | `<Link to="" params="">` |

---

## Example 2: Parallel Data Fetching (Course Overview)

### Current Next.js Implementation
**File**: `apps/web/app/course/[id]/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  getCourseById,
  getCurrentUser,
  getUserRole,
  getAssignmentsByCourse,
  getReflectionsByUser,
  getRecentGrades,
  getClassMedianGrade
} from '../../_lib/dataProviderClient';

export default function CourseOverview() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [classMedian, setClassMedian] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parallelize independent API calls
        const [courseData, currentUserData] = await Promise.all([
          getCourseById(courseId),
          getCurrentUser()
        ]);

        if (!courseData || !currentUserData) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        setCourse(courseData);
        setCurrentUser(currentUserData);

        // Parallelize all calls that depend on having course/user
        const [userRoleData, assignmentsData, reflectionsData, recentGradesData, classMedianData] = await Promise.all([
          getUserRole(currentUserData.id, courseId),
          getAssignmentsByCourse(courseId),
          getReflectionsByUser(currentUserData.id),
          getRecentGrades(currentUserData.id, 3),
          getClassMedianGrade(courseId)
        ]);

        setUserRole(userRoleData);
        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
        setReflections(Array.isArray(reflectionsData) ? reflectionsData : []);
        setRecentGrades(Array.isArray(recentGradesData) ? recentGradesData : []);
        setClassMedian(classMedianData || 0);
        setLoading(false);
      } catch (err) {
        console.error('[Course Page] Error loading course data:', err);
        setError('There was an error loading the course data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course || !currentUser) return <div>Course not found</div>;

  // Render logic...
  return (
    <div>
      <h1>{course.title}</h1>
      {/* Rest of UI */}
    </div>
  );
}
```

### New TanStack Implementation
**File**: `apps/web-start/src/routes/course.$id.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { backendFetcher } from '../integrations/fetcher';

export const Route = createFileRoute('/course/$id')({
  component: CourseOverview,
});

function CourseOverview() {
  const { id: courseId } = Route.useParams();

  // All queries run in parallel automatically!
  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: backendFetcher(`/courses/${courseId}`),
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: backendFetcher('/api/auth/session'),
  });

  const { data: userRole } = useQuery({
    queryKey: ['userRole', currentUser?.id, courseId],
    queryFn: backendFetcher(`/users/${currentUser?.id}/role?courseId=${courseId}`),
    enabled: !!currentUser?.id,
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments', courseId],
    queryFn: backendFetcher(`/assignments?courseId=${courseId}`),
    initialData: [],
  });

  const { data: reflections = [] } = useQuery({
    queryKey: ['reflections', currentUser?.id],
    queryFn: backendFetcher(`/reflections?userId=${currentUser?.id}`),
    enabled: !!currentUser?.id,
    initialData: [],
  });

  const { data: recentGrades = [] } = useQuery({
    queryKey: ['recentGrades', currentUser?.id],
    queryFn: backendFetcher(`/grades/recent?userId=${currentUser?.id}&limit=3`),
    enabled: !!currentUser?.id,
    initialData: [],
  });

  const { data: classMedian = 0 } = useQuery({
    queryKey: ['classMedian', courseId],
    queryFn: backendFetcher(`/grades/median?courseId=${courseId}`),
    initialData: 0,
  });

  // Compute combined loading/error state
  const isLoading = !course || !currentUser;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{course.title}</h1>
      <p>Role: {userRole}</p>
      <p>Assignments: {assignments.length}</p>
      <p>Reflections: {reflections.length}</p>
      <p>Recent Grades: {recentGrades.length}</p>
      <p>Class Median: {classMedian}%</p>
      {/* Rest of UI */}
    </div>
  );
}
```

### Key Differences
| Feature | Next.js | TanStack |
|---------|---------|----------|
| **State variables** | 8 `useState` | 0 |
| **useEffect** | 1 complex | 0 |
| **Manual Promise.all** | Yes | No (automatic) |
| **Dependent queries** | Manual ordering | `enabled` prop |
| **Error handling** | Manual try-catch | Automatic per query |
| **Loading state** | Manual boolean | Per query + combined |
| **Retry on error** | Manual reload | Automatic |
| **Caching** | None | All queries cached |

---

## Example 3: Route Parameters & Nested Routes

### Current Next.js Implementation
**File**: `apps/web/app/course/[id]/assignments/[assignmentId]/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAssignmentById, getCourseById } from '../../../../_lib/dataProviderClient';

export default function AssignmentDetail() {
  const params = useParams();
  const courseId = params.id as string;
  const assignmentId = params.assignmentId as string;

  const [assignment, setAssignment] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [assignmentData, courseData] = await Promise.all([
        getAssignmentById(assignmentId),
        getCourseById(courseId),
      ]);
      setAssignment(assignmentData);
      setCourse(courseData);
      setLoading(false);
    }
    fetchData();
  }, [courseId, assignmentId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{course.title}</h1>
      <h2>{assignment.title}</h2>
    </div>
  );
}
```

### New TanStack Implementation
**File**: `apps/web-start/src/routes/course.$id.assignments.$assignmentId.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { backendFetcher } from '../integrations/fetcher';

export const Route = createFileRoute('/course/$id/assignments/$assignmentId')({
  component: AssignmentDetail,
});

function AssignmentDetail() {
  const { id: courseId, assignmentId } = Route.useParams();

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: backendFetcher(`/courses/${courseId}`),
  });

  const { data: assignment } = useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: backendFetcher(`/assignments/${assignmentId}`),
  });

  const isLoading = !course || !assignment;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{course.title}</h1>
      <h2>{assignment.title}</h2>
    </div>
  );
}
```

### Key Differences
| Feature | Next.js | TanStack |
|---------|---------|----------|
| **Route params** | `useParams()` | `Route.useParams()` |
| **File naming** | `[id]` folders | `$id` in filename |
| **State management** | Manual `useState` | None |
| **Loading state** | Manual boolean | Computed |

---

## Example 4: Navigation & Links

### Current Next.js
```typescript
import Link from 'next/link';

// Simple link
<Link href="/courses">View Courses</Link>

// Dynamic link
<Link href={`/course/${course.id}`}>{course.title}</Link>

// With search params
<Link href="/courses?filter=active">Active Courses</Link>
```

### New TanStack
```typescript
import { Link } from '@tanstack/react-router';

// Simple link
<Link to="/courses">View Courses</Link>

// Dynamic link (type-safe!)
<Link to="/course/$id" params={{ id: course.id }}>
  {course.title}
</Link>

// With search params (type-safe!)
<Link to="/courses" search={{ filter: 'active' }}>
  Active Courses
</Link>
```

---

## Example 5: Authentication Check

### Current Next.js
```typescript
'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from './_lib/dataProviderClient';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        // Redirect to login
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Welcome, {user.name}!</div>;
}
```

### New TanStack
```typescript
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { backendFetcher } from '../integrations/fetcher';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: backendFetcher('/api/auth/session'),
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error || !user) {
    return <Navigate to="/login" />;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

---

## Summary of Benefits

### Code Reduction
- **~40% fewer lines** of code per component
- **No manual state management** for async data
- **No useEffect** for data fetching
- **No try-catch blocks** needed

### Features You Get for Free
✅ Automatic caching
✅ Background refetching
✅ Request deduplication
✅ Retry on failure
✅ Loading/error states
✅ DevTools for debugging
✅ Optimistic updates
✅ Stale-while-revalidate
✅ Type-safe routing
✅ Parallel queries by default

### Developer Experience
- **Less boilerplate**: Focus on business logic, not plumbing
- **Better debugging**: Dedicated devtools show all queries and state
- **Type safety**: Catch errors at compile time with route params
- **Faster development**: Write less code to achieve more functionality
