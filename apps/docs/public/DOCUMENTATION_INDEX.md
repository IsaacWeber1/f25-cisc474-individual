# Documentation Index

**Last Updated**: 2025-10-23

This is the central index for all project documentation. All documentation follows the RegAssist pattern with session-based tracking.

---

## 🚀 Quick Start

### Starting Development Servers

From the project root, run:
```bash
npm run dev
```

This single command starts **both** servers:
- **Backend API** on http://localhost:3000
- **Frontend** on http://localhost:3001

No need for separate terminals or filter flags - the turbo monorepo handles it!

### Alternative Commands

```bash
npm run dev --filter=web-start  # Frontend only
npm run dev --filter=api        # Backend only
npm run dev:all                 # All packages (includes docs)
```

---

## 📚 Documentation Structure

### Project Status (Current Work)
**Location**: `apps/docs/public/project-status/`

| Document | Purpose |
|----------|---------|
| [NEXT_STEPS.md](project-status/NEXT_STEPS.md) | Step-by-step implementation guide for Phase 1 |
| [SESSION_010_SUMMARY.md](project-status/SESSION_010_SUMMARY.md) | Quick overview of session 010 |
| [IMPLEMENTATION_STATUS.md](project-status/IMPLEMENTATION_STATUS.md) | Complete system status and roadmap |

### Authentication
**Location**: `apps/docs/public/authentication/`

| Document | Purpose |
|----------|---------|
| [README.md](authentication/README.md) | Authentication feature overview and session history |
| [CURRENT_STATE.md](authentication/CURRENT_STATE.md) | Latest authentication implementation status |
| [sessions/](authentication/sessions/) | Session-based checkpoints (001-010) |
| [troubleshooting/](authentication/troubleshooting/) | Auth0 configuration guides and fixes |

### Testing
**Location**: `apps/docs/public/testing/`

| Document | Purpose |
|----------|---------|
| [README.md](testing/README.md) | Testing guide hub and navigation |
| [COMPREHENSIVE_TESTING_GUIDE.md](testing/COMPREHENSIVE_TESTING_GUIDE.md) | Complete testing strategy (1,954 lines) |
| [QUICK_REFERENCE.md](testing/QUICK_REFERENCE.md) | Daily testing patterns and templates |
| [TOOLS_COMPARISON.md](testing/TOOLS_COMPARISON.md) | Testing tool selection guide |

### Documentation System
**Location**: `apps/docs/public/`

| Document | Purpose |
|----------|---------|
| [META_DOCUMENTATION.md](META_DOCUMENTATION.md) | Master guide and navigation hub |
| [DOCUMENTATION_AUTOMATION.md](DOCUMENTATION_AUTOMATION.md) | When/how Claude creates docs |
| [FEATURE_LIFECYCLE.md](FEATURE_LIFECYCLE.md) | Feature stage management |
| [SESSION_AUTOMATION.md](SESSION_AUTOMATION.md) | Session handoff and state management |
| [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) | Daily development workflow |
| [WORKTREE_GUIDE.md](WORKTREE_GUIDE.md) | Parallel development with git worktrees |
| [DOCUMENTATION_QUICK_REFERENCE.md](DOCUMENTATION_QUICK_REFERENCE.md) | Quick reference guide |
| [DOCUMENTATION_SUMMARY.md](DOCUMENTATION_SUMMARY.md) | System summary |
| [README_DOCUMENTATION_GUIDE.md](README_DOCUMENTATION_GUIDE.md) | Documentation guide |

### Templates
**Location**: `apps/docs/public/templates/`

| Document | Purpose |
|----------|---------|
| [CHECKPOINT_TEMPLATE.md](templates/CHECKPOINT_TEMPLATE.md) | Session checkpoint template |
| [CURRENT_STATE_TEMPLATE.md](templates/CURRENT_STATE_TEMPLATE.md) | Feature status template |
| [REGASSIST_DOCUMENTATION_PATTERNS.md](templates/REGASSIST_DOCUMENTATION_PATTERNS.md) | RegAssist pattern guide |

