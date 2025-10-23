# Auth0 Authentication - Implementation Guide

**Purpose**: Step-by-step guide to implement Auth0 authentication with Passport.js in a NestJS + TanStack Start application.

**Estimated Time**: 8-14 hours (2-3 days)

**Prerequisites**:
- Auth0 account (free tier works)
- Existing NestJS backend (apps/api)
- Existing TanStack Start frontend (apps/web-start)
- PostgreSQL database with Prisma

---

## Table of Contents

1. [Auth0 Setup (30 min)](#1-auth0-setup)
2. [Database Migration (30 min)](#2-database-migration)
3. [Backend Implementation (4 hours)](#3-backend-implementation)
4. [Frontend Implementation (3 hours)](#4-frontend-implementation)
5. [User Synchronization (1 hour)](#5-user-synchronization)
6. [Testing (1-2 hours)](#6-testing)
7. [Production Deployment (2 hours)](#7-production-deployment)

---

## 1. Auth0 Setup

### 1.1 Create Auth0 API Application

**Purpose**: Represents your backend API in Auth0

**Steps**:
1. Log into Auth0 dashboard: https://manage.auth0.com
2. Navigate to **Applications** → **APIs**
3. Click **Create API**
4. Fill in:
   - **Name**: "Course Management API" (or your project name)
   - **Identifier**: Your backend URL with trailing slash
     - Development: `http://localhost:3000/`
     - Production: `https://your-app.onrender.com/`
   - **Signing Algorithm**: RS256 (default)
5. Click **Create**

**Add Permissions** (Optional but recommended):
1. Go to **Permissions** tab
2. Add permission:
   - **Permission**: `read:courses`
   - **Description**: "Read course data"
3. Add more as needed (e.g., `write:assignments`, `read:grades`)

**Save These Values** (you'll need them):
- **Identifier** (this is your `AUTH0_AUDIENCE`)
- **Domain** from Settings → look for "YOUR_TENANT.us.auth0.com"

### 1.2 Create Auth0 SPA Application

**Purpose**: Represents your frontend app in Auth0

**Steps**:
1. Navigate to **Applications** → **Applications**
2. Click **Create Application**
3. Fill in:
   - **Name**: "Course Management Frontend"
   - **Type**: Select **Single Page Web Applications**
4. Click **Create**

**Configure Settings**:
1. Go to **Settings** tab
2. **Allowed Callback URLs** (comma-separated):
   ```
   http://localhost:3001/home,
   https://your-production-frontend.vercel.app/home
   ```
3. **Allowed Logout URLs** (same as callbacks):
   ```
   http://localhost:3001,
   https://your-production-frontend.vercel.app
   ```
4. **Allowed Web Origins**:
   ```
   http://localhost:3001,
   https://your-production-frontend.vercel.app
   ```
5. Click **Save Changes**

**Save These Values**:
- **Domain**: `YOUR_TENANT.us.auth0.com`
- **Client ID**: Long alphanumeric string

---

## 2. Database Migration

### 2.1 Add auth0Id Field to User Model

**Edit**: `packages/database/prisma/schema.prisma`

```prisma
model User {
  id            String    @id @default(cuid())
  auth0Id       String?   @unique  // Add this line
  email         String    @unique
  name          String
  emailVerified DateTime?

  // ... rest of existing fields
  enrollments   CourseEnrollment[]
  submissions   Submission[]
  grades        Grade[]
  comments      Comment[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}
```

### 2.2 Create and Run Migration

```bash
cd packages/database

# Create migration
npx prisma migrate dev --name add_auth0_id

# This will:
# 1. Create migration file in prisma/migrations/
# 2. Apply migration to database
# 3. Regenerate Prisma Client

# Verify migration worked
npx prisma studio
# Check that users table now has auth0Id column
```

**Expected Output**:
```
Applying migration `20251023000000_add_auth0_id`

The following migration(s) have been applied:

migrations/
  └─ 20251023000000_add_auth0_id/
      └─ migration.sql

✔ Generated Prisma Client
```

---

## 3. Backend Implementation

### 3.1 Install Packages

```bash
cd apps/api

# Production dependencies
npm install @nestjs/jwt @nestjs/passport passport passport-auth0 passport-jwt jwks-rsa

# Development dependencies
npm install -D @types/passport-auth0 @types/passport-jwt
```

### 3.2 Generate Auth Module

```bash
cd apps/api

# Generate auth module, controller, and service
nest g module auth
nest g controller auth
nest g service auth
```

**Files Created**:
- `src/auth/auth.module.ts`
- `src/auth/auth.controller.ts`
- `src/auth/auth.service.ts`

### 3.3 Create JWT Strategy

**Create**: `apps/api/src/auth/jwt.strategy.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER_URL,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    // This is called after JWT is verified
    // payload contains decoded JWT claims
    return {
      userId: payload.sub,  // Auth0 user ID
      email: payload.email,
      name: payload.name,
      permissions: payload.permissions || [],
    };
  }
}
```

**Key Points**:
- `jwks-rsa` fetches Auth0's public keys to verify JWT signatures
- `jwtFromRequest` extracts token from `Authorization: Bearer <token>` header
- `validate()` transforms JWT payload into user object attached to request

### 3.4 Create Current User Decorator

**Create**: `apps/api/src/auth/current-user.decorator.ts`

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

**Usage**:
```typescript
@Get('/me')
async getProfile(@CurrentUser() user) {
  // user contains data from JwtStrategy.validate()
  return user;
}
```

### 3.5 Configure Auth Module

**Edit**: `apps/api/src/auth/auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),  // Configuration comes from JwtStrategy
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtStrategy],  // Export for use in other modules
})
export class AuthModule {}
```

### 3.6 Update App Module

**Edit**: `apps/api/src/app.module.ts`

Add `AuthModule` to imports:

```typescript
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';  // Add this
import { CoursesModule } from './courses/courses.module';
import { AssignmentsModule } from './assignments/assignments.module';
// ... other imports

@Module({
  imports: [
    AuthModule,  // Add this
    CoursesModule,
    AssignmentsModule,
    // ... other modules
  ],
  // ...
})
export class AppModule {}
```

### 3.7 Add Environment Variables

**Edit**: `apps/api/.env` (create if doesn't exist)

```bash
# Auth0 Configuration
AUTH0_ISSUER_URL=https://YOUR_TENANT.us.auth0.com/
AUTH0_AUDIENCE=http://localhost:3000/

# Database (already exists)
DATABASE_URL=postgresql://...
```

**Important**:
- Replace `YOUR_TENANT` with your actual Auth0 tenant
- Include trailing slashes (they matter!)
- `AUTH0_AUDIENCE` should match your API Identifier from step 1.1

**Also add to**:
- Root `.env` file
- Render.com environment variables (for production)

### 3.8 Protect Endpoints with Guards

**Example**: `apps/api/src/assignments/assignments.controller.ts`

```typescript
import { Controller, Get, Post, Patch, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current-user.decorator';  // Import decorator

@Controller('assignments')
@UseGuards(AuthGuard('jwt'))  // Apply guard to all routes in controller
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async findAll() {
    // Only authenticated users can reach this
    return this.assignmentsService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateAssignmentDto, @CurrentUser() user) {
    // user.userId contains Auth0 user ID
    // Use this instead of hardcoded CURRENT_USER_ID
    return this.assignmentsService.create(dto, user.userId);
  }

  // ... other routes
}
```

**Apply guards to**:
- `apps/api/src/courses/courses.controller.ts`
- `apps/api/src/grades/grades.controller.ts`
- `apps/api/src/submissions/submissions.controller.ts`
- Any other protected controllers

**Selective Guards** (if some routes are public):
```typescript
@Controller('assignments')
export class AssignmentsController {
  @Get()  // Public route - no guard
  async findAll() { ... }

  @Post()
  @UseGuards(AuthGuard('jwt'))  // Protected route
  async create(...) { ... }
}
```

### 3.9 Add /users/me Endpoint

**Edit**: `apps/api/src/users/users.controller.ts`

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@CurrentUser() user) {
    // Sync Auth0 user to database and return database record
    return this.usersService.syncAuth0User(user);
  }

  // ... other routes
}
```

---

## 4. Frontend Implementation

### 4.1 Install Packages

```bash
cd apps/web-start
npm install @auth0/auth0-react
```

### 4.2 Add Environment Variables

**Edit**: `apps/web-start/.env`

```bash
# Auth0 Configuration
VITE_AUTH0_DOMAIN=YOUR_TENANT.us.auth0.com
VITE_AUTH0_CLIENT_ID=YOUR_CLIENT_ID_FROM_AUTH0_SPA

# Backend URL
VITE_BACKEND_URL=http://localhost:3000
```

**Also add to**:
- Vercel environment variables (for production)
- Cloudflare Workers environment variables (if using)

### 4.3 Wrap App with Auth0Provider

**Edit**: `apps/web-start/src/router.tsx`

```typescript
import { Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

export function Router() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/home`,
        audience: import.meta.env.VITE_BACKEND_URL,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Auth0Provider>
  );
}
```

**Key Points**:
- `Auth0Provider` must wrap everything (including Query provider)
- `redirect_uri` is where Auth0 redirects after login
- `audience` should match backend URL (tells Auth0 which API to issue token for)

### 4.4 Create Login Button

**Create**: `apps/web-start/src/components/auth/LoginButton.tsx`

```typescript
import { useAuth0 } from '@auth0/auth0-react';

export function LoginButton() {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? 'Loading...' : 'Log In'}
    </button>
  );
}
```

### 4.5 Create Logout Button

**Create**: `apps/web-start/src/components/auth/LogoutButton.tsx`

```typescript
import { useAuth0 } from '@auth0/auth0-react';

export function LogoutButton() {
  const { logout, isLoading } = useAuth0();

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      disabled={isLoading}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
    >
      {isLoading ? 'Loading...' : 'Log Out'}
    </button>
  );
}
```

### 4.6 Add Login to Index Page

**Edit**: `apps/web-start/src/routes/index.tsx`

```typescript
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from '../components/auth/LoginButton';
import { Link } from '@tanstack/react-router';

export function Index() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <h1>Welcome back!</h1>
        <Link to="/courses">Go to Courses</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Course Management System</h1>
      <LoginButton />
    </div>
  );
}
```

### 4.7 Create Home Page (Post-Login Landing)

**Create**: `apps/web-start/src/routes/home.tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { LogoutButton } from '../components/auth/LogoutButton';

export const Route = createFileRoute('/home')({
  component: Home,
});

function Home() {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}!</h1>

      <div className="mb-6">
        <img
          src={user?.picture}
          alt={user?.name}
          className="w-24 h-24 rounded-full"
        />
      </div>

      <div className="mb-6">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Email Verified:</strong> {user?.email_verified ? 'Yes' : 'No'}</p>
      </div>

      <div className="space-x-4">
        <a href="/courses" className="text-blue-600 hover:underline">
          Go to Courses
        </a>
        <LogoutButton />
      </div>
    </div>
  );
}
```

### 4.8 Update API Fetcher to Send JWT

**Edit**: `apps/web-start/src/integrations/fetcher.ts`

Replace existing `backendFetcher` with:

```typescript
import { useAuth0 } from '@auth0/auth0-react';

export const useBackendFetcher = () => {
  const { getAccessTokenSilently } = useAuth0();

  return async (endpoint: string, options?: RequestInit) => {
    const token = await getAccessTokenSilently();

    const url = `${import.meta.env.VITE_BACKEND_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };
};
```

**Update components using fetcher**:

Before:
```typescript
const { data } = useQuery({
  queryKey: ['assignments'],
  queryFn: () => backendFetcher('/assignments'),
});
```

After:
```typescript
const fetcher = useBackendFetcher();

const { data } = useQuery({
  queryKey: ['assignments'],
  queryFn: () => fetcher('/assignments'),
});
```

### 4.9 Update AuthContext to Use Auth0

**Edit**: `apps/web-start/src/contexts/AuthContext.tsx`

```typescript
import { createContext, useContext, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { useBackendFetcher } from '../integrations/fetcher';

interface AuthContextValue {
  currentUser: any | null;  // Replace 'any' with your User type
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const fetcher = useBackendFetcher();

  // Fetch current user from backend /users/me
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fetcher('/users/me'),
    enabled: isAuthenticated,  // Only fetch if authenticated
  });

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading: auth0Loading || userLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Remove hardcoded user**:
Delete or comment out `CURRENT_USER_ID` in `apps/web-start/src/config/constants.ts`

---

## 5. User Synchronization

### 5.1 Implement syncAuth0User Service

**Edit**: `apps/api/src/users/users.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Sync Auth0 user to database
   * Creates user if doesn't exist, updates if changed
   */
  async syncAuth0User(auth0User: { userId: string; email: string; name: string }) {
    const { userId: auth0Id, email, name } = auth0User;

    // Try to find existing user by auth0Id
    let user = await this.prisma.user.findUnique({
      where: { auth0Id },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

    if (user) {
      // User exists - update email/name if changed
      if (user.email !== email || user.name !== name) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { email, name },
          include: {
            enrollments: {
              include: {
                course: true,
              },
            },
          },
        });
      }
    } else {
      // User doesn't exist - create new user
      user = await this.prisma.user.create({
        data: {
          auth0Id,
          email,
          name,
          emailVerified: new Date(),  // Auth0 handles verification
        },
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
        },
      });
    }

    return user;
  }

  // ... other methods
}
```

### 5.2 Use Synced User in Services

**Edit**: `apps/api/src/assignments/assignments.service.ts`

Before (hardcoded):
```typescript
async create(dto: CreateAssignmentDto) {
  const HARDCODED_USER_ID = 'cmfr0jb7n0004k07ai1j02p8z';

  return this.prisma.assignment.create({
    data: {
      ...dto,
      createdById: HARDCODED_USER_ID,
    },
  });
}
```

After (using auth0Id):
```typescript
async create(dto: CreateAssignmentDto, auth0UserId: string) {
  // Find user by auth0Id
  const user = await this.prisma.user.findUnique({
    where: { auth0Id: auth0UserId },
  });

  if (!user) {
    throw new Error('User not found - should have been synced');
  }

  return this.prisma.assignment.create({
    data: {
      ...dto,
      createdById: user.id,  // Use database user ID
    },
  });
}
```

**Update controller to pass auth0UserId**:
```typescript
@Post()
@UseGuards(AuthGuard('jwt'))
async create(@Body() dto: CreateAssignmentDto, @CurrentUser() user) {
  return this.assignmentsService.create(dto, user.userId);
}
```

---

## 6. Testing

### 6.1 Manual Testing Checklist

**Local Development** (`npm run dev`):

- [ ] **Index Page**
  - Navigate to `http://localhost:3001`
  - See login button
  - Click login → Redirected to Auth0 login page

- [ ] **Auth0 Login**
  - Enter credentials or sign up
  - After login → Redirected to `/home`
  - See user profile (name, email, picture)

- [ ] **Home Page**
  - User data displays correctly
  - Logout button visible
  - "Go to Courses" link works

- [ ] **Protected Routes**
  - Navigate to `/courses`
  - Data loads (proves JWT is sent and validated)
  - Check Network tab:
    - Request to `/courses` has `Authorization: Bearer eyJ...` header
    - Response status 200

- [ ] **User Sync**
  - Check database: `npx prisma studio`
  - Find user in `users` table
  - Verify `auth0Id` is populated
  - Verify `email` and `name` match Auth0

- [ ] **Create Assignment**
  - Navigate to course assignments page
  - Click "Create Assignment"
  - Fill form and submit
  - Check database: assignment `createdById` should be your user ID (not hardcoded)

- [ ] **Logout**
  - Click logout button
  - Redirected to index page
  - Try to navigate to `/courses` → Should show error or redirect to login

### 6.2 Test Unauthenticated Access

```bash
# In terminal, test backend directly without token
curl http://localhost:3000/assignments

# Expected: 401 Unauthorized
```

### 6.3 Test with Valid Token

```bash
# Get token from browser:
# 1. Open DevTools → Application → Local Storage
# 2. Find Auth0 token (starts with 'eyJ')
# 3. Copy it

# Test with token
curl http://localhost:3000/assignments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected: 200 OK with assignments data
```

---

## 7. Production Deployment

### 7.1 Update Auth0 Applications

**API Application**:
1. Go to Auth0 dashboard → APIs → Your API
2. Update **Identifier** to production URL:
   - `https://your-app.onrender.com/`
3. Save

**SPA Application**:
1. Go to Auth0 dashboard → Applications → Your SPA
2. Update **Allowed Callback URLs**:
   ```
   http://localhost:3001/home,
   https://your-production-frontend.vercel.app/home
   ```
3. Update **Allowed Logout URLs**:
   ```
   http://localhost:3001,
   https://your-production-frontend.vercel.app
   ```
4. Update **Allowed Web Origins**:
   ```
   http://localhost:3001,
   https://your-production-frontend.vercel.app
   ```
5. Save

### 7.2 Deploy Backend (Render.com)

**Add Environment Variables**:
1. Go to Render dashboard → Your service
2. Navigate to **Environment** tab
3. Add:
   ```
   AUTH0_ISSUER_URL=https://YOUR_TENANT.us.auth0.com/
   AUTH0_AUDIENCE=https://your-app.onrender.com/
   DATABASE_URL=postgresql://... (should already exist)
   ```
4. Click **Save Changes**

**Deploy**:
- Render auto-deploys on git push to main
- Or click **Manual Deploy** → **Deploy latest commit**

**Verify**:
```bash
curl https://your-app.onrender.com/assignments

# Expected: 401 Unauthorized (proves guard is working)
```

### 7.3 Deploy Frontend (Vercel)

**Add Environment Variables**:
1. Go to Vercel dashboard → Your project
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   ```
   VITE_AUTH0_DOMAIN=YOUR_TENANT.us.auth0.com
   VITE_AUTH0_CLIENT_ID=YOUR_CLIENT_ID
   VITE_BACKEND_URL=https://your-app.onrender.com
   ```
4. Click **Save**

**Deploy**:
- Vercel auto-deploys on git push to main
- Or go to **Deployments** → **Redeploy**

**Verify**:
1. Visit your production URL
2. Click login → Should redirect to Auth0
3. Login → Should redirect to `/home`
4. Navigate to courses → Should load data

### 7.4 Update CORS (if needed)

**Edit**: `apps/api/src/main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://your-production-frontend.vercel.app',
    ],
    credentials: true,
  });

  await app.listen(3000);
}
```

---

## Common Issues & Solutions

### Issue 1: "Invalid token audience"

**Symptom**: 401 error with "Invalid audience" in response

**Cause**: `AUTH0_AUDIENCE` in backend doesn't match `audience` in frontend `Auth0Provider`

**Solution**: Ensure they match exactly:
- Backend: `AUTH0_AUDIENCE=https://your-app.onrender.com/`
- Frontend: `audience: import.meta.env.VITE_BACKEND_URL`
- `VITE_BACKEND_URL=https://your-app.onrender.com`

### Issue 2: "No authorization token was found"

**Symptom**: 401 error, no token in request headers

**Cause**: Frontend not sending token, or fetcher not updated

**Solution**:
1. Check `useBackendFetcher` uses `getAccessTokenSilently()`
2. Verify `Authorization: Bearer` header in Network tab
3. Ensure component uses `useBackendFetcher()` hook

### Issue 3: Callback URL mismatch

**Symptom**: After Auth0 login, error "Callback URL mismatch"

**Cause**: Callback URL in Auth0 SPA doesn't match redirect_uri

**Solution**:
1. Check `redirect_uri` in `Auth0Provider`: `${window.location.origin}/home`
2. Ensure Auth0 SPA has `http://localhost:3001/home` in Allowed Callback URLs
3. Ensure production URL also listed

### Issue 4: CORS errors

**Symptom**: "CORS policy blocked" in browser console

**Cause**: Backend not allowing frontend origin

**Solution**:
1. Check `main.ts` has correct CORS origins
2. Ensure production frontend URL is listed
3. Restart backend after changes

### Issue 5: User not synced to database

**Symptom**: Can login but no user record in database

**Cause**: `/users/me` not called, or sync logic broken

**Solution**:
1. Verify `AuthProvider` calls `/users/me` query
2. Check Network tab - should see request to `/users/me`
3. Add console.log in `syncAuth0User` to debug
4. Check Prisma query errors

---

## Next Steps After Implementation

1. **Add Role-Based Access Control**
   - Store roles in database (CourseEnrollment already has `role` field)
   - Create role guards (`@Roles('PROFESSOR')`)
   - Enforce permissions on sensitive routes

2. **Improve Error Handling**
   - Catch auth errors in frontend
   - Show user-friendly messages
   - Implement retry logic

3. **Add User Management**
   - Admin page to view all users
   - Assign users to courses
   - Manage user roles

4. **Session Management**
   - Token refresh handling
   - Logout on token expiry
   - "Remember me" functionality

5. **Audit Logging**
   - Log all user actions (ActivityLog model exists)
   - Track who created/modified what
   - Security audit trail

---

## Checklist Summary

**Auth0 Setup**:
- [ ] Create API application
- [ ] Create SPA application
- [ ] Copy credentials

**Backend**:
- [ ] Install packages
- [ ] Generate auth module
- [ ] Create JWT strategy
- [ ] Create current-user decorator
- [ ] Configure auth module
- [ ] Add environment variables
- [ ] Apply guards to controllers
- [ ] Add `/users/me` endpoint

**Database**:
- [ ] Add `auth0Id` field to User model
- [ ] Run migration
- [ ] Verify schema

**Frontend**:
- [ ] Install @auth0/auth0-react
- [ ] Add environment variables
- [ ] Wrap app with Auth0Provider
- [ ] Create LoginButton
- [ ] Create LogoutButton
- [ ] Create /home route
- [ ] Update fetcher to send JWT
- [ ] Update AuthContext

**User Sync**:
- [ ] Implement syncAuth0User()
- [ ] Call from /users/me
- [ ] Update services to use auth0Id

**Testing**:
- [ ] Login flow works
- [ ] Protected routes require auth
- [ ] User synced to database
- [ ] Assignment creation uses real user
- [ ] Logout works

**Production**:
- [ ] Update Auth0 applications
- [ ] Deploy backend with env vars
- [ ] Deploy frontend with env vars
- [ ] Test end-to-end in production

---

**Estimated Total Time**: 8-14 hours

**Demo Ready**: After all checkboxes complete

Good luck! 🚀
