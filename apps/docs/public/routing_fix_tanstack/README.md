# TanStack Router: Nested Routes Implementation

This folder documents the process of implementing proper nested routing patterns in the TanStack Start application after migrating from Next.js.

---

## Overview

After migrating from Next.js to TanStack Router, several routing issues emerged related to nested routes not rendering correctly. This documentation tracks the learning process and implementation of proper TanStack Router patterns.

---

## Session History

### Session 004: Nested Routes Fix (October 15, 2025)
**Location**: `sessions/004_nested_routes_fix/CHECKPOINT.md`

**Problem**: After migrating to TanStack Router, nested routes (Assignments, Grades, Reflections) were not rendering. Clicking on child routes would change the URL but not show content.

**Initial Symptoms**:
- Routes changed URL but showed no content
- Used conditional rendering with `useMatches()` as band-aid fix
- Violated TanStack Router patterns

**Root Causes**:
1. Parent route (`course.$id.tsx`) used conditional logic instead of proper layout
2. Missing index route for course overview content
3. Duplicate `PageLayout` wrappers in child routes
4. Missing `<Outlet />` in parent routes with children

**Solution**:
- Created `course.$id.index.tsx` for course overview
- Converted `course.$id.tsx` to pure layout component
- Removed `PageLayout` from all nested child routes
- Added `<Outlet />` to parent routes (`assignments.tsx`, `reflections.tsx`)

**Pattern Established**: **Layout + Index Pattern**
- Parent routes = Layouts (just `<Outlet />`)
- Index routes = Content for base path
- Child routes = Content for specific items

**Files Modified**: 8 files
**Result**: ✅ All 13 pages working correctly

---

### Session 005: Assignment Details Page Separation (October 15, 2025)
**Location**: `sessions/005_assignments_page_separation/CHECKPOINT.md`

**Problem**: Assignment details were rendering at the bottom of the assignments list instead of on their own page.

**Root Cause**: The `course.$id.assignments.tsx` file contained both list content AND `<Outlet />`, causing child routes to render below the list.

**Solution**:
- Created `course.$id.assignments.index.tsx` with assignments list
- Converted `course.$id.assignments.tsx` to pure layout (only `<Outlet />`)
- Applied the same Layout + Index pattern from Session 004

**Files Modified**: 2 files (1 created, 1 reduced from 347 to 9 lines)
**Result**: ✅ Assignment details now on separate page

**Key Insight**: The Layout + Index pattern is universally applicable to all nested routes.

---

## Key Patterns Learned

### 1. Layout Routes
**Purpose**: Provide wrapper structure for all children
**Implementation**: Only render `<Outlet />`
**No content**: All content goes in index or child routes

```tsx
// course.$id.assignments.tsx (LAYOUT)
function AssignmentsLayout() {
  return <Outlet />;
}
```

### 2. Index Routes
**Purpose**: Show content when at the exact parent path
**File naming**: `parent.index.tsx`
**Route path**: Shows at `/parent` exactly

```tsx
// course.$id.assignments.index.tsx (INDEX)
function AssignmentsListPage() {
  return <div>{/* Assignments list content */}</div>;
}
```

### 3. Child/Detail Routes
**Purpose**: Show content for specific items
**File naming**: `parent.$param.tsx`
**Route path**: Shows at `/parent/:param`

```tsx
// course.$id.assignments.$assignmentId.tsx (CHILD)
function AssignmentDetailPage() {
  return <div>{/* Assignment detail content */}</div>;
}
```

---

## Current Route Structure

```
__root__
└── course.$id (Layout with PageLayout)
    ├── course.$id.index (Course overview)
    ├── course.$id.assignments (Layout)
    │   ├── course.$id.assignments.index (Assignments list)
    │   └── course.$id.assignments.$assignmentId (Assignment detail)
    │       └── course.$id.assignments.$assignmentId.submissions
    ├── course.$id.grades (Grades list - no children)
    └── course.$id.reflections (Layout)
        ├── course.$id.reflections.index (Reflections list - TBD)
        └── course.$id.reflections.$reflectionId (Reflection detail)
```

