# 🚨 URGENT: Auth0 Dashboard Configuration Fix

## Current Issue
You're getting the error: **"Service not found: http://localhost:3000"**

This means Auth0's dashboard is looking for an API with identifier `http://localhost:3000` but your API is registered with `http://localhost:3000/` (with trailing slash).

## Two Solutions Available

### Solution A: Fix Auth0 Dashboard (Recommended) ✅

#### Step 1: Login to Auth0
- Go to: https://manage.auth0.com
- Login with your credentials

#### Step 2: Navigate to APIs
- Left sidebar: **Applications** → **APIs**
- You'll see your existing API with identifier `http://localhost:3000/`

#### Step 3: Create NEW API (Can't edit existing)
⚠️ **Auth0 doesn't allow editing API identifiers!**

1. Click **"+ Create API"**
2. Fill in:
   - **Name**: `F25 CISC474 Individual API v2`
   - **Identifier**: `http://localhost:3000` (NO TRAILING SLASH!)
   - **Signing Algorithm**: `RS256`
3. Click **Create**

#### Step 4: Update SPA Application Settings
1. Go to **Applications** → **Applications**
2. Find your SPA: "F25 CISC474 [YourName] Individual SPA"
3. Go to **Settings** tab
4. Scroll to **Application Properties**
5. Ensure these URLs are set:

**Allowed Callback URLs**:
```
http://localhost:3001/home,
http://localhost:3001/
```

**Allowed Logout URLs**:
```
http://localhost:3001
```

**Allowed Web Origins**:
```
http://localhost:3001
```

#### Step 5: Delete Old API (Optional)
- Once new API works, delete the old one with trailing slash

---

### Solution B: Update Local Files to Match Auth0 🔄

If you can't change Auth0, update your local config:

#### 1. Update Root .env
```bash
AUTH0_AUDIENCE=http://localhost:3000/
```

#### 2. Update Frontend .env
```bash
VITE_AUTH0_AUDIENCE=http://localhost:3000/
```

#### 3. Restart Both Servers
```bash
# Kill current servers (Ctrl+C) then:
cd apps/api && npm run dev
cd apps/web-start && npm run dev
```

---

## Additional Issues to Check

### 1. Empty User Data Issue
The page shows "Welcome, !" with no name/email. Check:

#### In Auth0 Dashboard:
1. **Applications** → Your SPA → **Settings**
2. Scroll to **Advanced Settings** → **OAuth**
3. Ensure **OIDC Conformant** is enabled
4. Check **Scopes**: Should include `openid profile email`

#### In Your Code:
Check `apps/web-start/src/contexts/AuthContext.tsx`:
```tsx
// Should request these scopes
authorizationParams={{
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  redirect_uri: `${window.location.origin}/home`,
  scope: 'openid profile email'  // ← Ensure this line exists
}}
```

### 2. Test User Creation
If you haven't created a test user:
1. **Auth0 Dashboard** → **User Management** → **Users**
2. Click **+ Create User**
3. Email: `test@example.com`
4. Password: `TestPassword123!`
5. Connection: `Username-Password-Authentication`

---

## Quick Test After Fix

### Test Command (After Updating):
```bash
# Test if API is now protected correctly
curl -v http://localhost:3000/users

# Should return: 401 Unauthorized
```

### Browser Test:
1. Clear browser cookies/cache (important!)
2. Visit: http://localhost:3001
3. Click **Login**
4. Should redirect to Auth0 without error
5. Login with test credentials
6. Should redirect to `/home` with user info displayed

---

## Current Status Check

### What's Working ✅
- Frontend server running on :3001
- Backend API running on :3000
- All API endpoints protected (401 without auth)
- Login/Logout buttons visible
- Route guards implemented

### What's Broken ❌
- Auth0 API identifier mismatch
- User data not displaying (empty name/email)
- Authentication flow interrupted by "Service not found" error

---

## If Still Having Issues

### Debug Information Needed:
1. Check browser console (F12) for errors
2. Check Network tab for failed requests
3. Look for any 400/401/403 responses

### Common Fixes:
1. **Clear all browser data** for localhost:3001
2. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Try incognito/private window**
4. **Verify Auth0 tenant region** (should match your location)

---

## Final Checklist

After fixing, verify:
- [ ] Auth0 API identifier is `http://localhost:3000` (no slash)
- [ ] Local .env files match Auth0 configuration
- [ ] Both servers restarted after changes
- [ ] Browser cache cleared
- [ ] Login flow completes without errors
- [ ] User data displays on /home page
- [ ] API calls include JWT token (check Network tab)

---

**Remember**: The key issue is the API identifier mismatch between Auth0 dashboard and your local configuration. They must match EXACTLY!