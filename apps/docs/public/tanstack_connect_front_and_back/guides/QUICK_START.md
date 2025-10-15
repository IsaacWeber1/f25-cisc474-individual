# Quick Start Guide

**Goal**: Get Assignment CRUD working in 4-6 hours

## Prerequisites

- Dev environment running: `npm run dev --filter=web-start --filter=api`
- Backend at: http://localhost:3000
- Frontend at: http://localhost:3001

## Phase 1: Install Dependencies (5 min)

```bash
cd packages/api
npm install zod
```

## Phase 2: Create DTOs (30 min)

Create `packages/api/src/assignments.ts`:

```typescript
import { z } from 'zod';

// Response DTO
export const AssignmentResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['FILE', 'TEXT', 'REFLECTION']),
  maxPoints: z.number(),
  dueDate: z.string().datetime(),
  // ... add all fields
});

// Create DTO
export const CreateAssignmentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  // ... required fields only
});

// Update DTO
export const UpdateAssignmentSchema = CreateAssignmentSchema.partial();
```

Export from `packages/api/src/index.ts`:
```typescript
export * from './assignments';
```

## Phase 3: Backend CRUD (1 hour)

### Update Service (`apps/api/src/assignments/assignments.service.ts`):

```typescript
import { CreateAssignmentDto, UpdateAssignmentDto } from '@repo/api';

async create(dto: CreateAssignmentDto, userId: string) {
  return this.prisma.assignment.create({
    data: { ...dto, createdById: userId },
  });
}

async update(id: string, dto: UpdateAssignmentDto) {
  return this.prisma.assignment.update({
    where: { id },
    data: dto,
  });
}

async delete(id: string) {
  await this.prisma.assignment.delete({ where: { id } });
  return { id, deleted: true };
}
```

### Update Controller (`apps/api/src/assignments/assignments.controller.ts`):

```typescript
import { Post, Patch, Delete, Body } from '@nestjs/common';

@Post()
create(@Body() dto: CreateAssignmentDto) {
  return this.service.create(dto, 'current-user-id');
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

### Test Backend:

```bash
# Create
curl -X POST http://localhost:3000/assignments \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test assignment","type":"TEXT","maxPoints":100,"dueDate":"2025-12-31T00:00:00Z","courseId":"course-id"}'

# Update
curl -X PATCH http://localhost:3000/assignments/ASSIGNMENT_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Delete
curl -X DELETE http://localhost:3000/assignments/ASSIGNMENT_ID
```

## Phase 4: Frontend Forms (2 hours)

### Create Form Component (`apps/web-start/src/components/assignments/AssignmentForm.tsx`):

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateAssignmentDto } from '@repo/api';

export function AssignmentForm({ courseId, onSuccess }) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateAssignmentDto) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      onSuccess?.();
    },
  });

  // Form JSX with inputs...
}
```

### Add to Assignments Page (`apps/web-start/src/routes/course.$id.assignments.index.tsx`):

```typescript
const [showForm, setShowForm] = useState(false);

// In JSX:
<button onClick={() => setShowForm(true)}>+ Create Assignment</button>

{showForm && (
  <AssignmentForm
    courseId={courseId}
    onSuccess={() => setShowForm(false)}
  />
)}
```

## Phase 5: Test Full Flow (30 min)

1. Open browser: http://localhost:3001
2. Navigate to course → Assignments
3. Click "+ Create Assignment"
4. Fill form and submit
5. Verify new assignment appears in list
6. Click "Edit" on assignment
7. Modify and save
8. Verify changes appear
9. Click "Delete"
10. Confirm deletion
11. Verify assignment removed

## Success Criteria

- [x] Can create assignment via form
- [x] New assignment appears in list immediately
- [x] Can edit assignment
- [x] Changes reflect in UI
- [x] Can delete assignment
- [x] Assignment removed from list
- [x] No console errors
- [x] Backend returns proper DTOs
- [x] Cache invalidation works

## Common Issues

**Issue**: TypeScript can't find @repo/api
**Fix**: Run `npm install` in root, rebuild packages

**Issue**: CORS error
**Fix**: Check backend CORS allows localhost:3001

**Issue**: List doesn't update after create
**Fix**: Check cache invalidation in mutation's onSuccess

**Issue**: Backend validation fails
**Fix**: Check DTO matches what frontend sends

---

**Time Breakdown**:
- Setup: 5 min
- DTOs: 30 min
- Backend: 1 hour
- Frontend: 2 hours
- Testing: 30 min
- **Total**: ~4 hours

---

*See planning/IMPLEMENTATION_PLAN.md for full system implementation*
