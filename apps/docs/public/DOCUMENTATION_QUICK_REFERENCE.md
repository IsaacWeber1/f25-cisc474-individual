# Documentation System - Quick Reference Card

Based on regassist_project patterns. Use this as your quick checklist.

---

## One-Minute Checklist

When starting work on a feature:

1. **Does documentation exist?**
   ```bash
   ls apps/docs/public/{feature_name}/
   ```

2. **If YES**: Read `CURRENT_STATE.md` first
3. **If NO**: Create minimum structure (3 files below)
4. **After work**: Update CURRENT_STATE.md + create checkpoint + commit

---

## Minimum Documentation (Required Even for "Simple" Features)

```
apps/docs/public/{feature_name}/
├── README.md                    # Overview + links to other docs
├── CURRENT_STATE.md            # Status + next steps + health checks
└── sessions/001_planning/
    └── CHECKPOINT.md           # First checkpoint documenting planning
```

---

## README.md Template (Copy & Adapt)

```markdown
# [Feature Name] Documentation

## Overview
[1-2 sentences: What does this feature do?]

## Key Documents

### Must Read First
1. **[CURRENT_STATE.md](CURRENT_STATE.md)** - Current status and next steps

### Planning
- [Planning](planning/planning.md) - Requirements, user stories, roadmap

### Architecture
- [Architecture](architecture/architecture.md) - System design, decisions

### Sessions
- [Sessions](sessions/) - Historical work checkpoints

## Quick Start
[How to get the system running]

## Status
[🟢 OPERATIONAL / 🟡 IN PROGRESS / 🔴 BLOCKED]

## Current Task
[What's being worked on now - from CURRENT_STATE.md]
```

---

## CURRENT_STATE.md Template (Copy & Adapt)

```markdown
# [Feature Name] - Current State

**Last Updated:** [Date] (Checkpoint XX)
**System Status:** 🟢/🟡/🔴 [Status]

## Quick Start
```bash
# Commands to verify everything works
[copy/paste commands here]
```

## What's Working ✅
- Item 1
- Item 2
- Item 3

## What's Not Done Yet ⚠️
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

## Quick Fixes (Common Problems)

### If X happens, do Y
```bash
# Copy/paste fix commands
```

## Latest Checkpoint
[Link to latest session checkpoint]

## Work Completed (by session)
1. Session 001 - Planning complete
2. Session 002 - Architecture designed
3. [More...]

---
*Always update this file after each session. It's the source of truth.*
```

---

## CHECKPOINT.md Template (Session Work Log)

```markdown
# Checkpoint NN: [Brief Title]

**Date:** [YYYY-MM-DD]
**Duration:** ~X hours
**Starting Point:** [Previous checkpoint or state]

## What I Did
- Task 1
- Task 2
- Task 3

## What Works Now
```bash
# Verification commands proving it works
command
# output shows success
```

## What Changed
| File | Change | Why |
|------|--------|-----|
| app/feature.ts | Added X | To handle Y |

## Problems & Solutions
- **Problem**: X didn't work
  - **Root cause**: Y
  - **Solution**: Z

## Next Session Should
- [ ] Do this next
- [ ] Then this
- [ ] Finally this

## BEFORE FINISHING
- [ ] Updated CURRENT_STATE.md
- [ ] Tested everything works
- [ ] Committed changes

---
*Next session: Check CURRENT_STATE.md first!*
```

---

## Directory Structure by Complexity

### SIMPLE Feature (fix, tweak)
```
feature_name/
├── README.md
├── CURRENT_STATE.md
└── sessions/001_fix/CHECKPOINT.md
```

### MEDIUM Feature (feature, enhancement)
```
feature_name/
├── README.md
├── CURRENT_STATE.md
├── planning/
│   └── planning.md
├── guides/
│   └── quick_reference.md
└── sessions/
    ├── 001_planning/CHECKPOINT.md
    ├── 002_architecture/CHECKPOINT.md
    └── 003_implementation/CHECKPOINT.md
```

### COMPLEX Feature (system, multiple components)
```
feature_name/
├── README.md
├── CURRENT_STATE.md
├── planning/
│   ├── mvp_plan.md
│   └── recommendations.md
├── architecture/
│   ├── design.md
│   └── ARCHITECTURE_REQUIREMENTS.md
├── research/
│   └── requirements.md
├── guides/
│   ├── implementation.md
│   └── quick_reference.md
└── sessions/
    ├── 001_planning/CHECKPOINT.md
    ├── 002_architecture/CHECKPOINT.md
    ├── 003_implementation/CHECKPOINT.md
    └── ... (many more)
```

---

## Key Principles (Don't Forget)

1. **CURRENT_STATE.md is the source of truth**
   - Read it FIRST before any work
   - Update it LAST after work completes
   - It should reflect reality, not hopes

2. **Sessions are incremental work units**
   - Not arbitrary time units
   - Create checkpoint after 30 min OR major change
   - Number them sequentially (001, 002, 003...)

