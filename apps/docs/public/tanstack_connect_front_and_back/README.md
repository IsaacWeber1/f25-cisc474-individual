# TanStack Frontend-Backend Connection with DTOs

**Status**: Planning → Implementation
**Priority**: HIGH
**Timeline**: 4-6 hours (assignment minimum), 20-30 hours (full system)

## Problem
Application lacks proper Data Transfer Objects (DTOs), resulting in exposed Prisma models, no validation layer, type mismatches between frontend/backend, and CRUD operations limited to GET only.

## Solution
Implement Zod-validated DTOs in shared `packages/api` package, create full CRUD operations in NestJS backend, build TanStack Query mutations on frontend with cache invalidation.

## Quick Links
- [Current State](CURRENT_STATE.md) ← **START HERE**
- [Requirements](planning/REQUIREMENTS.md) (Professor's assignment)
- [Implementation Plan](planning/IMPLEMENTATION_PLAN.md) (Full system architecture)
- [Architecture](architecture/) (DTO design patterns)
- [Latest Checkpoint](sessions/001_planning/CHECKPOINT.md)

## Scope Options

### Minimum (Assignment Requirement)
- DTOs for Assignments entity only
- Full CRUD on `/assignments` endpoint
- Forms for create, edit, delete
- **Time**: 4-6 hours

### Full System (Recommended)
- DTOs for all 8+ entities
- Complete CRUD across repository
- Shared infrastructure (hooks, helpers)
- **Time**: 20-30 hours

## Key Technologies
- **Zod**: Runtime validation + TypeScript inference
- **TanStack Query**: Mutations + cache management
- **NestJS**: Backend API framework
- **Prisma**: Database ORM

---

*See [CURRENT_STATE.md](CURRENT_STATE.md) for current progress and next actions.*
