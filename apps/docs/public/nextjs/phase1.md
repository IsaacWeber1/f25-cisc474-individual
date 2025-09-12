# NextJS Phase 1: Foundation Setup

## Overview
Create the minimal base structure for the LMS frontend using NextJS App Router. This phase establishes the foundation that all other pages will build upon.

## Target Location
**Work in**: `apps/web/` directory
**Development**: `npm run dev` (runs on port 3001)

## Phase 1 Tasks

### 1. Clean Up Existing Structure
- [ ] Remove default Next.js content from `apps/web/app/page.tsx`
- [ ] Update `apps/web/app/layout.tsx` with LMS-appropriate structure
- [ ] Clean up `apps/web/app/globals.css` for LMS styling

### 2. Create Folder Structure
Create the following directories in `apps/web/app/`:
- [ ] `_components/` - Reusable components (private folder)
- [ ] `_lib/` - Mock data and utilities (private folder)
- [ ] `course/` - Course-related pages
- [ ] `profile/` - User profile pages

### 3. Mock Data Setup
Create `apps/web/app/_lib/mockData.ts` with:
- [ ] **mockUsers**: User profiles with roles (student, ta, professor)
- [ ] **mockCourses**: Course information (id, name, title, instructor)
- [ ] **mockAssignments**: Assignment data (id, courseId, title, dueDate, status)
- [ ] **mockGrades**: Grade data with feedback
- [ ] **getCurrentUser()**: Function to simulate current user
- [ ] **getCoursesByUser()**: Function to get user's courses

### 4. Root Layout Update
Update `apps/web/app/layout.tsx`:
- [ ] Update metadata (title: "LMS - Learning Management System")
- [ ] Add basic navigation component
- [ ] Include links to: Dashboard (/), Profile (/profile)
- [ ] Keep existing font setup (Geist fonts)

### 5. Dashboard Implementation
Update `apps/web/app/page.tsx`:
- [ ] Create dashboard as Server Component
- [ ] Display current user info
- [ ] Show course cards using mock data
- [ ] Add navigation links to courses
- [ ] Include role-based content display

### 6. Basic Navigation Component
Create `apps/web/app/_components/Navigation.tsx`:
- [ ] Use Link component from 'next/link'
- [ ] Include: Dashboard, Profile links
- [ ] Show current user role
- [ ] Make it a Client Component for interactivity (if needed)

### 7. Course Card Component
Create `apps/web/app/_components/CourseCard.tsx`:
- [ ] Server Component for course display
- [ ] Props: course object (id, name, title, instructor)
- [ ] Link to course overview: `/course/[id]`
- [ ] Basic styling for card layout

## Essential File Structure After Phase 1
```
apps/web/app/
├── layout.tsx                    # Updated root layout
├── page.tsx                      # Dashboard with course cards
├── globals.css                   # Updated LMS styling
├── _components/
│   ├── Navigation.tsx           # Main navigation
│   └── CourseCard.tsx          # Course display card
├── _lib/
│   └── mockData.ts             # All mock data and functions
├── course/                     # (empty folder for phase 2)
└── profile/                    # (empty folder for phase 2)
```

## Mock Data Structure
```typescript
// Minimal required data structure
export const mockUsers = [
  { 
    id: 1, 
    name: 'John Student', 
    role: 'student', 
    email: 'john@example.edu',
    courses: [1, 2] 
  }
];

export const mockCourses = [
  { 
    id: 1, 
    code: 'CISC474', 
    title: 'Advanced Web Technologies', 
    instructor: 'Dr. Bart',
    semester: 'Fall 2024'
  }
];

export const getCurrentUser = () => mockUsers[0];
export const getCoursesByUser = (userId: number) => 
  mockCourses.filter(course => 
    mockUsers.find(u => u.id === userId)?.courses.includes(course.id)
  );
```

## Acceptance Criteria
- [ ] **App starts**: `npm run dev` runs without errors
- [ ] **Dashboard loads**: Root page (/) displays user info and course cards
- [ ] **Navigation works**: Links use Next.js Link component
- [ ] **Mock data flows**: Data displays correctly from mockData.ts
- [ ] **TypeScript clean**: No type errors (`npm run check-types`)
- [ ] **Linting passes**: No linting warnings (`npm run lint`)
- [ ] **Course links ready**: Cards link to `/course/[id]` (even if pages don't exist yet)

## Success Indicators
1. **Working Dashboard**: Main page shows personalized course list
2. **Clean Structure**: Organized folders for components and data
3. **Navigation Ready**: Header/nav with proper Link components
4. **Data Foundation**: Mock data system that can be easily extended
5. **Type Safety**: All TypeScript types properly defined
6. **Performance**: Server Components used appropriately for static content

## Next Steps Preview
After Phase 1 completion, Phase 2 will add:
- Course overview pages (`course/[id]/page.tsx`)
- Course layouts (`course/[id]/layout.tsx`)
- Assignment and grade page structures
- Profile page implementation

## Development Commands
```bash
# Navigate to web app
cd apps/web

# Start development
npm run dev

# Check types
npm run check-types

# Lint code
npm run lint
```

## Notes
- Keep components simple in Phase 1 - focus on structure over styling
- Use Server Components by default (no 'use client' unless needed for interactivity)
- Ensure all internal navigation uses Next.js Link component
- Mock data should be realistic enough to test the interface effectively
- Document any assumptions about user authentication or role switching