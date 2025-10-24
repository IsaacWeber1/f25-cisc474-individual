# New Feature Initialization

Quick guide for creating a new feature directory with minimal necessary documentation.

## Step 1: Create Structure

```bash
FEATURE="feature_name"
mkdir -p documents/current/$FEATURE/{planning,architecture,sessions/001_initialization,guides}
```

## Step 2: Core Files

### README.md
```markdown
# {Feature Name}

**Status**: Planning → Implementation
**Priority**: [High|Medium|Low]
**Timeline**: [estimate]

## Problem
[1-2 sentence problem statement]

## Solution
[1-2 sentence proposed solution]

## Quick Links
- [Current State](CURRENT_STATE.md)
- [Implementation Plan](planning/IMPLEMENTATION_PLAN.md)
- [Architecture](architecture/)
```

### CURRENT_STATE.md
```markdown
# Current State - {Feature}

*Last Updated: {DATE}*

## 🔴 NEXT SESSION START HERE

**Phase**: [Planning|Implementation|Testing]
**Status**: [One sentence status]

**What's Done**:
- ✅ [Item]

**What's NOT Done**:
- ❌ [Item]

**Next Actions**:
1. [Action]

---

## 📊 Progress
- Overall: [🔴|🟡|🟢] [Status]

---

## 📝 Session Notes

### Session 001: Initialization ({DATE})
- Created feature structure
- Defined architecture
- Planning complete
```

### planning/IMPLEMENTATION_PLAN.md
```markdown
# Implementation Plan - {Feature}

## Overview
[Brief description]

## Phases
1. **Phase 1**: [Name] (Days X-Y)
   - [ ] Task

2. **Phase 2**: [Name] (Days X-Y)
   - [ ] Task

## Success Criteria
- [ ] [Criteria]
```

### sessions/001_initialization/CHECKPOINT.md
```markdown
# Session 001: Feature Initialization

*Date: {DATE}*

## Created
- Feature directory structure
- Core documentation files
- Architecture design
- Implementation plan

## Status
Planning complete → Ready for implementation

## Handoff
Read CURRENT_STATE.md → "🔴 NEXT SESSION START HERE"
```

## Step 3: Architecture (Optional)

Only create if architectural decisions need documentation:

```bash
# architecture/DESIGN.md - only if needed
# architecture/DATA_FLOW.md - only if needed
```

## Step 4: Update Tracking

Add to `documents/current/ACTIVE_FEATURES.md`:

```markdown
### N. {Feature Name} 🟡 PLANNING
- **Priority**: [High|Medium|Low]
- **Docs Branch**: `documents/current/{feature}`
- **Status**: Architecture Complete → Implementation Ready
- **Timeline**: [estimate]
- **Dependencies**: [features or none]

**Quick Links**:
- [README]({feature}/README.md)
- [Current State]({feature}/CURRENT_STATE.md)
```

## Principles

**Minimal**: Only what's needed to start work
**Complete**: Enough context for next session
**Generic**: Trust Claude to fill in specifics
**Actionable**: Clear "what's next"

## Anti-Patterns

❌ Over-detailed instructions (trust next session)
❌ Duplicate information across files
❌ Premature optimization of docs
❌ Verbose explanations of obvious things

## Pattern

```
Session 001 (This session):
- Create structure
- Define architecture
- Write plan
- Mark: Planning Complete

Session 002+ (Future sessions):
- Read CURRENT_STATE.md
- Follow IMPLEMENTATION_PLAN.md
- Execute phase
- Update CURRENT_STATE.md
```

---

*This template itself is minimal - adapt as needed*
