# Scripts Directory

Utility scripts for development, testing, and maintenance.

## Available Scripts

### `create-test-users.sh`

Creates Auth0 test users programmatically for development and demo purposes.

**Usage:**

```bash
# Create default demo users
./scripts/create-test-users.sh

# Create users from custom config file
./scripts/create-test-users.sh path/to/custom-users.json

# Specify custom .env file
./scripts/create-test-users.sh .env.local scripts/test-users.json
```

**Features:**
- ✅ Reads Auth0 config from environment variables
- ✅ Supports JSON configuration files for custom user sets
- ✅ Handles duplicate users gracefully
- ✅ Includes rate limiting to avoid API throttling
- ✅ Color-coded output for easy scanning
- ✅ Exit codes for CI/CD integration

**Requirements:**
- `curl` (pre-installed on macOS/Linux)
- `jq` (optional, for JSON config support)
  - Install: `brew install jq` (macOS) or `apt-get install jq` (Linux)

**Environment Variables:**

The script reads Auth0 configuration from these variables (in order of precedence):

1. Command-line specified `.env` file
2. Project root `.env`
3. `apps/web-start/.env`

Required variables:
- `VITE_AUTH0_DOMAIN` or `AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID` or `AUTH0_CLIENT_ID`

Optional:
- `AUTH0_CONNECTION` (default: `Username-Password-Authentication`)

**JSON Configuration Format:**

Create a custom user configuration file:

```json
{
  "users": [
    {
      "email": "user@example.com",
      "password": "SecurePass123!",
      "name": "Test User",
      "role": "STUDENT",
      "notes": "Optional notes about this user"
    }
  ]
}
```

Fields:
- `email` (required): User's email address
- `password` (required): User's password (must meet Auth0 requirements)
- `name` (required): User's display name
- `role` (optional): For documentation purposes
- `notes` (optional): Additional context

**Default Users:**

If no config file is provided, creates these demo users:

| Email | Password | Name | Database Data |
|-------|----------|------|---------------|
| john.student@example.edu | TestPass123! | John Student | 4 submissions, 3 grades |
| dr.bart@example.edu | TestPass123! | Dr. Bart | Professor, created assignments |
| mike.ta@example.edu | TestPass123! | Mike TA | TA for CISC474 |
| jane.doe@example.edu | TestPass123! | Jane Doe | 2 submissions |

**Examples:**

```bash
# Quick demo setup
./scripts/create-test-users.sh

# Create custom user set
cat > my-users.json << 'EOF'
{
  "users": [
    {
      "email": "test1@example.com",
      "password": "Test123!",
      "name": "Test User 1"
    },
    {
      "email": "test2@example.com",
      "password": "Test123!",
      "name": "Test User 2"
    }
  ]
}
EOF

./scripts/create-test-users.sh my-users.json

# Use in CI/CD pipeline
if ./scripts/create-test-users.sh; then
  echo "Users created, running E2E tests..."
  npm run test:e2e
fi
```

**Troubleshooting:**

| Issue | Solution |
|-------|----------|
| "Missing Auth0 configuration" | Check `.env` files contain `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` |
| "jq not found" | Install jq or script will fall back to default users |
| "user already exists" | Not an error - user was already created (safe to ignore) |
| HTTP 429 errors | Rate limit hit - script includes delays, but wait a minute and retry |

---

## Adding New Scripts

When adding new scripts:

1. Make them executable: `chmod +x scripts/your-script.sh`
2. Add shebang: `#!/bin/bash` or `#!/usr/bin/env node`
3. Document in this README
4. Use consistent error handling
5. Support environment variable configuration
6. Include usage examples

---

**Last Updated:** 2025-10-24
