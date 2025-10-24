# Development Workflow Guide - LMS Project
*Created: 2025-10-24*

## Project Context

**Course**: CISC474 Advanced Web Technologies, Fall 2025
**Project**: Learning Management System with reflection feature
**Repository**: f25-cisc474-individual
**Documentation System**: RegAssist-inspired session management

---

## Current Focus: Phase 1 Implementation (Sequential Development)

Following **Sequential Code, Parallel Documentation Planning** approach:

**Current Phase**: Core CRUD Operations
**Order**: Submissions → Grades → Comments → Courses → Enrollments → Reflections

---

## Daily Workflow

### Session Start: Context Loading

```bash
# Navigate to project
cd "/Users/owner/Assignments/Advanced Web Tech/f25-cisc474-individual"

# Check current branch
git branch
git status

# Review active features
cat apps/docs/public/ACTIVE_FEATURES.md

# Find what to work on (look for 🔴 markers)
grep -r "🔴 NEXT SESSION" apps/docs/public/current/*/CURRENT_STATE.md

# Example: Working on submissions
cat apps/docs/public/current/submissions/CURRENT_STATE.md
```

### Morning: Planning & Documentation

```bash
# Create or update feature documentation
cd apps/docs/public/current/{feature_name}

# Update CURRENT_STATE.md as you plan
vim CURRENT_STATE.md

# Create planning docs for next feature (parallel planning)
# Example: Planning Grades while coding Submissions
mkdir -p ../grades/planning
vim ../grades/planning/IMPLEMENTATION_PLAN.md

# Commit documentation changes (follow .claude/CLAUDE.md rules)
git add .
git commit -m "docs({feature}): update planning and current state"
```

### Afternoon: Code Implementation

```bash
# Work on code (always on feature branch!)
git checkout -b feat/{feature-name}  # If new feature
# OR
git checkout feat/{feature-name}     # If resuming

# Backend work
cd apps/api
npm run dev  # Start backend (:3000)

# Frontend work (separate terminal)
cd apps/web-start
npm run dev  # Start frontend (:3001)

# Make code changes
# Test frequently: npm run lint --filter=api
#                  npm run build --filter=api

# Commit code changes (small, logical commits)
git add .
git commit -m "feat({feature}): {description}"
```

### End of Day: Sync & Checkpoint

```bash
# Update CURRENT_STATE.md
cd apps/docs/public/current/{feature}/
vim CURRENT_STATE.md
# - Mark what's complete with ✅
# - Add known issues with ❌
# - Update "Work Remaining"
# - Move 🔴 marker to next action

# Create checkpoint if milestone reached (>2 hours work)
SESSION_NUM=$(printf "%03d" $(($(ls -d sessions/[0-9]* 2>/dev/null | wc -l) + 1)))
mkdir -p sessions/${SESSION_NUM}_{description}
cp ../../templates/CHECKPOINT_TEMPLATE.md sessions/${SESSION_NUM}_{description}/CHECKPOINT.md
vim sessions/${SESSION_NUM}_{description}/CHECKPOINT.md

# Commit all documentation
git add apps/docs/
git commit -m "docs({feature}): session ${SESSION_NUM} checkpoint"

# Push all changes (if on feature branch)
git push -u origin feat/{feature-name}
```

---

## Feature Branches

### Active Branches

| Feature | Branch | Docs Location | Status |
|---------|--------|---------------|--------|
| Authentication | `feat/auth0-authentication` | `current/auth0_authentication/` | 🟢 Complete (ready to merge) |
| Submissions | Not created yet | `current/submissions/` | 🟡 Planning |
| Grades | Not created yet | `current/grades/` | 🔴 Blocked by Submissions |
| Comments | Not created yet | `current/comments/` | 🔴 Blocked by Submissions |

### Branch Strategy

```bash
# Always work on feature branches
# NEVER commit directly to main (branch protection enabled)

# Starting new feature
git checkout main
git pull origin main  # CRITICAL: Sync main first!
git checkout -b feat/{feature-name}

# Work on feature...
git add .
git commit -m "feat({feature}): {description}"

# Push and create PR
git push -u origin feat/{feature-name}
gh pr create --repo IsaacWeber1/f25-cisc474-individual \
  --base main \
  --head feat/{feature-name} \
  --title "Feature: {Feature Name}" \
  --body "Description here"

# After PR merged
git checkout main
git pull origin main
```

---

## Cross-Feature Tracking

### Master Status File

**Location**: `apps/docs/public/ACTIVE_FEATURES.md`

This file maintains sync between all features and tracks dependencies.

**Update when**:
- Feature status changes (Planning → Implementation → Complete)
- Dependencies resolved or created
- Blockers encountered or removed
- Milestones reached

---

