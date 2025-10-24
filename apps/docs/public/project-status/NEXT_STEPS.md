# Next Steps - Focused Implementation Guide

**Last Updated**: 2025-10-23
**Current Status**: Authentication ✅ | Database ✅ | Ready for CRUD Implementation

---

## 🎯 Your Mission (Phase 1)

**Goal**: Enable students to submit work and TAs to grade it

**Time Required**: 9-13 hours

**Impact**: Transforms read-only system into functional LMS

---

## 📋 Step-by-Step Implementation

### Step 1: Submissions CRUD (4-6 hours) ⭐ START HERE

#### 1.1 Generate Boilerplate (2 min)
```bash
cd apps/api
npx nest g module submissions
npx nest g controller submissions --no-spec
npx nest g service submissions --no-spec
```

#### 1.2 Create DTOs (15 min)
```bash
mkdir src/submissions/dto
```

Create `src/submissions/dto/create-submission.dto.ts`:
```typescript
import { AssignmentType, SubmissionStatus } from '@prisma/client';

export class CreateSubmissionDto {
  assignmentId: string;
  type: AssignmentType;
  content?: string;
  files?: any; // JSON array of file metadata
}
```

Create `src/submissions/dto/update-submission.dto.ts`:
```typescript
export class UpdateSubmissionDto {
  content?: string;
  files?: any;
  status?: SubmissionStatus;
}
```

#### 1.3 Implement Service (2-3 hours)
Add to `src/submissions/submissions.service.ts`:
```typescript
async create(dto: CreateSubmissionDto, userId: string) {
  return this.prisma.submission.create({
    data: {
      ...dto,
      studentId: userId,
      status: 'DRAFT',
      createdAt: new Date(),
    },
  });
}

async update(id: string, dto: UpdateSubmissionDto, userId: string) {
  // Verify ownership
  const submission = await this.prisma.submission.findUnique({
    where: { id },
  });

  if (submission.studentId !== userId) {
    throw new ForbiddenException('Not your submission');
  }

  if (submission.status === 'GRADED') {
    throw new ForbiddenException('Cannot edit graded submission');
  }

  return this.prisma.submission.update({
    where: { id },
    data: dto,
  });
}

async submit(id: string, userId: string) {
  return this.update(id, {
    status: 'SUBMITTED',
    submittedAt: new Date(),
  }, userId);
}
```

#### 1.4 Add Controller Endpoints (1 hour)
Add to `src/submissions/submissions.controller.ts`:
```typescript
@Post()
@UseGuards(AuthGuard('jwt'))
create(@Body() dto: CreateSubmissionDto, @CurrentUser() user: any) {
  return this.submissionsService.create(dto, user.sub);
}

@Patch(':id')
@UseGuards(AuthGuard('jwt'))
update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto, @CurrentUser() user: any) {
  return this.submissionsService.update(id, dto, user.sub);
}

@Post(':id/submit')
@UseGuards(AuthGuard('jwt'))
submit(@Param('id') id: string, @CurrentUser() user: any) {
  return this.submissionsService.submit(id, user.sub);
}
```

#### 1.5 Test It (30 min)
```bash
# Manual test with curl (after getting token from browser)
TOKEN="your_jwt_token_here"

# Create submission
curl -X POST http://localhost:3000/submissions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"assignmentId":"assignment-react-components-2","type":"TEXT","content":"My submission"}'

# Update submission
curl -X PATCH http://localhost:3000/submissions/SUBMISSION_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated content"}'

# Submit for grading
curl -X POST http://localhost:3000/submissions/SUBMISSION_ID/submit \
  -H "Authorization: Bearer $TOKEN"
```

---

### Step 2: Grades CRUD (3-4 hours)

#### 2.1 Generate Boilerplate (2 min)
```bash
cd apps/api/src/grades
# Service and controller already exist, just add methods
```

#### 2.2 Create DTOs (10 min)
Create `src/grades/dto/create-grade.dto.ts`:
```typescript
export class CreateGradeDto {
  submissionId: string;
  score: number;
  maxScore: number;
  feedback?: string;
}
```

Create `src/grades/dto/update-grade.dto.ts`:
```typescript
export class UpdateGradeDto {
  score: number;
  reason: string; // Required for audit trail
}
```

#### 2.3 Implement Service (2-3 hours)
Add to `src/grades/grades.service.ts`:
```typescript
async create(dto: CreateGradeDto, graderId: string) {
  // Validate score
  if (dto.score < 0 || dto.score > dto.maxScore) {
    throw new BadRequestException('Invalid score');
  }

  // Check if already graded
  const existing = await this.prisma.grade.findUnique({
    where: { submissionId: dto.submissionId },
  });

  if (existing) {
    throw new ConflictException('Already graded');
  }

  // Create grade and update submission status
  return this.prisma.$transaction(async (tx) => {
    const grade = await tx.grade.create({
      data: {
        ...dto,
        gradedById: graderId,
        gradedAt: new Date(),
      },
    });

    await tx.submission.update({
      where: { id: dto.submissionId },
      data: { status: 'GRADED' },
    });

    return grade;
  });
}

async update(id: string, dto: UpdateGradeDto, userId: string) {
  const grade = await this.prisma.grade.findUnique({ where: { id } });

  return this.prisma.$transaction(async (tx) => {
    // Create audit record
    await tx.gradeChange.create({
      data: {
        gradeId: id,
        oldScore: grade.score,
        newScore: dto.score,
        reason: dto.reason,
        changedById: userId,
      },
    });

    // Update grade
    return tx.grade.update({
      where: { id },
      data: { score: dto.score },
    });
  });
}
```

