# Auth0 Authentication Testing Guide

**Last Updated**: 2025-10-23

This guide provides comprehensive instructions for testing the Auth0 authentication implementation using NPM scripts and command-line tools.

## Table of Contents
1. [Quick Start](#quick-start)
2. [NPM Scripts](#npm-scripts)
3. [Testing Workflow](#testing-workflow)
4. [Extracting JWT Tokens](#extracting-jwt-tokens)
5. [API Testing](#api-testing)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
```bash
# Install global testing tools
npm install -g react-devtools
npm install -g auth0
npm install -g auth0-deploy-cli
```

### Basic Testing Flow
```bash
# 1. Start development servers
npm run dev

# 2. Test that endpoints are protected
npm run auth:test
# Expected: 401 Unauthorized

# 3. Login via browser
# Navigate to http://localhost:3001
# Click "Log In" and authenticate via Auth0

# 4. Extract token (see methods below)

# 5. Test with token
TOKEN="your_token_here"
curl http://localhost:3000/courses -H "Authorization: Bearer $TOKEN"
```

---

## NPM Scripts

The following NPM scripts have been added to `package.json` for authentication testing:

### `npm run auth:test`
Tests endpoints to verify authentication is required:
```bash
npm run auth:test
# Output: 401 Unauthorized (expected - confirms protection is working)
```

### `npm run auth:test-with-token`
Instructions for testing with a valid JWT token:
```bash
npm run auth:test-with-token
# Shows how to use curl with Bearer token
```

### `npm run auth:devtools`
Launches React DevTools for token extraction:
```bash
npm run auth:devtools
# Opens standalone React DevTools window
```

---

## Testing Workflow

### 1. Verify Protection is Working
```bash
# Test multiple endpoints without authentication
curl http://localhost:3000/courses        # Should return 401
curl http://localhost:3000/users/me       # Should return 401
curl http://localhost:3000/assignments    # Should return 401
```

### 2. Obtain a Valid JWT Token
See [Extracting JWT Tokens](#extracting-jwt-tokens) section for methods.

### 3. Test with Authentication
```bash
# Set the token
TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6..."

# Test protected endpoints
curl http://localhost:3000/courses \
  -H "Authorization: Bearer $TOKEN" \
  | jq .

curl http://localhost:3000/users/me \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

### 4. Verify Token Contents
```bash
# Decode JWT payload (base64)
echo $TOKEN | cut -d. -f2 | base64 -d 2>/dev/null | jq .
```

---

## Extracting JWT Tokens

### Method 1: React DevTools (Recommended)

1. **Install and launch React DevTools**:
   ```bash
   npm run auth:devtools
   ```

2. **In the browser**:
   - Login to your app at http://localhost:3001
   - Open React DevTools window

3. **Extract token**:
   - In Components tab, find and select `Auth0Provider`
   - In console, run:
   ```javascript
   $r.props.children.props.value.getAccessTokenSilently().then(token => {
     console.log('Token:', token);
     copy(token);
     console.log('✅ Token copied to clipboard!');
   });
   ```

### Method 2: Network Interception

Run this in browser console after logging in:
```javascript
// Capture token from next API call
(function captureToken() {
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args).then(response => {
      const authHeader = args[1]?.headers?.['Authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        console.log('🎯 Token captured!');
        copy(token);
        console.log('✅ Copied to clipboard!');
        window.fetch = originalFetch; // Restore original
      }
      return response;
    });
  };
  console.log('Token capture enabled. Navigate to trigger an API call...');
})();
```

Then navigate to any page that fetches data (e.g., /courses).

### Method 3: Browser Storage

Check if token is stored in localStorage or sessionStorage:
```javascript
// In browser console
Object.keys(localStorage).filter(k => k.includes('auth0')).forEach(key => {
  console.log(key, localStorage[key]);
});
```

---

## API Testing

### Test Individual Endpoints

```bash
# Set your token
TOKEN="your_jwt_token_here"

# Courses endpoint
curl -X GET http://localhost:3000/courses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

# User profile
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

# Assignments
curl -X GET http://localhost:3000/assignments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
```

### Test Error Scenarios

```bash
# Test with invalid token
curl -X GET http://localhost:3000/courses \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized

# Test with malformed header
curl -X GET http://localhost:3000/courses \
  -H "Authorization: invalid_format"
# Expected: 401 Unauthorized

# Test without header
curl -X GET http://localhost:3000/courses
# Expected: 401 Unauthorized
```

### Batch Testing Script

Create a test script for multiple endpoints:
```bash
#!/bin/bash
TOKEN="$1"

if [ -z "$TOKEN" ]; then
  echo "Usage: ./test-api.sh <token>"
  exit 1
fi

endpoints=("/courses" "/users/me" "/assignments" "/grades")

for endpoint in "${endpoints[@]}"; do
  echo "Testing $endpoint..."
  status=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $TOKEN" \
    "http://localhost:3000$endpoint")
  echo "  Status: $status"
done
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Cannot Extract Token from React DevTools
**Problem**: `$r` is undefined or Auth0Provider not found
**Solution**:
- Ensure you've selected the Auth0Provider component in React DevTools
- Make sure you're logged in first
- Try Method 2 (Network Interception) instead

#### 2. Token Returns 401 Even When Valid
**Problem**: Valid-looking token still returns unauthorized
**Solution**:
- Check token hasn't expired (decode and check `exp` field)
- Verify audience matches: `http://localhost:3000/`
- Ensure backend is using correct Auth0 domain

#### 3. CORS Errors
**Problem**: Browser blocks requests with CORS errors
**Solution**:
- Use curl for testing instead of browser fetch
- Verify backend CORS configuration includes frontend URL

#### 4. Auth0 Login Redirect Issues
**Problem**: After login, redirect fails or shows error
**Solution**:
- Verify callback URL in Auth0 dashboard: `http://localhost:3001/home`
- Check Allowed Web Origins includes: `http://localhost:3001`

### Debug Commands

```bash
# Check if servers are running
lsof -i :3000  # Backend
lsof -i :3001  # Frontend

# View server logs
npm run dev

# Test backend health
curl http://localhost:3000/
# Expected: "Hello World!"

# Check Auth0 configuration
curl https://dev-3ak1hbs2abxn01ak.us.auth0.com/.well-known/openid-configuration
```

---

## Advanced Testing

### Machine-to-Machine Testing

For automated testing without browser interaction:

1. **Create M2M Application in Auth0**:
   - Type: Machine to Machine
   - Authorize for your API
   - Note Client ID and Secret

2. **Get Token via Client Credentials**:
   ```bash
   curl --request POST \
     --url https://dev-3ak1hbs2abxn01ak.us.auth0.com/oauth/token \
     --header 'content-type: application/json' \
     --data '{
       "client_id":"YOUR_M2M_CLIENT_ID",
       "client_secret":"YOUR_M2M_CLIENT_SECRET",
       "audience":"http://localhost:3000/",
       "grant_type":"client_credentials"
     }'
   ```

3. **Use in automated tests**:
   ```javascript
   // In test files
   const token = await getM2MToken();
   const response = await fetch('/api/courses', {
     headers: { 'Authorization': `Bearer ${token}` }
   });
   ```

### Load Testing with Authentication

```bash
# Using Apache Bench with auth header
ab -n 100 -c 10 \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/courses
```

---

## Security Best Practices

### Token Handling
- ✅ Never commit tokens to version control
- ✅ Tokens expire - check `exp` claim
- ✅ Use environment variables for sensitive data
- ✅ Clear tokens on logout

### Testing Guidelines
- ✅ Test both positive and negative cases
- ✅ Verify all endpoints are protected
- ✅ Test token expiration handling
- ✅ Ensure proper CORS configuration

---

## Quick Reference

### Essential Commands
```bash
# Start servers
npm run dev

# Test protection
npm run auth:test

# Launch DevTools
npm run auth:devtools

# Test with token
TOKEN="..." curl http://localhost:3000/courses -H "Authorization: Bearer $TOKEN"

# Decode token
echo $TOKEN | cut -d. -f2 | base64 -d | jq .
```

### Environment Variables
```env
# Backend (.env)
AUTH0_ISSUER_URL=https://dev-3ak1hbs2abxn01ak.us.auth0.com/
AUTH0_AUDIENCE=http://localhost:3000/

# Frontend (.env)
VITE_AUTH0_DOMAIN=dev-3ak1hbs2abxn01ak.us.auth0.com
VITE_AUTH0_CLIENT_ID=8pbkxiocSD11OPaDuuuoqg1xRGXqeeZC
VITE_AUTH0_AUDIENCE=http://localhost:3000/
```

---

## Related Documentation

- [Authentication README](./README.md) - Overview and architecture
- [Current State](./CURRENT_STATE.md) - Implementation status
- [Session Checkpoints](./sessions/) - Development history
- [Auth0 Configuration](./AUTH0_CONFIGURATION.md) - Dashboard setup