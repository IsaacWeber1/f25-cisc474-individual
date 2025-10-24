# Templates

Reusable templates for documentation consistency across the project.

## 📂 Available Templates

### NEW_FEATURE_INIT.md ⭐️
Quick guide for initializing a new feature with minimal documentation:
- Directory structure commands
- Core file templates (minimal)
- Session 001 checkpoint pattern
- Anti-patterns to avoid
[View Template](NEW_FEATURE_INIT.md)

### CURRENT_STATE_TEMPLATE.md
Minimal template for CURRENT_STATE.md files:
- Next session handoff section
- Progress tracking
- Session notes
[View Template](CURRENT_STATE_TEMPLATE.md)

### SESSION_CHECKPOINT.md
Template for development session checkpoints:
- What was done
- Status handoff
- Key decisions
[View Template](SESSION_CHECKPOINT.md)

## 🎯 Using Templates

### Initialize New Feature
```bash
# Follow the guide (recommended)
# See: NEW_FEATURE_INIT.md for step-by-step

# Quick version:
FEATURE="feature_name"
mkdir -p documents/current/$FEATURE/{planning,architecture,sessions/001_initialization,guides}
# Then copy minimal templates from NEW_FEATURE_INIT.md
```

### Session Checkpoints
```bash
# Session 001 is always initialization (see NEW_FEATURE_INIT.md)
# Session 002+ as needed:
mkdir current/feature/sessions/00X_description
cp templates/SESSION_CHECKPOINT.md current/feature/sessions/00X_description/CHECKPOINT.md
```

## 📊 Template Standards

### Minimal Principle
- Only what's needed to start/continue work
- Trust next Claude session to fill specifics
- High-level guidance, not verbose instructions
- Generic, not feature-specific

### Required Elements
- Clear "what's next" (actionable)
- Handoff for next session
- Status/progress indicator
- Date tracking

## 🔧 New Feature Pattern

### Always Session 001: Initialization
Every feature starts the same way:
1. Create structure (dirs, files)
2. Write minimal core docs
3. Define architecture (if needed)
4. Write implementation plan
5. Create Session 001 checkpoint

**Result**: Planning Complete → Implementation Ready

### Session 002+: Implementation
Subsequent sessions:
1. Read CURRENT_STATE.md handoff
2. Execute phase from plan
3. Update CURRENT_STATE.md
4. Create checkpoint if major milestone

**Pattern**: Each session builds on previous, documented via checkpoints

## 🚀 Quick Reference

### Session 001 Always
```bash
# Create feature structure
FEATURE="name"
mkdir -p documents/current/$FEATURE/{planning,architecture,sessions/001_initialization,guides}

# Copy templates from NEW_FEATURE_INIT.md
# Write minimal docs
# Create checkpoint

# Result: Planning Complete → Ready for Implementation
```

### Update After Each Session
```markdown
# In CURRENT_STATE.md
### Session {N}: {Name} ({DATE})
- {What was done}
**Status**: {Phase} → {Next phase}
**Checkpoint**: [sessions/{N}_{name}/CHECKPOINT.md](...)
```

---

*See NEW_FEATURE_INIT.md for complete initialization guide*