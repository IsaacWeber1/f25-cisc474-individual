# Manual Browser Testing Checklist

**Date**: 2025-10-23
**Session**: 008 - Manual Browser Testing & Validation

## Pre-Testing Verification

- [x] Frontend running at http://localhost:3001
- [x] Backend API running at http://localhost:3000
- [x] Backend returns 401 for protected endpoints

## Browser Testing Steps

### 1. Initial Load & Login Flow

- [ ] Navigate to http://localhost:3001
- [ ] Verify page loads without errors
- [ ] Check browser console for any errors (F12 → Console tab)
- [ ] Locate "Log In" button on the page
- [ ] Click "Log In" button
- [ ] **Expected**: Redirect to Auth0 login page (dev-3ak1hbs2abxn01ak.us.auth0.com)

### 2. Auth0 Login Process

- [ ] On Auth0 page, check URL starts with `https://dev-3ak1hbs2abxn01ak.us.auth0.com`
- [ ] Enter test credentials or click "Sign up" to create new account
- [ ] Complete login/signup process
- [ ] **Expected**: Redirect back to http://localhost:3001/home

### 3. Post-Login Validation

- [ ] Verify successful redirect to /home route
- [ ] Check browser console for any errors
- [ ] Open DevTools Network tab (F12 → Network)
- [ ] Navigate to /courses
- [ ] **Expected**: Network tab shows API requests with Authorization headers

### 4. API Request Verification

In DevTools Network tab:
- [ ] Find request to http://localhost:3000/courses
- [ ] Click on the request
- [ ] Go to Headers tab
- [ ] **Verify**: Authorization header present with "Bearer [JWT_TOKEN]"
- [ ] **Verify**: Response status is 200 (not 401)
- [ ] **Verify**: Response contains course data

### 5. Protected Route Navigation

Test these routes and verify they load data:
- [ ] /courses - Should display course list
- [ ] /users - Should display user information
- [ ] /api-demo - Should successfully call API
- [ ] Click on a specific course to test /course/{id} routes

### 6. User Profile Verification

- [ ] Navigate to /profile
- [ ] **Verify**: User information displayed
- [ ] **Verify**: Auth0 user ID visible
- [ ] **Verify**: Email address correct

### 7. Logout Flow

- [ ] Locate "Log Out" button
- [ ] Click "Log Out"
- [ ] **Expected**: Redirect to login page or home
- [ ] Try navigating to /courses
- [ ] **Expected**: Should redirect to login or show no data

### 8. Re-authentication Test

- [ ] Click "Log In" again
- [ ] **Expected**: May auto-login if session active, or show Auth0 page
- [ ] Complete login if needed
- [ ] Verify /courses loads data again

## Issues to Document

If any of these occur, note them:
- [ ] Infinite redirect loops
- [ ] CORS errors in console
- [ ] 401 errors after login
- [ ] Missing Authorization headers
- [ ] Blank pages or loading spinners that don't resolve
- [ ] Network errors or failed API calls

## Browser Console Commands

Run these in browser console (F12) after login to verify Auth0 state:

```javascript
// Check if Auth0 is initialized
console.log('Auth0 loaded:', typeof window.Auth0 !== 'undefined');

// Check localStorage for Auth0 tokens (may be in memory instead)
console.log('LocalStorage keys:', Object.keys(localStorage));

// Check sessionStorage
console.log('SessionStorage keys:', Object.keys(sessionStorage));
```

## Network Tab Checklist

For API calls in Network tab, verify:
- [ ] Request URL: http://localhost:3000/[endpoint]
- [ ] Request Method: GET/POST/etc.
- [ ] Status Code: 200 (not 401)
- [ ] Request Headers includes: `Authorization: Bearer [token]`
- [ ] Response contains expected data

## Test Results

### Working Features
- List all features that work correctly

### Issues Found
- Document any issues with steps to reproduce

### Screenshots
- Take screenshots of:
  1. Auth0 login page
  2. Successful /home redirect
  3. Network tab showing JWT token
  4. Any errors encountered

## Final Validation

- [ ] Full OAuth flow completes successfully
- [ ] API calls include JWT tokens
- [ ] Protected routes return data when authenticated
- [ ] Logout properly clears authentication
- [ ] No console errors during normal operation

---

**Testing Performed By**: [Your Name]
**Testing Date**: 2025-10-23
**Testing Duration**: ~15 minutes
**Overall Status**: [ ] Pass / [ ] Pass with Issues / [ ] Fail