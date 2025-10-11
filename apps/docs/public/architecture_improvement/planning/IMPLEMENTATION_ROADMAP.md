# Implementation Roadmap

**Timeline**: 6 weeks (part-time, 2-4 hours per week)
**Approach**: Incremental, backwards-compatible refactoring
**Can pause between phases**: ✅ Yes

---

## Phase 1: Critical Fixes (Week 1-2)

**Goal**: Eliminate hardcoded values, establish patterns
**Time**: 8-12 hours
**Risk**: 🟢 Low (no breaking changes)

### Week 1: Configuration & Constants

**Tasks**:
1. **Create `src/config/constants.ts`** (1 hour)
   ```typescript
   export const CURRENT_USER_ID = 'cmfr0jaxg0001k07ao6mvl0d2';
   export const API_ENDPOINTS = {
     users: '/users',
     courses: '/courses',
     assignments: '/assignments',
     // ...
   };
   export const COLORS = {
     primary: '#2563eb',
     secondary: '#15803d',
     // ...
   };
   ```

2. **Create `src/contexts/AuthContext.tsx`** (2 hours)
   ```typescript
   export function AuthProvider({ children }) {
     const [currentUser, setCurrentUser] = useState(null);
     // Load user from session/hardcoded
     return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
   }
   export function useAuth() {
     return useContext(AuthContext);
   }
   ```

3. **Replace hardcoded user IDs** (2 hours)
   - Update all 9 files to use `const { currentUser } = useAuth();`
   - Remove all instances of `'cmfr0jaxg0001k07ao6mvl0d2'`
   - Test each route still works

**Checkpoint**: Commit "feat: add AuthContext and constants"

### Week 2: Shared Components

**Tasks**:
4. **Extract `LoadingSpinner.tsx`** (1 hour)
   - Create component with Tailwind classes
   - Replace 5+ duplicate implementations
   - Test all loading states

5. **Extract `ErrorMessage.tsx`** (1 hour)
   - Create component with retry functionality
   - Replace 10+ duplicate implementations
   - Test all error states

6. **Create `PageLayout.tsx`** (1 hour)
   - Standard layout with Navigation
   - Consistent padding and structure
   - Update all routes to use it

7. **Create `src/config/routes.ts`** (2 hours)
   ```typescript
   export const ROUTES = {
     home: '/',
     courses: '/courses',
     course: (id: string) => `/course/${id}`,
     // Type-safe builders
   };
   ```
   - Replace all 17+ hardcoded route strings

**Checkpoint**: Commit "feat: extract shared components and route constants"

**Phase 1 Success Criteria**:
- ✅ Zero hardcoded user IDs (`grep -r "cmfr0jaxg" src/` returns nothing)
- ✅ One LoadingSpinner implementation
- ✅ One ErrorMessage implementation
- ✅ All routes use ROUTES constants
- ✅ Build passes: `npm run build`
- ✅ Lint passes (same or better than before)

---

## Phase 2: Maintainability (Week 3-4)

**Goal**: Consistent styling, reusable logic
**Time**: 12-16 hours
**Risk**: 🟡 Medium (visual changes need QA)

### Week 3: CSS System

**Tasks**:
1. **Install Tailwind CSS** (1 hour)
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
   - Configure `tailwind.config.js`
   - Update `vite.config.ts` if needed
   - Create `src/styles/global.css`

2. **Create design tokens in `theme.ts`** (1 hour)
   ```typescript
   export const theme = {
     colors: {
       primary: { 50: '#eff6ff', 500: '#2563eb', ... },
       // All colors centralized
     },
     spacing: { xs: '0.5rem', sm: '1rem', ... },
     // All spacing values
   };
   ```

3. **Remove inline styles - Navigation** (2 hours)
   - Convert Navigation.tsx to Tailwind
   - Test all hover states work
   - Verify active states work

4. **Remove inline styles - Routes (Part 1)** (4 hours)
   - index.tsx (Dashboard)
   - courses.tsx
   - profile.tsx
   - Test visual parity

**Checkpoint**: Commit "feat: add Tailwind and convert 4 files"

### Week 4: Data Hooks & More Styles

**Tasks**:
5. **Remove inline styles - Routes (Part 2)** (4 hours)
   - course.$id.tsx
   - course.$id.assignments.tsx
   - course.$id.grades.tsx
   - Test all pages

6. **Extract data hooks** (4 hours)
   ```typescript
   // hooks/useCourse.ts
   export function useCourse(id: string) {
     const { data, isLoading, error } = useQuery({
       queryKey: ['course', id],
       queryFn: backendFetcher<Course>(`/courses/${id}`),
     });
     return { course: data, isLoading, error };
   }
   ```
   - Create useCourse.ts
   - Create useUser.ts (integrate with AuthContext)
   - Create useAssignments.ts
   - Update routes to use hooks

7. **Add ESLint rules** (1 hour)
   - Add rule: no inline `style={}` objects
   - Add rule: require `Link` import for navigation
   - Fix any new violations

**Checkpoint**: Commit "feat: complete Tailwind migration and add data hooks"

**Phase 2 Success Criteria**:
- ✅ Zero inline styles (`grep -r "style={{" src/routes/` returns nothing)
- ✅ All colors from theme.ts
- ✅ Data fetching in hooks, not routes
- ✅ ESLint enforces patterns
- ✅ Visual QA passes (no regressions)

---

## Phase 3: Architecture (Week 5-6)

**Goal**: Scalable, professional structure
**Time**: 12-16 hours
**Risk**: 🟢 Low (incremental improvement)

### Week 5: Component Extraction

