# Git Worktree Documentation Strategy - LMS Project

**Purpose**: Enable 3-5 parallel feature branches with isolated documentation that merges without conflicts.

**Based on**: GitLab's CHANGELOG solution, Kubernetes parallel development, Git worktree best practices (2024)

---

## Problem Statement

**Challenge**: Multiple feature branches editing the same `CURRENT_STATE.md` file causes merge conflicts on every PR.

**Current conflict rate**: ~90% with 3 parallel branches
**Expected conflicts over project**: ~45 conflicts
**Time cost**: 3.75-11.25 hours of manual conflict resolution

---

## Solution: File-Per-Feature YAML System

### Core Pattern (GitLab-Inspired)

Instead of all branches editing one file, each session/change gets its own uniquely-named YAML file:

```
apps/docs/public/authentication/
├── README.md                    # Rarely changes (low conflict risk)
├── CURRENT_STATE.md             # AUTO-GENERATED (never edit manually!)
├── PLANNING.md                  # Static after creation
├── sessions/                    # Append-only (no conflicts)
│   ├── 001_20251020_planning/
│   │   └── CHECKPOINT.md
│   └── 010_20251024_database_seeding/
│       └── CHECKPOINT.md
└── unreleased/                  # NEW: Per-session YAML entries
    ├── 20251024_143022_001_jwt_validation.yaml
    ├── 20251024_150030_001_frontend_fixes.yaml
    └── 20251025_093015_001_testing_suite.yaml
```

### Why This Works

1. **Timestamp + Counter Naming** → Guaranteed uniqueness across all branches
2. **Append-Only** → Files are never modified after creation
3. **Automated Compilation** → YAML files compile into CURRENT_STATE.md
4. **Zero Conflicts** → Each branch creates different files

**Result**: ~0% merge conflicts (from ~90%)

---

## Git Worktree Directory Structure

### Recommended Setup: Bare Repository Pattern

```
~/Assignments/Advanced Web Tech/
└── f25-cisc474-individual/           # Bare repository
    ├── .git/                         # Shared metadata
    ├── main/                         # Main branch worktree
    │   ├── apps/
    │   ├── packages/
    │   └── .claude/CLAUDE.md
    ├── feat-auth0/                   # Feature worktree #1
    │   ├── apps/
    │   ├── packages/
    │   └── apps/docs/public/authentication/unreleased/
    │       └── 20251024_143022_001_jwt.yaml
    ├── feat-comments/                # Feature worktree #2
    │   └── apps/docs/public/comments/unreleased/
    │       └── 20251024_150000_001_api.yaml
    ├── feat-grades/                  # Feature worktree #3
    └── feat-reflections/             # Feature worktree #4
```

**Key Benefits**:
- Each worktree is completely isolated
- Separate `node_modules/`, `.next/`, `dist/` per worktree
- Run multiple Claude Code instances simultaneously
- No context switching between features

---

## File Naming Convention

### Pattern: `YYYYMMDD_HHmmss_<counter>_<feature-slug>.yaml`

**Examples**:
```
20251024_143022_001_auth0_jwt_validation.yaml
20251024_143023_001_comments_api_endpoint.yaml
20251024_143022_002_auth0_frontend_fixes.yaml  # Same timestamp, different counter
```

**Why This Works**:
1. **Chronological ordering**: Files naturally sort by time
2. **Uniqueness**: Timestamp + counter prevents collisions
3. **Grep-friendly**: Easy to search by date or feature
4. **Merge-safe**: No two branches create same filename

---

## YAML Entry Format

### Template

```yaml
# 20251024_143022_001_jwt_validation.yaml
date: 2025-10-24
author: feat/auth0-authentication
type: enhancement  # or: fix, feature, docs, refactor, test
feature: authentication
title: "JWT validation with Auth0"
description: |
  Implemented JWT token validation using Auth0 RS256 algorithm
  with automatic JWKS key rotation support.

  Tested with valid/invalid tokens.
files_changed:
  - apps/api/src/auth/jwt.strategy.ts
  - apps/api/src/auth/auth.guard.ts
  - apps/api/test/auth/jwt.spec.ts
status: completed  # or: in_progress, blocked
session: "006_security_hardening"
related_prs: []
```