3. **Documentation before code**
   - Create README + CURRENT_STATE first
   - Write planning doc
   - THEN write code

4. **Research before implementing**
   - For new features: 5-10 min research
   - For complex systems: 15-30 min research
   - Document your findings briefly

5. **Architecture is mandatory**
   - Complex features MUST have architecture doc
   - Follow your project's architecture patterns
   - Don't make design decisions during coding

---

## Session Numbering

**ALWAYS increment forever, never reuse numbers:**

```
sessions/
├── 001_planning/              ← First session
├── 002_architecture/          ← Second session
├── 003_first_feature/         ← Third session
├── 004_bug_fix/              ← Fourth session
└── 005_deployment/           ← Fifth session
```

Next session should be `006_whatever`, not `001_next_phase`.

---

## File Naming Rules

### Fixed Names (Always These)
- `README.md` - Overview
- `CURRENT_STATE.md` - Status tracker
- `CHECKPOINT.md` - Session checkpoint
- `.claude/CLAUDE.md` - Project rules

### Variable Names (Your Choice)
- `planning/mvp_plan.md` or `planning/planning.md` or `planning/roadmap.md`
- `architecture/design.md` or `architecture/system.md` or `architecture/architecture.md`
- `guides/getting_started.md` or `guides/implementation.md`
- `sessions/NNN_whatever_description/`

---

## Status Indicators

Use consistent indicators in CURRENT_STATE.md:

- 🟢 **OPERATIONAL** - Feature working, ready for production
- 🟡 **IN PROGRESS** - Work ongoing, some features working
- 🔴 **BLOCKED** - Cannot proceed, external dependencies needed

Example:
```
**System Status:** 🟢 OPERATIONAL - Auth system ready for integration
**System Status:** 🟡 IN PROGRESS - Dashboard 80% complete, testing phase
**System Status:** 🔴 BLOCKED - Waiting for API docs from backend team
```

---

## Common Mistakes (Avoid These)

| Mistake | Impact | Fix |
|---------|--------|-----|
| Don't read CURRENT_STATE.md first | Wasted effort, duplicate work | Always read it first |
| Don't update CURRENT_STATE.md | Next person has no context | Update after every session |
| Don't create checkpoints | Work lost if context switches | Create at 30 min mark |
| Skip architecture planning | Messy code, design later | Plan before coding |
| Use relative paths | Breaks in different directories | Use absolute paths |
| Reuse session numbers | Confusing timeline | Always increment |
| Don't research | Reinvent wheels | Research 5-30 min first |

---

## Example Session Workflow

```
Monday 9am:
  1. ls apps/docs/public/assignments/
  2. Read apps/docs/public/assignments/CURRENT_STATE.md
  3. Check latest checkpoint
  4. Do work for 45 minutes
  5. Test everything works
  
Monday 10am:
  6. Update CURRENT_STATE.md
  7. Create sessions/003_inline_edit/CHECKPOINT.md
  8. git add -A && git commit
  
Tuesday 2pm:
  1. (Start over - read CURRENT_STATE.md first)
  2. Continue from where Monday left off
```

---

## Git Commands for Documentation

```bash
# After documentation work
git add apps/docs/public/feature_name/
git commit -m "docs(feature_name): session 005 checkpoint"

# When feature is complete
git commit -m "docs(feature_name): implementation complete"

# When moving to new feature
git commit -m "docs(other_feature): session 001 planning"
```

---

## Templates Location

All templates available in `/Users/owner/Projects/regassist_project/`:

```
.claude/CLAUDE.md                              ← Project rules
documents/META_DOCUMENTATION.md                ← Navigation guide
documents/DOCUMENTATION_AUTOMATION.md          ← When to create docs
documents/current/bi_system/README.md          ← Good README
documents/current/bi_system/CURRENT_STATE.md  ← Good CURRENT_STATE
documents/current/bi_system/CHECKPOINT_TEMPLATE.md ← Checkpoint template
```

---

## Quick Help

**Question: "I don't know where to start"**
- Answer: Check if `apps/docs/public/{feature}/` exists
- If yes → Read CURRENT_STATE.md
- If no → Create README.md + CURRENT_STATE.md + sessions/001_planning/

**Question: "What should I document in a checkpoint?"**
- Answer: Use the template - "What I Did", "What Works", "What Changed"

**Question: "How long should CURRENT_STATE.md be?"**
- Answer: 100-500 lines is normal. Use it liberally with copy/paste commands.

**Question: "Do I need a PLANNING.md?"**
- Answer: For MEDIUM+ features, yes. SIMPLE features skip it.

**Question: "Can I reuse session numbers?"**
- Answer: No. Always increment. Session 005 always comes after 004.

---

**Total Setup Time**: 5 minutes per new feature (just copy templates and fill in blanks)

**Total Maintenance**: 5 minutes per session (update CURRENT_STATE.md + commit)

**Total Benefit**: Never lose context, team knows exactly where you are, easy to hand off

