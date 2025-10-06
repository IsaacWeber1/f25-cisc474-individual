// Client-side data provider - uses session from cookies via API route
import * as apiClient from './apiClient';

// Get current user ID from session cookie via API route
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.userId;
  } catch (error) {
    console.error('[dataProviderClient] Failed to get session:', error);
    return null;
  }
}

// Get current user from session
export async function getCurrentUser() {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error('No user session found. Please log in.');
  }

  return apiClient.getUserById(userId);
}

// Re-export all API client functions for convenience
export {
  getAllUsers,
  getUserById,
  getAllCourses,
  getCourseById,
  getCoursesByUser,
  getCoursesByStudent,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByCourse,
  getAllSubmissions,
  getSubmissionById,
  getSubmissionsByAssignment,
  getSubmissionByStudent,
  getAllGrades,
  getGradeById,
  getGradesByStudent,
  getGradeBySubmission,
  createSubmission,
  updateSubmission,
  createGrade,
  updateGrade,
  getUserRole,
  getEnrollmentsByUser,
  getReflectionsByUser,
  getReflectionTemplatesByUser,
  getReflectionTemplatesByAssignment,
  getRecentGrades,
  getClassMedianGrade,
  getPeerBenchmark,
  getRecentFeedback,
  getRecentActivityByUser,
  getSkillTagsByCategory
} from './apiClient';

// Re-export types
export type {
  User,
  Course,
  Assignment,
  ReflectionTemplate,
  ReflectionResponse,
  Submission,
  Grade,
  Enrollment
} from './apiClient';

// Helper to indicate we're using client-side data fetching
export const getDataSourceInfo = () => ({
  source: 'NestJS API (Client-Side Fetching)',
  environment: process.env.NODE_ENV || 'development',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
});