#### 2.4 Add Controller Endpoints (30 min)
Add to `src/grades/grades.controller.ts`:
```typescript
@Post()
@UseGuards(AuthGuard('jwt'))
create(@Body() dto: CreateGradeDto, @CurrentUser() user: any) {
  return this.gradesService.create(dto, user.sub);
}

@Patch(':id')
@UseGuards(AuthGuard('jwt'))
update(@Param('id') id: string, @Body() dto: UpdateGradeDto, @CurrentUser() user: any) {
  return this.gradesService.update(id, dto, user.sub);
}
```

---

### Step 3: Comments CRUD (2-3 hours)

#### 3.1 Generate Boilerplate (2 min)
```bash
cd apps/api
npx nest g module comments
npx nest g controller comments --no-spec
npx nest g service comments --no-spec
```

#### 3.2 Create DTOs (10 min)
```typescript
export class CreateCommentDto {
  submissionId: string;
  content: string;
  parentId?: string; // For threading
}
```

#### 3.3 Implement Service (1-2 hours)
```typescript
async create(dto: CreateCommentDto, userId: string) {
  return this.prisma.comment.create({
    data: {
      ...dto,
      userId,
      createdAt: new Date(),
    },
    include: {
      user: true,
      replies: true,
    },
  });
}

async findBySubmission(submissionId: string) {
  return this.prisma.comment.findMany({
    where: {
      submissionId,
      parentId: null, // Only top-level
    },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
```

#### 3.4 Add Controller Endpoints (30 min)
```typescript
@Get('submission/:id')
@UseGuards(AuthGuard('jwt'))
findBySubmission(@Param('id') id: string) {
  return this.commentsService.findBySubmission(id);
}

@Post()
@UseGuards(AuthGuard('jwt'))
create(@Body() dto: CreateCommentDto, @CurrentUser() user: any) {
  return this.commentsService.create(dto, user.sub);
}
```

---

## ✅ Definition of Done (Phase 1)

Before moving to Phase 2, verify:

- [ ] **Submissions**:
  - [ ] Students can create draft submissions
  - [ ] Students can update draft submissions
  - [ ] Students can submit for grading
  - [ ] Cannot edit after graded

- [ ] **Grades**:
  - [ ] TAs can create grades
  - [ ] TAs can update grades (with audit trail)
  - [ ] Grade changes create GradeChange records
  - [ ] Submission status updates to GRADED

- [ ] **Comments**:
  - [ ] Users can add comments to submissions
  - [ ] Comments support threading (replies)
  - [ ] Comments display with user info

- [ ] **Testing**:
  - [ ] Manual curl tests pass
  - [ ] Browser workflow tested
  - [ ] No console errors

---

## 🧪 Quick Testing Commands

### Get JWT Token
1. Login at http://localhost:3001
2. Open browser console (F12)
3. Run: `localStorage.getItem('@@auth0spajs@@::CLIENT_ID::AUDIENCE::openid profile email')`
4. Extract `access_token` from JSON

### Test Submissions
```bash
TOKEN="paste_token_here"

# Create
curl -X POST http://localhost:3000/submissions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assignmentId": "assignment-react-components-2",
    "type": "TEXT",
    "content": "My React components implementation"
  }'

# Should return: {"id": "...", "status": "DRAFT", ...}
```

### Test Grades
```bash
# Create grade (use submission ID from above)
curl -X POST http://localhost:3000/grades \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "submissionId": "SUBMISSION_ID",
    "score": 85,
    "maxScore": 100,
    "feedback": "Great work!"
  }'
```

### Test Comments
```bash
# Add comment
curl -X POST http://localhost:3000/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "submissionId": "SUBMISSION_ID",
    "content": "Nice implementation!"
  }'
```

---

## 📚 Reference Documentation

### Need Help?
- **Testing Guide**: `/apps/docs/public/testing/QUICK_REFERENCE.md`
- **Full Status**: `/IMPLEMENTATION_STATUS.md`
- **Session 010 Checkpoint**: `/apps/docs/public/authentication/sessions/010_*/CHECKPOINT.md`

### Common Issues
- **401 Unauthorized**: Token expired, login again
- **403 Forbidden**: User doesn't own resource
- **400 Bad Request**: Check DTO validation
- **500 Server Error**: Check API logs

---

## 🚀 After Phase 1

Once Phase 1 is complete, you'll have a **functional LMS** where:
- ✅ Students can submit assignments
- ✅ TAs can grade submissions
- ✅ Everyone can discuss via comments
- ✅ Full audit trail of grade changes

**Next Phase**: Course Management (POST/PATCH/DELETE courses, enrollment management)

**Estimated Time**: 6-8 more hours

---

---

## 💻 Starting the Development Servers

From the project root, run:
```bash
npm run dev
```

This single command starts both:
- **Backend API** on http://localhost:3000
- **Frontend** on http://localhost:3001

No need for separate terminals or filter flags - the turbo monorepo handles both!

---

**Start Now**: Step 1.1 - Generate Submissions Boilerplate ⬆️