### Archive
**Location**: `apps/docs/public/archive/`

Historical documentation and migration guides for reference.

---

## 🎯 Finding What You Need

### I want to...

**Start developing immediately**
→ Run `npm run dev` from project root

**Implement the next feature (Submissions CRUD)**
→ Read [project-status/NEXT_STEPS.md](project-status/NEXT_STEPS.md)

**Understand current system status**
→ Read [project-status/IMPLEMENTATION_STATUS.md](project-status/IMPLEMENTATION_STATUS.md)

**Learn testing strategy**
→ Read [testing/COMPREHENSIVE_TESTING_GUIDE.md](testing/COMPREHENSIVE_TESTING_GUIDE.md)

**Write tests**
→ Use [testing/QUICK_REFERENCE.md](testing/QUICK_REFERENCE.md)

**Understand authentication**
→ Read [authentication/CURRENT_STATE.md](authentication/CURRENT_STATE.md)

**Fix Auth0 issues**
→ Read [authentication/troubleshooting/AUTH0_DASHBOARD_FIX.md](authentication/troubleshooting/AUTH0_DASHBOARD_FIX.md)

**Create a new feature**
→ Follow patterns in [templates/](templates/)

**Understand documentation system**
→ Read [META_DOCUMENTATION.md](META_DOCUMENTATION.md)

---

## 📖 Documentation Patterns

### Session-Based Development

All significant work is documented in **session checkpoints**:

```
apps/docs/public/{feature_name}/sessions/{number}_{description}/
└── CHECKPOINT.md
```

Each checkpoint includes:
- Problem statement
- Root cause analysis
- Solution implemented
- Files changed
- Testing performed
- Current system state
- Session handoff

### Feature Lifecycle

Features progress through stages:
1. **Future** (`apps/docs/public/future/`) - Planned features
2. **Current** (`apps/docs/public/current/`) - Active development
3. **Completed** (`apps/docs/public/completed/`) - Finished features

### Active Features Tracking

See [ACTIVE_FEATURES.md](ACTIVE_FEATURES.md) for master tracking of all features.

---

## 🔄 Recent Updates

### Session 010 (2025-10-23)
- Database populated with seed data
- Comprehensive system analysis completed
- Testing strategy documented (4,299 lines)
- Implementation roadmap created (5 phases, 55-71 hours)
- Documentation reorganized and moved from root level

### Sessions 001-009 (2025-10-23)
- Authentication system implemented and tested
- Auth0 integration with JWT validation
- Frontend UI integration
- Route guards and API protection
- 10 session checkpoints created

---

## 🛠️ Common Commands

### Development
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build all packages
npm run lint             # Lint all packages
npm run test             # Run tests
```

### Database
```bash
npm run db:push          # Push schema changes
npm run db:seed          # Populate with test data
npm run db:migrate:dev   # Create migration
```

### Testing
```bash
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Open Playwright UI
npm test                 # Run unit tests
```

### Authentication Testing
```bash
npm run auth:test        # Quick auth endpoint test
npm run test:e2e:auth    # Full auth E2E tests
```

---

## 📊 Project Status

**Current Phase**: Phase 1 - Core CRUD Implementation

**Completed**:
- ✅ Authentication system (8.5 hours)
- ✅ Database seeding
- ✅ System analysis
- ✅ Testing strategy

**Next Up**:
- ⏳ Submissions CRUD (4-6 hours)
- 📅 Grades CRUD (3-4 hours)
- 📅 Comments CRUD (2-3 hours)

**Time to Functional System**: 9-13 hours (Phase 1)

---

For complete system status, see [project-status/IMPLEMENTATION_STATUS.md](project-status/IMPLEMENTATION_STATUS.md)