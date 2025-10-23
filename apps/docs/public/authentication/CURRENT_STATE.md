# Current State - Auth0 Authentication Implementation

**Last Updated**: 2025-10-23 (Session 001 - Planning)

---

## 🟡 NEXT SESSION START HERE

**Current Phase**: Planning complete, ready to implement

### What You Need to Know

1. **Assignment Requirements**:
   - Add Auth0 authentication using Passport.js in NestJS
   - Protect ALL backend endpoints from unauthenticated users
   - Integrate Auth0 React SDK in frontend
   - Demo working authentication on Friday in class

2. **What's Actually Done**:
   - ✅ Planning documentation complete
   - ✅ Implementation guide written (see `planning/planning.md`)
   - ✅ Current system analysis complete
   - ❌ No Auth0 applications created yet
   - ❌ No packages installed yet
   - ❌ No code written yet

3. **What to Implement Next**:
   - Auth0 API application (for backend)
   - Auth0 SPA application (for frontend)
   - Backend: Passport.js JWT strategy
   - Frontend: Auth0Provider wrapper
   - User sync to database

### Where to Start

**Read**: [`planning/planning.md`](./planning/planning.md) (15-20 min)

**Implement** (in order):
1. **Auth0 Setup** (30 min) - Create API + SPA applications
2. **Backend Implementation** (3-4 hours) - Passport.js, guards, strategies
3. **Frontend Implementation** (2-3 hours) - Auth0Provider, login/logout
4. **Database Sync** (1-2 hours) - User profile synchronization
5. **Testing** (1-2 hours) - Verify authentication flow
6. **Production Deployment** (1-2 hours) - Update environment variables

**Total Estimate**: 8-14 hours (2-3 days)

---

## What's Complete

### ✅ Planning & Documentation
- README.md with feature overview
- CURRENT_STATE.md (this file)
- planning/planning.md with step-by-step implementation
- Session 001 checkpoint created

**Location**: `apps/docs/public/authentication/`

### ✅ Existing System Analysis
**Current authentication**: Hardcoded user ID in `apps/web-start/src/config/constants.ts`
```typescript
export const CURRENT_USER_ID = 'cmfr0jb7n0004k07ai1j02p8z'; // Dr. Bart (PROFESSOR)
```

**Files using hardcoded auth**:
- `apps/web-start/src/contexts/AuthContext.tsx` - Returns hardcoded user ID
- `apps/api/src/assignments/assignments.service.ts` - Uses hardcoded ID for `createdBy`
- All backend endpoints currently unprotected (no guards)

**Database setup**:
- ✅ `User` model exists in Prisma schema
- ✅ Has `email`, `name`, `emailVerified` fields
- ⚠️ Missing `auth0Id` field (will need migration)

---

## What's Not Done

### ❌ Auth0 Applications (Must create first)

**API Application**:
- [ ] Create "API" application in Auth0 dashboard
- [ ] Set Identifier to backend URL (e.g., `https://your-app.onrender.com/`)
- [ ] Add permission scope (e.g., `read:courses`)
- [ ] Copy domain and audience for `.env`

**SPA Application**:
- [ ] Create "Single Page Application" in Auth0 dashboard
- [ ] Set Allowed Callback URLs:
  - `http://localhost:3001/home`
  - `https://your-production-frontend.vercel.app/home`
- [ ] Set Allowed Logout URLs (same as callbacks)
- [ ] Set Allowed Web Origins:
  - `http://localhost:3001`
  - `https://your-production-frontend.vercel.app`
- [ ] Copy Client ID, Domain for `.env`

### ❌ Backend Implementation

**Package Installation**:
```bash
cd apps/api
npm install @nestjs/jwt @nestjs/passport passport passport-auth0 passport-jwt jwks-rsa
npm install -D @types/passport-auth0 @types/passport-jwt
```

**Files to Create**:
- [ ] `apps/api/src/auth/auth.module.ts` - Auth module registration
- [ ] `apps/api/src/auth/auth.controller.ts` - Auth endpoints
- [ ] `apps/api/src/auth/auth.service.ts` - Auth business logic
- [ ] `apps/api/src/auth/jwt.strategy.ts` - JWT validation strategy
- [ ] `apps/api/src/auth/current-user.decorator.ts` - Extract user from request

**Files to Modify**:
- [ ] `apps/api/src/app.module.ts` - Import AuthModule
- [ ] `apps/api/src/users/users.controller.ts` - Add `/users/me` endpoint
- [ ] `apps/api/src/assignments/assignments.controller.ts` - Add `@UseGuards(AuthGuard('jwt'))`
- [ ] `apps/api/src/courses/courses.controller.ts` - Add guards
- [ ] `apps/api/src/grades/grades.controller.ts` - Add guards
- [ ] `apps/api/src/submissions/submissions.controller.ts` - Add guards
- [ ] All other controllers - Add guards to protected routes