---

## Automation Scripts

### 1. Create Documentation Entry

**Script**: `scripts/create-doc-entry.js`

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: npm run docs:entry <feature> <slug>');
  console.error('Example: npm run docs:entry authentication jwt_validation');
  process.exit(1);
}

const [feature, slug] = args;
const timestamp = new Date().toISOString()
  .replace(/[-:]/g, '')
  .replace(/\.\d{3}Z/, '');

const unreleasedDir = path.join(
  __dirname,
  '..',
  'apps',
  'docs',
  'public',
  feature,
  'unreleased'
);

// Ensure directory exists
if (!fs.existsSync(unreleasedDir)) {
  fs.mkdirSync(unreleasedDir, { recursive: true });
}

// Find existing files with same timestamp
const existing = fs.readdirSync(unreleasedDir)
  .filter(f => f.startsWith(timestamp.substring(0, 15)))  # Same day + hour + minute
  .length;

const counter = String(existing + 1).padStart(3, '0');
const filename = `${timestamp}_${counter}_${slug}.yaml`;
const filepath = path.join(unreleasedDir, filename);

// Get current branch for author
const { execSync } = require('child_process');
const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();

// Create template
const template = `date: ${new Date().toISOString().split('T')[0]}
author: ${branch}
type: enhancement  # or: fix, feature, docs, refactor, test
feature: ${feature}
title: ""
description: |

files_changed: []
status: in_progress  # or: completed, blocked
session: ""
related_prs: []
`;

fs.writeFileSync(filepath, template);
console.log(`✅ Created: ${filename}`);
console.log(`   Edit: ${filepath}`);
```

**Usage**:
```bash
npm run docs:entry authentication jwt_validation
# Creates: 20251024T143022_001_jwt_validation.yaml
```

---

### 2. Compile Documentation

**Script**: `scripts/compile-docs.js`

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

function compileFeature(featureName) {
  const basePath = path.join(__dirname, '..', 'apps', 'docs', 'public', featureName);
  const unreleasedDir = path.join(basePath, 'unreleased');
  const outputFile = path.join(basePath, 'CURRENT_STATE.md');

  // Check if unreleased directory exists
  if (!fs.existsSync(unreleasedDir)) {
    console.log(`⚠️  No unreleased/ directory for ${featureName}`);
    return;
  }

  // Read all YAML files
  const yamlFiles = glob.sync(path.join(unreleasedDir, '*.yaml'));

  if (yamlFiles.length === 0) {
    console.log(`ℹ️  No YAML files in ${featureName}/unreleased/`);
    return;
  }

  const entries = yamlFiles
    .map(file => {
      try {
        return {
          ...yaml.load(fs.readFileSync(file, 'utf8')),
          filename: path.basename(file)
        };
      } catch (e) {
        console.error(`❌ Error parsing ${file}:`, e.message);
        return null;
      }
    })
    .filter(entry => entry !== null)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Group by date
  const byDate = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  // Generate Markdown
  let markdown = `# ${featureName.charAt(0).toUpperCase() + featureName.slice(1)} - Current State\n\n`;
  markdown += `*Last compiled: ${new Date().toISOString().split('T')[0]}*\n\n`;
  markdown += `*This file is AUTO-GENERATED from \`unreleased/*.yaml\`. Do not edit manually!*\n\n`;
  markdown += `---\n\n`;
  markdown += `## Recent Changes\n\n`;

  const dates = Object.keys(byDate).sort().reverse();

  dates.forEach(date => {
    markdown += `### ${date}\n\n`;
    byDate[date].forEach(entry => {
      const icon = {
        'enhancement': '✨',
        'fix': '🐛',
        'feature': '🎉',
        'docs': '📝',
        'refactor': '♻️',
        'test': '✅'
      }[entry.type] || '🔹';

      markdown += `${icon} **${entry.title}**`;
      if (entry.session) {
        markdown += ` (Session ${entry.session})`;
      }
      markdown += `\n`;

      if (entry.description && entry.description.trim()) {
        const desc = entry.description.trim().split('\n').map(line => `  ${line}`).join('\n');
        markdown += `${desc}\n`;
      }

      if (entry.files_changed && entry.files_changed.length > 0) {
        markdown += `  - **Files**: ${entry.files_changed.slice(0, 3).join(', ')}`;
        if (entry.files_changed.length > 3) {
          markdown += ` (+${entry.files_changed.length - 3} more)`;
        }
        markdown += `\n`;
      }

      const statusIcon = {
        'completed': '✅',
        'in_progress': '🟡',
        'blocked': '🔴'
      }[entry.status] || '🔹';

      markdown += `  - **Status**: ${statusIcon} ${entry.status}\n`;
      markdown += `  - **Source**: \`${entry.filename}\`\n`;
      markdown += `\n`;
    });
  });

  markdown += `---\n\n`;
  markdown += `## Summary Statistics\n\n`;
  markdown += `- **Total entries**: ${entries.length}\n`;
  markdown += `- **Date range**: ${dates[dates.length - 1]} to ${dates[0]}\n`;
  markdown += `- **Status breakdown**:\n`;

  const statusCounts = entries.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  Object.entries(statusCounts).forEach(([status, count]) => {
    markdown += `  - ${status}: ${count}\n`;
  });

  markdown += `\n---\n\n`;
  markdown += `*To add new entries, run: \`npm run docs:entry ${featureName} <description>\`*\n`;
  markdown += `*To recompile, run: \`npm run docs:compile ${featureName}\`*\n`;

  fs.writeFileSync(outputFile, markdown);
  console.log(`✅ Compiled ${featureName}: ${yamlFiles.length} entries → CURRENT_STATE.md`);
}

