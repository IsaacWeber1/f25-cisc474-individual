# Frontend-Backend Connection Implementation

## Assignment Completion Summary

This document outlines the implementation of client-side data fetching from the backend API using React Suspense.

## Demo Pages

### Main Landing Page
**URL:** `/` (Home/Dashboard)

This page contains a prominent "Backend API Integration Demo" section with clear links to the two demo pages described below.

### Demo Page 1: User Directory
**URL:** `/users`
- **Backend Route Used:** `GET /users`
- **Implementation:** Client component with `fetch` API
- **Suspense:** Yes - implements React Suspense with loading fallback
- **Description:** Displays all users in the system with their roles, email, and course enrollments

### Demo Page 2: Course Catalog
**URL:** `/courses`
- **Backend Route Used:** `GET /courses`
- **Implementation:** Client component with `fetch` API
- **Suspense:** Yes - implements React Suspense with loading fallback
- **Description:** Displays all courses with details including student count, assignments, and instructors

## Technical Implementation Details

### Client-Side Data Fetching
- Both pages use the `'use client'` directive
- Data fetching is performed using the `fetch` API through `/apps/web/app/_lib/apiClient.ts`
- Components use `useState` and `useEffect` hooks for async data loading
- Proper error handling and loading states implemented

### React Suspense Integration
- Each page wraps the data-fetching component in a `<Suspense>` boundary
- Custom loading components provide visual feedback during data fetch
- Fallback UI shows animated spinner and descriptive text

### CORS Configuration
**Backend (apps/api/src/main.ts:4-27):**
- CORS now uses environment variable `ALLOWED_ORIGINS`
- Falls back to default localhost and production URLs if not set
- Configured to support credentials
- No wildcard usage for GET requests ✅

**Environment Variables:**
- `ALLOWED_ORIGINS` (Backend): Comma-separated list of allowed frontend URLs
- `NEXT_PUBLIC_API_URL` (Frontend): Backend API URL

### Environment Variable Files Created
1. `/apps/api/.env.example` - Backend configuration template
2. `/apps/web/.env.example` - Frontend development configuration
3. `/apps/web/.env.production` - Frontend production configuration

## Deployed URLs

### Production Frontend
**Base URL:** `https://f25-cisc474-individual-web-henna.vercel.app`

**Demo Pages:**
- Landing: `https://f25-cisc474-individual-web-henna.vercel.app/`
- Users: `https://f25-cisc474-individual-web-henna.vercel.app/users`
- Courses: `https://f25-cisc474-individual-web-henna.vercel.app/courses`

### Production Backend
**Base URL:** `https://f25-cisc474-individual-n1wv.onrender.com`

**Endpoints Used:**
- GET `/users` - Returns all users with enrollments
- GET `/courses` - Returns all courses with related data

## Code References

### Frontend Components
- `/apps/web/app/users/page.tsx` - User directory page with Suspense
- `/apps/web/app/users/UsersList.tsx` - Client component that fetches users
- `/apps/web/app/courses/page.tsx` - Course catalog page with Suspense
- `/apps/web/app/courses/CoursesList.tsx` - Client component that fetches courses
- `/apps/web/app/page.tsx:91-184` - Landing page with demo links

### Backend Configuration
- `/apps/api/src/main.ts:4-27` - CORS configuration with environment variables

### API Client
- `/apps/web/app/_lib/apiClient.ts` - Centralized API fetch functions

## Assignment Requirements Checklist

- ✅ Uses `fetch` function to access backend API data
- ✅ At least two backend routes accessible (`GET /users` and `GET /courses`)
- ✅ Client components created to render data
- ✅ React Suspense approach with visual fallback implemented
- ✅ CORS correctly configured (no wildcard for GET requests)
- ✅ Environment variables used for frontend/backend communication
- ✅ Landing page with clear links to demo pages
- ✅ Deployed and accessible

## Submission Link

**Primary URL for grading:**
`https://f25-cisc474-individual-web-henna.vercel.app/`

From this page, click the links in the "Backend API Integration Demo" section to access:
1. 👥 User Directory
2. 📚 Course Catalog

Both pages demonstrate client-side data fetching with React Suspense.