**Environment Variables** (add to `.env`, `apps/api/.env`, Render):
```bash
AUTH0_ISSUER_URL=https://YOUR_TENANT.us.auth0.com/
AUTH0_AUDIENCE=https://your-app.onrender.com/
```

### ❌ Frontend Implementation

**Package Installation**:
```bash
cd apps/web-start
npm install @auth0/auth0-react
```

**Files to Create**:
- [ ] `apps/web-start/src/components/auth/LoginButton.tsx` - Login button component
- [ ] `apps/web-start/src/components/auth/LogoutButton.tsx` - Logout button component
- [ ] `apps/web-start/src/routes/home.tsx` - Post-login landing page

**Files to Modify**:
- [ ] `apps/web-start/src/router.tsx` - Wrap with `Auth0Provider`
- [ ] `apps/web-start/src/integrations/fetcher.ts` - Add JWT token to requests
- [ ] `apps/web-start/src/contexts/AuthContext.tsx` - Use Auth0 user instead of hardcoded
- [ ] `apps/web-start/src/routes/index.tsx` - Add login button

**Environment Variables** (add to `.env`, `apps/web-start/.env`, Vercel):
```bash
VITE_AUTH0_DOMAIN=YOUR_TENANT.us.auth0.com
VITE_AUTH0_CLIENT_ID=YOUR_CLIENT_ID
VITE_BACKEND_URL=http://localhost:3000
```

### ❌ Database Migration

**Schema Changes**:
```prisma
model User {
  id            String    @id @default(cuid())
  auth0Id       String?   @unique  // Add this field
  email         String    @unique
  name          String
  emailVerified DateTime?
  // ... existing fields
}
```

**Migration Commands**:
```bash
cd packages/database
npx prisma migrate dev --name add_auth0_id
npx prisma generate
```

### ❌ User Synchronization

**Create Service Method**:
- [ ] `apps/api/src/users/users.service.ts::syncAuth0User()`
  - Takes Auth0 user profile
  - Checks if user exists by `auth0Id`
  - Creates user if missing
  - Updates email/name if changed
  - Returns database user record

**Call from Auth Endpoint**:
- [ ] `apps/api/src/auth/auth.controller.ts::getProfile()`
  - Extract user from JWT
  - Call `syncAuth0User()`
  - Return synced user

### ❌ Testing

**Manual Testing Checklist**:
- [ ] Start dev servers (`npm run dev`)
- [ ] Navigate to `http://localhost:3001`
- [ ] Click login button → Redirected to Auth0
- [ ] Enter credentials → Redirected to `/home`
- [ ] See user profile on home page
- [ ] Navigate to `/courses` → Should load (authenticated)
- [ ] Check Network tab → Authorization header present
- [ ] Logout → Redirected to index page
- [ ] Try to access `/courses` → Should fail (401)

**Automated Testing**:
- [ ] Add auth tests in `apps/api/src/auth/auth.controller.spec.ts`
- [ ] Test JWT validation
- [ ] Test guard protection
- [ ] Test user sync

### ❌ Production Deployment

**Backend (Render.com)**:
- [ ] Add `AUTH0_ISSUER_URL` environment variable
- [ ] Add `AUTH0_AUDIENCE` environment variable
- [ ] Update Auth0 API application Identifier to production URL
- [ ] Deploy and test

**Frontend (Vercel/Cloudflare)**:
- [ ] Add `VITE_AUTH0_DOMAIN` environment variable
- [ ] Add `VITE_AUTH0_CLIENT_ID` environment variable
- [ ] Add `VITE_BACKEND_URL` (production backend URL)
- [ ] Update Auth0 SPA Allowed Callback URLs
- [ ] Update Auth0 SPA Allowed Logout URLs
- [ ] Update Auth0 SPA Allowed Web Origins
- [ ] Deploy and test

---

## Known Issues & Blockers

### 🟢 No Current Blockers

All dependencies are available, documentation is clear, and the implementation path is straightforward.

### ⚠️ Potential Issues

1. **Auth0 Environment Variable Precision**
   - URLs must match EXACTLY (trailing slashes matter)
   - Frontend-sent values must match backend configuration
   - **Mitigation**: Copy/paste from Auth0 dashboard, don't type manually

