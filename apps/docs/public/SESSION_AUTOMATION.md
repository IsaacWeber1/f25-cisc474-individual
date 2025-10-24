# Session State Automation

**Purpose**: Automatic session state management and handoffs between Claude instances.

## Session Start Checklist (AUTOMATIC)

```python
def on_session_start():
    # 1. Scan for active work
    active = glob("documents/current/*/CURRENT_STATE.md")
    for feature in active:
        if "🔴 NEXT SESSION START HERE" in read(feature):
            print(f"⚠️ Incomplete: {feature}")

    # 2. Load last session number
    sessions = glob("documents/current/*/sessions/*/")
    last_session = max(sessions) if sessions else "000"

    # 3. Check for blockers
    if "❌ BLOCKED" in any(active):
        alert_user("Previous session hit blockers")

    # 4. Resume TodoWrite state
    if exists(".todo_state"):
        TodoWrite.load_state()
```

## Auto-Save Rules

**Every 10 minutes:**
```python
def auto_save():
    # Save current position
    current_state["last_file"] = current_file
    current_state["last_line"] = current_line
    current_state["todos"] = TodoWrite.get_state()

    # Update CURRENT_STATE.md
    update_current_state(current_state)

    # Commit
    git_commit("checkpoint: auto-save")
```

## Session Handoff Format

When session ends, automatically create in CURRENT_STATE.md:

```markdown
## 🔴 NEXT SESSION START HERE

**Stopped at**: {specific_file}:{line_number}
**Working on**: {current_todo_item}
**Next action**: {specific_next_step}

### Resume checklist:
1. [ ] cd {working_directory}
2. [ ] source ../pyenv/bin/activate
3. [ ] {specific_command_to_run}
```

## Session Numbering

```python
def get_next_session_number(feature_name):
    sessions = glob(f"documents/current/{feature_name}/sessions/*")
    if not sessions:
        return "001_initialization"

    last = max(sessions)
    num = int(last.split("_")[0]) + 1

    # Auto-name based on phase
    if "planning" in current_work:
        name = "planning"
    elif "test" in current_work:
        name = "testing"
    else:
        name = "implementation"

    return f"{num:03d}_{name}"
```

## State Persistence

Save to `.claude_session_state.json`:
```json
{
    "feature": "control_panel",
    "session": "003",
    "phase": "implementation",
    "todos": [...],
    "last_checkpoint": "2024-10-09T15:30:00Z",
    "working_dir": "/Users/owner/Projects/regassist_project",
    "environment": "local"
}
```

## Context Switch Detection

```python
def detect_context_switch(current_topic, new_topic):
    if feature_name(current_topic) != feature_name(new_topic):
        # Save current
        create_checkpoint(current_topic)
        git_commit(f"checkpoint: switching to {new_topic}")

        # Clear and load new
        TodoWrite.clear()
        load_feature_state(new_topic)
```

## Session End Triggers

Automatically end session when:
- User says: "goodbye", "see you", "that's all"
- No activity for 5 minutes
- Context switching to new feature
- Error blocks progress

## Recovery from Interruption

If session interrupted unexpectedly:
1. Check for uncommitted changes
2. Create recovery checkpoint
3. Note interruption point in CURRENT_STATE.md
4. Commit with: "recovery: session interrupted"

---
*This file handles session state only. See META_DOCUMENTATION.md for overall rules.*