# TanStack Migration Documentation

Complete guide for migrating from Next.js to TanStack Start/Router with TanStack Query.

## 📚 Documentation Files

### 1. **QUICK_START.md** - Start Here!
Quick guide to get the TanStack app running in 10 minutes.
- Copy web-start directory from upstream
- Install dependencies
- Configure environment
- Test basic setup
- **Perfect for**: Getting started immediately

### 2. **CODE_COMPARISONS.md** - Learn by Example
Side-by-side comparisons showing how Next.js code translates to TanStack.
- Real examples from your codebase
- Before/after comparisons
- Common patterns
- **Perfect for**: Understanding the migration

### 3. **MIGRATION_PLAN.md** - Complete Reference
Comprehensive 7-phase migration plan with detailed steps.
- Architecture overview
- Phase-by-phase breakdown
- Testing strategy
- Deployment guide
- Timeline estimates
- **Perfect for**: Planning and executing the full migration

## 🎯 Assignment Requirements

From `assignment.md`:
> Deploy your new frontend and submit the URL. Make sure you have wired up at least one frontend page to render data from a backend route that accesses your database.

**Minimum requirements:**
1. ✅ Copy web-start from upstream repo
2. ✅ Configure to connect to your backend
3. ✅ At least ONE page fetching data from database
4. ✅ Deploy to Vercel
5. ✅ Submit deployment URL

**Good news:** The upstream already has a working `/courses` page that meets these requirements!

## 🚀 Quick Path to Success

### Option A: Minimal (Meet Requirements)
1. Follow `QUICK_START.md` steps 1-4
2. Verify `/courses` page works locally
3. Deploy to Vercel (step 8)
4. Submit URL
5. **Time: 1-2 hours**

### Option B: Complete Migration
1. Follow `QUICK_START.md` for setup
2. Use `CODE_COMPARISONS.md` as reference
3. Follow `MIGRATION_PLAN.md` phases
4. Migrate all pages
5. **Time: 17-25 hours**

## 📖 How to Use This Documentation

```
Start → QUICK_START.md → Get running
   ↓
   ├─→ Need examples? → CODE_COMPARISONS.md
   ├─→ Ready to migrate? → MIGRATION_PLAN.md
   └─→ Just submit assignment? → Deploy after step 4
```

## 🔑 Key Concepts

### TanStack Query (React Query)
Replaces all your `useEffect` + `useState` + `fetch` patterns with:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['courses'],
  queryFn: backendFetcher('/courses'),
});
```

Benefits:
- Automatic caching
- Background refetching
- Loading/error states
- Request deduplication
- Retry logic
- DevTools

### TanStack Router
File-based routing with type safety:
- `index.tsx` → `/`
- `courses.tsx` → `/courses`
- `course.$id.tsx` → `/course/:id`

Benefits:
- Type-safe params
- Type-safe navigation
- Better link handling
- Route devtools

## 🛠️ Technical Stack

### Current (Next.js)
```
Next.js 15 → React → fetch → Manual state → Inline styles
```

### New (TanStack)
```
Vite → TanStack Router → React → TanStack Query → Backend API
```

## 📦 What You Get from Upstream

The `web-start` directory includes:
- ✅ Configured Vite + TypeScript
- ✅ TanStack Router setup
- ✅ TanStack Query setup
- ✅ Backend fetcher with retry logic
- ✅ DevTools integration
- ✅ Working example (`/courses` page)
- ✅ Root layout with navigation

## 🎓 Learning Resources

**Official Docs:**
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Start](https://tanstack.com/start/latest)
- [Vite](https://vitejs.dev/)

**Reference:**
- [Professor's Repo](https://github.com/acbart/cisc474-f25-individual-project-starter)
- Your current Next.js code (for comparison)

## ⚠️ Common Gotchas

### 1. Environment Variables
- Next.js: `NEXT_PUBLIC_*`
- TanStack: `VITE_*`

### 2. Route Parameters
- Next.js: `[id]` folder
- TanStack: `$id` in filename

### 3. Navigation
- Next.js: `<Link href="/path">`
- TanStack: `<Link to="/path" params={...}>`

### 4. Client Components
- Next.js: `'use client'` directive needed
- TanStack: All components are client by default

### 5. Data Fetching
- Next.js: Manual `useEffect`
- TanStack: `useQuery` hook

## 🎯 Success Criteria

**For Assignment:**
- [ ] Web-start directory copied from upstream
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] At least one page working (e.g., `/courses`)
- [ ] Deployed to Vercel
- [ ] Page fetches data from backend/database
- [ ] URL submitted

**For Full Migration:**
- [ ] All pages migrated
- [ ] No `useEffect` for data fetching
- [ ] Using TanStack Query for all API calls
- [ ] Using TanStack Router for all navigation
- [ ] Loading/error states working
- [ ] Caching working (verify in DevTools)
- [ ] Deployed and tested

## 📞 Getting Help

1. **Check DevTools**: TanStack provides amazing debugging tools
2. **Console logs**: The fetcher logs all requests
3. **Compare examples**: Use `CODE_COMPARISONS.md`
4. **Check docs**: Links in "Learning Resources" above
5. **Review upstream**: Professor's repo has working examples

## 🎬 Next Steps

1. Read `QUICK_START.md`
2. Execute steps 1-4
3. Verify it works locally
4. (Optional) Read `CODE_COMPARISONS.md` for migration patterns
5. Deploy to Vercel
6. Submit URL

**Ready to start?** → Open `QUICK_START.md`

---

*Last Updated: October 2025*
*Assignment Due: Check Canvas*
