# TanStack Migration - Comprehensive Audit

**Date**: October 11, 2025 (Updated)
**Status**: SUBSTANTIAL PROGRESS - 10 of 13 pages migrated (77%)
**Previous Status** (Oct 10): Early checkpoint showed 2/13 pages (15%)

---

## ✅ Current Reality Check

**Migration has progressed significantly since initial audit:**

### ✅ What's Migrated (10 pages)
1. **Dashboard** (`/` → `index.tsx`) - ✅ Complete + Refactored
2. **Courses Catalog** (`/courses` → `courses.tsx`) - ✅ Complete + Refactored
3. **Profile page** (`/profile` → `profile.tsx`) - ✅ Complete + Refactored
4. **Users page** (`/users` → `users.tsx`) - ✅ Complete + Refactored
5. **Course detail** (`/course/[id]` → `course.$id.tsx`) - ✅ Complete + Refactored
6. **Assignments list** (`/course/[id]/assignments` → `course.$id.assignments.tsx`) - ✅ Complete + Refactored
7. **Assignment detail** (`/course/[id]/assignments/[assignmentId]` → `course.$id.assignments.$assignmentId.tsx`) - ✅ Complete + Refactored
8. **Grades** (`/course/[id]/grades` → `course.$id.grades.tsx`) - ✅ Complete + Refactored
9. **Reflections list** (`/course/[id]/reflections` → `course.$id.reflections.tsx`) - ✅ Complete + Refactored
10. **Reflection detail** (`/course/[id]/reflections/[reflectionId]` → `course.$id.reflections.$reflectionId.tsx`) - ✅ Complete + Refactored

### ❌ What's NOT Migrated (3 pages)
1. **Login page** (`/login`) - Required for user authentication/switching
2. **Submissions/Grading** (`/course/[id]/assignments/[assignmentId]/submissions`) - Required for instructor grading
3. **API demo page** (`/api-demo`) - Documentation page (nice-to-have)

**Migration Progress**: **10/13 pages = 77%**

---

## 📊 Detailed Progress Since Initial Audit

### **Phase 1: Initial Setup** (Oct 10 - Early)
- 2/13 pages migrated (Dashboard, Courses)
- Basic TanStack Query + Router setup
- Initial documentation

### **Phase 2: Core Migration** (Oct 10)
- 8 additional pages migrated
- All course detail pages complete
- Profile and Users pages complete
- Navigation component updated

### **Phase 3: Architecture Refactor** (Oct 11)
- All 10 migrated pages refactored
- Shared components created (LoadingSpinner, ErrorMessage, PageLayout)
- Design tokens centralized (COLORS, TYPOGRAPHY)
- AuthContext replaces hardcoded user IDs
- ~946 lines of duplicate code eliminated
- Type-safe route constants implemented

---

## 📊 Next.js vs TanStack Comparison

### Next.js App (apps/web)
```
app/
├── page.tsx                               # Home/Dashboard
├── profile/page.tsx                       # Profile ❌
├── courses/page.tsx                       # Courses catalog
├── users/page.tsx                         # Users list ❌
├── login/page.tsx                         # Login ❌
├── api-demo/page.tsx                      # Demo ❌
├── course/[id]/
│   ├── page.tsx                          # Course detail ❌
│   ├── assignments/
│   │   ├── page.tsx                      # Assignments list ❌
│   │   └── [assignmentId]/
│   │       ├── page.tsx                  # Assignment detail ❌
│   │       └── submissions/page.tsx      # Submissions ❌
│   ├── grades/page.tsx                   # Grades ❌
│   └── reflections/
│       ├── page.tsx                      # Reflections list ❌
│       └── [reflectionId]/page.tsx       # Reflection detail ❌
└── _lib/
    ├── apiClient.ts                      # API functions
    └── dataProviderClient.ts             # Session management
```

