# Documentation Automation Rules

## Purpose
Specific, actionable rules for Claude to automatically create and maintain documentation without manual prompting.

## Feature Size Detection Algorithm

```python
def detect_feature_size(description):
    """
    Automatically determine feature complexity from user's description.
    """
    # Keywords that indicate complexity
    COMPLEX_KEYWORDS = [
        "orchestration", "system", "architecture", "multiple",
        "framework", "platform", "integration", "workflow"
    ]

    MEDIUM_KEYWORDS = [
        "feature", "module", "component", "service",
        "refactor", "enhance", "improve"
    ]

    SIMPLE_KEYWORDS = [
        "fix", "update", "tweak", "adjust", "small",
        "quick", "minor", "simple"
    ]

    # Check description for indicators
    description_lower = description.lower()

    if any(word in description_lower for word in COMPLEX_KEYWORDS):
        return "COMPLEX"
    elif any(word in description_lower for word in MEDIUM_KEYWORDS):
        return "MEDIUM"
    elif any(word in description_lower for word in SIMPLE_KEYWORDS):
        return "SIMPLE"

    # Default based on estimated scope
    if "multiple files" in description_lower or "several" in description_lower:
        return "COMPLEX"
    elif "single" in description_lower or "one" in description_lower:
        return "SIMPLE"

    return "MEDIUM"  # Default
```

## Automatic Trigger Conditions

### Trigger 1: New Feature Detection
**WHEN**: User **explicitly requests** documentation with **exact phrases**:
- "create documentation for [feature]"
- "document [feature]"
- "set up docs for [feature]"
- "start documentation for [feature]"

**ACTION**:
```bash
1. Extract feature name from context
2. Check if exists: ls apps/docs/public/current/{feature_name}/
3. If NOT exists:
   - Determine size: SIMPLE/MEDIUM/COMPLEX
   - Create appropriate structure
   - Generate initial documentation
   - Create session 001
   - Commit to git (follow .claude/CLAUDE.md rules)
4. If exists:
   - Read CURRENT_STATE.md
   - Continue from checkpoint
```

**CRITICAL**: Do NOT create documentation for:
- General discussion ("I'm thinking about...")
- Exploration ("How does X work?")
- Small changes ("fix the bug in...")
- Questions ("Can we add...?")
- ONLY create when user explicitly says "create documentation" or "document"

### Trigger 2: Planning Request
**WHEN**: User uses **exact phrase** requesting written plan:
- "create a plan" or "write a plan"
- "create an architecture document"
- "write up the design"

**ACTION**:
```bash
1. Create planning/ directory if not exists
2. Create IMPLEMENTATION_PLAN.md with user discussion
3. If COMPLEX: Create architecture proposal (only if user says "create architecture proposal")
4. Update CURRENT_STATE.md if it exists
5. Commit documentation (follow .claude/CLAUDE.md rules)
```

**CRITICAL**: Do NOT create planning documents for:
- Verbal discussion of approach
- Brainstorming ("let's think about...")
- Asking questions about implementation
- ONLY create when user explicitly says "create a plan" or "write a plan"

### Trigger 3: Implementation Start
**WHEN**: User **explicitly requests** implementation documentation with **exact phrases**:
- "create implementation guide"
- "write implementation doc"
- "document the implementation"

**ACTION**:
```bash
1. Create guides/IMPLEMENTATION.md (only if explicitly requested)
2. Update CURRENT_STATE.md to "Implementation" phase
3. Start TodoWrite for task tracking
4. Commit at logical checkpoints
```

**CRITICAL**: Do NOT create implementation guides for:
- Starting to code ("implement this", "code it", "build it")
- Approved architecture (approval ≠ need for implementation doc)
- General coding work
- ONLY create implementation guide when user explicitly says "create implementation guide" or "document the implementation"

### Trigger 4: Session Time Limit
**WHEN**: Session duration > 30 minutes

**ACTION**:
```bash
1. Create checkpoint automatically
2. Save current state
3. Update CURRENT_STATE.md
4. Note stopping point
```

### Trigger 5: Context Switch
**WHEN**: User switches to different feature/topic

**ACTION**:
```bash
1. Create checkpoint for current work
2. Update CURRENT_STATE.md
3. Commit changes (follow .claude/CLAUDE.md rules)
4. Clear TodoWrite
5. Load new context
```

### Trigger 6: Error/Blocker
**WHEN**: Encounter any of:
- Unresolved error
- Missing dependency
- Unclear requirement
- Test failure

**ACTION**:
```bash
1. Document issue in checkpoint
2. Create BLOCKERS.md if recurring
3. Update CURRENT_STATE.md with ❌
4. Note resolution attempts
5. Commit current state
```

### Trigger 7: Success/Milestone
**WHEN**: Achieve any of:
- Tests pass
- Feature complete
- Milestone reached
- Problem solved

**ACTION**:
```bash
1. Update CURRENT_STATE.md with ✅
2. Create celebratory checkpoint
3. Update progress metrics
4. Commit working state
5. Update ACTIVE_FEATURES.md
```

## Documentation Structure by Size

### SIMPLE Feature Structure
```
{feature_name}/
├── README.md                    # Brief overview
├── CURRENT_STATE.md            # Status
└── sessions/
    └── 001_implementation/
        └── CHECKPOINT.md       # Single session likely
```