### Route Type Key
- **Layout**: Only renders `<Outlet />`, provides structure
- **Index**: Shows at base path, contains list/overview content
- **Child**: Shows at specific ID path, contains detail content
- **Leaf**: Final destination with no children

---

## Before vs After Comparison

### Before (Incorrect Pattern)
```tsx
// course.$id.assignments.tsx - WRONG
function AssignmentsPage() {
  const matches = useMatches();

  // Conditional rendering based on route detection
  if (isOnChildRoute) {
    return <Outlet />;
  }

  return (
    <>
      {/* Assignments list content */}
      <Outlet /> {/* Child renders BELOW list */}
    </>
  );
}
```

**Problems**:
- Runtime route detection is fragile
- Content and outlet on same level
- Not idiomatic TanStack Router

### After (Correct Pattern)
```tsx
// course.$id.assignments.tsx - Layout
function AssignmentsLayout() {
  return <Outlet />;
}

// course.$id.assignments.index.tsx - List
function AssignmentsListPage() {
  return <div>{/* Assignments list */}</div>;
}

// course.$id.assignments.$assignmentId.tsx - Detail
function AssignmentDetailPage() {
  return <div>{/* Assignment detail */}</div>;
}
```

**Benefits**:
- Clear separation of concerns
- No runtime route detection needed
- Idiomatic TanStack Router pattern
- Each route has single responsibility

---

## Common Mistakes to Avoid

1. ❌ **Putting content in layout routes**
   - Layouts should ONLY have `<Outlet />`

2. ❌ **Forgetting to create index routes**
   - Base path needs somewhere to render

3. ❌ **Using `useMatches()` for conditional rendering**
   - This is a band-aid, use proper layouts instead

4. ❌ **Nesting `<PageLayout>` components**
   - Only top-level layout should have `<PageLayout>`

5. ❌ **Missing `<Outlet />` in parent routes**
   - Routes with children MUST have `<Outlet />`

---

## Debugging Tips

### Issue: Routes change URL but don't render
**Check**:
1. Does parent route have `<Outlet />`?
2. Does the route file exist with proper naming?
3. Is `routeTree.gen.ts` up to date? (restart dev server)

### Issue: Content appears below other content
**Check**:
1. Is parent route mixing content with `<Outlet />`?
2. Should there be an index route for parent content?
3. Are child routes wrapped in `<PageLayout>`? (they shouldn't be)

### Issue: "Route not found" errors
**Check**:
1. File naming matches expected pattern?
2. Dev server restarted after creating new routes?
3. Check `routeTree.gen.ts` for registered routes

---

## Next Steps / Future Work

### Potential Improvements
1. **Reflections Index Route**: Create `course.$id.reflections.index.tsx` for consistency
2. **Submissions Separation**: Consider separating submissions to own page
3. **Loading States**: Add route-level loading states for nested transitions
4. **Error Boundaries**: Add error boundaries at route level

### Pattern to Apply Elsewhere
The Layout + Index pattern should be applied to any nested route structure:
- Lists should be in index routes
- Details should be in child routes
- Parents should be pure layouts

---

## References

- **TanStack Router Docs**: https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing
- **Professor's Example**: https://github.com/acbart/cisc474-f25-individual-project-starter/tree/main/apps/web-start/src/routes
- **Original Migration**: `apps/docs/public/switch_to_tanstack/`

---

## Folder Structure

```
routing_fix_tanstack/
├── README.md (this file)
└── sessions/
    ├── 004_nested_routes_fix/
    │   └── CHECKPOINT.md
    └── 005_assignments_page_separation/
        └── CHECKPOINT.md
```

---

**Status**: ✅ Routing patterns established and documented
**Last Updated**: October 15, 2025