### TanStack App (apps/web-start) - CURRENT STATE
```
src/routes/                               # 10 pages migrated ✅
├── __root.tsx                            # Root layout ✅
├── index.tsx                             # Dashboard ✅
├── courses.tsx                           # Courses catalog ✅
├── profile.tsx                           # Profile page ✅
├── users.tsx                             # Users directory ✅
├── course.$id.tsx                        # Course detail ✅
├── course.$id.assignments.tsx            # Assignments list ✅
├── course.$id.assignments.$assignmentId.tsx  # Assignment detail ✅
├── course.$id.grades.tsx                 # Grades page ✅
├── course.$id.reflections.tsx            # Reflections list ✅
└── course.$id.reflections.$reflectionId.tsx  # Reflection detail ✅

src/components/
├── common/                               # Shared components (Phase 1) ✅
│   ├── LoadingSpinner.tsx               # Reusable loading UI ✅
│   ├── ErrorMessage.tsx                 # Reusable error UI ✅
│   └── PageLayout.tsx                   # Page structure ✅
├── Navigation.tsx                        # Nav bar ✅
└── CourseCard.tsx                        # Course card ✅

src/contexts/
└── AuthContext.tsx                       # Auth context (Phase 1) ✅

src/config/
├── constants.ts                          # COLORS, TYPOGRAPHY (Phase 1) ✅
└── routes.ts                             # Type-safe routes (Phase 1) ✅

src/integrations/
├── fetcher.ts                            # Backend client ✅
└── root-provider.tsx                     # React Query setup ✅

src/types/
└── api.ts                                # TypeScript types ✅
```

**Remaining to migrate**: **3 pages + supporting components (login, grading, api-demo)**

---

## 🔍 Key Technical Differences

### Data Fetching Pattern

**Next.js (useEffect pattern)**:
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    const result = await apiClient.getUserById(id);
    setData(result);
    setLoading(false);
  }
  fetchData();
}, [id]);
```

**TanStack (useQuery pattern)**:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['user', id],
  queryFn: backendFetcher<User>(`/users/${id}`),
});
// Loading, errors, caching all automatic
```

### Routing Pattern

**Next.js**:
- File: `app/course/[id]/page.tsx`
- Params: `const params = useParams(); const id = params.id;`
- Links: `<Link href="/course/123">`

**TanStack Router**:
- File: `routes/course.$id.tsx`
- Params: `const { id } = Route.useParams();`
- Links: `<Link to="/course/$id" params={{ id: "123" }}>`

### Authentication

**Next.js**:
- Uses `/api/auth/session` API route
- Session stored in cookies
- `getCurrentUser()` function wraps session check

**TanStack**:
- Currently hardcoded user ID (not migrated)
- Needs session management implementation
- Could use React Query for session state

---

## 🎯 Full Migration Plan

### Phase 1: Core Pages (High Priority)
**Estimated Time**: 4-6 hours

1. **Profile Page** (`/profile` → `routes/profile.tsx`)
   - User profile with stats
   - Courses, grades, activities
   - Skill tags
   - Complexity: Medium

2. **Course Detail** (`/course/$id` → `routes/course.$id.tsx`)
   - Dynamic routing with params
   - Course overview
   - Navigation to sub-pages
   - Complexity: Medium

### Phase 2: Course Sub-Pages (Medium Priority)
**Estimated Time**: 6-8 hours

3. **Assignments List** (`routes/course.$id.assignments.tsx`)
   - List of course assignments
   - Due dates, status
   - Links to assignment details
   - Complexity: Medium

4. **Assignment Detail** (`routes/course.$id.assignments.$assignmentId.tsx`)
   - Assignment specifications
   - Submit functionality
   - View submissions (for staff)
   - Complexity: High (needs submission form)

5. **Grades Page** (`routes/course.$id.grades.tsx`)
   - Grade table
   - Filter/sort functionality
   - Grade details
   - Complexity: Medium

### Phase 3: Advanced Features (Lower Priority)
**Estimated Time**: 4-6 hours

6. **Reflections List** (`routes/course.$id.reflections.tsx`)
   - List reflection assignments
   - Completion status
   - Complexity: Medium

