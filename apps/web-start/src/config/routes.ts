/**
 * Type-safe route builders
 * Prevents typos and provides auto-complete
 * Created: 2025-10-10 (Architecture Refactor Phase 1)
 */

export const ROUTES = {
  // Static routes
  home: '/',
  courses: '/courses',
  profile: '/profile',
  users: '/users',

  // Dynamic routes - type-safe builders
  course: (id: string) => `/course/${id}` as const,
  courseAssignments: (id: string) => `/course/${id}/assignments` as const,
  courseAssignment: (courseId: string, assignmentId: string) =>
    `/course/${courseId}/assignments/${assignmentId}` as const,
  courseGrades: (id: string) => `/course/${id}/grades` as const,
  courseReflections: (id: string) => `/course/${id}/reflections` as const,
  courseReflection: (courseId: string, reflectionId: string) =>
    `/course/${courseId}/reflections/${reflectionId}` as const,
} as const;

// Type helpers for params
export type CourseParams = { id: string };
export type AssignmentParams = { id: string; assignmentId: string };
export type ReflectionParams = { id: string; reflectionId: string };
