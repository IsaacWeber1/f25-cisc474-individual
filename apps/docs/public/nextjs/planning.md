# NextJS Frontend Development - Assignment 2 Planning

## Assignment Overview
Develop the frontend of the LMS web application using NextJS App Router, implementing at least 5 interconnected pages based on the designs from [planning.md](../planning/planning.md).

## Required NextJS Concepts to Study ✅
- [x] **[Project Structure](./project_structure.md)** - App Router structure, file conventions, colocation strategies
- [x] **[Layouts and Pages](./layouts_and_pages.md)** - File-system routing, nested layouts, dynamic routes, params
- [x] **[Linking and Navigating](./linking_and_navigating.md)** - Link component, prefetching, client-side transitions, streaming
- [x] **[Server and Client Components](./server_and_client_components.md)** - 'use client' directive, data passing, composition patterns

## Project Structure Analysis

### Target Implementation
**Primary App**: `apps/web/` (NextJS 15 with App Router)
- Port: 3001 (`npm run dev`)
- TurboRepo monorepo structure
- TypeScript + ESLint configured
- React 19 with Server Components

### Current Structure
```
apps/web/
├── app/
│   ├── layout.tsx          # Root layout (required)
│   ├── page.tsx           # Home page (/)
│   ├── globals.css        # Global styles
│   └── fonts/             # Font assets
├── package.json
├── next.config.js
└── tsconfig.json
```

## Pages to Implement (5+ Required)

### App Router File Structure
```
apps/web/app/
├── layout.tsx                                    # Root layout with nav
├── page.tsx                                      # Dashboard (/)
├── _components/                                  # Shared components (private)
├── _lib/                                        # Mock data & utilities (private)
├── course/
│   └── [id]/
│       ├── layout.tsx                           # Course layout with tabs
│       ├── page.tsx                             # Course overview
│       ├── loading.tsx                          # Loading UI
│       ├── assignments/
│       │   ├── page.tsx                        # Assignments list
│       │   └── [assignmentId]/
│       │       ├── page.tsx                    # Assignment detail
│       │       └── loading.tsx                 # Assignment loading
│       ├── grades/
│       │   └── page.tsx                        # Grades view
│       └── reflections/
│           └── [reflectionId]/
│               └── page.tsx                    # Reflection interface
└── profile/
    └── page.tsx                                # User profile
```

### Page Specifications

#### 1. Dashboard (`app/page.tsx`) - Server Component
- **Route**: `/`
- **Purpose**: Main landing page with course overview
- **Features**: 
  - Course cards (mock data)
  - Role-based navigation
  - Quick access to recent assignments
  - Links to all major sections
- **Data**: Server-side mock data fetching

#### 2. Course Overview (`app/course/[id]/page.tsx`) - Server Component  
- **Route**: `/course/[courseId]`
- **Purpose**: Individual course dashboard
- **Features**:
  - Course information display
  - Navigation tabs (assignments, grades, reflections)
  - Recent activity feed
  - Role-specific content (Student vs TA/Professor)
- **Dynamic**: Uses `params.id` for course identification

#### 3. Assignments List (`app/course/[id]/assignments/page.tsx`) - Server Component
- **Route**: `/course/[courseId]/assignments`
- **Purpose**: List all assignments for a course
- **Features**:
  - Assignment cards with due dates
  - Submission status indicators
  - Filter/sort functionality
  - Links to assignment details
- **Data**: Mock assignments filtered by course ID

#### 4. Assignment Detail (`app/course/[id]/assignments/[assignmentId]/page.tsx`) - Mixed
- **Route**: `/course/[courseId]/assignments/[assignmentId]`
- **Purpose**: Individual assignment view and submission
- **Features**:
  - Assignment specifications (Server Component)
  - Submission interface (Client Component)
  - Due date and requirements
  - File upload simulation
- **Dynamic**: Double parameter route with both course and assignment IDs

#### 5. Grades View (`app/course/[id]/grades/page.tsx`) - Server Component
- **Route**: `/course/[courseId]/grades`
- **Purpose**: Display grades for course
- **Features**:
  - Personal grade table (Student view)
  - Grade history and feedback
  - Export functionality
  - Grade analytics visualization
- **Data**: Mock grade data with calculations

