// Direct API integration - no more mock data!
// All functions now connect directly to our NestJS backend

// IMPORTANT: This file uses server-only APIs (cookies) and should only be imported by server components
import { getSessionUserId } from './sessionServer';
import * as apiClient from './apiClient';

// Server-side function that reads the current user from the session cookie
export async function getCurrentUser() {
  const userId = await getSessionUserId();

  if (!userId) {
    throw new Error('No user session found. Please log in.');
  }

  return apiClient.getUserById(userId);
}

// Re-export all other API client functions
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

// Re-export types for consistency
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

// Helper to indicate we're always using real data now
export const isUsingRealData = () => true;
export const getDataSourceInfo = () => ({
  source: 'NestJS API (Real Data)',
  environment: process.env.NODE_ENV || 'development',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
});