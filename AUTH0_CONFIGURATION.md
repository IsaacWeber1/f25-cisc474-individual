# Auth0 Configuration Reference

## Development URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend | http://localhost:3000 |

## Production URLs

| Service | URL | Platform |
|---------|-----|----------|
| Frontend (Primary) | https://f25-cisc474-individual-web-henna.vercel.app | Vercel |
| Frontend (Alt) | https://tanstack-start-app.isaacgweber.workers.dev | Cloudflare Workers |
| Backend | https://f25-cisc474-individual-n1wv.onrender.com | Render |

---

## Auth0 Application Settings

### SPA Application Configuration

**Client ID**: `8pbkxiocSD11OPaDuuuoqg1xRGXqeeZC`
**Domain**: `dev-3ak1hbs2abxn01ak.us.auth0.com`

#### Allowed Callback URLs
```
http://localhost:3001/home,
http://localhost:3001,
https://f25-cisc474-individual-web-henna.vercel.app/home,
https://f25-cisc474-individual-web-henna.vercel.app,
https://tanstack-start-app.isaacgweber.workers.dev/home,
https://tanstack-start-app.isaacgweber.workers.dev
```

#### Allowed Logout URLs
```
http://localhost:3001,
https://f25-cisc474-individual-web-henna.vercel.app,
https://tanstack-start-app.isaacgweber.workers.dev
```

#### Allowed Web Origins
```
http://localhost:3001,
https://f25-cisc474-individual-web-henna.vercel.app,
https://tanstack-start-app.isaacgweber.workers.dev
```

---

## Environment Variables

### Local Development

**Root `.env`:**
```bash
DATABASE_URL="postgres://postgres.<project-ref>:<password>@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgres://postgres.<project-ref>:<password>@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
AUTH0_ISSUER_URL=https://dev-3ak1hbs2abxn01ak.us.auth0.com/
AUTH0_AUDIENCE=http://localhost:3000
```

**`apps/api/.env`:**
```bash
AUTH0_ISSUER_URL=https://dev-3ak1hbs2abxn01ak.us.auth0.com/
AUTH0_AUDIENCE=http://localhost:3000
```

**`apps/web-start/.env`:**
```bash
VITE_BACKEND_URL=http://localhost:3000
VITE_AUTH0_DOMAIN=dev-3ak1hbs2abxn01ak.us.auth0.com
VITE_AUTH0_CLIENT_ID=8pbkxiocSD11OPaDuuuoqg1xRGXqeeZC
VITE_AUTH0_AUDIENCE=http://localhost:3000
```

### Production - Vercel (Frontend)

Set these in Vercel dashboard → Project Settings → Environment Variables:

```bash
VITE_AUTH0_DOMAIN=dev-3ak1hbs2abxn01ak.us.auth0.com
VITE_AUTH0_CLIENT_ID=8pbkxiocSD11OPaDuuuoqg1xRGXqeeZC
VITE_AUTH0_AUDIENCE=https://f25-cisc474-individual-n1wv.onrender.com
VITE_BACKEND_URL=https://f25-cisc474-individual-n1wv.onrender.com
```

### Production - Cloudflare Workers (Frontend)

Set these in Cloudflare dashboard → Workers → Settings → Variables:

```bash
VITE_AUTH0_DOMAIN=dev-3ak1hbs2abxn01ak.us.auth0.com
VITE_AUTH0_CLIENT_ID=8pbkxiocSD11OPaDuuuoqg1xRGXqeeZC
VITE_AUTH0_AUDIENCE=https://f25-cisc474-individual-n1wv.onrender.com
VITE_BACKEND_URL=https://f25-cisc474-individual-n1wv.onrender.com
```

### Production - Render (Backend)

Set these in Render dashboard → Service → Environment:

```bash
AUTH0_ISSUER_URL=https://dev-3ak1hbs2abxn01ak.us.auth0.com/
AUTH0_AUDIENCE=https://f25-cisc474-individual-n1wv.onrender.com
DATABASE_URL=<your supabase pooled connection string>
DIRECT_URL=<your supabase direct connection string>
PORT=3000
```

---

## Auth0 API Configuration

### Production API Setup (Recommended)

**Option 1: Single API for All Environments**
- API Name: `F25 CISC474 Individual API`
- Identifier: `https://f25-cisc474-individual-n1wv.onrender.com`
- Signing Algorithm: RS256

Update local development to use production API identifier:
```bash
# All .env files
AUTH0_AUDIENCE=https://f25-cisc474-individual-n1wv.onrender.com
VITE_AUTH0_AUDIENCE=https://f25-cisc474-individual-n1wv.onrender.com
```

**Option 2: Separate APIs (More Complex)**
- Dev API Identifier: `http://localhost:3000`
- Prod API Identifier: `https://f25-cisc474-individual-n1wv.onrender.com`

---

## Testing Checklist

### Local Development
- [ ] Can login at http://localhost:3001
- [ ] Can logout successfully
- [ ] Can access /courses after login
- [ ] JWT token visible in Network tab
- [ ] Backend returns 401 without auth

### Production (Vercel)
- [ ] Can login at Vercel URL
- [ ] Can logout successfully
- [ ] Can access protected routes
- [ ] CORS configured correctly
- [ ] Auth0 callbacks working

### Production (Cloudflare)
- [ ] Can login at Workers URL
- [ ] Can logout successfully
- [ ] Can access protected routes
- [ ] CORS configured correctly
- [ ] Auth0 callbacks working

---

## Common Issues

### Issue: "Callback URL mismatch"
**Solution**: Ensure the callback URL in Auth0 exactly matches the URL in the browser (including /home path)

### Issue: "Logout error - misconfiguration"
**Solution**: Add logout URL to "Allowed Logout URLs" in Auth0 SPA settings

### Issue: "CORS error in production"
**Solution**: Ensure production frontend URL is in backend's CORS allowed origins (apps/api/src/main.ts)

### Issue: "401 Unauthorized in production"
**Solution**: Check that AUTH0_AUDIENCE matches between frontend, backend, and Auth0 API identifier

---

**Last Updated**: 2025-10-24
**Auth0 Tenant**: dev-3ak1hbs2abxn01ak.us.auth0.com
