# Checkpoint 005: Assignment Details Page Separation

**Date**: 2025-10-15
**Duration**: ~30 minutes
**Starting State**: Assignment details rendered below assignments list (nested layout issue)
**Ending State**: ✅ Assignment details on separate page, proper TanStack Router layout pattern

---

## Problem Statement

After the TanStack Router migration, assignment details were rendering at the bottom of the assignments list page instead of on their own page. When clicking "View Details" on an assignment:
- URL changed to `/course/:id/assignments/:assignmentId`
- Both the assignments list AND assignment details rendered on the same page
- Assignment details appeared below the fold, making it appear as if nothing happened

This was caused by having all content directly in the parent route (`course.$id.assignments.tsx`) with an `<Outlet />` at the bottom, causing child routes to render below parent content.

---

## Root Cause

**Improper Route Structure:**
The `course.$id.assignments.tsx` file was both:
1. Displaying the assignments list content
2. Providing an `<Outlet />` for child routes

This is an anti-pattern in TanStack Router. The correct pattern is:
- **Layout routes**: Only render `<Outlet />` (act as wrappers)
- **Index routes**: Display content for the base path
- **Child routes**: Display content for specific IDs

**What was happening:**
```
/course/:id/assignments
├─ assignments.tsx (rendered assignments list + <Outlet />)
└─ assignments.$assignmentId.tsx (rendered detail inside outlet, below list)
```

**What should happen:**
```
/course/:id/assignments (layout)
├─ assignments/index.tsx (list at base path)
└─ assignments/$assignmentId.tsx (detail at child path)
```

---

## Solution Implemented

### 1. Created Index Route for Assignments List
**File**: `course.$id.assignments.index.tsx` (NEW)

Moved all assignments list content from `course.$id.assignments.tsx` to this new index route:
- Fetches course and assignments data
- Displays assignments list with cards
- Shows status badges, due dates, grades
- Provides "View Details" links to child routes
- Shows at `/course/:id/assignments` exactly

**Key changes from original:**
- Changed optional chaining `assignment.submissions?.find()` → `assignment.submissions.find()` (lint fix)
- File route path: `/course/$id/assignments/` (note trailing slash for index)

### 2. Converted Parent Route to Pure Layout
**File**: `course.$id.assignments.tsx` (MODIFIED)

**Before** (347 lines):
```tsx
function AssignmentsPage() {
  // ... all state, queries, helper functions
  // ... all assignments list rendering
  return (
    <>
      {/* All the assignments list content */}
      <Outlet /> {/* Child routes render here */}
    </>
  );
}
```

**After** (9 lines):
```tsx
function AssignmentsLayout() {
  return <Outlet />;
}
```

Now acts as a pure layout component that only renders child routes.

### 3. Files Modified Summary

| File | Change | Lines Changed |
|------|--------|---------------|
| `course.$id.assignments.tsx` | Converted to layout (deleted all content) | -338 lines |
| `course.$id.assignments.index.tsx` | Created with assignments list content | +365 lines (new) |
| Total | Net change | +27 lines, +1 file |

---

## Route Hierarchy (After Fix)

```
course.$id (layout with PageLayout)
└── assignments (layout - just Outlet)
    ├── index (list page) ← Shows at /course/:id/assignments
    └── $assignmentId (detail page) ← Shows at /course/:id/assignments/:id
        └── submissions (submissions page)
```

---

## Testing Performed

### Quality Checks
✅ **Lint**: `npm run lint --filter=web-start` - Passed (after fixing optional chaining)
✅ **Build**: `npm run build --filter=web-start` - Passed
✅ **Dev Server**: Running at http://localhost:3001/

### Functional Testing
✅ Navigate to `/course/:id/assignments` → Shows assignments list only
✅ Click "View Details" → Navigates to detail page
✅ Detail page shows assignment info on its own (no list visible)
✅ Back navigation works correctly
✅ Direct URL access works for both routes

### Browser Console
✅ No errors
✅ No CORS issues (local backend configuration)
✅ All API calls succeed

---

## Environment Configuration Note

During testing, discovered the `.env` file was configured for production:
```bash
# Was:
VITE_BACKEND_URL=https://f25-cisc474-individual-n1wv.onrender.com

# Changed to:
VITE_BACKEND_URL=http://localhost:3000
```

