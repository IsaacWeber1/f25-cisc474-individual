/**
 * Common DTO Schemas and Types
 *
 * Shared schemas used across all entity DTOs to ensure consistency
 * and reduce duplication. All DTOs in this package should use these
 * base schemas where applicable.
 */

import { z } from 'zod';

// ============================================================================
// Base Field Schemas
// ============================================================================

/**
 * CUID identifier schema - used for all entity IDs
 */
export const CuidSchema = z.string().cuid();

/**
 * ISO 8601 datetime string schema - used for all dates
 */
export const DateTimeSchema = z.string().datetime();

/**
 * Email validation schema
 */
export const EmailSchema = z.string().email();

/**
 * Non-empty string schema - common for required text fields
 */
export const NonEmptyStringSchema = z.string().min(1);

// ============================================================================
// Pagination and Query Schemas
// ============================================================================

/**
 * Standard pagination parameters for list endpoints
 *
 * @example
 * GET /assignments?page=1&pageSize=20&sortBy=dueDate&sortOrder=desc
 */
export const PaginationQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

/**
 * Generic paginated response wrapper
 *
 * @param itemSchema - Zod schema for the items being paginated
 * @returns Schema for paginated response with items array and metadata
 *
 * @example
 * const PaginatedAssignmentsSchema = PaginatedResponseSchema(AssignmentListItemSchema);
 */
export function PaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    totalPages: z.number().int().min(0),
    hasMore: z.boolean(),
  });
}

export type PaginatedResponse<T> = {
  items: Array<T>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
};

// ============================================================================
// Standard Response Schemas
// ============================================================================

/**
 * Standard delete operation response
 *
 * Used when an entity is successfully deleted to confirm the operation
 * and provide a human-readable message.
 */
export const DeleteResponseSchema = z.object({
  id: CuidSchema,
  deleted: z.boolean(),
  message: z.string(),
});

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

/**
 * Standard error response schema
 *
 * Matches NestJS HttpException format for consistency
 */
export const ErrorResponseSchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string().optional(),
  details: z.unknown().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Standard success message response
 *
 * Used for operations that don't return data but need to confirm success
 */
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown().optional(),
});

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

// ============================================================================
// Common Nested Object Schemas
// ============================================================================

/**
 * Simplified user reference for nested objects
 *
 * Used when including user data in other entity responses without
 * exposing full user details or sensitive information.
 */
export const UserReferenceSchema = z.object({
  id: CuidSchema,
  name: z.string(),
  email: EmailSchema,
});

export type UserReference = z.infer<typeof UserReferenceSchema>;

/**
 * Simplified course reference for nested objects
 */
export const CourseReferenceSchema = z.object({
  id: CuidSchema,
  code: z.string(),
  title: z.string(),
  semester: z.string(),
});

export type CourseReference = z.infer<typeof CourseReferenceSchema>;

// ============================================================================
// Enum Schemas (from Prisma)
// ============================================================================

/**
 * User role enumeration
 */
export const RoleSchema = z.enum(['STUDENT', 'TA', 'PROFESSOR', 'ADMIN']);
export type Role = z.infer<typeof RoleSchema>;

/**
 * Assignment type enumeration
 */
export const AssignmentTypeSchema = z.enum(['FILE', 'TEXT', 'REFLECTION']);
export type AssignmentType = z.infer<typeof AssignmentTypeSchema>;

/**
 * Submission status enumeration
 */
export const SubmissionStatusSchema = z.enum(['DRAFT', 'SUBMITTED', 'GRADED', 'LATE']);
export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Creates a schema for partial updates (all fields optional)
 *
 * @param schema - Base Zod object schema to make partial
 * @returns Schema with all fields optional
 *
 * @example
 * const CreateCourseSchema = z.object({ title: z.string(), code: z.string() });
 * const UpdateCourseSchema = makePartial(CreateCourseSchema);
 */
export function makePartial<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.partial();
}

/**
 * Validates that at least one field is provided in update operations
 *
 * @param data - Object to validate
 * @returns True if at least one field is present
 */
export function hasAtLeastOneField(data: Record<string, unknown>): boolean {
  return Object.keys(data).length > 0;
}

// ============================================================================
// Transform Helpers
// ============================================================================

/**
 * Transforms Prisma Date objects to ISO string format for JSON responses
 * This is a schema-level transform, use dto-transformer.ts for runtime transforms
 */
export const DateTransform = z.date().transform((date) => date.toISOString());

/**
 * Transforms ISO string to Date object for database operations
 */
export const StringToDateTransform = z.string().datetime().transform((str) => new Date(str));
