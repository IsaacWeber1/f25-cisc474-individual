# Implementation Plan - Upstream Merge + Cloudflare Migration

**Created**: 2025-10-11
**Estimated Duration**: 5-8 hours across multiple sessions

## Overview

Merge 19 instructor commits while preserving our working TanStack implementation (PRs #23-25), then migrate from Vercel to Cloudflare Workers deployment.

## Phases

### Phase 1: Analysis & Documentation (Session 002, ~2 hours)

**Goal**: Understand exactly what needs to be merged and how.

- [ ] Review all 19 upstream commits individually
- [ ] Create `architecture/UPSTREAM_ANALYSIS.md` with:
  - [ ] List all 19 commits with SHA, message, files changed
  - [ ] Categorize each: Required / Optional / Conflicts / Irrelevant
  - [ ] Identify environment variable changes
  - [ ] Document instructor's TanStack vs. our TanStack differences
- [ ] Research Cloudflare Workers for TanStack Start:
  - [ ] Deployment configuration
  - [ ] Environment variable setup
  - [ ] Build command differences from Vercel
- [ ] Decide merge strategy:
  - Option A: Cherry-pick required commits
  - Option B: Merge all, resolve conflicts
  - Option C: Hybrid approach
- [ ] Create detailed merge plan in `guides/MERGE_STRATEGY.md`

**Success Criteria**:
- Every upstream commit categorized
- Cloudflare deployment steps documented
- Merge strategy decided and documented

---

### Phase 2: Cloudflare Setup (Session 003, ~1-2 hours)

**Goal**: Get Cloudflare Workers configured and ready.

- [ ] Create Cloudflare account (if needed)
- [ ] Install Wrangler CLI
- [ ] Configure `wrangler.toml` for web-start
- [ ] Set up environment variables:
  - [ ] `VITE_BACKEND_URL` pointing to Render API
  - [ ] Any other required vars from upstream
- [ ] Test local Cloudflare Workers build:
  - `npx wrangler dev`
- [ ] Deploy test version to Cloudflare
- [ ] Verify basic deployment works

**Success Criteria**:
- Cloudflare Workers deploys successfully
- Can access deployed app
- Environment variables work

---

### Phase 3: Selective Merge (Session 004, ~2-3 hours)

**Goal**: Merge required upstream changes without breaking our implementation.

Following merge strategy from Phase 1:

- [ ] Create merge branch: `feat/upstream-merge`
- [ ] Apply required commits (method TBD in Phase 1):
  - [ ] Environment variable updates
  - [ ] Backend wiring changes (if needed)
  - [ ] Cloudflare configuration
  - [ ] Any other required infrastructure
- [ ] Resolve conflicts:
  - [ ] Keep our TanStack implementation for all 13 pages
  - [ ] Adopt instructor's env var patterns
  - [ ] Merge any backend improvements
- [ ] Test locally:
  - [ ] All 13 pages load
  - [ ] API calls work
  - [ ] No console errors
- [ ] Run quality checks:
  - [ ] `npm run lint`
  - [ ] `npm run build`
  - [ ] `npm run type-check`

**Success Criteria**:
- All required upstream changes merged
- Our 13 pages still work
- Build passes
- No lint errors

---

### Phase 4: Deployment & Verification (Session 005, ~1 hour)

**Goal**: Deploy merged code to Cloudflare and verify production works.

- [ ] Deploy to Cloudflare Workers:
  - `npx wrangler deploy`
- [ ] Verify all 13 pages work in production:
  - [ ] Dashboard, Courses, Profile, Users
  - [ ] Course detail + nested routes
  - [ ] Login, Grading, API demo
- [ ] Test API connectivity from Cloudflare to Render
- [ ] Check browser console for errors
- [ ] Verify environment variables work
- [ ] Update README.md deployment instructions
- [ ] Create PR with all changes
- [ ] Move feature to completed/

**Success Criteria**:
- Production deployment on Cloudflare works
- All functionality verified
- Documentation updated
- PR created and reviewed

---

## Dependencies

**External**:
- Instructor's upstream repo access (have it)
- Cloudflare account (create if needed)
- Render backend already deployed (have it)

**Internal**:
- PR #23, #24, #25 already merged ✅
- Working TanStack app on Vercel ✅
- Branch protection rules active ✅

---

## Risk Management

**High Risk**:
- Merge conflicts between our TanStack vs. instructor's TanStack
- **Mitigation**: Phase 1 analysis, keep our implementation

**Medium Risk**:
- Cloudflare configuration different from Vercel
- **Mitigation**: Phase 2 isolated testing

**Low Risk**:
- Environment variables not working
- **Mitigation**: Test in Phase 2 before merge

---

## Rollback Plan

If merge breaks everything:
1. `git reset --hard` to before merge
2. Keep using Vercel with our current implementation
3. Consult instructor about alternative approach

---

## Success Metrics

- [ ] All 19 upstream commits reviewed
- [ ] Cloudflare Workers deployment works
- [ ] All 13 pages function correctly
- [ ] API connectivity works
- [ ] No regression from PRs #23-25
- [ ] Proper git workflow followed (PR with CI)
- [ ] Documentation complete

---

*This is a living document - update as we learn more in each phase.*