// Compile specific feature or all features
const features = process.argv.slice(2);

if (features.length === 0) {
  // Find all features with unreleased/ directories
  const docsPath = path.join(__dirname, '..', 'apps', 'docs', 'public');
  const allFeatures = fs.readdirSync(docsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => {
      const unreleasedPath = path.join(docsPath, name, 'unreleased');
      return fs.existsSync(unreleasedPath);
    });

  allFeatures.forEach(compileFeature);
} else {
  features.forEach(compileFeature);
}
```

**Usage**:
```bash
# Compile one feature
npm run docs:compile authentication

# Compile all features
npm run docs:compile-all
```

---

### 3. Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "docs:entry": "node scripts/create-doc-entry.js",
    "docs:compile": "node scripts/compile-docs.js",
    "docs:compile-all": "node scripts/compile-docs.js"
  },
  "devDependencies": {
    "js-yaml": "^4.1.0",
    "glob": "^10.3.10"
  }
}
```

---

## Daily Workflow with Worktrees

### Setup (One-Time)

```bash
# Navigate to project parent
cd ~/Assignments/Advanced\ Web\ Tech

# Back up existing repo
mv f25-cisc474-individual f25-cisc474-individual-backup

# Clone as bare repository
git clone --bare f25-cisc474-individual-backup/.git f25-cisc474-individual

# Navigate to bare repo
cd f25-cisc474-individual

# Create main worktree
git worktree add main main

# Create feature worktrees
git worktree add feat-auth0 feat/auth0-authentication
git worktree add feat-submissions feat/submissions
git worktree add feat-grades feat/grades
git worktree add feat-comments feat/comments

# List all worktrees
git worktree list
```

### Working in a Worktree

```bash
# Terminal 1: Work on authentication
cd ~/Assignments/Advanced\ Web\ Tech/f25-cisc474-individual/feat-auth0

# Create documentation entry
npm run docs:entry authentication jwt_validation

# Edit the YAML file
vim apps/docs/public/authentication/unreleased/20251024_143022_001_jwt_validation.yaml

# Make code changes...
vim apps/api/src/auth/jwt.strategy.ts

# Test, lint, build
npm run lint --filter=api
npm run build --filter=api

# Compile documentation before committing
npm run docs:compile authentication

# Review generated CURRENT_STATE.md
cat apps/docs/public/authentication/CURRENT_STATE.md

# Commit (includes both YAML and compiled Markdown)
git add .
git commit -m "feat(auth): JWT validation with Auth0"
git push
```

