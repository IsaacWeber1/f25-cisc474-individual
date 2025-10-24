# RegAssist Documentation Patterns & Standards - Complete Guide

This guide documents the comprehensive documentation system used in the regassist_project repository, adapted for use in your course management project.

---

## Table of Contents

1. [Documentation Structure Hierarchy](#documentation-structure-hierarchy)
2. [Directory Organization](#directory-organization)
3. [File Templates & Examples](#file-templates--examples)
4. [PLANNING.md Template](#planningmd-template)
5. [README.md Pattern](#readmemd-pattern)
6. [CURRENT_STATE.md Pattern](#current_statemd-pattern)
7. [Session/Checkpoint Organization](#sessioncheckpoint-organization)
8. [Key Principles & Paradigms](#key-principles--paradigms)
9. [Git Workflow Integration](#git-workflow-integration)
10. [Examples from Real Features](#examples-from-real-features)

---

## Documentation Structure Hierarchy

### Overview
RegAssist uses a **multi-level documentation system** with strict hierarchy:

```
.claude/CLAUDE.md (Project Rules)
    ↓
documents/META_DOCUMENTATION.md (Navigation Hub)
    ↓
documents/DOCUMENTATION_AUTOMATION.md (When to Create Docs)
    ↓
documents/SESSION_AUTOMATION.md (Session Management)
    ↓
documents/current/{feature}/CURRENT_STATE.md (Active Status)
    ↓
documents/current/{feature}/README.md (Overview)
    ↓
documents/current/{feature}/sessions/NNN_description/ (Checkpoints)
```

### Master Rules (from .claude/CLAUDE.md)

**Critical First:**
1. **CURRENT_STATE.md is the source of truth** - Read before any work
2. **Multi-session workflow** - Always check existing docs first
3. **Research before implementing** - For new features/workflows (5-30 min)
4. **Documentation BEFORE code** - Create structure first, then implement
5. **Session checkpoints are automatic** - After 30 min or major change

---

## Directory Organization

### Standard Feature Structure

The regassist_project uses this **proven pattern** for every feature:

```
documents/current/{feature_name}/
├── README.md                          # Overview (ALWAYS PRESENT)
├── CURRENT_STATE.md                   # Status tracker (ALWAYS PRESENT)
├── planning/
│   ├── mvp_plan.md                   # User stories & requirements
│   ├── recommendations.md             # Strategic analysis
│   └── planning.md                    # Other planning docs
├── architecture/
│   ├── modular_architecture.md        # Module design
│   ├── ARCHITECTURE_REQUIREMENTS.md   # Mandatory patterns
│   ├── database_architecture_analysis.md
│   └── other_architecture_docs.md
├── research/
│   └── REQUIREMENTS_ANALYSIS.md       # Requirements breakdown
├── guides/
│   ├── IMPLEMENTATION.md              # Implementation guide
│   ├── quick_reference.md             # 5-minute overview
│   └── HANDOFF_GUIDE.md              # Checkpoint system guide
├── sessions/                          # Session checkpoints
│   ├── 001_planning/
│   │   └── CHECKPOINT.md
│   ├── 002_architecture_integration/
│   │   └── CHECKPOINT.md
│   └── 003_implementation/
│       └── CHECKPOINT.md
└── output/                            # Artifacts (PDFs, diagrams)
    ├── feature_proposal.pdf
    ├── *.png
    └── *.md (temp files)
```

### Three-Tier Organization

RegAssist organizes features by **status**:

```
documents/
├── current/                  # Features being worked on
│   ├── bi_system/           (47 sessions!)
│   ├── cicd_pipeline/       (currently active)
│   ├── pytest_migration/    (completed, not removed)
│   ├── supabase_auth/
│   ├── user_roles/
│   └── ... (15+ active features)
├── completed/               # Finished features (reference)
│   ├── dmg_highlighting_fix/
│   ├── forms_system/
│   └── scenarios_system/
├── future/                  # Planned work
│   ├── database_advanced/
│   ├── platform_architecture/
│   └── user_data_enhancement/
└── ... (META_DOCUMENTATION.md, templates/, etc.)
```

**Key Pattern**: Features stay in `current/` even after completion for reference!

---

## File Templates & Examples

### Minimum Feature Documentation

Even the **simplest feature** must have:

1. **README.md** - Overview with quick navigation
2. **CURRENT_STATE.md** - Current status & next steps
3. **sessions/001_*/CHECKPOINT.md** - First checkpoint

### Complexity-Based Structure

| Complexity | Must Have | Plus If Complex | Plus If Very Complex |
|-----------|-----------|-----------------|----------------------|
| **SIMPLE** (fix, tweak) | README + CURRENT_STATE | sessions/ | |
| **MEDIUM** (feature) | ^ | + planning/ | + guides/ |
| **COMPLEX** (system) | ^ | + architecture/ | + research/, output/ |

---

## PLANNING.md Template

### Purpose
The planning document **captures user stories, requirements, and roadmap** before any code is written.

### Real Example: BI System MVP Plan

From `/documents/current/bi_system/planning/mvp_plan.md`:

```markdown
# RegAssist Business Intelligence System - MVP Plan

## Executive Summary
[2-3 sentence overview of what's being built]

## Target Users & User Stories

### 1. [User Type]
**Persona**: [Who they are]

#### User Stories:
- **As a [role]**, I want to [action] so I can [benefit]
- [More stories...]

### 2. [Another User Type]
[Same pattern...]

## Architecture Design

### Core Principles
1. **Modularity** - Each feature self-contained
2. **Extensibility** - Easy to add new components
3. [More principles...]

### System Architecture
[ASCII diagram or mermaid showing system relationships]

### Data Model / Schema Design
[Tables, relationships, key fields]

## MVP Implementation Plan

### Phase 1: Foundation (Week 1)
#### Day 1-2: Backend
- [ ] Create endpoints
- [ ] Set up data layer
- [ ] Implement business logic

#### Day 3-4: Frontend
- [ ] Initialize project
- [ ] Set up UI framework
- [ ] Implement API client

### Phase 2: [Next Phase]
[Breakdown of what's included]

## Technology Stack

### Frontend
- Framework + version
- UI Library
- Build tool
- [Other dependencies...]

### Backend
- Language + version
- Framework
- Database
- [Other services...]

## Success Metrics

### Technical Metrics
- Response time < X ms
- Load time < X seconds
- [Other metrics...]

### Business Metrics
- Adoption rate
- User satisfaction
- [Other metrics...]

## Risk Mitigation

### [Risk Type]
- **Risk**: [What could go wrong]
- **Mitigation**: [How to prevent]

## Next Steps

1. Validate user stories with team
2. Create wireframes
3. Set up development environment
4. Build proof-of-concept
5. Gather feedback
```

### Key Characteristics of Good Planning Docs

1. **User-centric** - Starts with target users and user stories
2. **Architectural** - Shows system design clearly
3. **Phased** - Breaks work into manageable chunks
4. **Risk-aware** - Identifies and mitigates risks
5. **Specific** - Has concrete success metrics
6. **Detailed but not prescriptive** - Explains the "what" and "why", not step-by-step "how"

---

## README.md Pattern

### Purpose
The README is the **entry point** for the feature. It should answer:
- What is this feature?
- Where is documentation?
- How do I get started?

### Real Example: BI System README

From `/documents/current/bi_system/README.md`:

```markdown
# BI System Documentation

## ⚠️ MANDATORY ARCHITECTURE REQUIREMENTS

**ALL work on the BI system MUST follow Recursive Architecture patterns.**

See:
- [ARCHITECTURE_REQUIREMENTS.md](ARCHITECTURE_REQUIREMENTS.md) - **READ THIS FIRST**
- [ARCHITECTURE_QUICK_REFERENCE.md](ARCHITECTURE_QUICK_REFERENCE.md) - Quick checklist

## Overview

[1-2 paragraphs describing the system]

## Core Documentation

### Planning & Strategy
- **[MVP Plan](planning/mvp_plan.md)** - User stories, requirements, and roadmap
- **[Recommendations](recommendations.md)** - Strategic analysis and prioritization
- **[Quick Reference](quick_reference.md)** - 5-minute overview

### Architecture & Implementation
- **[Modular Architecture](architecture/modular_architecture.md)** - Module design
- **[Implementation Guide](implementation_starter.md)** - Step-by-step examples
- **[Technical Specs](technical_implementation_guide.md)** - Detailed technical info

### Database & Migration
- **[Migration Plan](alembic_migration_plan.md)** - Database changes
- **[Database Architecture](database_architecture_analysis.md)** - Why this approach

### Implementation Tracking
- **[CURRENT STATE](CURRENT_STATE.md)** - ⚠️ START HERE! Always read first
- **[Checkpoint Template](CHECKPOINT_TEMPLATE.md)** - Session documentation template
- **[Sessions](sessions/)** - Historical checkpoints by date

## Key Decisions

✅ [Decision 1] - [Rationale]
✅ [Decision 2] - [Rationale]
✅ [Decision 3] - [Rationale]

## Implementation Steps

1. [First step]
2. [Second step]
3. [More steps...]

## Architecture Summary

```
folder_structure/
├── feature/
└── support_files/
```

[Brief description of why this structure]
```

### README Principles

1. **Navigation-first** - Links to all important docs
2. **Hierarchy-clear** - Most important docs first
3. **Architecture-explicit** - Mandatory patterns highlighted
4. **Current-state-first** - Always link to CURRENT_STATE.md
5. **Quick-reference** - Include 5-minute overview
6. **Decisions-documented** - Explain key architectural choices

---

## CURRENT_STATE.md Pattern

### Purpose
The CURRENT_STATE.md is **THE SOURCE OF TRUTH** for feature status. It's updated after every session and tells you:
- What's working NOW?
- What's not done yet?
- Where to start?
- How to verify the system?

### Real Example: BI System CURRENT_STATE

From `/documents/current/bi_system/CURRENT_STATE.md`:

```markdown
# BI System - Current State
<!-- UPDATE THIS FILE AT THE END OF EACH SESSION -->

**Last Updated:** October 3, 2024 (Checkpoint 09 - PR #53 Created)
**System Status:** 🟢 OPERATIONAL - BI Module Ready for Merge

## Quick Orientation

### Start Here - Health Check
```bash
cd /Users/owner/Projects/regassist_project/source_code/regassist

# 1. What environment?
cat .system

# 2. Are processes running?
ps aux | grep gunicorn | grep -v grep

# 3. Is BI module responding?
curl -s http://localhost:8000/api/bi/health

# 4. Which database?
echo $DATABASE_URL
```

### How to Start the System
```bash
cd /Users/owner/Projects/regassist_project/source_code/regassist
source ../pyenv/bin/activate
export DATA_PATH="../data"
./local-test.sh  # Standard startup
```

## Current Working State

### ✅ Working
- BI module at `/api/bi/*` endpoints
- PostgreSQL on port 5433
- Virtual environment with pandas 2.3.3
- Database schema `bi.analytics_events` tables
- Analytics dual-write to CSV + database
- Test suite passing (17 tests)
- Standard startup via `./local-test.sh`

### ⚠️ Known Issues
1. BI migration only in local environment
2. Historical analytics data (9,363 events) only in CSV

## System Configuration

### Files & Locations
```
source_code/regassist/
├── .system                    → "local"
├── local-test.sh              → Standard startup
├── bi_module/                 → BI implementation
├── models/bi_models.py        → Analytics database models
├── Analytics.py               → Dual-write to CSV + DB
├── tests/analytics.py         → Analytics test suite
└── pyenv/                     → Virtual env (has pandas)
```

### Database
- **Connection:** `postgresql://...`
- **Latest Migration:** `6998942cd8a6_add_bi_schema_and_initial_views.py`
- **Docker Containers:** 3 (postgres, adminer, redis)

## Work Completed (by checkpoint)
1. Initial planning and architecture
2. Docker environment setup
3. Alembic migration creation
4. BI module implementation
5. Pandas integration fix
[... more items ...]
13. Created PR #53 for BI module

## Work Remaining

### ⚠️ MANDATORY: All new work must follow [ARCHITECTURE_REQUIREMENTS.md](ARCHITECTURE_REQUIREMENTS.md)

- [ ] Migrate historical CSV data to database
- [ ] Replace mock data source with real queries
- [ ] Add PostgreSQL data sources
- [ ] Implement caching layer
- [ ] Implement core metrics
[... more items ...]

## Quick Fixes for Common Problems

### If app won't start
```bash
# 1. Check environment
cat .system  # Should be "local"

# 2. Activate virtual environment
source ../pyenv/bin/activate

# 3. Set DATA_PATH
export DATA_PATH="../data"

# 4. Kill old processes
pkill -f "gunicorn.*regassist"

# 5. Start fresh
./local-test.sh
```

### If import errors
```bash
source ../pyenv/bin/activate
pip list | grep pandas  # Should show 2.3.3
python -c "from models import AnalyticsEventModel; print('OK')"
```

## Testing Commands

```bash
# Run all analytics tests
source ../pyenv/bin/activate
export DATA_PATH="../data"
python tests/analytics.py

# Run database tests
python tests/database.py

# Full test suite
./tests/run-all.sh
```

---
*This is the source of truth. Check sessions/ for session details.*
*REMEMBER: Update this file when creating new checkpoints!*
```

### CURRENT_STATE.md Principles

1. **Updated after EVERY session** - Non-negotiable
2. **Actionable commands** - Includes copy-paste commands to verify state
3. **Problem-solution pairs** - "If X happens, do Y"
4. **Clear status indicator** - 🟢/🟡/🔴 system status
5. **Session reference** - Points to latest checkpoint
6. **Next steps hidden in "Work Remaining"** - Not prescriptive
7. **Always shows last updated date** - Tells you if it's stale
8. **Testing checklist** - How to verify everything works

---

## Session/Checkpoint Organization

### Naming Convention

Sessions are **numbered, not dated**:

```
sessions/
├── 001_planning/
├── 002_architecture_integration/
├── 003_implementation/
├── 004_testing_and_fixes/
├── 005_deployment_preparation/
└── 006_supabase_integration/
```

**Pattern**: `NNN_{brief_description}`

**Numbers increment forever** - Never reuse numbers. This creates a clear timeline.

### CHECKPOINT.md Template

From `/documents/current/bi_system/CHECKPOINT_TEMPLATE.md`:

```markdown
# Checkpoint XX: [Title]

**Date:** [Date]
**Session Duration:** [Approximate time]
**Starting State:** [What checkpoint/state you started from]

## 🚨 MANDATORY PRE-CHECKPOINT CHECKLIST
<!-- Complete BEFORE saving this checkpoint -->
- [ ] **Updated CURRENT_STATE.md** with latest status
  - [ ] Changed "Last Updated" date and checkpoint number
  - [ ] Updated "System Status" indicator
  - [ ] Added work completed to appropriate section
  - [ ] Updated "Work Remaining" with next priorities
  - [ ] Updated "Files & Locations" if structure changed
  - [ ] Updated "Quick Fixes" if new issues discovered
- [ ] **Saved this checkpoint** to `sessions/NNN_*/`
- [ ] **Committed changes** (if using git)

## Architecture Compliance
<!-- MANDATORY: Confirm recursive architecture was followed -->
- [ ] All new code is in proper modules with `__init__.py`
- [ ] No monolithic files were created or expanded
- [ ] Parent modules don't know child implementation details
- [ ] Each module can be tested in isolation
- [ ] Followed patterns in ARCHITECTURE_REQUIREMENTS.md

## What I Did
<!-- Concrete actions taken -->
- Action 1
- Action 2
- Action 3

## What I Verified Works
<!-- Actual tests run with results -->
```bash
# Command run
# Output received
```

## What I Changed
<!-- Files modified and why -->
| File | Change | Architecture Compliant? |
|------|--------|------------------------|
| path/file.ext | What was changed | ✅/❌ |

## What's Broken/Unclear
<!-- Issues discovered but not fixed -->
- Issue 1
- Issue 2

## End State
<!-- How to verify the system is in the state I'm leaving it -->
```bash
# Run these to confirm state:
[commands...]
```

## 🚨 BEFORE FINISHING: Did you update CURRENT_STATE.md?
<!-- Final reminder to update the source of truth -->
Go back and complete the "MANDATORY PRE-CHECKPOINT CHECKLIST" at top.

---
*Next session: Check CURRENT_STATE.md and ARCHITECTURE_REQUIREMENTS.md first.*
```

### Real Checkpoint Example

From `/documents/current/bi_system/sessions/01_checkpoint.md` (simplified):

```markdown
# BI System Implementation - Handoff Document

**Date**: September 30, 2024
**Status**: Planning Complete, Ready for Implementation

## 📋 Current State Summary

### ✅ Completed

1. **Database Configuration Extended**
   - Modified `source_code/regassist/database_management/core/db_config.py`
   - Added support for `'local'` environment
   - Allows isolated Docker testing

2. **Docker Development Environment Created**
   - `docker-compose.bi-dev.yml`
   - `Makefile.bi`
   - `init_bi_db.sql`
   - Provides local PostgreSQL with pgvector

3. **Complete Documentation Created**
   - Located in `/documents/bi_system/`
   - 10 comprehensive planning documents
   - Architecture, user stories, implementation guides

### ⚠️ NOT Yet Done (Next Steps)

1. **No Alembic Migration Created**
2. **No BI Module Code**
3. **No Testing Done**
4. **No Integration**

## 🎯 What We're Building

### Architecture Summary
- BI is a module INSIDE RegAssist
- Uses SAME database with optimized views
- Uses SAME Alembic migrations
- Lives in `source_code/regassist/bi_module/`

### Key Decisions
| Decision | Choice | Reason |
|----------|--------|--------|
| Database | Same production DB | Simple, 31K events is tiny |
| Schema | New `bi` schema | Organization |
| Migrations | Alembic | Consistent workflow |
| Architecture | Modular `bi_module/` | Self-contained |

## 📁 File Status

### Modified Files (Already Done)
```
✅ source_code/regassist/database_management/core/db_config.py
   - Added 'local' environment support
   - Lines 27-31: Returns DATABASE_URL directly when local
```

### Documentation Files (Already Done)
```
✅ documents/bi_system/ (all files)
```

## 🚀 Next Steps (Detailed Instructions)

### Step 1: Start Docker Environment
```bash
cd /Users/owner/Projects/regassist_project/source_code/regassist/database_management

# Initial setup
make -f Makefile.bi setup

# Start Docker services
make -f Makefile.bi up

# Verify it's running
make -f Makefile.bi status
```

### Step 2: Create Alembic Migration
```bash
cd /Users/owner/Projects/regassist_project/source_code/regassist
source ../pyenv/bin/activate

alembic revision -m "add_bi_schema_and_initial_views"
```

[... more steps ...]

## 🧪 Testing Checklist

### Before Starting
- [ ] Docker is installed
- [ ] Virtual environment works
- [ ] Can run `alembic current` successfully

### After Step 1 (Docker)
- [ ] `make -f Makefile.bi status` shows services running
- [ ] Can connect to PostgreSQL
- [ ] Adminer loads at http://localhost:8081

[... more items ...]

## 📊 Current Data State

### Existing Data Available
- 31,000+ analytics events in `interaction_log.csv`
- User data in `app_users` table
- Chat data in `chat_history` table
- Document data in `documents` table

### BI Will Add
- `bi.daily_metrics` - Aggregated daily statistics
- `bi.hourly_metrics` - Recent hour-by-hour data
- `bi.widget_configs` - User dashboard configurations

---

**Current Status**: ✅ Planning complete, 🔨 Ready to build
**Next Action**: Execute Step 1 (Start Docker) or Step 2 (Create Migration)
**Estimated Time to MVP**: 2-4 hours
```

### Checkpoint Principles

1. **Checklist-first** - Always includes "BEFORE FINISHING" checklist
2. **Architecture-focused** - Explicitly checks for architecture compliance
3. **Clear handoff** - Tells next person exactly what to do
4. **Actual verification** - Not hypothetical, shows tested state
5. **Problem + solution** - Documents what didn't work and how it was fixed
6. **References to docs** - Points to planning/architecture docs
7. **Time estimate** - Includes estimated time for next steps

---

## Key Principles & Paradigms

### Principle 1: Documentation BEFORE Code

**The Pattern**:
```
Documentation created → Structure clear → Code written → Tests pass
```

**Why**: It forces you to think through the design before implementing.

### Principle 2: CURRENT_STATE.md is Source of Truth

**Every session:**
1. Read CURRENT_STATE.md FIRST
2. Do work
3. Update CURRENT_STATE.md
4. Create checkpoint
5. Commit

**Never rely on conversation history** - Always check CURRENT_STATE.md for the latest status.

### Principle 3: Multi-Session Workflow

**Critical from .claude/CLAUDE.md:**

```markdown
BEFORE doing ANY work on a feature:

1. **Check if feature docs exist**: `ls current/[feature_name]/`
2. **If exists, READ CURRENT_STATE.md FIRST**
3. **Look for "🔴 NEXT SESSION START HERE" section**
4. **Check latest checkpoint**
5. **Verify environment**: `cat /Users/owner/.system`
6. **NEW: Research if implementing something new**

Why: Previous sessions may have done planning but NOT implementation. 
CURRENT_STATE.md is the source of truth.
```

### Principle 4: Architecture Over Arbitrary Rules

From the system:

> **ALL work must follow ARCHITECTURE_REQUIREMENTS.md**

Every feature has mandatory architecture patterns (e.g., recursive module architecture for BI system). This is non-negotiable.

### Principle 5: Research Before Implementing

**From .claude/CLAUDE.md:**

When implementing anything new:

1. **Internal Check (2-5 min)**
   - Search for similar existing solutions
   - Check if similar feature was built before
   - Look in `documents/current/`

2. **Industry Research (5-30 min depending on complexity)**
   - Check official docs for frameworks used
   - Look for common patterns in similar projects
   - Example: "GitHub Actions deployment best practices 2024"

3. **Document Briefly**
   - Add to checkpoint: "Researched X, found Y is standard, using Z because..."
   - Can be 1-2 sentences

**Complexity Guide**:
- **Simple**: 5-10 minutes (straightforward feature, existing patterns)
- **Complex**: 15-30 minutes (architectural decisions, new systems)

### Principle 6: Clear Status Indicators

**Three-tier status system**:
- 🟢 **OPERATIONAL** - Feature works, ready for use
- 🟡 **IN PROGRESS** - Work ongoing, some functionality working
- 🔴 **BLOCKED** - Cannot proceed without external work

Always shown in CURRENT_STATE.md first line.

### Principle 7: Incremental Work Units (Sessions)

**Sessions are natural breaking points**, not arbitrary time units:

- After 30 minutes → Create checkpoint
- When switching features → Create checkpoint
- When hitting blockers → Create checkpoint
- When making progress → Optional but recommended

Each session gets its own directory and checkpoint.

---

## Git Workflow Integration

### Commit Strategy

From the system (per .claude/CLAUDE.md):

**Documentation repo** (`documents/`):
- Direct commits allowed (local git only)
- Commit immediately after documentation created/updated
- Pattern: `docs(feature): session NNN checkpoint`

**Source code repos** (code changes):
- FEATURE BRANCHES REQUIRED (protected main)
- Never commit to master/main
- Pattern: `git checkout -b feature/my-feature`
- Then: Create PR

**Session-end commits**:
```bash
# For documentation updates
git add . && git commit -m "docs(feature): session 005 checkpoint"

# Automatic on session end (per project rules)
```

### Branch Naming

```bash
# Feature branch naming
git checkout -b feature/user-roles-implementation
git checkout -b feature/bi-dashboard-widgets
git checkout -b fix/migration-error

# Document updates (commit directly if local repo)
git commit -m "docs(ci-cd): session 042 checkpoint"
```

---

## Examples from Real Features

### Example 1: BI System (Complex Feature)

**Status**: Ongoing (47 sessions!)
**Structure**:
- ✅ README.md with full navigation
- ✅ CURRENT_STATE.md with system health checks
- ✅ planning/mvp_plan.md (user stories, architecture)
- ✅ planning/recommendations.md (strategy)
- ✅ architecture/ (4 architecture docs)
- ✅ guides/ (multiple guides)
- ✅ sessions/ (47 numbered checkpoints!)

**Key Pattern**: Started with planning, moved to implementation, now has extensive checkpoint history

### Example 2: User Roles (Medium Feature)

**Status**: Planning Complete, Ready for Implementation
**Structure**:
- ✅ README.md
- ✅ CURRENT_STATE.md
- ✅ architecture/SCHEMA_DESIGN.md
- ✅ architecture/SYSTEM_DIAGRAMS.md
- ✅ research/REQUIREMENTS_ANALYSIS.md
- ✅ sessions/001_planning/CHECKPOINT.md

**Key Pattern**: Shows transition from planning to implementation-ready state

### Example 3: CI/CD Pipeline (Complex Feature)

**Status**: Ongoing (47+ sessions)
**Structure**:
- ✅ README.md
- ✅ CURRENT_STATE.md
- ✅ planning/ (multiple planning docs)
- ✅ architecture/ (technical design)
- ✅ sessions/ (incrementally numbered)

**Key Pattern**: Long-running feature with many sessions; each checkpoint builds on previous

---

## Applying This to Your Project

### Step 1: Create Feature Directory

For a new assignment/feature:

```bash
mkdir -p apps/docs/public/{feature_name}/{planning,architecture,guides,sessions}
mkdir -p apps/docs/public/{feature_name}/sessions/001_planning
```

### Step 2: Create Minimum Documentation

Create three files:

1. **README.md** - Overview + navigation to other docs
2. **CURRENT_STATE.md** - Current status + next steps
3. **sessions/001_planning/CHECKPOINT.md** - First checkpoint with planning

### Step 3: Planning Document

Create `planning/planning.md` (or `mvp_plan.md`):

```markdown
# [Feature Name] - Planning

## Executive Summary
[What are you building?]

## Target Users & User Stories
[Who will use this? What do they need?]

## Architecture Design
[System overview, key components, data model]

## Implementation Plan
[Phased approach with concrete steps]

## Technology Stack
[What tech will you use?]

## Success Metrics
[How will you know it works?]

## Risk Mitigation
[What could go wrong? How do you prevent it?]

## Next Steps
[Concrete actions to proceed]
```

### Step 4: Update as You Work

After each session:

1. Update CURRENT_STATE.md
2. Create session checkpoint
3. Commit changes

---

## File Naming Conventions

### Fixed Filenames (Always These Names)

- `README.md` - Feature overview
- `CURRENT_STATE.md` - Feature status tracker
- `CHECKPOINT.md` - Session checkpoint
- `.claude/CLAUDE.md` - Project rules
- `META_DOCUMENTATION.md` - Navigation hub

### Variable Names (Your Choice)

- `planning/mvp_plan.md` - Planning document (mvp_plan, planning, roadmap, etc.)
- `architecture/modular_architecture.md` - Architecture docs (multiple per feature OK)
- `guides/*.md` - Guides (multiple per feature OK)
- `sessions/NNN_description/` - Session folders (numbered, description varies)

---

## Common Mistakes to Avoid

1. **Not reading CURRENT_STATE.md first**
   - Fix: Always check this first before starting work

2. **Not updating CURRENT_STATE.md after session**
   - Fix: Make this the FIRST thing you do when creating checkpoint

3. **Documentation mixed with code decisions**
   - Fix: Separate "what to build" (docs) from "how to build it" (code)

4. **Forgetting BEFORE FINISHING checklist in checkpoint**
   - Fix: Use the template provided

5. **Architecture decisions made during implementation**
   - Fix: Create ARCHITECTURE document first, code after

6. **Sessions without checkpoints**
   - Fix: Create checkpoint after every 30 minutes or major change

7. **Wrong git workflow**
   - Fix: Commits to feature branches, direct commits to docs repos only

---

## Key Files to Reference

In regassist_project:

```
.claude/CLAUDE.md                                  ← Project rules (START HERE)
documents/META_DOCUMENTATION.md                    ← Navigation hub
documents/DOCUMENTATION_AUTOMATION.md              ← When to create docs
documents/current/bi_system/README.md              ← Good README example
documents/current/bi_system/CURRENT_STATE.md      ← Good CURRENT_STATE example
documents/current/bi_system/planning/mvp_plan.md  ← Good PLANNING example
documents/current/bi_system/CHECKPOINT_TEMPLATE.md ← Good CHECKPOINT template
documents/current/user_roles/README.md             ← Medium feature example
documents/completed/*/                            ← Examples of completed features
```

---

## Summary

The regassist_project documentation system is characterized by:

1. **Hierarchy** - Clear documentation levels from project rules to session checkpoints
2. **Multi-session design** - Built for features that take many sessions to complete
3. **Source-of-truth files** - CURRENT_STATE.md and README.md are the primary references
4. **Session-based tracking** - Numbered sessions create clear timeline
5. **Architecture-first** - Design documented before code
6. **Problem + solution** - Checkpoints document what didn't work and how it was fixed
7. **Actionable commands** - Includes copy-paste commands to verify state
8. **Research-required** - New features require research before implementation
9. **Automatic checkpoints** - 30+ minute sessions get documented automatically
10. **Multi-repo workflow** - Documentation and code in separate git repos with different commit rules

---

**This guide is comprehensive. Use it as your reference when setting up documentation for new assignments in your course management system.**