#### 6. Reflection Interface (`app/course/[id]/reflections/[reflectionId]/page.tsx`) - Mixed
- **Route**: `/course/[courseId]/reflections/[reflectionId]`
- **Purpose**: Complete guided reflection assignments
- **Features**:
  - Data summary display (Server Component)
  - Interactive form (Client Component)
  - Progress tracking
  - Submission handling
- **Unique**: Implements the special "Reflection" feature from planning.md

#### 7. Profile (`app/profile/page.tsx`) - Mixed
- **Route**: `/profile`
- **Purpose**: User settings and information
- **Features**:
  - User information display (Server Component)
  - Settings form (Client Component)
  - Role switching simulation
  - Preferences management

## Component Architecture

### Layout Strategy
- **Root Layout** (`app/layout.tsx`): Contains `<html>`, `<body>`, global nav, fonts
- **Course Layout** (`app/course/[id]/layout.tsx`): Course-specific navigation tabs
- **Nested Layouts**: Preserve state, remain interactive during navigation

### Component Organization
**Location**: `apps/web/app/_components/` (private folder - not routable)

#### Server Components (Default)
- **CourseCard**: Course display with static data
- **AssignmentCard**: Assignment information display  
- **GradeTable**: Grade listing and history
- **UserInfo**: Profile information display
- **CourseNavigation**: Static navigation elements

#### Client Components ('use client')
- **SubmissionForm**: File upload and text submission
- **ReflectionForm**: Interactive reflection interface
- **FilterControls**: Assignment filtering and sorting
- **GradeChart**: Interactive grade visualization
- **RoleSelector**: Role switching for demo purposes
- **ThemeProvider**: Global state management

#### Loading Components
- **loading.tsx files**: Skeleton UI for dynamic routes
- **LoadingSpinner**: Reusable loading indicator
- **CourseLoadingSkeleton**: Course-specific loading states

### Data Flow Strategy

#### Mock Data Structure (`apps/web/app/_lib/`)
```typescript
// mockData.ts
export const mockUsers = [
  { id: 1, name: 'John Student', role: 'student', email: 'john@example.com' }
];

export const mockCourses = [
  { id: 1, name: 'CISC474', title: 'Advanced Web Technologies', instructor: 'Dr. Bart' }
];

export const mockAssignments = [
  { id: 1, courseId: 1, title: 'NextJS Frontend', dueDate: '2024-12-15', status: 'pending' }
];
```

#### Data Access Patterns
- **Server Components**: Direct import and async simulation
- **Client Components**: Props from Server Components
- **Dynamic Routes**: `params` object for route parameters
- **Search Params**: `searchParams` for filtering and pagination

## NextJS Features Implementation

### App Router Features
1. **File-based Routing**: Folders = URL segments, `page.tsx` = public routes
2. **Dynamic Routes**: `[id]` and `[assignmentId]` for parameterized paths
3. **Nested Layouts**: Shared UI that preserves state during navigation  
4. **Route Groups**: `(dashboard)`, `(course)` for organization (if needed)
5. **Private Folders**: `_components`, `_lib` for non-routable code
6. **Special Files**: `loading.tsx`, `error.tsx`, `not-found.tsx`

### Performance Optimization
1. **Server Components**: Default rendering for better performance
2. **Client Components**: Only where interactivity is needed
3. **Automatic Prefetching**: Links prefetched when in viewport
4. **Streaming**: Progressive loading with loading.tsx files
5. **Static Generation**: Build-time rendering where possible

### Navigation Implementation
1. **Link Component**: `import Link from 'next/link'` for all internal navigation
2. **useRouter**: For programmatic navigation in Client Components
3. **Active States**: Navigation highlighting with `usePathname`
4. **Breadcrumbs**: Course > Assignments > Assignment Detail

## Implementation Plan

### Phase 1: Foundation (Days 1-2)
1. **Clean Up Web App**
   - Remove default Next.js content from `apps/web/app/`
   - Update `layout.tsx` with LMS branding and navigation
   - Set up global CSS with LMS styling
   - Create folder structure for components and data

2. **Mock Data Setup**
   - Create `_lib/mockData.ts` with comprehensive sample data
   - Implement data access functions
   - Set up role simulation system
   - Test data relationships (courses → assignments → grades)

### Phase 2: Core Pages (Days 3-4)  
1. **Dashboard Implementation**
   - Update `app/page.tsx` with course cards
   - Implement role-based content display
   - Add navigation to course pages
   - Test link functionality