7. **Reflection Detail** (`routes/course.$id.reflections.$reflectionId.tsx`)
   - View reflection prompts
   - Display relevant data
   - Submit responses
   - Complexity: High (complex UI)

8. **Submissions View** (`routes/course.$id.assignments.$assignmentId.submissions.tsx`)
   - View all submissions (staff only)
   - Grade submissions
   - Add comments
   - Complexity: Very High

### Phase 4: Supporting Pages
**Estimated Time**: 2-3 hours

9. **Users Page** (`routes/users.tsx`)
   - List all users
   - Filter by role
   - Complexity: Low

10. **Login Page** (`routes/login.tsx`)
    - Authentication form
    - Session management
    - Complexity: Medium

11. **API Demo** (`routes/api-demo.tsx`)
    - Demo landing page
    - Links to examples
    - Complexity: Low

---

## 🛠️ Migration Strategy

### For Each Page:

1. **Read Next.js version** to understand:
   - What data is fetched
   - What components are rendered
   - What user interactions exist

2. **Create TanStack route file**:
   - Use proper naming (`$id` for params)
   - Set up route with `createFileRoute`

3. **Convert data fetching**:
   ```typescript
   // Replace useEffect + useState
   useEffect(() => {
     fetchData().then(setData);
   }, []);

   // With useQuery
   const { data } = useQuery({
     queryKey: ['key'],
     queryFn: backendFetcher('/endpoint'),
   });
   ```

4. **Update navigation**:
   ```typescript
   // Replace Next.js Link
   <Link href="/path">

   // With TanStack Link
   <Link to="/path">
   ```

5. **Handle params**:
   ```typescript
   // Replace useParams
   const params = useParams();

   // With Route.useParams
   const { id } = Route.useParams();
   ```

6. **Test**:
   - Load page in browser
   - Check console for errors
   - Verify data displays correctly
   - Test navigation

7. **Quality checks**:
   - Run `npm run lint --filter=web-start`
   - Run `npm run build --filter=web-start`
   - Fix any TypeScript errors

---

## 🚧 Known Challenges

### 1. **Nested Dynamic Routes**
Next.js: `app/course/[id]/assignments/[assignmentId]/page.tsx`
TanStack: `routes/course.$id.assignments.$assignmentId.tsx`

**Solution**: Use dot notation for nested params

### 2. **Authentication/Session**
Next.js uses API routes + cookies for session management.

**Solution**:
- Option A: Keep Next.js API routes, call from TanStack
- Option B: Implement session in TanStack Query
- Option C: Use TanStack middleware for auth

### 3. **Form Submissions**
Complex forms (assignment submission, reflection responses).

**Solution**:
- Use `useMutation` from TanStack Query
- Create form components
- Handle file uploads separately

### 4. **Role-Based Rendering**
Different UI for students vs. staff.

**Solution**:
- Fetch user role in root loader
- Pass via context or query
- Conditional rendering based on role

---

## 📋 Migration Checklist

### Infrastructure (Complete)
- [x] TanStack Start installed
- [x] Backend fetcher with retry logic
- [x] React Query configured
- [x] TypeScript types
- [x] Navigation component
- [x] ESLint configured

### Routes (2/13 = 15%)
- [x] Dashboard (`/`)
- [x] Courses catalog (`/courses`)
- [ ] Profile (`/profile`)
- [ ] Course detail (`/course/$id`)
- [ ] Assignments list (`/course/$id/assignments`)
- [ ] Assignment detail (`/course/$id/assignments/$assignmentId`)
- [ ] Submissions (`/course/$id/assignments/$assignmentId/submissions`)
- [ ] Grades (`/course/$id/grades`)
- [ ] Reflections list (`/course/$id/reflections`)
- [ ] Reflection detail (`/course/$id/reflections/$reflectionId`)
- [ ] Users (`/users`)
- [ ] Login (`/login`)
- [ ] API demo (`/api-demo`)