## Session Checkpoints

### When to Create Checkpoints

- After completing a major milestone
- Before switching to a different task
- At end of significant work sessions (2+ hours)
- Before creating PR
- When hitting blockers
- At end of day if significant progress made

### Checkpoint Process

```bash
# Determine next session number
cd apps/docs/public/current/{feature}/
SESSION_NUM=$(printf "%03d" $(($(ls -d sessions/[0-9]* 2>/dev/null | wc -l) + 1)))

# Create session directory with descriptive name
mkdir sessions/${SESSION_NUM}_{description}
# Examples:
# sessions/001_planning/
# sessions/002_backend_crud_implementation/
# sessions/003_frontend_forms/

# Copy template
cp ../../templates/CHECKPOINT_TEMPLATE.md sessions/${SESSION_NUM}_{description}/CHECKPOINT.md

# Fill in checkpoint (see template for structure)
vim sessions/${SESSION_NUM}_{description}/CHECKPOINT.md

# MANDATORY: Update CURRENT_STATE.md
vim CURRENT_STATE.md
# Add to "Last Updated" line
# Update completion status
# Note this checkpoint in history

# Commit
git add .
git commit -m "docs({feature}): session ${SESSION_NUM} checkpoint - {brief description}"
```

---

## Testing Strategy

### Development Testing

```bash
# Backend testing
cd apps/api
npm run lint --filter=api
npm run build --filter=api
npm test  # When tests exist

# Frontend testing
cd apps/web-start
npm run lint --filter=web-start
npm run build --filter=web-start

# Manual browser testing
# 1. Start both servers
# 2. Login at http://localhost:3001
# 3. Test the workflow
# 4. Check browser console for errors
```

### Before Committing (CRITICAL)

Follow `.claude/CLAUDE.md` quality checks:

- [ ] `npm run lint --filter={workspace}` passes
- [ ] `npm run build --filter={workspace}` passes
- [ ] Manual browser test completed
- [ ] No console errors
- [ ] Documentation updated
- [ ] CURRENT_STATE.md reflects changes

### Before Creating PR

- [ ] All tests pass
- [ ] Lint passes
- [ ] Build passes
- [ ] Browser testing complete
- [ ] Documentation complete
- [ ] CURRENT_STATE.md updated
- [ ] Checkpoint created
- [ ] CI will pass (same checks)

---

## Merging Strategy

### Feature Complete

```bash
# 1. Ensure all quality checks pass
cd "/Users/owner/Assignments/Advanced Web Tech/f25-cisc474-individual"
npm run lint --filter=api
npm run build --filter=api
npm run lint --filter=web-start
npm run build --filter=web-start

# 2. Update documentation to "Complete" status
cd apps/docs/public/current/{feature}/
vim CURRENT_STATE.md
# Change status to 🟢 Complete

# 3. Create final checkpoint
# (Follow checkpoint process above)

# 4. Create PR
gh pr create --repo IsaacWeber1/f25-cisc474-individual \
  --base main \
  --head feat/{feature-name} \
  --title "{Feature}: Complete implementation" \
  --body "$(cat <<'EOF'
## Summary
- Implemented {list key accomplishments}

## Test Plan
- [x] Manual testing complete
- [x] Lint passes
- [x] Build passes

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"

# 5. Wait for CI to pass, then merge via GitHub UI

# 6. After merge, move docs to completed/
git checkout main
git pull origin main
mv apps/docs/public/current/{feature}/ apps/docs/public/completed/
git commit -m "docs({feature}): move to completed"
git push
```

### Starting Next Feature

```bash
# After current feature merged
git checkout main
git pull origin main

# Create new feature branch
git checkout -b feat/{next-feature}

# Documentation already planned (parallel planning!)
cd apps/docs/public/current/{next-feature}/
cat CURRENT_STATE.md  # Should have 🔴 marker ready

# Begin implementation...
```

---

## Quick Reference Commands

### Status Check

```bash
# What branch am I on?
git branch

# What features are active?
cat apps/docs/public/ACTIVE_FEATURES.md | grep "🟢\|🟡"

# What's the current state of a feature?
cat apps/docs/public/current/{feature}/CURRENT_STATE.md

# Find next action across all features
grep -r "🔴 NEXT SESSION" apps/docs/public/current/*/CURRENT_STATE.md
```

### Environment Setup

```bash
# Start development session (two terminals)

# Terminal 1: Backend
cd "/Users/owner/Assignments/Advanced Web Tech/f25-cisc474-individual/apps/api"
npm run dev  # Runs on :3000

# Terminal 2: Frontend
cd "/Users/owner/Assignments/Advanced Web Tech/f25-cisc474-individual/apps/web-start"
npm run dev  # Runs on :3001

# Access app: http://localhost:3001
```

