# Submissions Feature

## Overview

Enable students to create, edit, and submit assignments for grading. Supports multiple submission types (FILE, TEXT, REFLECTION) with validation and status tracking.

---

## Core Documentation

### Current State
- **[CURRENT_STATE.md](./CURRENT_STATE.md)** - ⭐ Start here for current status and next steps

### Planning
- **[planning/IMPLEMENTATION_PLAN.md](./planning/IMPLEMENTATION_PLAN.md)** - Step-by-step implementation guide

### Sessions
- No sessions yet (feature not started)

---

## Key Features

**Target Functionality**:
- ✅ View existing submissions (GET operations working)
- ❌ Create draft submissions (POST /submissions)
- ❌ Update draft submissions (PATCH /submissions/:id)
- ❌ Submit for grading (POST /submissions/:id/submit)
- ❌ Delete submissions (DELETE /submissions/:id)
- ❌ File upload handling
- ❌ Due date validation
- ❌ Submission type validation

---

## Quick Start

### Prerequisites
- ✅ Authentication system operational
- ✅ Database schema includes Submission model
- ✅ Prisma client generated

### Implementation Steps

1. **Generate NestJS Components** (2 min)
   ```bash
   cd apps/api
   npx nest g module submissions
   npx nest g controller submissions --no-spec
   npx nest g service submissions --no-spec
   ```

2. **Create DTOs** (15 min)
   ```bash
   mkdir -p src/submissions/dto
   # Create CreateSubmissionDto and UpdateSubmissionDto
   ```

3. **Implement Service** (2-3 hours)
   - create() - Create draft submission
   - update() - Update draft (with ownership check)
   - submit() - Transition DRAFT → SUBMITTED
   - delete() - Remove submission (with validation)

4. **Add Controller Endpoints** (1 hour)
   - POST /submissions - @UseGuards(AuthGuard('jwt'))
   - PATCH /submissions/:id - With ownership validation
   - POST /submissions/:id/submit - Final submission
   - DELETE /submissions/:id - With safety checks

5. **Test** (30 min)
   - Manual testing with curl + JWT token
   - Verify ownership checks
   - Test status transitions
   - Validate error handling

---

## Architecture Summary

### Database Model
```prisma
model Submission {
  id            String           @id @default(cuid())
  type          AssignmentType   // FILE, TEXT, REFLECTION
  content       String?          // For TEXT submissions
  files         Json?            // For FILE submissions (array of metadata)
  status        SubmissionStatus @default(DRAFT) // DRAFT, SUBMITTED, GRADED
  submittedAt   DateTime?

  // Relations
  assignmentId  String
  assignment    Assignment       @relation(...)
  studentId     String
  student       User             @relation(...)
  grade         Grade?
  comments      Comment[]
}

enum SubmissionStatus {
  DRAFT
  SUBMITTED
  GRADED
}
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /submissions | ✅ | List user's submissions |
| GET | /submissions/:id | ✅ | Get submission details |
| POST | /submissions | ✅ | Create draft submission |
| PATCH | /submissions/:id | ✅ | Update draft submission |
| POST | /submissions/:id/submit | ✅ | Submit for grading |
| DELETE | /submissions/:id | ✅ | Delete submission |

### Status Transitions

```
DRAFT ──submit()──> SUBMITTED ──grade()──> GRADED
  │                                           │
  └──delete()───X                            └─(cannot delete)
```

---

## Current Status

**Phase**: Not started
**Priority**: ⭐ #1 HIGHEST - Unblocks student workflow
**Estimated Time**: 4-6 hours
**Dependencies**:
- ✅ Authentication (COMPLETE)
- ✅ Database schema (COMPLETE)

**Blocks**:
- Grades (need submissions to grade)
- Comments (need submissions to comment on)
- Reflections (special submission type)

---

## Related Documentation

- **Master Tracking**: [/apps/docs/public/ACTIVE_FEATURES.md](../ACTIVE_FEATURES.md)
- **Implementation Guide**: [/NEXT_STEPS.md](/NEXT_STEPS.md)
- **Testing Guide**: [/apps/docs/public/testing/QUICK_REFERENCE.md](../../testing/QUICK_REFERENCE.md)

---

## Next Steps

**🔴 To start this feature**:
1. Read [CURRENT_STATE.md](./CURRENT_STATE.md)
2. Read [planning/IMPLEMENTATION_PLAN.md](./planning/IMPLEMENTATION_PLAN.md)
3. Create branch: `git checkout -b feat/submissions`
4. Generate NestJS components (see Quick Start above)
5. Begin implementation following the plan

---

**Status**: 🟡 PLANNING COMPLETE - Ready to implement
**Last Updated**: 2025-10-24