### Components (Partial)
- [x] Navigation
- [x] CourseCard
- [ ] AssignmentCard
- [ ] GradeTable
- [ ] SubmissionForm
- [ ] ReflectionForm
- [ ] CommentThread
- [ ] LoadingSpinner (using inline styles currently)
- [ ] ErrorBoundary

### Features (Partial)
- [x] Data fetching (basic)
- [x] Loading states
- [x] Error handling
- [x] Caching
- [ ] Authentication
- [ ] Form submissions
- [ ] File uploads
- [ ] Role-based access
- [ ] Comments/threading
- [ ] Grade submission
- [ ] Reflections

---

## ⏱️ Time Estimates

| Phase | Pages | Estimated Time |
|-------|-------|----------------|
| Phase 1: Core | 2 pages | 4-6 hours |
| Phase 2: Course Sub-pages | 3 pages | 6-8 hours |
| Phase 3: Advanced | 3 pages | 4-6 hours |
| Phase 4: Supporting | 3 pages | 2-3 hours |
| **Testing & Polish** | All | 3-4 hours |
| **TOTAL** | 11 pages | **19-27 hours** |

**Note**: This assumes no major blockers and familiarity with patterns.

---

## 🎯 Recommended Approach

### Option A: Incremental (Recommended)
Migrate one page at a time, test thoroughly, commit frequently.

**Pros**:
- Lower risk
- Easier to debug
- Can stop at any point
- Learn patterns as you go

**Cons**:
- Takes longer total time

### Option B: Batch by Phase
Complete entire phases before moving on.

**Pros**:
- Can establish patterns
- More satisfying completion
- Better code consistency

**Cons**:
- Harder to debug issues
- Large commits
- More time before seeing results

### Option C: Critical Path Only
Migrate only the pages you actually use.

**Pros**:
- Fastest to "done"
- Focus on what matters

**Cons**:
- Incomplete migration
- Dead code in Next.js app

---

## 🚀 Getting Started

1. **Choose a page** (Recommendation: Profile page - self-contained, no params)
2. **Read existing Next.js code** to understand data needs
3. **Create TanStack route file** with proper naming
4. **Implement useQuery** for data fetching
5. **Copy/adapt JSX** from Next.js version
6. **Update Links** to use TanStack Router
7. **Test in browser** - check console, verify data
8. **Run lint + build** to catch errors
9. **Commit** with descriptive message
10. **Repeat** for next page

---

## 📝 Notes

- The dev server runs fine - no immediate errors
- Backend API is working correctly
- **UPDATED**: 10/13 pages migrated (was 2/13 at time of initial audit)
- All existing TanStack code is high quality (types, error handling, caching)
- **Phase 1 architecture refactor complete** - all migrated pages use shared components and design tokens
- The foundation is solid and proven

---

## ⚠️ Critical Information - MUST READ

### **Cannot Delete Next.js App (`apps/web`) Yet**

Even with 77% migration complete, the `apps/web` folder **MUST be kept** until these are migrated:

1. **Login page** (`/login`) - Required for user authentication/switching
2. **Grading interface** (`/course/[id]/assignments/[assignmentId]/submissions`) - Required for instructor grading
3. **API demo page** (`/api-demo`) - Documentation/reference page

**Components needed from Next.js:**
- `GradingInterface.tsx`
- `SubmissionInterface.tsx`
- `UserSwitcher.tsx`
- Session management logic

### **Current Deployment Options**

**Option A: Hybrid Deployment** (Recommended for now)
- Keep both apps running
- Next.js handles: Login + Grading + API docs
- TanStack handles: All student-facing pages
- Works perfectly for current needs

**Option B: Complete Migration** (6-9 hours work)
- Migrate 3 remaining pages + supporting components
- Port session management infrastructure
- Single unified app
- Can delete Next.js app afterward

---

**Status**: 77% Complete (10/13 pages)
**Next Action**: Either deploy hybrid setup OR invest 6-9 hours to finish migration
**Updated**: October 11, 2025
