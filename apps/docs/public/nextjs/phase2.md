# NextJS Phase 2: Core Pages Implementation

## Overview
Build upon Phase 1's foundation to implement the core LMS functionality with dynamic routing, nested layouts, and interactive components. This phase focuses on creating the course-specific pages and profile functionality.

## Target Location
**Work in**: `apps/web/` directory
**Development**: `npm run dev` (runs on port 3001)

## Prerequisites
✅ Phase 1 must be completed:
- Dashboard with course cards working
- Navigation component functional
- Mock data system established
- Development server running without errors

## Phase 2 Tasks

### 1. Course Layout & Overview
Create the foundation for all course-specific pages:

- [ ] **Course Layout** (`app/course/[id]/layout.tsx`)
  - Server Component with course navigation tabs
  - Dynamic route parameter handling for course ID
  - Tabs: Overview, Assignments, Grades, **Reflections** (key MVP feature)
  - Breadcrumb navigation (Dashboard > Course Name)
  - Course header with title, instructor, semester
  - Role-based tab visibility (Student vs TA vs Professor)

- [ ] **Course Overview** (`app/course/[id]/page.tsx`)
  - Server Component displaying course information
  - Recent assignments and **reflections** (last 3)
  - Course announcements and roster snippet (per original planning)
  - Quick stats (total assignments, average grade, reflection completion)
  - Role-based content (Student: enrolled view; TA/Professor: teaching view)

- [ ] **Loading UI** (`app/course/[id]/loading.tsx`)
  - Skeleton layout for course pages
  - Loading states for dynamic content

### 2. Assignment & Submission System
Implement the core assignment workflow from original planning:

- [ ] **Assignments List** (`app/course/[id]/assignments/page.tsx`)
  - Server Component with assignment cards
  - Include both regular assignments AND reflection assignments
  - Filter by type: All, File, Text, **Reflection** (key MVP feature)
  - Sort by due date, title, status
  - Assignment status indicators with visual badges
  - Role-based actions (Student: submit; TA/Professor: review)

- [ ] **Assignment Detail** (`app/course/[id]/assignments/[assignmentId]/page.tsx`)
  - Mixed Component (Server for content, Client for interactions)  
  - Assignment specifications and requirements
  - Due date with countdown timer (Client Component)
  - **Multi-type submission interface:**
    - File upload for file assignments
    - Text editor for text submissions  
    - **Reflection interface** with data summary + guided prompts
  - Submission history and status
  - Submit button with type-specific handling

- [ ] **Submission Review** (`app/course/[id]/assignments/[assignmentId]/submissions/page.tsx`)
  - TA/Professor only - list of all student submissions
  - Filter by status (Submitted, Graded, Needs Review)
  - Quick preview of submissions
  - Links to individual submission grading interface

- [ ] **Submission Detail** (`app/course/[id]/assignments/[assignmentId]/submissions/[submissionId]/page.tsx`)
  - TA/Professor submission review and grading interface
  - File/text viewer for regular submissions
  - **Reflection response viewer** with summary and filtering
  - Comment system (threaded comments per original planning)
  - Grade input with change reason tracking
  - Grade history log

### 3. **Reflection System** (Distinctive MVP Feature)
Implement the core Reflection feature from original planning:

- [ ] **Reflections List** (`app/course/[id]/reflections/page.tsx`)
  - Server Component showing available reflections
  - Student view: assigned reflections with completion status
  - TA/Professor view: launched reflections with response summaries
  - Quick filters for "needs help" responses and skill tags

- [ ] **Reflection Detail** (`app/course/[id]/reflections/[reflectionId]/page.tsx`)
  - **Student view - Complete Reflection:**
    - Data summary section (recent grades, last 3 comments, peer benchmarks)
    - Guided prompts: "What helped you most?", "Where did you get stuck?", "Pick a skill tag"
    - Response submission with skill tag selection
  - **TA/Professor view - Reflection Summary:**
    - Response list with quick filters (skill tags, "needs help" indicators)
    - Aggregate trends and common responses
    - Individual response threading for follow-up comments

### 4. Grades Implementation
Create the grade viewing and analytics interface:

- [ ] **Grades View** (`app/course/[id]/grades/page.tsx`)
  - **Role-based views per original planning:**
    - Student: Personal grade history with feedback
    - TA/Professor: Roster view with grade distribution
    - Assignment breakdown with scores and comments
  - Grade change history with reasons (ActivityLog)
  - Simple analytics (class median for peer benchmarking)

### 5. Profile Page
Implement user profile and settings:

- [ ] **Profile Page** (`app/profile/page.tsx`)
  - Mixed Component (Server for display, Client for forms)
  - User information display (name, email, role)
  - Settings form for preferences
  - **Role switching demonstration** (Student ↔ TA ↔ Professor for testing)
  - Course enrollment/teaching list by role

### 5. Enhanced Components
Extend the component library:

- [ ] **Assignment Card** (`_components/AssignmentCard.tsx`)
  - Server Component for assignment display
  - Status badges and due date formatting
  - Link integration to assignment details

- [ ] **Filter Controls** (`_components/FilterControls.tsx`)
  - Client Component for filtering and sorting
  - Dropdown menus and search functionality
  - State management for filter persistence

- [ ] **Breadcrumb Navigation** (`_components/Breadcrumb.tsx`)
  - Server Component for navigation context
  - Dynamic breadcrumb generation
  - Integration with course and assignment pages

### 6. Data Layer Enhancements
Expand the mock data system:

- [ ] **Enhanced Mock Data** (`_lib/mockData.ts`)
  - Add more realistic assignment data
  - Expand grade data with feedback
  - Add user preferences and settings
  - Submission status tracking

- [ ] **Utility Functions** (`_lib/utils.ts`)
  - Date formatting and calculations
  - Grade percentage calculations
  - Status badge helpers
  - URL generation utilities

## File Structure After Phase 2
```
apps/web/app/
├── layout.tsx                           # Root layout (Phase 1)
├── page.tsx                             # Dashboard (Phase 1)
├── globals.css                          # Global styles (Phase 1)
├── _components/
│   ├── Navigation.tsx                   # Main nav (Phase 1)
│   ├── CourseCard.tsx                   # Course cards (Phase 1)
│   ├── AssignmentCard.tsx              # NEW: Assignment display
│   ├── FilterControls.tsx              # NEW: Filtering UI
│   ├── Breadcrumb.tsx                  # NEW: Navigation breadcrumbs
│   ├── GradeTable.tsx                  # NEW: Grade listing
│   ├── GradeChart.tsx                  # NEW: Grade visualization
│   ├── UserInfo.tsx                    # NEW: Profile display
│   ├── SettingsForm.tsx                # NEW: User settings
│   └── RoleSelector.tsx                # NEW: Demo role switching
├── _lib/
│   ├── mockData.ts                     # Enhanced data (Phase 1 + 2)
│   ├── utils.ts                        # NEW: Utility functions
│   └── gradeUtils.ts                   # NEW: Grade calculations
├── course/
│   └── [id]/
│       ├── layout.tsx                  # NEW: Course layout with tabs
│       ├── page.tsx                    # NEW: Course overview
│       ├── loading.tsx                 # NEW: Course loading UI
│       ├── assignments/
│       │   ├── page.tsx               # NEW: Assignment list
│       │   └── [assignmentId]/
│       │       ├── page.tsx           # NEW: Assignment detail
│       │       └── loading.tsx        # NEW: Assignment loading
│       └── grades/
│           └── page.tsx               # NEW: Grades view
└── profile/
    └── page.tsx                       # NEW: User profile
```

## NextJS Features to Demonstrate

### Dynamic Routing
- **Single Parameter**: `/course/[id]` for course pages
- **Nested Parameters**: `/course/[id]/assignments/[assignmentId]`
- **Parameter Access**: Using `params` object in Server Components
- **Search Parameters**: Filter and sort query strings

### Layout Composition
- **Nested Layouts**: Course layout wrapping all course pages
- **Layout Preservation**: State maintained during navigation
- **Shared UI Elements**: Course header and tabs persistent

### Server/Client Component Patterns
- **Server Default**: Static content and data fetching
- **Client Interactivity**: Forms, filters, charts, timers
- **Data Flow**: Props from Server to Client components
- **Event Handling**: Form submissions and user interactions

### Advanced Features
- **Loading States**: Progressive loading with skeleton UI
- **Error Boundaries**: Graceful error handling
- **Prefetching**: Automatic link prefetching
- **Streaming**: Incremental page rendering

## Mock Data Requirements (Aligned with Original Planning)