**Tasks**:
1. **Extract course components** (3 hours)
   - Create `components/course/CourseHeader.tsx`
   - Create `components/course/CourseNav.tsx`
   - Create `components/course/CourseStats.tsx`
   - Update course.$id.tsx (should be < 150 lines now)

2. **Extract assignment components** (3 hours)
   - Create `components/assignment/AssignmentList.tsx`
   - Create `components/assignment/AssignmentCard.tsx`
   - Create `components/assignment/AssignmentStatus.tsx`
   - Update assignment routes

3. **Thin all route files** (2 hours)
   - Target: All routes < 150 lines
   - Move rendering to components
   - Keep only composition in routes

**Checkpoint**: Commit "feat: extract domain components, thin routes"

### Week 6: Polish & Documentation

**Tasks**:
4. **Add advanced patterns** (2 hours)
   - Create ErrorBoundary component
   - Add Suspense wrappers
   - Code splitting for large routes (optional)

5. **Component library documentation** (1 hour)
   - Document each component's API
   - Add usage examples
   - Create components README

6. **Architecture documentation** (1 hour)
   - Write architecture decision records
   - Update project README
   - Create developer onboarding guide

7. **Final testing & cleanup** (2 hours)
   - Full manual QA of all pages
   - Run all linters and tests
   - Fix any remaining issues
   - Measure metrics (before/after)

**Checkpoint**: Commit "feat: complete architecture refactor"

**Phase 3 Success Criteria**:
- ✅ All route files < 150 lines
- ✅ Reusable component library exists
- ✅ Documentation complete
- ✅ All success metrics met (see Appendix A)

---

## Parallel Work Strategy

**Can work on features during refactor?** ✅ Yes!

### Strategy:
1. **Feature branches** - Continue feature work on separate branches
2. **Rebase often** - Pull refactor changes into feature branches
3. **Follow new patterns** - New code uses constants, Tailwind, etc.
4. **Merge refactor first** - Merge architecture changes before features

### Example Timeline:
```
Week 1-2: Phase 1 refactor (8-12 hours)
  - Can do feature work in parallel on separate branch
  - At end of week 2: Merge Phase 1, rebase feature branch

Week 3-4: Phase 2 refactor (12-16 hours)
  - Can continue feature work
  - At end of week 4: Merge Phase 2, rebase feature branch

Week 5-6: Phase 3 refactor (12-16 hours)
  - Finish features using new patterns
  - At end of week 6: Merge everything
```

---

## Rollback Plan

Each phase is independent and reversible:

### If Phase 1 Needs Rollback:
```bash
git revert <commit-hash>
# No dependencies, safe to revert
```

### If Phase 2 Needs Rollback:
```bash
# Can keep constants and AuthContext from Phase 1
# Just revert Tailwind commits if needed
git revert <tailwind-commits>
```

### If Phase 3 Needs Rollback:
```bash
# Can keep everything from Phase 1 & 2
# Just don't extract components yet
```

---

## Progress Tracking

### Weekly Checklist

**Week 1**:
- [ ] Constants file created
- [ ] AuthContext created
- [ ] All 9 hardcoded IDs replaced
- [ ] Build passing
- [ ] Checkpoint committed

**Week 2**:
- [ ] LoadingSpinner extracted
- [ ] ErrorMessage extracted
- [ ] PageLayout created
- [ ] Route constants created
- [ ] All route strings replaced
- [ ] Checkpoint committed

**Week 3**:
- [ ] Tailwind installed
- [ ] Theme tokens created
- [ ] 4 files converted to Tailwind
- [ ] Visual QA passed
- [ ] Checkpoint committed

**Week 4**:
- [ ] All files converted to Tailwind
- [ ] Data hooks extracted
- [ ] ESLint rules added
- [ ] Zero inline styles
- [ ] Checkpoint committed

**Week 5**:
- [ ] Course components extracted
- [ ] Assignment components extracted
- [ ] All routes < 150 lines
- [ ] Checkpoint committed

**Week 6**:
- [ ] Error boundaries added
- [ ] Documentation complete
- [ ] Final QA passed
- [ ] Metrics achieved
- [ ] Final commit

---

## Appendix A: Success Metrics Checklist

Run these commands to verify success:

```bash
# 1. No inline styles
grep -r "style={{" src/routes/ --include="*.tsx"
# Expected: No results

# 2. No hardcoded user IDs
grep -r "cmfr0jaxg0001k07ao6mvl0d2" src/ --include="*.tsx"
# Expected: No results (only in constants.ts)

# 3. No hardcoded routes
grep -r 'to="/' src/routes/ --include="*.tsx"
# Expected: All use ROUTES constants

# 4. File sizes
wc -l src/routes/*.tsx
# Expected: All files < 150 lines

# 5. Build passes
npm run build
# Expected: Success

# 6. Lint passes
npm run lint
# Expected: Same or fewer warnings than before
```

---

## Appendix B: Emergency Contacts

**If stuck or have questions**:
1. Check CURRENT_STATE.md for latest status
2. Check guides/QUICK_WINS.md for step-by-step
3. Check architecture/ for design decisions
4. Check sessions/ for detailed work logs

**If build breaks**:
1. Run `npm run build` to see exact error
2. Check if TanStack Router needs regeneration
3. Check TypeScript errors in routes
4. Revert last commit if needed

**If visual regressions**:
1. Compare screenshots before/after
2. Check Tailwind classes match inline styles
3. Verify design tokens in theme.ts
4. Ask for QA review before merging

---

**Last Updated**: October 10, 2025
**Next Review**: After Phase 1 completion
