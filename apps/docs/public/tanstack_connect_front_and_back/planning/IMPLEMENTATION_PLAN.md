# Comprehensive Planning: Full Repository DTOs & CRUD Implementation

**Date**: October 15, 2025
**Scope**: Complete implementation of DTOs and CRUD operations across entire application
**Goal**: Establish robust, type-safe data layer with proper separation between database models and API contracts

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Model Inventory](#data-model-inventory)
3. [DTO Design Patterns](#dto-design-patterns)
4. [Entity-by-Entity Implementation Plan](#entity-by-entity-implementation-plan)
5. [Shared Infrastructure](#shared-infrastructure)
6. [Testing Strategy](#testing-strategy)
7. [Implementation Phases](#implementation-phases)
8. [File Structure](#file-structure)

---

## Architecture Overview

### Current State
```
┌─────────────────┐
│   Frontend      │
│  (web-start)    │  ← TypeScript interfaces (types/api.ts)
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Backend       │
│     (api)       │  ← Returns Prisma models directly
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
│   (Supabase)    │  ← Prisma schema
└─────────────────┘
```

**Problems**:
- ❌ Frontend types don't match backend reality
- ❌ Prisma models exposed to frontend (security risk)
- ❌ No validation layer
- ❌ No CRUD operations beyond GET
- ❌ Type mismatches between layers

### Target State
```
┌─────────────────┐
│   Frontend      │
│  (web-start)    │  ← Imports DTOs from @repo/api
└────────┬────────┘
         │ HTTP (JSON)
         ▼
┌─────────────────┐
│   Backend       │
│     (api)       │  ← Validates with Zod, transforms to/from Prisma
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
│   (Supabase)    │  ← Prisma schema (source of truth)
└─────────────────┘

      ┌──────────────┐
      │ packages/api │  ← Shared DTOs with Zod schemas
      └──────────────┘
```

**Benefits**:
- ✅ Single source of truth for API contracts
- ✅ Runtime validation with Zod
- ✅ Type safety across frontend and backend
- ✅ Security: never expose internal fields
- ✅ Flexibility: DTOs can differ from database schema

---

## Data Model Inventory

### Complete Entity List (from Prisma Schema)

| Entity | Models | Relations | Complexity | Priority | CRUD Needs |
|--------|--------|-----------|------------|----------|------------|
| **Users** | User | Many enrollments, submissions, grades | Medium | HIGH | Read, Update profile |
| **Courses** | Course, CourseEnrollment | Many assignments, enrollments | High | HIGH | Full CRUD |
| **Assignments** | Assignment | Submissions, reflections | High | **HIGHEST** | Full CRUD |
| **Submissions** | Submission | Assignment, student, grade, comments | Very High | MEDIUM | Create, Read, Update status |
| **Grades** | Grade, GradeChange | Submission, grader | Medium | MEDIUM | Create, Read, Update |
| **Reflections** | ReflectionTemplate, ReflectionResponse, ReflectionResponseSkill | Assignment, skill tags | Very High | LOW | Create, Read |
| **Comments** | Comment | Submission, user, thread | Medium | LOW | Full CRUD |
| **Skill Tags** | SkillTag, ReflectionTemplateSkill | Reflections | Low | LOW | Admin only |

### Entity Relationships Map

```
User
├─── CourseEnrollment ──→ Course
│                          └─── Assignment
│                               ├─── Submission (student)
│                               │    ├─── Grade (gradedBy: User)
│                               │    │    └─── GradeChange (changedBy: User)
│                               │    ├─── Comment (user)
│                               │    └─── ReflectionResponse
│                               └─── ReflectionTemplate
│                                    ├─── ReflectionTemplateSkill ──→ SkillTag
│                                    └─── ReflectionResponse
└─── (many other relations)
```

---

## DTO Design Patterns

### Standard DTO Types Per Entity

Every entity should have these DTOs where applicable:

```typescript
// 1. Response DTO - Full object for detail views
export const EntityResponseSchema = z.object({
  id: z.string().cuid(),
  // all fields...
  // nested relations as simplified objects
});

// 2. List Item DTO - Lightweight for lists
export const EntityListItemSchema = z.object({
  id: z.string().cuid(),
  // only essential fields for list display
});

// 3. Create DTO - Input for POST requests
export const CreateEntitySchema = z.object({
  // required fields only
  // NO id, createdAt, updatedAt
});

// 4. Update DTO - Input for PATCH requests
export const UpdateEntitySchema = z.object({
  // all fields optional
  // NO id, createdAt, updatedAt
});

// 5. Query/Filter DTO - For search/filter endpoints
export const EntityQuerySchema = z.object({
  // filter criteria
  courseId: z.string().optional(),
  status: z.enum([...]).optional(),
});
```

### Field Categories

**Always Include in Response**:
- Identifiers (id, foreign keys)
- Core data fields
- Timestamps (createdAt, updatedAt)
- Computed/derived fields (counts, statuses)

**Sometimes Include**:
- Relations (simplified, not full nested objects)
- Optional fields (null check required)

**Never Include in Response**:
- Password hashes
- Internal system fields
- Sensitive tokens

**Never Include in Create/Update**:
- Auto-generated: id, createdAt, updatedAt
- System-managed: computed fields
- Relations (use IDs instead)

---

## Entity-by-Entity Implementation Plan

### 1. Assignments (Priority: HIGHEST) ⭐

**Why First?**: Assignment requirement, most common CRUD operations

#### 1.1 DTOs

**File**: `packages/api/src/assignments.ts`

```typescript
import { z } from 'zod';

// Response DTO - Full assignment
export const AssignmentResponseSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['FILE', 'TEXT', 'REFLECTION']),
  maxPoints: z.number(),
  dueDate: z.string().datetime(),
  instructions: z.array(z.string()).nullable(),
  isPublished: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  // Simplified relations
  course: z.object({
    id: z.string(),
    code: z.string(),
    title: z.string(),
  }),
  createdBy: z.object({
    id: z.string(),
    name: z.string(),
  }),

  // Computed fields
  submissionCount: z.number().optional(),
  gradedCount: z.number().optional(),
});

export type AssignmentResponse = z.infer<typeof AssignmentResponseSchema>;

// List DTO - Lightweight
export const AssignmentListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['FILE', 'TEXT', 'REFLECTION']),
  dueDate: z.string().datetime(),
  maxPoints: z.number(),
  isPublished: z.boolean(),
  courseId: z.string(),
});

export type AssignmentListItem = z.infer<typeof AssignmentListItemSchema>;

// Create DTO
export const CreateAssignmentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  type: z.enum(['FILE', 'TEXT', 'REFLECTION']),
  maxPoints: z.number().int().min(0).max(1000),
  dueDate: z.string().datetime(),
  instructions: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
  courseId: z.string().cuid(),
});

export type CreateAssignmentDto = z.infer<typeof CreateAssignmentSchema>;

// Update DTO
export const UpdateAssignmentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  type: z.enum(['FILE', 'TEXT', 'REFLECTION']).optional(),
  maxPoints: z.number().int().min(0).max(1000).optional(),
  dueDate: z.string().datetime().optional(),
  instructions: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export type UpdateAssignmentDto = z.infer<typeof UpdateAssignmentSchema>;
```

#### 1.2 Backend

**Service** (`apps/api/src/assignments/assignments.service.ts`):
```typescript
async create(dto: CreateAssignmentDto, userId: string) {
  return await this.prisma.assignment.create({
    data: {
      ...dto,
      dueDate: new Date(dto.dueDate),
      createdById: userId,
    },
    include: { course: true, createdBy: true },
  });
}

async update(id: string, dto: UpdateAssignmentDto) {
  return await this.prisma.assignment.update({
    where: { id },
    data: {
      ...dto,
      ...(dto.dueDate && { dueDate: new Date(dto.dueDate) }),
    },
    include: { course: true, createdBy: true },
  });
}

async delete(id: string) {
  const deleted = await this.prisma.assignment.delete({ where: { id } });
  return { id, deleted: true, title: deleted.title };
}
```

**Controller** (`apps/api/src/assignments/assignments.controller.ts`):
```typescript
@Post()
create(@Body() dto: CreateAssignmentDto, @CurrentUser() user) {
  return this.service.create(dto, user.id);
}

@Patch(':id')
update(@Param('id') id: string, @Body() dto: UpdateAssignmentDto) {
  return this.service.update(id, dto);
}

@Delete(':id')
delete(@Param('id') id: string) {
  return this.service.delete(id);
}
```

#### 1.3 Frontend

**Form**: `apps/web-start/src/components/assignments/AssignmentForm.tsx`
**Mutations**: Create, update, delete with TanStack Query
**Pages**: Add CRUD UI to assignments list

---

### 2. Courses (Priority: HIGH)

**Why**: Core entity, needed for assignment context

#### 2.1 DTOs

**File**: `packages/api/src/courses.ts`

```typescript
// Course Response
export const CourseResponseSchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  instructor: z.string(),
  semester: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  // Relations
  enrollments: z.array(z.object({
    id: z.string(),
    role: z.enum(['STUDENT', 'TA', 'PROFESSOR', 'ADMIN']),
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }),
  })).optional(),

  // Computed
  enrollmentCount: z.number().optional(),
  assignmentCount: z.number().optional(),
});

// Course List Item
export const CourseListItemSchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  instructor: z.string(),
  semester: z.string(),
  enrollmentCount: z.number().optional(),
});

// Create Course
export const CreateCourseSchema = z.object({
  code: z.string().min(1).max(20),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  instructor: z.string().min(1),
  semester: z.string().regex(/^(Fall|Spring|Summer) \d{4}$/),
});

// Update Course
export const UpdateCourseSchema = CreateCourseSchema.partial();

// Enrollment DTO
export const CreateEnrollmentSchema = z.object({
  userId: z.string().cuid(),
  courseId: z.string().cuid(),
  role: z.enum(['STUDENT', 'TA', 'PROFESSOR', 'ADMIN']),
});
```

#### 2.2 Endpoints Needed

- `POST /courses` - Create course
- `PATCH /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course
- `POST /courses/:id/enroll` - Enroll user
- `DELETE /courses/:id/unenroll/:userId` - Remove enrollment

#### 2.3 UI Components

- Course create form
- Course edit form
- Course delete confirmation
- Enrollment management interface

---

### 3. Submissions (Priority: MEDIUM)

**Why**: Students need to submit assignments

#### 3.1 DTOs

**File**: `packages/api/src/submissions.ts`

```typescript
// Submission Response
export const SubmissionResponseSchema = z.object({
  id: z.string(),
  type: z.enum(['FILE', 'TEXT', 'REFLECTION']),
  status: z.enum(['DRAFT', 'SUBMITTED', 'GRADED', 'LATE']),
  submittedAt: z.string().datetime().nullable(),
  content: z.string().nullable(),
  files: z.array(z.string()).nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  assignment: z.object({
    id: z.string(),
    title: z.string(),
    dueDate: z.string().datetime(),
    maxPoints: z.number(),
  }),
  student: z.object({
    id: z.string(),
    name: z.string(),
  }),
  grade: z.object({
    score: z.number(),
    maxScore: z.number(),
    feedback: z.string().nullable(),
  }).nullable(),
});

// Create Submission (Draft)
export const CreateSubmissionSchema = z.object({
  assignmentId: z.string().cuid(),
  type: z.enum(['FILE', 'TEXT', 'REFLECTION']),
  content: z.string().optional(),
  files: z.array(z.string()).optional(),
});

// Update Submission
export const UpdateSubmissionSchema = z.object({
  content: z.string().optional(),
  files: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'SUBMITTED']).optional(),
});

// Submit action (changes status to SUBMITTED)
export const SubmitAssignmentSchema = z.object({
  submissionId: z.string().cuid(),
});
```

#### 3.2 Key Operations

- `POST /submissions` - Create draft submission
- `PATCH /submissions/:id` - Update draft
- `POST /submissions/:id/submit` - Submit for grading
- `GET /submissions/:id` - Get submission details
- `GET /assignments/:id/submissions` - Get all submissions for assignment (professor only)

---

### 4. Grades (Priority: MEDIUM)

**Why**: Instructors need to grade submissions

#### 4.1 DTOs

**File**: `packages/api/src/grades.ts`

```typescript
// Grade Response
export const GradeResponseSchema = z.object({
  id: z.string(),
  score: z.number(),
  maxScore: z.number(),
  feedback: z.string().nullable(),
  gradedAt: z.string().datetime(),

  submission: z.object({
    id: z.string(),
    student: z.object({
      id: z.string(),
      name: z.string(),
    }),
    assignment: z.object({
      id: z.string(),
      title: z.string(),
    }),
  }),
  gradedBy: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

// Create Grade
export const CreateGradeSchema = z.object({
  submissionId: z.string().cuid(),
  score: z.number().min(0),
  maxScore: z.number().min(0),
  feedback: z.string().max(5000).optional(),
});

// Update Grade
export const UpdateGradeSchema = z.object({
  score: z.number().min(0).optional(),
  feedback: z.string().max(5000).optional(),
  reason: z.string().max(500), // Required for grade changes
});
```

#### 4.2 Key Operations

- `POST /grades` - Create grade for submission
- `PATCH /grades/:id` - Update grade (creates GradeChange record)
- `GET /grades/:id` - Get grade details
- `GET /submissions/:id/grade` - Get grade for specific submission

---

### 5. Users (Priority: HIGH - Read Only)

**Why**: Need user info throughout app, but modify via profile only

#### 5.1 DTOs

**File**: `packages/api/src/users.ts`

```typescript
// User Profile Response
export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),

  enrollments: z.array(z.object({
    id: z.string(),
    role: z.enum(['STUDENT', 'TA', 'PROFESSOR', 'ADMIN']),
    enrolledAt: z.string().datetime(),
    course: z.object({
      id: z.string(),
      code: z.string(),
      title: z.string(),
      semester: z.string(),
    }),
  })).optional(),
});

// Update Profile
export const UpdateUserProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  // Email changes require verification
});
```

#### 5.2 Key Operations

- `GET /users/:id` - Get user profile
- `PATCH /users/:id` - Update own profile
- `GET /users` - List users (admin only)

---

### 6. Reflections (Priority: LOW)

**Complex**: ReflectionTemplate, ReflectionResponse, skill tags

#### 6.1 DTOs

**File**: `packages/api/src/reflections.ts`

```typescript
// Reflection Template
export const ReflectionTemplateSchema = z.object({
  id: z.string(),
  assignmentId: z.string(),
  prompts: z.array(z.string()),
  dataToShow: z.array(z.string()),
  skillTags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
  })),
});