### Common Tasks

```bash
# Run linter
npm run lint --filter=api
npm run lint --filter=web-start

# Fix lint errors
cd apps/web-start
npm run lint -- --fix

# Build
npm run build --filter=api
npm run build --filter=web-start

# Database operations
cd packages/database
npx prisma studio  # Visual database browser
npx prisma db push  # Push schema changes
npx prisma db seed  # Seed database
```

---

## Documentation Templates

All templates are in `apps/docs/public/templates/`:

- `CHECKPOINT_TEMPLATE.md` - Session checkpoints
- `CURRENT_STATE_TEMPLATE.md` - Feature status
- `FEATURE_STRUCTURE.md` - Directory structure
- `NEW_FEATURE_INIT.md` - New feature startup
- `ARCHITECTURE_RULE_TEMPLATE.md` - Rules/patterns

---

## Best Practices

### Documentation

- ✅ Update CURRENT_STATE.md frequently (every session)
- ✅ Create checkpoints for major milestones (>2 hours)
- ✅ Keep README.md as navigation hub
- ✅ Follow template structures exactly
- ✅ Use 🔴 markers for handoffs
- ✅ Keep bullets ONE LINE each
- ❌ Don't create verbose documentation
- ❌ Don't skip checkpoint updates

### Code

- ✅ Test frequently during development
- ✅ Run lint before committing
- ✅ Run build before committing
- ✅ Commit small, logical changes
- ✅ Write descriptive commit messages
- ✅ Always work on feature branches
- ❌ Never commit directly to main
- ❌ Never skip quality checks

### Git Workflow

- ✅ Always sync main before creating branch
- ✅ Create feature branches for all changes
- ✅ Use PR workflow for everything
- ✅ Wait for CI to pass before merging
- ✅ Follow branch naming: `feat/`, `fix/`, `docs/`
- ❌ Never use `git commit --amend` (except for hooks)
- ❌ Never force push to main
- ❌ Never skip branch protection

### Communication

- ✅ Document decisions in checkpoints
- ✅ Note blockers in CURRENT_STATE.md with ❌
- ✅ Update ACTIVE_FEATURES.md when status changes
- ✅ Link related documentation

---

## Troubleshooting

### "Wrong branch" errors

```bash
# Check which branch
git branch

# Switch to correct branch
git checkout feat/{feature-name}
```

### "Uncommitted changes" warnings

```bash
# Check what changed
git status

# Commit or stash
git add .
git commit -m "wip: {description}"
# OR
git stash
```

### "Tests failing" issues

```bash
# Check linter
npm run lint --filter=api

# Check build
npm run build --filter=api

# View detailed errors
cd apps/api
npm run lint
npm run build
```

### "Can't commit to main" error

```bash
# Branch protection is enabled!
# Create feature branch instead:
git checkout -b feat/{feature-name}
git add .
git commit -m "{message}"
git push -u origin feat/{feature-name}
```

---

## Project Timeline

### Completed

- ✅ Assignment 1: Planning (Week 1-2)
- ✅ Assignment 2: Infrastructure (Week 3-4)
- ✅ Assignment 3: Authentication (Week 5-6)

### Current Phase: Core Implementation

**Week 7-8: Submissions & Grades**
- Days 1-3: Submissions CRUD (4-6 hours)
- Days 4-5: Grades CRUD (3-4 hours)
- Day 6: Comments CRUD (2-3 hours)
- Day 7: Testing & documentation
- **Deliverable**: Functional LMS with core workflows

**Week 9-10: Course Management**
- Courses CRUD
- Enrollments CRUD
- Testing

**Week 11-12: Reflections (Unique Feature)**
- Reflection templates
- Skill tagging
- Analytics
- Testing

**Week 13-14: Testing & Polish**
- Unit tests (80% coverage)
- E2E tests (critical paths)
- Final polish
- **Deliverable**: Complete LMS

---

## Parallel Development Pattern

### Sequential Code, Parallel Documentation

```
Week 7:  [Submissions Code Implementation]
         [= Grades Documentation Planning =]

Week 8:  [Grades Code Implementation]
         [= Comments Documentation Planning =]

Week 9:  [Comments Code Implementation]
         [= Courses Documentation Planning =]
```

**Benefits**:
- No merge conflicts (one feature branch at a time)
- Documentation prepared ahead
- Clear dependencies managed
- Smooth handoffs between features

---

**Status Legend**:
- 🟢 ACTIVE - Currently working on
- 🟡 PLANNING - Documentation ready, waiting to code
- 🔴 BLOCKED - Waiting on dependencies
- ✅ COMPLETE - Merged to main

---

*Last Updated: 2025-10-24*
*For documentation system details, see META_DOCUMENTATION.md*
