# Auth0 Authentication Feature

## Overview
Implementation of authentication using Auth0 and Passport.js to protect all backend endpoints from unauthenticated users. This replaces the temporary hardcoded user ID system with proper JWT-based authentication.

## Status
- [x] Planning
- [ ] Backend Setup (Auth0 API Application)
- [ ] Backend Implementation (Passport.js + JWT Strategy)
- [ ] Frontend Setup (Auth0 SPA Application)
- [ ] Frontend Implementation (Auth0 React SDK)
- [ ] Testing
- [ ] Production Deployment

## Quick Links
- **[CURRENT_STATE.md](CURRENT_STATE.md)** - ⭐ Current status and next steps (READ THIS FIRST)
- [Planning Documents](planning/) - Implementation guide and requirements
- [Session History](sessions/) - Work session checkpoints

## Key Objectives
1. **Add Auth0 Authentication**: Implement Auth0 with Passport.js in NestJS backend
2. **Protect All Endpoints**: Guard all backend routes requiring authentication
3. **Frontend Integration**: Integrate Auth0 React SDK in TanStack Start frontend
4. **Replace Hardcoded User**: Remove `CURRENT_USER_ID` constant, use real user context
5. **User Profile Sync**: Sync Auth0 user data with database `users` table

## Related Features
- **Depends on**: Existing user system in database (Prisma `User` model)
- **Blocks**: Role-based access control enforcement
- **Follows**: Assignment CRUD patterns (Phase 1-3 completed)

## Architecture Context
This project uses:
- **Frontend**: TanStack Start (React 19) + TanStack Router + TanStack Query
- **Backend**: NestJS + Prisma ORM + PostgreSQL
- **Current Auth**: Hardcoded user ID (`cmfr0jb7n0004k07ai1j02p8z` - Dr. Bart)

## Key Commands
```bash
# Backend (apps/api)
npm install @nestjs/jwt @nestjs/passport passport passport-auth0 passport-jwt jwks-rsa

# Frontend (apps/web-start)
npm install @auth0/auth0-react

# Generate NestJS modules
cd apps/api
nest g module auth
nest g controller auth
nest g service auth

# Test authentication
npm run dev  # Start both frontend + backend
# Navigate to http://localhost:3001
# Click login button, verify Auth0 redirect
```

## Git Branches
- **Feature Branch**: `feat/auth0-authentication`
- **Base Branch**: `main`
- **Will Merge Via**: Pull Request (CI must pass)

## Assignment Reference
- **Original**: [assignment.md](assignment.md)
- **Instructor Notes**: https://github.com/acbart/cisc474-f25-individual-project-starter#changes-on-october-19-2025
- **Demo Date**: Friday (in-class demos)
- **Class Overview**: Monday

## Success Criteria
- ✅ All backend endpoints protected with `@UseGuards(AuthGuard('jwt'))`
- ✅ Users can log in via Auth0
- ✅ Frontend redirects to login when unauthenticated
- ✅ JWT tokens passed in Authorization headers
- ✅ User data from Auth0 synced to database
- ✅ Remove hardcoded `CURRENT_USER_ID` constant
- ✅ Production deployment working on Render + Vercel/Cloudflare