// Create Reflection Response
export const CreateReflectionResponseSchema = z.object({
  templateId: z.string().cuid(),
  submissionId: z.string().cuid().optional(),
  answers: z.record(z.string(), z.string()), // prompt ID -> answer
  needsHelp: z.boolean().default(false),
  skillRatings: z.array(z.object({
    skillTagId: z.string().cuid(),
    rating: z.number().min(1).max(5),
  })),
});
```

---

### 7. Comments (Priority: LOW)

**Feature**: Discussion threads on submissions

#### 7.1 DTOs

**File**: `packages/api/src/comments.ts`

```typescript
// Comment Response
export const CommentResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  user: z.object({
    id: z.string(),
    name: z.string(),
  }),

  replies: z.array(z.lazy(() => CommentResponseSchema)).optional(),
});

// Create Comment
export const CreateCommentSchema = z.object({
  submissionId: z.string().cuid(),
  content: z.string().min(1).max(2000),
  parentId: z.string().cuid().optional(), // For threaded replies
});

// Update Comment
export const UpdateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
});
```

---

## Shared Infrastructure

### 1. Common Response Wrappers

**File**: `packages/api/src/common.ts`

```typescript
// Paginated response
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    hasMore: z.boolean(),
  });

// Delete response
export const DeleteResponseSchema = z.object({
  id: z.string(),
  deleted: z.boolean(),
  message: z.string(),
});

