# Session Checkpoint: TanStack Router Nested Routes Fix

**Date:** October 15, 2025
**Session Focus:** Fix incorrect routing implementation and establish proper TanStack Router nested route patterns

---

## Problem Statement

After migrating from Next.js to TanStack Router, nested routes were not rendering properly:
- Clicking on child routes (e.g., "View Details" on assignments) would change the URL but not render the content
- The previous session implemented a "band-aid" fix using `useMatches()` to conditionally render content based on route detection
- This was identified as the WRONG approach per instructor feedback

## Root Causes Identified

### Issue 1: Improper Layout Pattern
**Previous (Wrong) Implementation:**
- Parent route `course.$id.tsx` used conditional logic with `useMatches()` to detect active child routes
- It would either show course overview OR render `<Outlet />`, but not as a proper layout

**Problem:** Runtime route detection is fragile and not the idiomatic TanStack Router pattern

### Issue 2: Missing Index Route
**Previous Implementation:**
- Course overview content was directly in `course.$id.tsx`
- No separate index route for the base path

**Problem:** Violated TanStack Router's layout + index pattern

### Issue 3: Duplicate PageLayout Wrappers
**Previous Implementation:**
- Parent route had `PageLayout`
- ALL child routes also wrapped content in `PageLayout`

**Problem:** Double-wrapping caused rendering issues and prevented proper nesting

### Issue 4: Missing Outlet in Parent Routes
**Critical Bug:**
- `course.$id.assignments.tsx` is a parent route (has children) but had NO `<Outlet />`
- `course.$id.reflections.tsx` is a parent route (has children) but had NO `<Outlet />`

**Problem:** Child routes had nowhere to render, causing the main symptom

---

## Solution Implemented

### 1. Restructured Parent Route as Pure Layout
**File:** `course.$id.tsx`

**Before:**
```tsx
// Had conditional logic, course overview content, and useMatches()
function CourseDetailPage() {
  const matches = useMatches();
  const isOnChildRoute = matches.some(match => ...);

  if (isOnChildRoute) {
    return <PageLayout><Outlet /></PageLayout>;
  }
  return <PageLayout>{/* course overview */}</PageLayout>;
}
```

**After:**
```tsx
// Pure layout - just wraps children
function CourseLayout() {
  const { currentUserId } = useAuth();
  const { data: currentUser } = useQuery({...});

  return (
    <PageLayout currentUser={currentUser}>
      <Outlet />
    </PageLayout>
  );
}
```

### 2. Created Index Route
**File:** `course.$id.index.tsx` (NEW)

- Moved all course overview content here
- Shows when at `/course/:id` exactly
- Contains course stats, navigation cards, recent assignments preview

### 3. Removed PageLayout from Nested Child Routes
**Files Modified:**
- `course.$id.assignments.$assignmentId.tsx`
- `course.$id.reflections.$reflectionId.tsx`
- `course.$id.assignments.$assignmentId.submissions.tsx`

**Changed:** Removed `import { PageLayout }` and changed wrapper from `<PageLayout>` to `<>`

### 4. Removed Duplicate Wrapper Styling
**Files Modified:**
- `course.$id.assignments.tsx`
- `course.$id.grades.tsx`
- `course.$id.reflections.tsx`

**Changed:** Removed outer div with `padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh'`

### 5. Added Missing Outlets (THE CRITICAL FIX)
**Files Modified:**
- `course.$id.assignments.tsx` - Added `import { Outlet }` and `<Outlet />` at end
- `course.$id.reflections.tsx` - Added `import { Outlet }` and `<Outlet />` at end

**Why Critical:** Without these, child detail pages had nowhere to render

### 6. Fixed Type Safety Issue
**File:** `src/types/api.ts`

**Changed:** `instructions: Array<string>` → `instructions: Array<string> | null`

**Also Added:** Null check in assignments page: `assignment.instructions && assignment.instructions.length > 0`

---

## Final Route Hierarchy

