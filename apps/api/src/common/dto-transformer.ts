/**
 * DTO Transformation Utilities
 *
 * Backend utilities for transforming Prisma models to DTOs.
 * These helpers ensure consistent data transformation across all controllers.
 *
 * Key responsibilities:
 * - Convert Date objects to ISO strings for JSON responses
 * - Strip sensitive fields from user objects
 * - Handle nested relations consistently
 * - Provide pagination metadata calculation
 */

import type { PaginatedResponse } from '@repo/api/common';

// ============================================================================
// Date Transformation
// ============================================================================

/**
 * Recursively transforms all Date objects in an object to ISO string format
 *
 * Prisma returns Date objects, but JSON responses should use ISO strings.
 * This function handles nested objects and arrays automatically.
 *
 * @param obj - Object potentially containing Date fields
 * @returns Same object with Dates converted to ISO strings
 *
 * @example
 * const assignment = await prisma.assignment.findUnique({ where: { id } });
 * return transformDates(assignment); // All dates are now strings
 */
export function transformDates<T extends Record<string, unknown>>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  const result = { ...obj };

  for (const key in result) {
    const value = result[key];

    if (value instanceof Date) {
      // Transform Date to ISO string
      (result as Record<string, unknown>)[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      // Recursively transform array items
      (result as Record<string, unknown>)[key] = value.map((item) =>
        typeof item === 'object' && item !== null ? transformDates(item as Record<string, unknown>) : item,
      );
    } else if (typeof value === 'object' && value !== null) {
      // Recursively transform nested objects
      (result as Record<string, unknown>)[key] = transformDates(value as Record<string, unknown>);
    }
  }

  return result;
}

// ============================================================================
// User Sanitization
// ============================================================================

/**
 * Strips sensitive fields from user objects before sending to frontend
 *
 * Never send password hashes, tokens, or other sensitive data to the client.
 * This function removes these fields while preserving the rest of the user data.
 *
 * @param user - User object from database
 * @returns User object without sensitive fields
 *
 * @example
 * const user = await prisma.user.findUnique({ where: { id } });
 * return sanitizeUser(user);
 */
export function sanitizeUser<T extends Record<string, unknown>>(user: T): Omit<T, 'password'> {
  if (typeof user !== 'object' || user === null) {
    return user as Omit<T, 'password'>;
  }

  // Remove sensitive fields
  const { password, ...safeUser } = user as T & { password?: unknown };

  return safeUser as Omit<T, 'password'>;
}

/**
 * Sanitizes multiple user objects (for arrays of users)
 *
 * @param users - Array of user objects
 * @returns Array of sanitized user objects
 */
export function sanitizeUsers<T extends Record<string, unknown>>(users: Array<T>): Array<Omit<T, 'password'>> {
  return users.map((user) => sanitizeUser(user));
}

// ============================================================================
// Pagination Helpers
// ============================================================================

/**
 * Calculates pagination metadata from query params and total count
 *
 * @param total - Total number of items in database
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Pagination metadata object
 *
 * @example
 * const total = await prisma.assignment.count();
 * const assignments = await prisma.assignment.findMany({ skip, take: pageSize });
 * const metadata = calculatePaginationMetadata(total, page, pageSize);
 * return { ...metadata, items: assignments };
 */
export function calculatePaginationMetadata(
  total: number,
  page: number,
  pageSize: number,
): Omit<PaginatedResponse<unknown>, 'items'> {
  const totalPages = Math.ceil(total / pageSize);
  const hasMore = page < totalPages;

  return {
    total,
    page,
    pageSize,
    totalPages,
    hasMore,
  };
}

/**
 * Calculates skip value for Prisma pagination
 *
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Number of items to skip
 *
 * @example
 * const skip = calculateSkip(2, 20); // Returns 20 (skip first page)
 * const items = await prisma.assignment.findMany({ skip, take: 20 });
 */
export function calculateSkip(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

// ============================================================================
// Nested Relation Helpers
// ============================================================================

/**
 * Extracts simplified user reference from full user object
 *
 * Use this when including user data in nested relations to avoid
 * sending full user profiles everywhere.
 *
 * @param user - Full user object from Prisma
 * @returns Simplified user reference with id, name, email
 *
 * @example
 * const assignment = await prisma.assignment.findUnique({
 *   include: { createdBy: true }
 * });
 * return {
 *   ...assignment,
 *   createdBy: extractUserReference(assignment.createdBy)
 * };
 */
export function extractUserReference(
  user: { id: string; name: string; email: string } | null | undefined,
): { id: string; name: string; email: string } | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Extracts simplified course reference from full course object
 *
 * @param course - Full course object from Prisma
 * @returns Simplified course reference
 */
export function extractCourseReference(
  course: { id: string; code: string; title: string; semester: string } | null | undefined,
): { id: string; code: string; title: string; semester: string } | null {
  if (!course) {
    return null;
  }

  return {
    id: course.id,
    code: course.code,
    title: course.title,
    semester: course.semester,
  };
}

// ============================================================================
// JSON Field Helpers
// ============================================================================

/**
 * Safely parses JSON fields from Prisma
 *
 * Prisma returns Json fields as unknown, this provides type-safe parsing.
 *
 * @param json - JSON value from Prisma
 * @param defaultValue - Fallback if json is null/invalid
 * @returns Parsed value or default
 *
 * @example
 * const instructions = parseJsonField<string[]>(assignment.instructions, []);
 */
export function parseJsonField<T>(json: unknown, defaultValue: T): T {
  if (json === null || json === undefined) {
    return defaultValue;
  }

  // Prisma Json fields are already parsed objects, just need type assertion
  return json as T;
}

// ============================================================================
// Validation Response Helpers
// ============================================================================

/**
 * Creates a standardized validation error response
 *
 * @param errors - Validation error messages
 * @returns Error response object
 *
 * @example
 * if (!title) {
 *   throw new BadRequestException(
 *     createValidationError(['Title is required'])
 *   );
 * }
 */
export function createValidationError(errors: Array<string>): {
  statusCode: number;
  message: Array<string>;
  error: string;
} {
  return {
    statusCode: 400,
    message: errors,
    error: 'Validation Error',
  };
}

/**
 * Creates a standardized not found error response
 *
 * @param entityName - Name of entity that wasn't found
 * @param id - ID that was searched for
 * @returns Error response object
 */
export function createNotFoundError(entityName: string, id: string): {
  statusCode: number;
  message: string;
  error: string;
} {
  return {
    statusCode: 404,
    message: `${entityName} with ID ${id} not found`,
    error: 'Not Found',
  };
}
