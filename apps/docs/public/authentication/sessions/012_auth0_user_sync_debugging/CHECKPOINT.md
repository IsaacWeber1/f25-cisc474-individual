# Checkpoint 012: Auth0 User Sync Debugging

**Date**: 2025-10-24
**Duration**: ~2 hours
**Starting State**: Auth0 authentication returns 500 error on `/users/me` endpoint
**Ending State**: 🚧 **In Progress** - Root causes identified, fixes implemented, final Prisma error still being debugged

---

## Problem Statement

After implementing Auth0 authentication, users could log in successfully through Auth0, but the application returned a 500 Internal Server Error when trying to sync the authenticated user to the database via the `/users/me` endpoint. The frontend showed:

```
[authFetcher] 500 error for http://localhost:3000/users/me
{"statusCode":500,"message":"Internal server error"}
```

## Root Causes Identified

### 1. **Seeded Users Missing Auth0 IDs**
The database seed script (`packages/database/src/seed.ts`) created users without `auth0Id` values:
```typescript
prisma.user.create({
  name: "John Student",
  email: "john.student@example.edu",
  // ❌ NO auth0Id field
})
```

When John logged in via Auth0, the backend couldn't find him by `auth0Id`, leading to an attempted duplicate email creation.

### 2. **Missing Email Lookup Fallback**
The original `syncAuth0User` function only looked up users by `auth0Id`. For seeded users (who had `null` auth0Id), this failed, causing the function to try creating a new user with an email that already existed → unique constraint violation.

### 3. **Access Tokens Don't Contain User Profile Claims**
**Key Learning**: Auth0 access tokens (JWTs) do NOT include user profile information (email, name) by default. These claims are only in the **ID token**.

- The JWT strategy was extracting `payload.email` and `payload.name`, but these were `undefined` in access tokens
- The frontend's `useAuth0()` hook provides the `user` object from the **ID token**
- We needed to pass email/name from the frontend's ID token data to the backend as query parameters

### 4. **Timing Issue - User Object Loading**
The `useAuth0()` hook's `user` object is initially `undefined` while Auth0 is loading. The frontend was trying to fetch `/users/me` before the user object was ready, leading to:
```javascript
[AuthContext] Auth0 user object: undefined // ❌ Too early!
```

### 5. **Prisma Update Error (Current Issue)**
After fixing the above issues, we're now encountering:
```
PrismaClientKnownRequestError: Invalid `this.prisma.user.update()` invocation
```

The user is being found successfully, but the update operation is failing. The full error details are being cut off in logs.

---

## Solutions Implemented

### Fix 1: Add Email-Based User Lookup

**File**: `apps/api/src/users/users.service.ts:47-105`

Added fallback logic to find users by email if not found by auth0Id:

```typescript
if (user) {
  // Found by auth0Id - update if needed
} else {
  // Not found by auth0Id, try email (for seeded users)
  user = await this.prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    // Found by email - update with auth0Id
    user = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        auth0Id,
        name,
        emailVerified: new Date(),
      },
    });
  } else {
    // Create new user
  }
}
```

### Fix 2: Pass User Profile from Frontend to Backend

**File**: `apps/web-start/src/contexts/AuthContext.tsx:17-46`

Modified to extract email/name from Auth0's `user` object (ID token) and pass as query parameters:

```typescript
const { isAuthenticated, isLoading: auth0Loading, user } = useAuth0();

useQuery({
  queryKey: ['currentUser', user?.sub],
  queryFn: () => {
    const params = new URLSearchParams();
    if (user?.email) params.append('email', user.email);
    if (user?.name) params.append('name', user.name);
    return authFetch<User>(`/users/me?${params.toString()}`);
  },
  enabled: !auth0Loading && isAuthenticated && !!user, // ✅ Wait for user object
  retry: false,
});
```

### Fix 3: Accept Query Parameters in Backend Controller

**File**: `apps/api/src/users/users.controller.ts:10-31`

```typescript
async getProfile(
  @CurrentUser() user: any,
  @Query('email') emailParam?: string,
  @Query('name') nameParam?: string,
) {
  const userWithProfile = {
    ...user,
    email: user.email || emailParam,  // Fallback to query param
    name: user.name || nameParam,      // Fallback to query param
  };

  return this.usersService.syncAuth0User(userWithProfile);
}
```

### Fix 4: Wait for Auth0 to Load Before Fetching

Updated the `enabled` condition in the query to wait for:
1. Auth0 to finish loading (`!auth0Loading`)
2. User to be authenticated (`isAuthenticated`)
3. User object to exist (`!!user`)

### Fix 5: Added Comprehensive Logging

Added debug logging throughout the flow:
- `[AuthContext]` - Frontend Auth0 state
- `[UsersController]` - Backend controller inputs
- `[syncAuth0User]` - User sync logic flow

---

## Files Changed

| File | Changes | Lines Modified |
|------|---------|---------------|
| `apps/api/src/users/users.service.ts` | Added email lookup fallback, extensive logging | 50+ lines |
| `apps/api/src/users/users.controller.ts` | Accept email/name query params, add logging | 15 lines |
| `apps/web-start/src/contexts/AuthContext.tsx` | Extract user from ID token, pass as query params | 25 lines |
| `apps/web-start/src/integrations/authFetcher.ts` | Added audience/scope to `getAccessTokenSilently()` | 6 lines |