```
__root__
└── course.$id (Layout - provides PageLayout wrapper)
    ├── course.$id.index (Course overview - shows at /course/:id)
    ├── course.$id.assignments (List + Outlet)
    │   └── course.$id.assignments.$assignmentId (Detail)
    │       └── course.$id.assignments.$assignmentId.submissions (Submissions)
    ├── course.$id.grades (Grades list)
    └── course.$id.reflections (List + Outlet)
        └── course.$id.reflections.$reflectionId (Detail)
```

## Files Changed

### Created
- `src/routes/course.$id.index.tsx` - Course overview page

### Modified
1. `src/routes/course.$id.tsx` - Converted to pure layout (27 lines, was 499)
2. `src/routes/course.$id.assignments.tsx` - Added Outlet, removed wrapper styling
3. `src/routes/course.$id.grades.tsx` - Removed wrapper styling
4. `src/routes/course.$id.reflections.tsx` - Added Outlet, removed wrapper styling
5. `src/routes/course.$id.assignments.$assignmentId.tsx` - Removed PageLayout
6. `src/routes/course.$id.reflections.$reflectionId.tsx` - Removed PageLayout
7. `src/routes/course.$id.assignments.$assignmentId.submissions.tsx` - Removed PageLayout
8. `src/types/api.ts` - Made instructions nullable

## Key TanStack Router Patterns Learned

### Pattern 1: Layout Routes
**Purpose:** Provide wrapper structure for all children
**Implementation:** Only render `<Outlet />` (possibly wrapped in layout components)
**Example:** `course.$id.tsx`

### Pattern 2: Index Routes
**Purpose:** Show content when at the exact parent path
**File Naming:** `parent.$param.index.tsx`
**Example:** `course.$id.index.tsx` shows at `/course/:id`

### Pattern 3: Nested Parent Routes
**Purpose:** Routes that show their own content AND have children
**Must Have:** `<Outlet />` component to render children
**Example:** `course.$id.assignments.tsx` shows list AND can show detail below

### Pattern 4: Leaf Routes
**Purpose:** Final destination routes with no children
**Should NOT:** Wrap content in PageLayout if parent provides it
**Example:** `course.$id.assignments.$assignmentId.tsx`

## Testing Performed

✅ **Lint Check:** `npm run lint --filter=web-start` - Passed
✅ **Build Check:** `npm run build --filter=web-start` - Passed
✅ **Dev Server:** Running successfully at http://localhost:3001/
✅ **HMR:** Hot Module Replacement working correctly

## What Should Work Now

1. ✅ Navigate to course page → See course overview
2. ✅ Click "Assignments" → See assignments list
3. ✅ Click "View Details" on assignment → See assignment detail page
4. ✅ Navigate to reflections → See reflections list
5. ✅ Click on reflection → See reflection detail page
6. ✅ All pages have consistent PageLayout with navigation
7. ✅ All routes render their proper content

## Common Pitfalls to Avoid

1. ❌ **Don't use `useMatches()` for route-based conditionals** - Use proper layout/index pattern
2. ❌ **Don't duplicate PageLayout** - Only the top-level layout should have it
3. ❌ **Don't forget `<Outlet />`** - Any route with children MUST have it
4. ❌ **Don't rely on HMR alone** - Structural changes need full server restart
5. ❌ **Don't wrap everything in divs** - Use React Fragments `<>` when no wrapper needed

## Next Steps (if needed)

1. Consider making assignment detail REPLACE the list instead of showing below (UX decision)
2. Add proper 404 handling (currently showing TanStack Router default)
3. Consider adding loading states for nested route transitions
4. May want to add route-level error boundaries

## References

- TanStack Router Docs: https://tanstack.com/router/latest
- Professor's Example: https://github.com/acbart/cisc474-f25-individual-project-starter/tree/main/apps/web-start/src/routes
- Key Concept: File-based routing with layout + index pattern

---

## Debug Log

**Issue Encountered During Fix:**
- HMR showed syntax errors with old PageLayout tags
- **Solution:** Full server restart cleared cached route generation

**How to Debug Similar Issues:**
1. Check `src/routeTree.gen.ts` to see registered routes
2. Look for routes marked as having children (e.g., `CourseIdAssignmentsRouteWithChildren`)
3. Ensure those routes have `<Outlet />` components
4. Kill and restart dev server after structural changes

---

**Session End Status:** ✅ All routing issues resolved, proper patterns established
