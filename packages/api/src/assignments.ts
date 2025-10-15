/**
 * Assignment DTOs
 *
 * Data Transfer Objects for Assignment entity operations.
 * These DTOs define the contract between frontend and backend for assignments.
 *
 * DTO Types:
 * - Response: Full assignment data for detail views
 * - ListItem: Lightweight assignment data for list views
 * - Create: Data required to create a new assignment
 * - Update: Data that can be updated on existing assignment
 * - Query: Filter/search parameters for assignment lists
 */

import { z } from 'zod';
import {
  AssignmentTypeSchema,
  CuidSchema,
  DateTimeSchema,
  NonEmptyStringSchema,
  UserReferenceSchema,
  CourseReferenceSchema,
} from './common';

// ============================================================================
// Assignment Response DTO - Full Data
// ============================================================================

/**
 * Full assignment response with all fields and nested relations
 *
 * Used for:
 * - Assignment detail pages
 * - After create/update operations
 * - When full assignment data is needed
 */
export const AssignmentResponseSchema = z.object({
  // Core fields
  id: CuidSchema,
  title: z.string(),
  description: z.string(),
  type: AssignmentTypeSchema,
  maxPoints: z.number().int(),
  dueDate: DateTimeSchema,
  instructions: z.array(z.string()).nullable(),
  isPublished: z.boolean(),

  // Timestamps
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,

  // Foreign keys
  courseId: CuidSchema,
  createdById: CuidSchema,

  // Nested relations (simplified)
  course: CourseReferenceSchema,
  createdBy: UserReferenceSchema,

  // Computed/aggregated fields (optional - may not always be included)
  submissionCount: z.number().int().optional(),
  gradedCount: z.number().int().optional(),
  averageScore: z.number().optional(),
});

export type AssignmentResponse = z.infer<typeof AssignmentResponseSchema>;

// ============================================================================
// Assignment List Item DTO - Lightweight
// ============================================================================

/**
 * Lightweight assignment data for list views
 *
 * Used for:
 * - Assignment list pages
 * - Course assignment overviews
 * - When minimal data is sufficient
 */
export const AssignmentListItemSchema = z.object({
  id: CuidSchema,
  title: z.string(),
  type: AssignmentTypeSchema,
  dueDate: DateTimeSchema,
  maxPoints: z.number().int(),
  isPublished: z.boolean(),
  courseId: CuidSchema,

  // Optional computed fields for list display
  submissionCount: z.number().int().optional(),
});

export type AssignmentListItem = z.infer<typeof AssignmentListItemSchema>;

// ============================================================================
// Create Assignment DTO - Input for POST
// ============================================================================

/**
 * Data required to create a new assignment
 *
 * Used for:
 * - POST /assignments
 * - Assignment creation forms
 *
 * Validation rules:
 * - title: 1-200 characters
 * - description: 1-10000 characters
 * - maxPoints: 0-1000
 * - dueDate: ISO 8601 datetime string
 * - instructions: optional array of strings
 * - isPublished: defaults to false
 * - courseId: must be valid CUID
 */
export const CreateAssignmentSchema = z.object({
  title: NonEmptyStringSchema.max(200, 'Title must be 200 characters or less'),
  description: NonEmptyStringSchema.max(10000, 'Description must be 10000 characters or less'),
  type: AssignmentTypeSchema,
  maxPoints: z.number().int().min(0, 'Points cannot be negative').max(1000, 'Maximum 1000 points'),
  dueDate: DateTimeSchema,
  instructions: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
  courseId: CuidSchema,
});

export type CreateAssignmentDto = z.infer<typeof CreateAssignmentSchema>;

// ============================================================================
// Update Assignment DTO - Input for PATCH
// ============================================================================

/**
 * Data that can be updated on an existing assignment
 *
 * Used for:
 * - PATCH /assignments/:id
 * - Assignment edit forms
 *
 * All fields are optional - only provided fields will be updated.
 * Validation rules same as CreateAssignmentSchema.
 */
export const UpdateAssignmentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(10000).optional(),
  type: AssignmentTypeSchema.optional(),
  maxPoints: z.number().int().min(0).max(1000).optional(),
  dueDate: DateTimeSchema.optional(),
  instructions: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export type UpdateAssignmentDto = z.infer<typeof UpdateAssignmentSchema>;

// ============================================================================
// Assignment Query DTO - Filter/Search Parameters
// ============================================================================

/**
 * Query parameters for filtering/searching assignments
 *
 * Used for:
 * - GET /assignments?courseId=...&type=...&isPublished=true
 * - Filtered assignment lists
 *
 * All filters are optional and can be combined.
 */
export const AssignmentQuerySchema = z.object({
  courseId: CuidSchema.optional(),
  type: AssignmentTypeSchema.optional(),
  isPublished: z.boolean().optional(),
  dueBefore: DateTimeSchema.optional(),
  dueAfter: DateTimeSchema.optional(),
  createdById: CuidSchema.optional(),
});

export type AssignmentQuery = z.infer<typeof AssignmentQuerySchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates CreateAssignmentDto and returns validation errors if any
 *
 * @param data - Data to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateCreateAssignment(data: unknown): Array<string> {
  const result = CreateAssignmentSchema.safeParse(data);
  if (result.success) {
    return [];
  }
  return result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
}

/**
 * Validates UpdateAssignmentDto and returns validation errors if any
 *
 * @param data - Data to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateUpdateAssignment(data: unknown): Array<string> {
  const result = UpdateAssignmentSchema.safeParse(data);
  if (result.success) {
    return [];
  }
  return result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
}
