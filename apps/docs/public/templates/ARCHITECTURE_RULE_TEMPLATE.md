# Architecture Rule: [Rule Name]

## Status: MANDATORY | RECOMMENDED | DEPRECATED
*Effective Date: [YYYY-MM-DD]*
*Last Review: [YYYY-MM-DD]*

## 📐 Rule Statement

> **[MUST/SHOULD/MUST NOT]**: [Clear, single sentence stating the rule]

Example:
> **MUST**: All database operations must go through the ORM layer, direct SQL execution is forbidden except in migrations.

## 🎯 Rationale

### Problem This Prevents
[Describe the specific problem or anti-pattern this rule prevents]

### Benefits
- [Benefit 1: e.g., Maintainability]
- [Benefit 2: e.g., Security]
- [Benefit 3: e.g., Testability]

### Real Incident (if applicable)
> On [date], [what happened] because this rule wasn't followed, resulting in [impact].

## ✅ Good Examples (DO THIS)

### Example 1: [Scenario]
```python
# CORRECT: Using ORM for database operations
from models import User

def get_active_users():
    """Properly uses ORM to query database"""
    return User.query.filter_by(active=True).all()
```

### Example 2: [Different Scenario]
```python
# CORRECT: Proper error handling
async def process_request(data):
    try:
        user = await User.get(data['user_id'])
        return await user.process(data)
    except User.DoesNotExist:
        raise ValueError(f"User {data['user_id']} not found")
```

## ❌ Bad Examples (DON'T DO THIS)

### Anti-Pattern 1: [What Not To Do]
```python
# WRONG: Direct SQL execution bypassing ORM
import psycopg2

def get_active_users_bad():
    """This will be rejected in code review"""
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE active = true")  # ❌ Direct SQL
    return cursor.fetchall()
```

### Anti-Pattern 2: [Another Violation]
```python
# WRONG: Import-time side effects
import os
import sys

# ❌ This executes during import, breaking module composability
if not os.getenv('DATABASE_URL'):
    sys.exit("DATABASE_URL must be set!")  # Dies at import time

class DatabaseConnection:
    pass
```

## 🔍 Detection & Verification

### Automated Check
```bash
# Script to detect violations
#!/bin/bash

# Find direct SQL execution (should return nothing)
grep -r "cursor.execute\|conn.execute" --include="*.py" src/

# Find import-time side effects
grep -r "sys.exit\|exit()" --include="*.py" src/ | grep -v "def \|class "

# Use AST analysis for complex patterns
python scripts/check_architecture.py --rule no-direct-sql
```

### Manual Review Checklist
- [ ] No raw SQL strings in application code
- [ ] All database models inherit from base ORM class
- [ ] No connection objects created outside of connection pool
- [ ] Migrations are the only place with raw SQL

### CI/CD Integration
```yaml
# .github/workflows/architecture.yml
- name: Check Architecture Rules
  run: |
    python scripts/architecture_lint.py
    if [ $? -ne 0 ]; then
      echo "Architecture violations detected. PR cannot be merged."
      exit 1
    fi
```

## 🔧 Migration Path

If existing code violates this rule, here's how to fix it:

### Step 1: Identify Violations
```bash
# Generate report of violations
python scripts/find_violations.py --rule [rule-name] > violations.txt
```

### Step 2: Refactor Pattern
```python
# Before (violating)
cursor.execute("SELECT * FROM users WHERE age > %s", (18,))

# After (compliant)
User.query.filter(User.age > 18).all()
```

### Step 3: Verification
```bash
# Ensure refactoring didn't break functionality
pytest tests/test_refactored_module.py
make integration-test
```

## 🚫 Exceptions

Legitimate exceptions to this rule:

### Exception 1: [Specific Case]
- **When**: During database migrations
- **Why**: Migrations need to modify schema
- **How**: Use Alembic/Django migrations framework
- **Example**: `migrations/versions/001_add_user_table.py`

### Exception 2: [Another Case]
- **When**: Performance-critical batch operations
- **Why**: ORM overhead unacceptable for millions of records
- **How**: Must be approved by tech lead and documented
- **Example**: `scripts/batch_operations/bulk_import.py`

### Requesting Exception
1. Document why the rule cannot be followed
2. Propose alternative safeguards
3. Get approval from: [Tech Lead/Architect]
4. Add exception to this document

## 📊 Metrics & Monitoring

### Compliance Metrics
- Current violations: [number]
- Violations trend: [decreasing/stable/increasing]
- Last violation introduced: [date]
- Teams with most violations: [list]

### Tracking Command
```bash
# Generate compliance report
python scripts/architecture_metrics.py --rule [rule-name]
```

## 🔄 Related Rules

- See also: [Related Rule 1] - [How it relates]
- Conflicts with: [Rule X] - [How to resolve]
- Supersedes: [Old Rule] - [What changed]

## 📚 References

### Internal Documentation
- [Design decision document]
- [Post-mortem that led to this rule]
- [Architecture overview]

### External Resources
- [Industry best practice article]
- [Framework documentation]
- [Security guideline]

## 📝 Revision History

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2024-01-15 | 1.0 | Initial rule created | Tech Lead |
| 2024-02-20 | 1.1 | Added exception for migrations | DBA |
| 2024-03-10 | 1.2 | Clarified detection script | DevOps |

## 💬 Discussion & Questions

For questions or proposed changes to this rule:
1. Open an issue with label `architecture-rule`
2. Include specific use case that challenges the rule
3. Propose alternative that maintains the benefits

---
*This rule is enforced automatically in CI/CD. Non-compliant code will be blocked from merging.*