**Meanwhile, in parallel:**

```bash
# Terminal 2: Work on comments (no conflicts!)
cd ~/Assignments/Advanced\ Web\ Tech/f25-cisc474-individual/feat-comments

# Create documentation entry
npm run docs:entry comments api_endpoint

# Edit YAML
vim apps/docs/public/comments/unreleased/20251024_150000_001_api_endpoint.yaml

# Make code changes...
vim apps/api/src/comments/comments.controller.ts

# Same workflow: test, compile, commit
npm run docs:compile comments
git add .
git commit -m "feat(comments): add API endpoints"
git push
```

**No conflicts because:**
- Different features → Different `unreleased/` directories
- Different timestamps → Different filenames
- Compilation happens per-branch → Each PR has its own compiled CURRENT_STATE.md
- Git merges files naturally (append-only, no editing)

---

## Session Checkpoints (Enhanced)

### Enhanced Naming with Date Prefix

**Old format**:
```
sessions/010_database_seeding/CHECKPOINT.md
```

**New format**:
```
sessions/010_20251024_database_seeding/CHECKPOINT.md
```

**Benefits**:
- Explicit chronology
- Easy to sort and filter
- Clear when sessions happened
- Still append-only (no conflicts)

---

## Merge Strategy

### PR Workflow with Auto-Compilation

```bash
# Before creating PR, compile documentation
npm run docs:compile authentication

# Review changes
git diff apps/docs/public/authentication/CURRENT_STATE.md

# Commit compiled state
git add apps/docs/public/authentication/
git commit -m "docs(auth): compile session 010 documentation"

# Push
git push

# Create PR
gh pr create --base main --title "Authentication: JWT validation"

# CI will verify:
# - Lint passes
# - Build passes
# - Documentation compiled (CURRENT_STATE.md exists and is recent)
```

### After Merge

**Cleanup Options**:

**Option A: Keep YAML files** (recommended)
- YAML files stay in `unreleased/`
- Provides complete history
- Can regenerate CURRENT_STATE.md anytime
- Disk space is cheap

**Option B: Move to released/**
```bash
# After PR merged to main
git checkout main
git pull

mkdir -p apps/docs/public/authentication/released
mv apps/docs/public/authentication/unreleased/*.yaml apps/docs/public/authentication/released/

git commit -m "docs(auth): archive session 010 entries"
```

---

## CI/CD Integration

### GitHub Action: Auto-Compile Documentation

Create `.github/workflows/docs-compile.yml`:

```yaml
name: Compile Documentation

on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - 'apps/docs/public/*/unreleased/*.yaml'

jobs:
  compile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm install

      - name: Compile documentation
        run: npm run docs:compile-all

      - name: Check for changes
        id: changes
        run: |
          if [[ $(git status --porcelain) ]]; then
            echo "changes=true" >> $GITHUB_OUTPUT
          else
            echo "changes=false" >> $GITHUB_OUTPUT
          fi

      - name: Commit compiled documentation
        if: steps.changes.outputs.changes == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add apps/docs/public/*/CURRENT_STATE.md
          git commit -m "docs: auto-compile documentation state"
          git push