### Core LMS Entities
```typescript
// Enhanced Assignment with reflection support
export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  type: 'file' | 'text' | 'reflection';  // Key MVP feature
  dueDate: string;
  maxPoints: number;
  reflectionTemplate?: ReflectionTemplate;
  instructions?: string[];
}

// NEW: Reflection system (distinctive MVP feature)
export interface ReflectionTemplate {
  id: number;
  assignmentId: number;
  prompts: string[];                    // e.g., "What helped you most?"
  dataToShow: string[];                 // e.g., "recent_grades", "peer_benchmark"
  skillTags: string[];                  // e.g., "recursion", "testing", "debugging"
}

export interface ReflectionResponse {
  id: number;
  submissionId: number;
  studentId: number;
  answers: Record<string, string>;      // prompt -> answer mapping
  selectedSkillTag?: string;
  needsHelp: boolean;
  submittedAt: string;
}

// Enhanced Submission system
export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  type: 'file' | 'text' | 'reflection';
  content?: string;                     // text submissions
  files?: string[];                     // file submissions
  reflectionResponse?: ReflectionResponse; // reflection submissions
  submittedAt: string;
  status: 'draft' | 'submitted' | 'graded';
}

// Grade with change tracking (per original planning)
export interface Grade {
  id: number;
  submissionId: number;
  score: number;
  maxScore: number;
  feedback?: string;
  gradedBy: number;                     // TA or Professor ID
  gradedAt: string;
}

export interface GradeChange {
  id: number;
  gradeId: number;
  oldScore: number;
  newScore: number;
  reason: string;                       // Required per original planning
  changedBy: number;
  changedAt: string;
}

// Threaded comments (per original planning)
export interface Comment {
  id: number;
  submissionId: number;
  userId: number;
  content: string;
  parentId?: number;                    // For threading
  createdAt: string;
}

// Enrollment with roles (per original planning)
export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  role: 'student' | 'ta' | 'professor';
  enrolledAt: string;
}

// Activity logging for grade changes
export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  entityType: 'grade' | 'assignment' | 'submission';
  entityId: number;
  details: string;
  timestamp: string;
}

// Skill tags for reflections
export interface SkillTag {
  id: number;
  name: string;
  category: string;                     // e.g., "programming", "collaboration"
  description?: string;
}
```

## Acceptance Criteria

### ✅ Technical Requirements
- [ ] **5+ Functional Pages**: All new pages accessible and working
- [ ] **Dynamic Routing**: Course and assignment IDs work correctly
- [ ] **Nested Layouts**: Course layout properly wraps child pages
- [ ] **Server/Client Split**: Proper component architecture
- [ ] **Loading States**: All pages have loading.tsx files
- [ ] **TypeScript**: No type errors, proper typing
- [ ] **Navigation**: All links use Next.js Link component

### ✅ User Experience
- [ ] **Professional Design**: Consistent with Phase 1 styling
- [ ] **Responsive**: Works on desktop, tablet, mobile
- [ ] **Interactive Elements**: Forms, filters, and buttons functional
- [ ] **Role-Based Content**: Different views for different users
- [ ] **Fast Navigation**: Smooth transitions between pages
- [ ] **Accessibility**: Proper semantic HTML

### ✅ NextJS Concept Demonstration
- [ ] **Dynamic Routes**: Multiple parameter levels working
- [ ] **Nested Layouts**: Course tabs remain visible during navigation
- [ ] **Loading UI**: Skeleton states provide good UX
- [ ] **Server Components**: Default for static content
- [ ] **Client Components**: Only for interactivity
- [ ] **Data Flow**: Proper parent-child data passing

## Implementation Strategy

### Week 1: Core Structure
1. **Day 1-2**: Course layout and overview pages
2. **Day 2-3**: Assignment list and detail pages
3. **Day 3-4**: Profile page implementation

### Week 2: Enhancement
1. **Day 4-5**: Grades view and visualization
2. **Day 5-6**: Enhanced components and filtering
3. **Day 6-7**: Testing, refinement, and documentation

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

# Test specific routes
# http://localhost:3001/course/1
# http://localhost:3001/course/1/assignments
# http://localhost:3001/course/1/assignments/1
# http://localhost:3001/profile
```

## Success Indicators
1. **Working Course Pages**: Course overview loads with proper data
2. **Dynamic Navigation**: Tabs work and maintain state
3. **Assignment System**: List and detail pages functional
4. **Profile Management**: Settings form works properly
5. **Grade Display**: Grade table and charts render correctly
6. **Responsive Design**: All pages work on different screen sizes
7. **Performance**: Fast page transitions and loading

## Notes
- Focus on functionality over complex styling
- Ensure proper Server/Client component separation
- Use realistic mock data for better testing
- Test all dynamic routes with different IDs
- Verify navigation works from all entry points
- Document any assumptions about user interactions

This phase establishes the core LMS functionality while demonstrating advanced Next.js App Router concepts through practical, interconnected pages.