2. **CORS Configuration**
   - Production frontend domain must be in backend CORS origins
   - **Current**: `apps/api/src/main.ts` has CORS enabled
   - **Action**: Verify production frontend URL is allowed

3. **Callback URL Configuration**
   - Must include `/home` path in Auth0 SPA settings
   - Must include port for localhost (`http://localhost:3001/home`)
   - **Mitigation**: Add all variations (localhost + production)

4. **Database User Sync Timing**
   - Need to create user on first login
   - Need to update user on subsequent logins
   - **Mitigation**: Upsert pattern in `syncAuth0User()`

---

## Implementation Order (Critical Path)

Follow this exact order to avoid dependency issues:

1. **Auth0 Setup** (30 min)
   - Create API application
   - Create SPA application
   - Copy all credentials

2. **Backend Packages** (5 min)
   - Install all packages
   - Add environment variables

3. **Backend Auth Module** (2 hours)
   - Generate module/controller/service
   - Implement JWT strategy
   - Create current-user decorator

4. **Database Migration** (30 min)
   - Add `auth0Id` field
   - Run migration
   - Generate Prisma client

5. **Backend Guards** (1 hour)
   - Add guards to all controllers
   - Implement `/users/me` endpoint
   - Test with Postman/Insomnia

6. **Frontend Packages** (5 min)
   - Install @auth0/auth0-react
   - Add environment variables

7. **Frontend Auth Components** (2 hours)
   - Create LoginButton/LogoutButton
   - Wrap app with Auth0Provider
   - Create /home route
   - Update fetcher to send JWT

8. **Frontend Auth Context** (1 hour)
   - Remove hardcoded user ID
   - Use Auth0 user data
   - Update all components using AuthContext

9. **User Sync** (1 hour)
   - Implement `syncAuth0User()` service method
   - Call from `/users/me` endpoint
   - Test user creation

10. **End-to-End Testing** (1 hour)
    - Full login/logout flow
    - Protected routes
    - User data sync

11. **Production Deployment** (2 hours)
    - Update Auth0 applications
    - Deploy backend
    - Deploy frontend
    - Verify everything works

---

## Quick Reference

### File Locations

**Current System**:
- `apps/web-start/src/config/constants.ts:7` - Hardcoded `CURRENT_USER_ID`
- `apps/web-start/src/contexts/AuthContext.tsx` - Hardcoded user provider
- `apps/api/src/main.ts` - CORS configuration

**Will Create**:
- `apps/api/src/auth/*` - All auth module files
- `apps/web-start/src/components/auth/*` - Login/logout components
- `apps/web-start/src/routes/home.tsx` - Post-login page

### Commands

**Start Development**:
```bash
# From root
npm run dev

# Opens:
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
```

**Database Commands**:
```bash
cd packages/database
npx prisma migrate dev --name add_auth0_id
npx prisma generate
npx prisma studio  # Visual database browser
```

**Generate NestJS Components**:
```bash
cd apps/api
nest g module auth
nest g controller auth
nest g service auth
```

**Run Linter and Build**:
```bash
npm run lint --filter=api
npm run lint --filter=web-start
npm run build --filter=api
npm run build --filter=web-start
```

**Check Git Status**:
```bash
git status
git branch  # Should be on: feat/auth0-authentication
```

---

## Session History

| Session | Date | Focus | Outcome | Duration |
|---------|------|-------|---------|----------|
| **001** | **2025-10-23** | **Planning** | **Documentation complete** | **~1 hour** |

---

## Related Documentation

- **Instructor's Implementation**: https://github.com/acbart/cisc474-f25-individual-project-starter#changes-on-october-19-2025
- **Auth0 NestJS Guide**: https://docs.nestjs.com/security/authentication
- **Auth0 React SDK**: https://auth0.com/docs/quickstart/spa/react
- **Passport.js**: http://www.passportjs.org/
- **Project .claude/CLAUDE.md**: Git workflow, quality checks, CI/CD

---

## Next Steps

**For Next Session** (Immediate):
1. Create Auth0 API application
2. Create Auth0 SPA application
3. Install backend packages
4. Generate auth module/controller/service
5. Create `sessions/002_backend_setup/CHECKPOINT.md`

**For This Week** (Before Friday Demo):
1. Complete backend implementation
2. Complete frontend implementation
3. Test locally
4. Deploy to production
5. Demo in class ✅

---

**Status**: 🟡 IN PROGRESS - Planning complete, implementation ready to start
**Confidence**: HIGH - Clear implementation path, good documentation from instructor
**Risk**: LOW - Well-documented process, similar to other NestJS patterns
**Timeline**: 2-3 days to complete, demo Friday
