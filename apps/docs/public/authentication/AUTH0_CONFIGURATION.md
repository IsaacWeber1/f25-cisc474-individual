# Auth0 Configuration Guide

## Required Auth0 Applications

You need TWO applications in Auth0:

### 1. API Application (Backend)
- **Type**: API
- **Name**: F25 CISC474 [YourName] Individual API
- **Identifier**: `http://localhost:3000` (must match `AUTH0_AUDIENCE` - NO trailing slash)
- **Signing Algorithm**: RS256

### 2. SPA Application (Frontend)
- **Type**: Single Page Application
- **Name**: F25 CISC474 [YourName] Individual SPA

## SPA Application Settings

### Allowed Callback URLs
Add ALL of these (comma-separated):
```
http://localhost:3001/home,
http://localhost:3001/,
https://your-production-domain.workers.dev/home,
https://your-production-domain.vercel.app/home
```

### Allowed Logout URLs
Add ALL of these (comma-separated):
```
http://localhost:3001,
https://your-production-domain.workers.dev,
https://your-production-domain.vercel.app
```

### Allowed Web Origins
Add ALL of these (comma-separated):
```
http://localhost:3001,
https://your-production-domain.workers.dev,
https://your-production-domain.vercel.app
```

### Refresh Token Rotation
- **Rotation**: Enabled
- **Reuse Interval**: 0

## Environment Variables

### Backend (.env)
```env
AUTH0_ISSUER_URL=https://dev-3ak1hbs2abxn01ak.us.auth0.com/
AUTH0_AUDIENCE=http://localhost:3000
```

### Frontend (.env)
```env
VITE_AUTH0_DOMAIN=dev-3ak1hbs2abxn01ak.us.auth0.com
VITE_AUTH0_CLIENT_ID=8pbkxiocSD11OPaDuuuoqg1xRGXqeeZC
VITE_AUTH0_AUDIENCE=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3000
```

## Common Issues

### Callback URL Mismatch Error
**Error**: "The provided redirect_uri is not in the list of allowed callback URLs"

**Solution**:
1. Check that `http://localhost:3001/home` is in Allowed Callback URLs
2. Ensure no trailing slashes or typos
3. Save changes in Auth0 dashboard

### CORS Issues
**Error**: "CORS policy: No 'Access-Control-Allow-Origin'"

**Solution**:
1. Verify Allowed Web Origins includes your frontend URL
2. Check backend CORS configuration allows frontend origin

### Token Validation Errors
**Error**: "Unauthorized" on all API calls

**Solution**:
1. Verify `AUTH0_AUDIENCE` matches between frontend and backend
2. Ensure `AUTH0_ISSUER_URL` has trailing slash
3. Check JWT token is being sent in Authorization header

## Testing Authentication Flow

### 1. Manual Browser Test
1. Navigate to http://localhost:3001
2. Click "Log In" button
3. Login via Auth0
4. Should redirect to http://localhost:3001/home
5. Open Network tab - API calls should have Authorization header

### 2. Check Token in Browser Console
```javascript
// After logging in, run in browser console:
const auth0 = window.$AUTH0;
const token = await auth0.getAccessTokenSilently();
console.log('Token:', token);
```

### 3. Test Protected API with Token
```bash
# Get token from browser console, then:
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Production Deployment

When deploying to production, update:

1. **Auth0 Dashboard** - Add production URLs to all fields
2. **Backend Environment** (Render):
   - `AUTH0_ISSUER_URL`
   - `AUTH0_AUDIENCE`
   - `ALLOWED_ORIGINS` (include production frontend URL)

3. **Frontend Environment** (Vercel/Cloudflare):
   - `VITE_AUTH0_DOMAIN`
   - `VITE_AUTH0_CLIENT_ID`
   - `VITE_AUTH0_AUDIENCE`
   - `VITE_BACKEND_URL` (production backend URL)

## Troubleshooting Steps

1. **Check Auth0 Application Type** - Must be "Single Page Application"
2. **Verify All URLs** - No typos, correct protocols (http/https)
3. **Clear Browser Cache** - Auth0 settings are cached
4. **Check Browser Console** - Look for specific error messages
5. **Verify Environment Variables** - All required vars are set
6. **Test with Auth0 Debugger** - https://jwt.io to decode tokens

## Security Checklist

- [ ] Different Auth0 applications for dev/staging/prod
- [ ] Rotate client secrets regularly
- [ ] Use HTTPS in production
- [ ] Enable refresh token rotation
- [ ] Set appropriate token expiration times
- [ ] Implement proper logout (clear tokens)
- [ ] Never commit Auth0 credentials to git