// Error response
export const ErrorResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string().optional(),
  details: z.unknown().optional(),
});

// Query params for filtering/pagination
export const QueryParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});
```

### 2. Backend Helper Functions

**File**: `apps/api/src/common/dto-transformer.ts`

```typescript
/**
 * Transforms Date objects to ISO strings for JSON response
 */
export function transformDates<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    if (result[key] instanceof Date) {
      (result as Record<string, unknown>)[key] = (result[key] as Date).toISOString();
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      (result as Record<string, unknown>)[key] = transformDates(result[key] as Record<string, unknown>);
    }
  }
  return result;
}

/**
 * Strips sensitive fields from user objects
 */
export function sanitizeUser(user: unknown): unknown {
  if (typeof user !== 'object' || user === null) return user;
  const { password, ...safe } = user as Record<string, unknown>;
  return safe;
}
```

### 3. Frontend Mutation Hooks

**File**: `apps/web-start/src/hooks/mutations/useCreateMutation.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateMutation<TData, TVariables>(
  endpoint: string,
  invalidateKeys: Array<unknown[]>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TVariables) => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }
      return response.json() as Promise<TData>;
    },
    onSuccess: () => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}

// Similarly: useUpdateMutation, useDeleteMutation
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal**: Setup shared infrastructure