---

## Testing Performed

✅ Auth0 login flow completes successfully
✅ User object loads from Auth0 ID token with correct data:
```javascript
{
  nickname: 'john.student',
  name: 'John Student',
  email: 'john.student@example.edu',
  sub: 'auth0|68fb92fbc2b2a8f01761465b'
}
```
✅ Query parameters correctly sent to backend:
```
/users/me?email=john.student%40example.edu&name=John+Student
```
✅ Backend finds user by auth0Id
✅ Backend detects email/name need updating
❌ Prisma update operation fails with "Invalid invocation" error

---

## Current System State

### What's Working
1. Auth0 login/logout flows
2. JWT validation and route protection
3. Frontend Auth0 integration with proper scope (`openid profile email`)
4. User object extraction from ID token
5. Query parameter passing to backend
6. User lookup by auth0Id

### What's Not Working
1. **Prisma user update operation** - Failing with incomplete error message
2. User sync completing successfully

### Active Debugging
The Prisma error is being investigated with enhanced logging to capture:
- Exact values being passed to `prisma.user.update()`
- Full error details from Prisma
- Database state of the user being updated

---

## Key Learnings

### Auth0 Token Architecture
- **ID Token**: Contains user profile claims (email, name, picture, etc.)
  - Available via `useAuth0()` hook's `user` object in frontend
  - Used for authentication and user identity
- **Access Token**: Contains only authorization info (sub, scope, permissions)
  - Used for API access
  - Does NOT contain email/name by default
  - Can have custom claims added via Auth0 Actions

### Auth0 React SDK Behavior
- `useAuth0()` hook provides `isLoading` flag
- `user` object is `undefined` until Auth0 finishes loading
- Must check `!isLoading && !!user` before using user data
- `getAccessTokenSilently()` needs explicit `authorizationParams` to work correctly

### Prisma User Sync Pattern
For applications with both seeded users and Auth0 users:
1. Try finding by `auth0Id` first (fast path for returning users)
2. Fall back to finding by `email` (catches seeded users)
3. Update seeded user with `auth0Id` on first login
4. Create new user only if not found by either method

---

## Known Issues / Limitations

### 1. Prisma Update Failing (Critical - Blocks Login)
**Status**: 🔴 Active Investigation
**Error**: `PrismaClientKnownRequestError: Invalid invocation`
**Location**: `apps/api/src/users/users.service.ts:47`
**Impact**: Users cannot complete login flow
**Next Steps**:
- Check full Prisma error details in logs
- Verify data types match schema
- Check for database constraints
- Investigate if `email` update is causing unique constraint issue

### 2. Password Reset for Seeded Users
**Status**: 🟡 Documented, Not Urgent
Test user creation scripts exist but need debugging:
- `scripts/create-users-mgmt-api.sh`
- `scripts/reset-user-passwords.sh`

### 3. Hardcoded User ID in Assignments POST
**Status**: 🟡 Known Technical Debt
**Location**: `apps/api/src/assignments/assignments.controller.ts:57`
**Impact**: All assignments created by same user
**Fix**: Use `@CurrentUser()` decorator instead of hardcoded ID

---

## Session Handoff

### What's Working
- ✅ Complete Auth0 authentication flow
- ✅ Frontend/backend integration
- ✅ User data extraction from ID token
- ✅ Database lookup logic

### What's Blocked
- ❌ User sync completing (Prisma update error)
- ❌ Login completing successfully

### Next Session Should
1. **Investigate Prisma Error** (Priority 1)
   - Check backend logs for full error with new logging
   - Verify email/name values being passed
   - Check if unique constraint violation on email update
   - Consider if update is even needed (maybe user already has correct email/name?)

2. **Possible Solutions to Try**
   - Skip update if email/name already match (optimization)
   - Use `upsert` instead of separate find + update
   - Check for race conditions (multiple simultaneous logins)
   - Verify Prisma client is regenerated after schema changes

3. **Remove Debug Logging** (After Fix)
   - Clean up console.log statements from:
     - `AuthContext.tsx`
     - `users.controller.ts`
     - `users.service.ts`
     - `authFetcher.ts`

4. **Documentation Updates**
   - Update `CURRENT_STATE.md` with final resolution
   - Update `AUTH0_CONFIGURATION.md` with ID token vs access token guidance
   - Create troubleshooting guide for common Auth0 issues

---

## Research Conducted

### Auth0 Documentation
- ID tokens vs access tokens architecture
- OpenID Connect (OIDC) scopes (`openid`, `profile`, `email`)
- Custom claims in access tokens via Auth0 Actions
- React SDK `useAuth0` hook behavior

### Community Issues
- Common problem: User object missing email/name properties
- Solution: Ensure `scope: 'openid profile email'` in Auth0Provider
- Timing issue: User object loads asynchronously

### Best Practices Identified
- Always check `isLoading` before using `user` object
- Pass `authorizationParams` to `getAccessTokenSilently()`
- Use ID token for user identity, access token for API authorization
- Implement email-based fallback for hybrid auth scenarios (seeded + OAuth users)

---

**Status**: 🚧 **In Progress** - Prisma update error needs resolution before login flow can complete

**Estimated Time to Resolution**: 30-60 minutes
**Blockers**: Need full Prisma error details from enhanced logging