**Remember**: When switching between local and production:
1. Update `.env` file
2. Rebuild the app (`npm run build`)
3. For Cloudflare: Redeploy with production settings

---

## Key TanStack Router Patterns Reinforced

### Pattern 1: Layout Routes
**Purpose**: Provide wrapper structure, no content
**Implementation**: Only `<Outlet />`
**Example**: `course.$id.assignments.tsx`

### Pattern 2: Index Routes
**Purpose**: Content for exact parent path
**File naming**: `parent.index.tsx`
**Example**: `course.$id.assignments.index.tsx` → `/course/:id/assignments`

### Pattern 3: Separation of Concerns
- **Layout** = Structure (Outlet)
- **Index** = List/Overview (when at base path)
- **Child** = Detail (when at specific ID)

This pattern was established in Session 004 for course routes and is now consistently applied to assignments routes.

---

## Comparison to Session 004

| Aspect | Session 004 (Course) | Session 005 (Assignments) |
|--------|---------------------|---------------------------|
| Problem | Course overview & nested routes on same page | Assignments list & detail on same page |
| Solution | Created `course.$id.index.tsx` | Created `course.$id.assignments.index.tsx` |
| Layout | `course.$id.tsx` → pure layout | `course.$id.assignments.tsx` → pure layout |
| Pattern | Layout + Index | Layout + Index (same) |
| Result | Clean separation | Clean separation |

**Learning**: Once you understand the layout + index pattern, it applies consistently across all nested routes.

---

## Files in Repository

### Modified
- `apps/web-start/src/routes/course.$id.assignments.tsx` - Now 9 lines (layout only)
- `apps/web-start/.env` - Switched to local backend

### Created
- `apps/web-start/src/routes/course.$id.assignments.index.tsx` - 365 lines (list page)
- `apps/docs/public/routing_fix_tanstack/sessions/005_assignments_page_separation/CHECKPOINT.md` - This file

### Build Artifacts
- `apps/web-start/dist/` - Updated with new route structure
- `apps/web-start/src/routeTree.gen.ts` - Auto-regenerated by TanStack Router

---

## Common Pitfalls to Avoid

1. ❌ **Don't put content in layout routes** - Only use `<Outlet />`
2. ❌ **Don't forget to create index routes** - Base path needs content
3. ❌ **Don't use optional chaining on non-nullable types** - Lint will catch this
4. ❌ **Don't forget to restart dev server** - Route structure changes require restart
5. ❌ **Don't test with wrong environment** - Check `.env` matches your backend

---

## Next Steps (Optional)

If you want to apply this pattern to other nested routes:

1. **Reflections**: Already has layout + index pattern ✅ (from Session 004)
2. **Submissions**: Currently renders below assignment detail
   - Could create `course.$id.assignments.$assignmentId.index.tsx`
   - Convert `course.$id.assignments.$assignmentId.tsx` to layout
3. **Grades**: Single page, no nested routes needed ✅

---

## Git Status

### Branch
`fix/increase-backend-timeout` (existing branch)

### Modified Files (not yet committed)
```
M apps/web-start/.env
M apps/web-start/src/routes/course.$id.assignments.tsx
?? apps/web-start/src/routes/course.$id.assignments.index.tsx
```

### Recommended Commit Message
```
feat: separate assignment details onto own page

- Convert course.$id.assignments.tsx to pure layout component
- Create course.$id.assignments.index.tsx for assignments list
- Assignment details now render on separate page instead of below list
- Follows TanStack Router layout + index pattern from Session 004
- Fix lint errors (unnecessary optional chaining)

Closes routing issue where assignment details appeared below list
```

---

## Session Handoff

### What Works ✅
- Assignment list displays at `/course/:id/assignments`
- Assignment details display at `/course/:id/assignments/:assignmentId` on own page
- Navigation between list and details works correctly
- Lint and build checks pass
- Local development environment configured correctly

### What's Not Done ⚪
- No additional work needed - task is complete

### Ready for Next Steps
- ✅ Can commit changes
- ✅ Can continue development
- ✅ Pattern established for future nested routes
- ✅ Documentation complete

---

## References

- **Session 004**: `apps/docs/public/routing_fix_tanstack/sessions/004_nested_routes_fix/CHECKPOINT.md`
- **TanStack Router Docs**: https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing
- **Pattern Origin**: Professor's example repository structure

---

**Session Complete**: All objectives met, pattern documented, ready for deployment.