1. Create `packages/api/src/common.ts` with base schemas
2. Update `packages/api/package.json` dependencies (add zod)
3. Create backend helpers for DTO transformation
4. Create frontend mutation hooks
5. Setup error handling patterns

**Deliverables**:
- [ ] Common DTOs and helpers
- [ ] Mutation hooks
- [ ] Error handling

---

### Phase 2: Core Entities (Week 2)
**Goal**: Implement CRUD for Assignments (assignment requirement)

1. Assignments DTOs in `packages/api/src/assignments.ts`
2. Assignments backend CRUD in `apps/api/src/assignments/`
3. Assignment forms in `apps/web-start/src/components/assignments/`
4. Integrate forms into assignment pages
5. Test full CRUD flow

**Deliverables**:
- [ ] Assignment CRUD working end-to-end
- [ ] Forms with validation
- [ ] Cache invalidation working

---

### Phase 3: Supporting Entities (Week 3)
**Goal**: Add Courses, Users, Submissions

1. Courses DTOs and CRUD
2. Users DTOs (read-only + profile update)
3. Submissions DTOs and create/update
4. UI for each entity

**Deliverables**:
- [ ] Course management
- [ ] Profile editing
- [ ] Submission creation

---

### Phase 4: Grading System (Week 4)
**Goal**: Implement grading workflow