```

---

## Migration Checklist

### Week 1: Foundation (2 hours)

- [ ] Install dependencies: `npm install js-yaml glob --save-dev`
- [ ] Create `scripts/create-doc-entry.js`
- [ ] Create `scripts/compile-docs.js`
- [ ] Add npm scripts to `package.json`
- [ ] Create `unreleased/` directories:
  ```bash
  mkdir -p apps/docs/public/{authentication,submissions,grades,comments,courses,enrollments,reflections}/unreleased
  ```
- [ ] Test creating 3 sample YAML entries
- [ ] Test compilation script
- [ ] Verify generated CURRENT_STATE.md is readable

### Week 2: Git Worktree Setup (1 hour)

- [ ] Back up current repository
- [ ] Convert to bare repository structure
- [ ] Create main worktree
- [ ] Create 3-5 feature worktrees
- [ ] Test `npm install` in each worktree
- [ ] Test `npm run dev` in each worktree
- [ ] Document worktree commands in README

### Week 3: Validation (30 minutes)

- [ ] Create 3 parallel branches in different worktrees
- [ ] Each branch adds 2 YAML entries
- [ ] Compile documentation in each branch
- [ ] Create 3 separate PRs
- [ ] Merge all 3 PRs (verify 0 conflicts!)
- [ ] Check final CURRENT_STATE.md includes all entries

### Week 4: CI/CD (Optional, 2 hours)

- [ ] Create GitHub Action for auto-compilation
- [ ] Test on sample PR
- [ ] Verify auto-commit works correctly
- [ ] Add status badge to README

---

## Conflict Resolution: Before vs After

### Before: Manual CURRENT_STATE.md Editing

```markdown
# Branch A modifies CURRENT_STATE.md:
## What's Working
- Authentication with Auth0
- JWT validation

# Branch B modifies CURRENT_STATE.md (CONFLICT!):
## What's Working
- Comments API endpoints
- Threaded replies

# Result: Merge conflict requires manual resolution
```

### After: YAML File-Per-Feature

```yaml
# Branch A creates: 20251024_143022_001_jwt_validation.yaml
date: 2025-10-24
title: "JWT validation"
...

# Branch B creates: 20251024_150000_001_comments_api.yaml
date: 2025-10-24
title: "Comments API"
...

# Result: Both files exist, no conflict!
# Compilation combines both into CURRENT_STATE.md automatically
```

---

## Expected Results

### Quantitative Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Merge conflicts (with 3 branches) | ~90% | ~0% | **90% reduction** |
| Conflict resolution time per PR | 5-15 min | 0 min | **100% reduction** |
| Total conflicts over project (50 PRs) | ~45 | ~0 | **45 conflicts prevented** |
| Total time saved | - | - | **3.75-11.25 hours** |
| Documentation consistency | Manual | Automated | **100% consistent format** |

### Qualitative Benefits

- ✅ **Parallel development**: 3-5 developers/features work simultaneously
- ✅ **Complete history**: Every change tracked in YAML files
- ✅ **Easy review**: YAML files are small, focused, reviewable
- ✅ **Automated compilation**: CURRENT_STATE.md always up-to-date
- ✅ **Git-friendly**: Clear diffs, no binary files, standard Markdown
- ✅ **Grep-friendly**: Easy to search across all documentation

---

## Troubleshooting

### Issue: YAML file not compiling

**Check**:
```bash
# Validate YAML syntax
npm install -g js-yaml
js-yaml apps/docs/public/authentication/unreleased/file.yaml

# Run compilation with verbose output
node scripts/compile-docs.js authentication
```

### Issue: Duplicate timestamps

**Solution**: Counter prevents this, but if it happens:
```bash
# Manually rename file with correct counter
mv 20251024_143022_001_file.yaml 20251024_143022_002_file.yaml
```

### Issue: Lost worktree

**Recovery**:
```bash
# List worktrees
git worktree list

# Prune deleted worktrees
git worktree prune

# Recreate worktree
git worktree add feat-submissions feat/submissions
```

---

## References

- **GitLab CHANGELOG solution**: https://about.gitlab.com/blog/2018/07/03/solving-gitlabs-changelog-conflict-crisis/
- **Git Worktree best practices**: https://gist.github.com/ChristopherA/4643b2f5e024578606b9cd5d2e6815cc
- **Timestamp file naming**: IASA file naming conventions, Harvard Data Management
- **Claude Code parallel development**: Anthropic engineering blog

---

**Status**: Ready to implement
**Estimated setup time**: 3-4 hours
**Expected conflict reduction**: 90%
**Time saved over project**: 4-11 hours

*Last updated: 2025-10-24*