### MEDIUM Feature Structure
```
{feature_name}/
├── README.md                    # Overview
├── CURRENT_STATE.md            # Living status
├── planning/
│   └── IMPLEMENTATION_PLAN.md  # How to build
├── guides/
│   └── QUICK_START.md          # Usage guide
└── sessions/
    └── 001_initialization/
        └── CHECKPOINT.md       # Multi-session expected
```

### COMPLEX Feature Structure
```
{feature_name}/
├── README.md                    # Comprehensive overview
├── CURRENT_STATE.md            # Detailed status
├── planning/
│   ├── requirements.md          # Full requirements
│   └── IMPLEMENTATION_PLAN.md   # Phased plan
├── architecture/
│   ├── TECHNICAL_ARCHITECTURE.md # System design
│   ├── DATA_FLOW.md            # How data moves
│   └── PATTERNS.md             # Design patterns
├── guides/
│   ├── QUICK_START.md          # 5-minute guide
│   ├── DEVELOPER_GUIDE.md      # Full guide
│   └── API.md                  # If applicable
├── output/
│   └── ARCHITECTURE_PROPOSAL.md # For approval
└── sessions/
    ├── 001_planning/
    ├── 002_architecture/
    └── 003_implementation/      # Many sessions expected
```

## Automatic File Generation Rules

### README.md Template
```markdown
# {Feature Name}

## Problem
{Auto-extract from user's description}

## Solution
{Auto-extract from planning}

## Status
{Auto-determine: Planning/Implementation/Testing/Complete}

## Quick Links
- [Current State](CURRENT_STATE.md)
- [Implementation Plan](planning/IMPLEMENTATION_PLAN.md) {if exists}
- [Architecture](architecture/) {if exists}
- [Latest Session](sessions/{latest}/)
```

### CURRENT_STATE.md Template
```markdown
# Current State - {Feature}
*Last Updated: {ISO_DATETIME}*

**System Status**: {🔴 Not Started | 🟡 In Progress | 🟢 Complete}

## What's Working
- {Auto-list completed/working items - ONE LINE each}

## Known Issues
- {Auto-list problems/blockers - ONE LINE each}

## Work Remaining
{Unordered checklist grouped by category if helpful}
{Can be ordered by priority/logic but NOT numbered phases}
{Next session determines what to tackle}

- [ ] {Task description - ONE LINE}
- [ ] {Another task - ONE LINE}

## Quick Reference
- Latest session: sessions/{latest}/CHECKPOINT.md
- {Key links}

IMPORTANT: No prescriptive "Next Actions" or numbered phases.
Just state what IS, next session determines what to do.
```

## Git Automation Rules

### Commit Timing
```python
def should_commit():
    """Determine if commit needed."""
    return any([
        session_ending,
        major_milestone_reached,
        documentation_created,
        successful_test,
        30_minutes_passed,
        context_switching,
        user_requested
    ])
```

### Commit Messages
Follow `.claude/CLAUDE.md` git workflow and branch protection rules.

For documentation commits:
```python
def generate_commit_message(changes):
    """Auto-generate descriptive commit message."""

    if "docs" in changes:
        if "checkpoint" in changes:
            return f"docs({feature}): session {session_num} checkpoint"
        elif "architecture" in changes:
            return f"docs({feature}): add architecture design"
        else:
            return f"docs({feature}): update documentation"

    elif "feat" in changes:
        return f"feat({feature}): {auto_summarize_changes()}"

    elif "fix" in changes:
        return f"fix({feature}): {describe_fix()}"

    elif "test" in changes:
        return f"test({feature}): {describe_tests()}"

    return f"chore({feature}): {general_description()}"
```

## Quality Checks

### Before Creating Documentation
- [ ] Feature doesn't already exist
- [ ] User intent is clear
- [ ] Complexity determined
- [ ] Structure appropriate for size

### Before Session End
- [ ] Checkpoint created
- [ ] CURRENT_STATE.md updated
- [ ] TodoWrite cleared/transferred
- [ ] Changes committed (follow .claude/CLAUDE.md)
- [ ] Next steps documented

### Documentation Quality
- [ ] Self-contained context
- [ ] Clear done vs not done
- [ ] Specific next actions
- [ ] No vague statements
- [ ] Session numbered

## Automation Metrics

Track these automatically:
- Sessions per feature
- Documentation completeness %
- Checkpoint frequency
- Commit frequency
- Time to first documentation
- Features without documentation

## Anti-Patterns to Avoid

❌ **DON'T**:
- Wait for user to ask for documentation
- Create code before documentation
- Skip checkpoints
- Use generic commit messages
- Assume context between sessions
- Leave CURRENT_STATE.md stale
- Create documentation for general discussion
- Number phases prescriptively
- Make items verbose (many items OK, verbose NOT OK)

✅ **DO**:
- Create documentation proactively (when explicitly requested)
- Document first, code second
- Checkpoint at natural boundaries
- Generate descriptive commits
- Include full context
- Keep CURRENT_STATE.md live
- State what IS, not what to do
- Use unordered work stacks
- Keep bullets ONE LINE each

## Integration with Other Systems

### TodoWrite Integration
- Start automatically for new features
- Transfer tasks to checkpoint
- Clear on session end
- Track in CURRENT_STATE.md

### Testing Integration
- Document test results
- Update status on pass/fail
- Create checkpoint after tests
- Commit on success

### Git Workflow Integration
- Follow `.claude/CLAUDE.md` branch protection rules
- Always create feature branches
- Never commit directly to main
- Use PR workflow for all changes
- Run lint and build before declaring complete

---

*This document defines the automation rules. Claude should implement these without being asked.*