1. Grades DTOs
2. Grading interface for instructors
3. Grade viewing for students
4. Grade history (GradeChange)

**Deliverables**:
- [ ] Grading workflow
- [ ] Grade display

---

### Phase 5: Advanced Features (Week 5)
**Goal**: Reflections and comments

1. Reflections DTOs and responses
2. Comments and threading
3. Polish UI/UX
4. Performance optimization

**Deliverables**:
- [ ] Reflection system
- [ ] Comment threads
- [ ] Optimized queries

---

## File Structure

```
Repository After Full Implementation:

packages/api/src/
├── index.ts                    (Export all DTOs)
├── common.ts                   (Shared schemas)
├── users.ts                    (User DTOs)
├── courses.ts                  (Course DTOs)
├── assignments.ts              (Assignment DTOs)
├── submissions.ts              (Submission DTOs)
├── grades.ts                   (Grade DTOs)
├── reflections.ts              (Reflection DTOs)
└── comments.ts                 (Comment DTOs)

apps/api/src/
├── common/
│   ├── dto-transformer.ts      (Date/field transformations)
│   ├── decorators/             (Custom decorators)
│   └── guards/                 (Auth guards)
├── users/
│   ├── users.controller.ts     (+ PATCH)
│   └── users.service.ts        (+ update)
├── courses/
│   ├── courses.controller.ts   (+ POST, PATCH, DELETE)
│   └── courses.service.ts      (+ create, update, delete)
├── assignments/
│   ├── assignments.controller.ts (+ POST, PATCH, DELETE)
│   └── assignments.service.ts    (+ create, update, delete)
├── submissions/
│   ├── submissions.controller.ts (+ POST, PATCH)
│   └── submissions.service.ts    (+ create, update, submit)
├── grades/
│   ├── grades.controller.ts      (+ POST, PATCH)
│   └── grades.service.ts         (+ create, update)
├── reflections/
│   ├── reflections.controller.ts (+ POST)
│   └── reflections.service.ts    (+ create response)
└── comments/
    ├── comments.controller.ts    (+ POST, PATCH, DELETE)
    └── comments.service.ts       (+ create, update, delete)

apps/web-start/src/
├── hooks/
│   └── mutations/
│       ├── useCreateMutation.ts
│       ├── useUpdateMutation.ts
│       └── useDeleteMutation.ts
├── components/
│   ├── assignments/
│   │   ├── AssignmentForm.tsx
│   │   ├── AssignmentList.tsx
│   │   └── DeleteAssignmentButton.tsx
│   ├── courses/
│   │   ├── CourseForm.tsx
│   │   └── EnrollmentManager.tsx
│   ├── submissions/
│   │   ├── SubmissionForm.tsx
│   │   └── SubmissionStatus.tsx
│   ├── grades/
│   │   ├── GradeForm.tsx
│   │   └── GradeDisplay.tsx
│   └── common/
│       ├── Modal.tsx
│       ├── ConfirmDialog.tsx
│       └── Toast.tsx
└── routes/
    ├── course.$id.assignments.index.tsx  (+ CRUD UI)
    ├── course.$id.submissions.tsx        (NEW)
    ├── course.$id.grades.tsx             (+ grading UI)
    └── profile.tsx                       (+ edit form)
```

