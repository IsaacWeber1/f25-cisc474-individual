# Feature Documentation Template

## Standard Feature Structure

When creating a new feature, use this directory structure:

```
{feature_name}/
├── CURRENT_STATE.md              # What works, what's broken, next steps
├── ARCHITECTURE_RULES.md         # Feature-specific constraints
├── DEBT_TRACKER.md              # Known workarounds & technical debt
├── README.md                    # Overview & navigation
│
├── sessions/                    # Development sessions/checkpoints
│   ├── 001_initial/
│   │   ├── CURRENT_STATE.md    # Session state snapshot
│   │   ├── OPERATIONS_LOG.md   # What was done
│   │   └── TODOWRITE_STATE.md  # Task tracking
│   └── 002_enhancement/
│
├── architecture/                # How it's built
│   ├── DESIGN.md               # Overall design
│   ├── INTEGRATION.md          # How it connects
│   └── PATTERNS.md             # Design patterns used
│
├── guides/                      # How to work with it
│   ├── IMPLEMENTATION.md       # Step-by-step guide
│   ├── TESTING.md              # Test procedures
│   └── QUICK_REFERENCE.md      # Commands & tips
│
└── planning/                    # Original plans & requirements
    ├── requirements.md          # What it needs to do
    └── mvp.md                  # Minimum viable version
```

## Creating a New Feature

```bash
# From documents directory
FEATURE_NAME="your_feature_name"

# Create in future/ for planning
mkdir -p future/$FEATURE_NAME/{planning,architecture,guides,sessions}

# When ready to implement, move to current/
mv future/$FEATURE_NAME current/

# When complete, move to completed/
mv current/$FEATURE_NAME completed/
```

## Key Files to Create First

### 1. README.md
```markdown
# {Feature Name}

## Overview
Brief description of what this feature does.

## Status
- [ ] Planning
- [ ] In Development
- [ ] Testing
- [ ] Complete

## Quick Links
- [Current State](CURRENT_STATE.md)
- [Architecture](architecture/)
- [Implementation Guide](guides/IMPLEMENTATION.md)
- [Sessions](sessions/)

## Key Commands
\`\`\`bash
# How to test
make test-{feature}

# How to run
./run-{feature}.sh
\`\`\`
```

### 2. CURRENT_STATE.md
```markdown
# Current State - {Feature Name}
*Last Updated: {ISO Date}*

## ✅ What Works
- [Component]: [Status]

## ⚠️ Known Issues
- [Issue]: [Workaround if any]

## 🎯 Next Steps
1. [Immediate task]
2. [Following task]

## 📊 Metrics
- Lines of code: X
- Test coverage: X%
- Technical debt: Depth X

## 🔄 Session History
- 001_initial: [Date] - [Summary]
- 002_enhancement: [Date] - [Summary]
```

### 3. ARCHITECTURE_RULES.md
```markdown
# Architecture Rules - {Feature Name}

## Feature-Specific Rules

### 1. [Rule Name]
\`\`\`python
# ❌ BANNED
[bad example]

# ✅ REQUIRED
[good example]
\`\`\`

## Integration Rules
- Must use [system]
- Must not bypass [component]
- Must respect [constraint]
```

## Best Practices

### Self-Contained
- Each feature should be independently understandable
- Include all context needed to work on it
- Don't reference external docs without links

### Progressive Documentation
- Start with planning/
- Add architecture/ as you design
- Update guides/ as you implement
- Keep CURRENT_STATE.md always accurate

### Session Tracking
- Create new session for each work period
- Number sequentially (001, 002, etc.)
- Include date inside the session docs
- Snapshot state at session end