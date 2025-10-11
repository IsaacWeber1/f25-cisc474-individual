# Upstream Merge + Cloudflare Migration

**Status**: Planning → Architecture → Implementation
**Priority**: High
**Timeline**: Multi-session (est. 5-8 hours)
**Created**: 2025-10-11

## Problem

Must merge 19 commits from instructor's upstream (`acbart/cisc474-f25-individual-project-starter`) that include:
- Their own TanStack Start implementation (different from our 35-commit migration)
- Required switch from Vercel to Cloudflare Workers deployment
- Backend changes and environment variable requirements (`VITE_BACKEND_URL`)
- Database wiring updates

Our independent TanStack migration (PRs #23-25) will conflict heavily with instructor's changes.

## Solution

Systematically evaluate each of the 19 upstream commits to determine:
1. Which changes are required (deployment, env vars, instructor's requirements)
2. Which changes conflict with our working implementation
3. How to preserve our working TanStack app while adopting required infrastructure changes
4. Migration path from Vercel to Cloudflare Workers

## Approach

**Phase 1**: Analysis & Planning (this session)
- Review all 19 upstream commits individually
- Categorize: Required vs. Optional vs. Conflicts
- Document instructor's TanStack implementation differences
- Plan merge strategy (cherry-pick vs. full merge vs. hybrid)

**Phase 2**: Cloudflare Migration (future session)
- Set up Cloudflare Workers deployment
- Configure environment variables
- Test deployment works

**Phase 3**: Selective Merge (future session)
- Apply required upstream changes
- Resolve conflicts preserving our implementation
- Test everything still works

**Phase 4**: Verification (future session)
- Full system test on Cloudflare
- Verify all 13 pages work
- Clean up merge artifacts

## Quick Links

- [Current State](CURRENT_STATE.md) ← **START HERE NEXT SESSION**
- [Implementation Plan](planning/IMPLEMENTATION_PLAN.md)
- [Architecture Analysis](architecture/UPSTREAM_ANALYSIS.md)
- [Session 001 Checkpoint](sessions/001_initialization/CHECKPOINT.md)

## Context

**Our Work**:
- PR #23: Complete TanStack migration (35 commits, 13/13 pages)
- PR #24: Lint fixes (26 errors resolved)
- PR #25: Next.js removal (115 MB freed)

**Instructor's Upstream** (19 commits):
- Their own TanStack implementation
- Cloudflare Workers requirement
- Backend wiring changes
- Environment variable changes

**Key Decision**: Keep our frontend implementation, adopt their infrastructure requirements.
