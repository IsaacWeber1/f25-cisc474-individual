# 📚 Documentation Master Guide - LMS Project

**START HERE** → This is your single entry point for all documentation rules.

## 🗺️ Documentation Navigation

| What You Need | Where to Find It |
|---------------|-----------------|
| **Project rules & setup** | `.claude/CLAUDE.md` (project root) |
| **When to create docs** | `META_DOCUMENTATION.md` → Triggers & templates |
| **Session handling** | `SESSION_AUTOMATION.md` → State management |
| **Active features** | `apps/docs/public/current/*/CURRENT_STATE.md` → Check all |
| **Master feature tracking** | `apps/docs/public/ACTIVE_FEATURES.md` |

## 🚀 Quick Start - New Feature

1. **CHECK FIRST**: `ls apps/docs/public/current/{feature_name}/`
2. **IF EXISTS**: Read `CURRENT_STATE.md` → Find "🔴 NEXT SESSION START HERE"
3. **IF NEW**: Auto-create structure based on complexity:

| Complexity | Indicators | Structure |
|------------|-----------|-----------|
| **SIMPLE** | "fix", "tweak", single file | README + sessions/ |
| **MEDIUM** | "feature", "refactor", <5 files | + planning/ + guides/ |
| **COMPLEX** | "system", "orchestration", >5 files | + architecture/ + output/ |

## 📁 Standard Structure

```bash
apps/docs/public/current/{feature_name}/
├── README.md                    # Overview (ALWAYS)
├── CURRENT_STATE.md             # Status with "🔴 NEXT SESSION" marker
├── sessions/NNN_phase/          # Numbered checkpoints
├── planning/                    # If MEDIUM+
├── architecture/                # If COMPLEX
└── output/                      # If needs approval
```

## 🔄 Lifecycle Triggers

**See `DOCUMENTATION_AUTOMATION.md`** for detailed triggers.

Quick reference:
- "create documentation for X" → Create docs
- "create a plan" → Planning phase
- "implement/code" → Implementation phase
- "test/verify" → Testing phase
- Session >30min → Auto-checkpoint

## 📏 Critical Rules

1. **Documentation BEFORE code** - Always create structure first
2. **Research BEFORE implementation** - For new features/workflows, research similar solutions first (5-30 min)
3. **CURRENT_STATE.md is truth** - Keep it updated every session
4. **Session numbers increment** - Never reuse numbers
5. **Commits follow project rules** - See `.claude/CLAUDE.md` for git workflow
6. **State what IS, not what to do** - Use "Work Remaining" stack, not prescriptive "Next Actions"
7. **No micromanagement** - Avoid numbered phases, next session determines priority

**See `.claude/CLAUDE.md`** for detailed research guidelines and git workflow

## ⚠️ Quick Fixes

| Issue | Fix |
|-------|-----|
| No docs exist | Stop → Create structure → Then code |
| Lost context | Check CURRENT_STATE.md → Find red marker |
| Session number? | `ls sessions/` → Increment highest |
| Where to commit? | See `.claude/CLAUDE.md` → Git rules |

## 📖 Document Hierarchy

```
.claude/CLAUDE.md                                    → Project rules (START HERE)
apps/docs/public/META_DOCUMENTATION.md               → This file (navigation hub)
apps/docs/public/DOCUMENTATION_AUTOMATION.md         → When/how to create docs
apps/docs/public/FEATURE_LIFECYCLE.md                → Feature stage management
apps/docs/public/SESSION_AUTOMATION.md               → Session state handling
apps/docs/public/WORKFLOW_GUIDE.md                   → Daily development workflow
apps/docs/public/ACTIVE_FEATURES.md                  → Master feature tracking
apps/docs/public/current/*/CURRENT_STATE.md          → Active feature status
/Users/owner/.claude/history.jsonl                   → Raw conversation logs
```

## 🔍 When to Analyze Conversation Logs vs Checkpoints

**Checkpoints show WHAT was done. Conversation logs show HOW it felt to do it.**

### Use Conversation Logs When:
- ✅ **Researching pain points** - User uncertainty, trial-and-error, frustration
- ✅ **Debugging workflow analysis** - Actual commands run, time spent, iterations
- ✅ **Quantifying friction** - Count errors, manual interventions
- ✅ **Understanding emotional context** - "Site is still down", "Context low"
- ✅ **Validating documentation gaps** - What questions were asked repeatedly?

### Use Checkpoints When:
- ✅ **Understanding outcomes** - What was built, what was decided
- ✅ **Following implementation path** - What steps were taken
- ✅ **Getting technical details** - Architecture decisions, code patterns
- ✅ **Quick context** - High-level understanding of past work

### How to Access Conversation Logs

```bash
# Location of raw conversation history
/Users/owner/.claude/history.jsonl

# Example analysis commands
grep -i "error\|failed" history.jsonl | wc -l          # Count issues
grep -B 2 -A 5 "pattern" history.jsonl                 # Extract context
```

### When to Proactively Suggest Conversation Analysis

**Suggest analyzing conversation logs when user asks about:**
- "How long did X take?" → Analyze timestamps
- "Why did we have so many issues with Y?" → Count error patterns
- "What was the debugging experience like?" → Extract trial-and-error iterations
- "Can we improve Z workflow?" → Analyze friction points
- "Past conversation research" → **DEFAULT TO LOGS, NOT CHECKPOINTS**

**Pattern:** If investigating *process* (how we work), use logs. If investigating *product* (what we built), use checkpoints.

## 📝 Exemplar References

| Need Example Of | Look At |
|----------------|---------|
| **Session Checkpoint** | `current/auth0_authentication/sessions/010_*/CHECKPOINT.md` |
| **CURRENT_STATE.md** | `current/auth0_authentication/CURRENT_STATE.md` |
| **Master Tracking** | `ACTIVE_FEATURES.md` |
| **Complex Feature** | `current/auth0_authentication/` structure |

## 🎯 LMS Project Specific

### Class Requirements
- **Course**: CISC474 Advanced Web Technologies, Fall 2025
- **Project**: Learning Management System with unique reflection feature
- **Tech Stack**: TanStack Start, NestJS, Prisma, PostgreSQL, Auth0

### Feature Categories
1. **Infrastructure** (completed/) - Database, deployment, CI/CD
2. **Authentication** (current/) - Auth0 integration with JWT
3. **Core Features** (current/) - Submissions, Grades, Comments, Courses
4. **Unique Feature** (current/) - Reflections with skill tagging
5. **Testing** (current/) - Unit, integration, E2E tests

### Documentation Locations
- **Meta-docs**: `apps/docs/public/META_*.md`
- **Features**: `apps/docs/public/current/{feature}/`
- **Completed**: `apps/docs/public/completed/{feature}/`
- **Planning**: `apps/docs/public/future/{feature}/`
- **Templates**: `apps/docs/public/templates/`

---

*Each document has ONE purpose. No duplication. Check the right doc for the right info.*
