# Auth0 Test User Creation - Research & Best Practices

**Date**: 2025-10-24
**Issue**: HTTP 400 errors when creating/updating users programmatically via Auth0 Management API
**Goal**: Establish reliable, automated test user creation for CI/CD and local development

---

## 🔍 Problem Analysis

### Our Situation
- Users created via `/dbconnections/signup` appear in Auth0 dashboard
- Login fails with "Wrong email or password"
- Attempting to reset passwords via Management API returns HTTP 400
- Need programmatic user creation for automated testing

### Root Causes Identified

1. **`/dbconnections/signup` Limitations**
   - Public endpoint (no authentication required)
   - Cannot set `email_verified: true`
   - Password may not be set correctly for some configurations
   - Designed for end-user signups, not automated testing

2. **Management API HTTP 400 Errors**
   Common causes from Auth0 community:
   - Empty password field
   - Password doesn't meet strength requirements
   - Incorrect connection name
   - Missing required fields
   - Invalid JSON structure
   - Insufficient API permissions

3. **Password Policy Issues**
   - Auth0 has 5 security levels (None, Low, Fair, Good, Excellent)
   - Default is "None" (minimum 1 character)
   - Maximum password length: 72 bytes
   - Our password `TestPass123!` should meet requirements

---

## ✅ Industry Best Practices

### 1. **Use Separate Test Tenants**
**Recommendation**: Use separate Auth0 tenants for dev/staging/production

**Benefits**:
- Isolate test data from production
- Different password policies per environment
- Safe rule/flow testing

**Implementation**:
```bash
# Dev Tenant
AUTH0_DOMAIN=dev-yourapp.auth0.com

# Production Tenant
AUTH0_DOMAIN=prod-yourapp.auth0.com
```

### 2. **Management API for Automated Testing**
**Correct Approach**: Use Management API `/api/v2/users` endpoint

**Required Setup**:
1. Create Machine-to-Machine application
2. Authorize for "Auth0 Management API"
3. Grant permissions: `create:users`, `read:users`, `update:users`

**Correct JSON Payload**:
```json
{
  "connection": "Username-Password-Authentication",
  "email": "test@example.com",
  "password": "SecurePass123!",
  "email_verified": true,
  "verify_email": false,
  "name": "Test User"
}
```

### 3. **Resource Owner Password Flow for Testing**
**For E2E Tests**: Use Resource Owner Password Grant

**Setup**:
1. Application Settings → Show Advanced Settings
2. Grant Types tab → Check "Password"
3. Use in tests to programmatically login

**Example**:
```javascript
// In Cypress/Playwright tests
const response = await fetch(`https://${domain}/oauth/token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'password',
    username: 'test@example.com',
    password: 'TestPass123!',
    client_id: clientId,
    client_secret: clientSecret, // For confidential clients
    audience: audience,
    scope: 'openid profile email'
  })
});
```

### 4. **Dedicated Static Test Users**
**Best Practice**: Create dedicated test users, don't reuse demo/sales accounts

**Recommended Structure**:
```json
{
  "users": [
    {
      "email": "test-student@example.com",
      "role": "STUDENT",
      "purpose": "E2E submission tests"
    },
    {
      "email": "test-professor@example.com",
      "role": "PROFESSOR",
      "purpose": "E2E grading tests"
    }
  ]
}
```

### 5. **Minimize Write Operations**
**Principle**: Rely mostly on reads, not writes

**Implementation**:
- Create test users once (setup phase)
- Reuse for multiple test runs
- Clean up test data periodically
- Use transactions where possible

### 6. **Email Testing Configuration**
**For Production**: Use custom email provider

**Options**:
- Mailtrap (for testing)
- Custom SMTP server
- Email verification disabled for test tenants

---

## 🔧 Solutions for Our HTTP 400 Errors

### Solution 1: Check Password Policy
**Auth0 Dashboard** → **Authentication** → **Database** → **Username-Password-Authentication** → **Password Policy**

Ensure policy allows our password format:
- `TestPass123!` should pass even "Excellent" policy
- Check for custom password dictionaries
- Verify personal info validation settings

### Solution 2: Verify Exact Connection Name
Our connection: `"Username-Password-Authentication"`

**Common mistakes**:
- Extra spaces
- Wrong capitalization
- Typos

**Verify**:
```bash
# List all connections via Management API
curl "https://${AUTH0_DOMAIN}/api/v2/connections" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Solution 3: Check API Scopes
**Required Permissions for Test User Management**:
- ✅ `create:users`
- ✅ `read:users`
- ✅ `update:users`
- ✅ `read:users_app_metadata`
- ✅ `update:users_app_metadata`
- ✅ `delete:users` (optional, for cleanup)