---

## Testing Strategy

### Unit Tests

**Backend** (`apps/api/src/**/*.spec.ts`):
```typescript
describe('AssignmentsService', () => {
  it('should create assignment with valid DTO', async () => {
    const dto: CreateAssignmentDto = { /* valid data */ };
    const result = await service.create(dto, userId);
    expect(result).toBeDefined();
    expect(result.title).toBe(dto.title);
  });

  it('should reject invalid DTO', async () => {
    const dto = { title: '' }; // Invalid
    await expect(service.create(dto, userId)).rejects.toThrow();
  });
});
```

**Frontend** (`apps/web-start/src/**/*.test.tsx`):
```typescript
describe('AssignmentForm', () => {
  it('should validate required fields', () => {
    render(<AssignmentForm />);
    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
describe('Assignment CRUD Flow', () => {
  it('should create, read, update, delete assignment', async () => {
    // Create
    const created = await request(app).post('/assignments').send(createDto);
    expect(created.status).toBe(201);

    // Read
    const read = await request(app).get(`/assignments/${created.body.id}`);
    expect(read.body.title).toBe(createDto.title);

    // Update
    const updated = await request(app).patch(`/assignments/${created.body.id}`).send(updateDto);
    expect(updated.body.title).toBe(updateDto.title);

    // Delete
    const deleted = await request(app).delete(`/assignments/${created.body.id}`);
    expect(deleted.status).toBe(200);
  });
});
```

### E2E Tests

```typescript
test('professor can create assignment and student can submit', async ({ page }) => {
  // Login as professor
  await page.goto('/login');
  await page.fill('[name="email"]', 'professor@test.com');
  await page.click('button[type="submit"]');

  // Create assignment
  await page.goto('/course/cisc474/assignments');
  await page.click('text=Create Assignment');
  await page.fill('[name="title"]', 'Homework 1');
  await page.click('button:has-text("Create")');

  // Verify created
  await expect(page.locator('text=Homework 1')).toBeVisible();

  // Switch to student
  // ... submit workflow ...
});
```

---

## Success Criteria

### Assignment Requirement Met ✅
- [ ] One entity (Assignments) has full CRUD
- [ ] DTOs in `packages/api`
- [ ] Zod validation working
- [ ] Forms with create, edit, delete
- [ ] TanStack Query mutations
- [ ] Cache invalidation

### Bonus: Full System ⭐
- [ ] All core entities have DTOs
- [ ] 80%+ of CRUD operations implemented
- [ ] Consistent patterns across all entities
- [ ] Comprehensive error handling
- [ ] Loading states everywhere
- [ ] Type safety end-to-end

---

## Next Steps

1. **Review this document** - Ensure understanding of architecture
2. **Start with Phase 1** - Build foundation first
3. **Implement Phase 2** - Complete assignment requirement (Assignments CRUD)
4. **Continue phases as time allows** - Build out full system
5. **Document as you go** - Update session checkpoints

---

**Document Status**: Complete Planning
**Ready For**: Implementation
**Estimated Total Time**: 20-30 hours for full system, 4-6 hours for assignment minimum