2. **Course Structure**
   - Create `app/course/[id]/layout.tsx` with course navigation
   - Implement `app/course/[id]/page.tsx` course overview
   - Add `loading.tsx` for better UX
   - Test dynamic routing with different course IDs

### Phase 3: Assignment & Grade Pages (Days 5-6)
1. **Assignment Pages**
   - Create assignments list page with filtering
   - Implement assignment detail with submission interface
   - Add loading states and error handling
   - Test nested dynamic routing

2. **Grades and Reflections**  
   - Implement grades view with mock calculations
   - Create reflection interface with dynamic forms
   - Add interactive components with proper 'use client' usage
   - Test Server/Client Component data passing

### Phase 4: Polish & Deploy (Days 7-8)
1. **Enhancement**
   - Add profile page with settings
   - Implement responsive design
   - Add error boundaries and error.tsx files
   - Performance testing and optimization

2. **Production Ready**
   - TypeScript error resolution
   - ESLint compliance (`npm run lint`)
   - Build testing (`npm run build`)
   - Vercel deployment and testing

## Mock Data Strategy

### Role-Based Content
```typescript
// Simulate different user roles
const getCurrentUser = () => ({
  id: 1,
  role: process.env.NODE_ENV === 'development' ? 'student' : 'professor', // Easy switching
  name: 'Demo User',
  courses: [1, 2, 3]
});

// Role-specific data filtering
const getAssignmentsForRole = (courseId: string, role: string) => {
  const assignments = mockAssignments.filter(a => a.courseId === courseId);
  return role === 'student' ? 
    assignments.map(a => ({ ...a, submissions: a.mySubmissions })) :
    assignments.map(a => ({ ...a, allSubmissions: a.submissions }));
};
```

### API-Ready Structure
- Structure mock data to match planned database schema
- Use async/await patterns to simulate API calls
- Implement error states and loading behaviors
- Make data easily replaceable with real API calls later

## Success Criteria & Checklist

### ✅ Technical Requirements
- [ ] **5+ Functional Pages**: All pages accessible and properly linked
- [ ] **Dynamic Routing**: Course and assignment IDs work correctly
- [ ] **App Router Usage**: Proper layouts, Server/Client components
- [ ] **Loading States**: loading.tsx files provide good UX
- [ ] **Error Handling**: Graceful error states and boundaries
- [ ] **TypeScript**: No type errors, proper typing throughout
- [ ] **Performance**: Proper Server/Client Component split

### ✅ User Experience  
- [ ] **Professional Design**: Clean, educational software aesthetic
- [ ] **Role Simulation**: Different views for different user types
- [ ] **Responsive**: Works on desktop, tablet, and mobile
- [ ] **Fast Navigation**: Smooth client-side transitions
- [ ] **Intuitive Flow**: Clear navigation between related pages
- [ ] **Accessibility**: Proper semantic HTML and ARIA labels

### ✅ NextJS Concept Demonstration
- [ ] **Project Structure**: Well-organized app directory
- [ ] **Layouts and Pages**: Nested layouts, proper page structure
- [ ] **Linking and Navigating**: Link component, prefetching visible
- [ ] **Server and Client Components**: Proper separation and data flow
- [ ] **Dynamic Routes**: Multiple parameter levels working
- [ ] **Special Files**: loading.tsx, error.tsx, not-found.tsx

### ✅ Deployment
- [ ] **Build Success**: `npm run build` completes without errors
- [ ] **Lint Passing**: `npm run lint` passes with no warnings
- [ ] **Vercel Deploy**: Live URL accessible and functional
- [ ] **Performance**: Good Core Web Vitals scores
- [ ] **No Console Errors**: Clean browser console in production

## Development Commands

```bash
# Start development server
cd apps/web
npm run dev

# Type checking
npm run check-types

# Linting
npm run lint

# Production build
npm run build
npm run start
```

---

## Notes
- Focus on demonstrating NextJS App Router concepts over complex styling
- Ensure all navigation uses Link component for proper prefetching
- Use Server Components by default, Client Components only when needed
- Structure code to be easily enhanced with real API integration later
- Document any assumptions about user roles or authentication flow
- Test on multiple devices and screen sizes before deployment

This plan leverages the full power of NextJS 15 App Router while creating a realistic LMS interface that demonstrates all required concepts through practical, interconnected pages.