**Verify**: Auth0 Dashboard → Applications → Test User Management → APIs → Auth0 Management API

### Solution 4: Correct API Request Format
**Working Example**:
```bash
# Get token
TOKEN=$(curl -s -X POST "https://${AUTH0_DOMAIN}/oauth/token" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "'${CLIENT_ID}'",
    "client_secret": "'${CLIENT_SECRET}'",
    "audience": "https://'${AUTH0_DOMAIN}'/api/v2/",
    "grant_type": "client_credentials"
  }' | jq -r '.access_token')

# Create user
curl -X POST "https://${AUTH0_DOMAIN}/api/v2/users" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "connection": "Username-Password-Authentication",
    "email": "test@example.com",
    "password": "TestPass123!",
    "email_verified": true,
    "verify_email": false,
    "name": "Test User"
  }'
```

### Solution 5: Password Update Instead of Reset
**For existing users**, use PATCH with correct format:
```bash
# Get user ID
USER_ID=$(curl -s "https://${AUTH0_DOMAIN}/api/v2/users-by-email?email=test@example.com" \
  -H "Authorization: Bearer ${TOKEN}" | jq -r '.[0].user_id')

# Update password
curl -X PATCH "https://${AUTH0_DOMAIN}/api/v2/users/${USER_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NewPass123!",
    "connection": "Username-Password-Authentication"
  }'
```

---

## 📋 Implementation Checklist

### Immediate Fixes (For Demo)
- [ ] Manually set passwords in Auth0 Dashboard
- [ ] Disable email verification for test connection
- [ ] Verify test users can login

### Proper Setup (Post-Demo)
- [ ] Verify Management API permissions are correct
- [ ] Test user creation script with verbose error output
- [ ] Document exact API error responses
- [ ] Check password policy settings
- [ ] Verify connection name is exact match
- [ ] Implement Resource Owner Password Flow for E2E tests

### Long-term Best Practices
- [ ] Create separate test tenant
- [ ] Set up Mailtrap for email testing
- [ ] Implement user cleanup scripts
- [ ] Add retry logic with exponential backoff
- [ ] Document all test users and their purposes
- [ ] Create CI/CD pipeline integration

---

## 🎯 Recommended Approach

### For Your Project:

**Now (Demo)**:
1. Manually reset passwords via Auth0 Dashboard
2. Use Google account for demo (already works)

**This Week**:
1. Debug exact API error with verbose logging
2. Fix Management API script
3. Document working solution

**Next Sprint**:
1. Implement Resource Owner Password Flow for E2E tests
2. Create dedicated test users with clear purposes
3. Add to CI/CD pipeline

---

## 📚 References

- [Auth0 Management API v2 Documentation](https://auth0.com/docs/api/management/v2)
- [Password Strength in Auth0 Database Connections](https://auth0.com/docs/authenticate/database-connections/password-strength)
- [Cypress Auth0 Testing Guide](https://docs.cypress.io/app/guides/authentication-testing/auth0-authentication)
- [Auth0 Testing Best Practices (Community)](https://community.auth0.com/t/test-users-best-practices/33145)
- [Create Users Documentation](https://auth0.com/docs/manage-users/user-accounts/create-users)

---

## 🔍 Next Steps for Debugging

1. **Add verbose error logging**:
```bash
# Capture full response body
response=$(curl -v -X POST "https://${AUTH0_DOMAIN}/api/v2/users" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '...' 2>&1)

echo "$response" | jq .
```

2. **Test minimal payload**:
```json
{
  "connection": "Username-Password-Authentication",
  "email": "minimal@test.com",
  "password": "Pass123!"
}
```

3. **Verify token scopes**:
```bash
# Decode JWT to check scopes
echo $TOKEN | cut -d'.' -f2 | base64 -d | jq .
```

---

**Status**: Research complete. Manual workaround documented. Automated solution pending debugging.
