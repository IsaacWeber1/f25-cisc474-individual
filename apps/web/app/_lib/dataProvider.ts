// Data provider that can switch between mock and real data
// Set USE_REAL_DATA to true to use Supabase, false to use mock data

const USE_REAL_DATA = process.env.NODE_ENV === 'production' || process.env.USE_REAL_DATA === 'true';

// Import both data sources
import * as mockData from './mockData';
import * as realData from './realData';

// Export the appropriate data source based on configuration
export const {
  getCurrentUser,
  getCoursesByUser,
  getCourseById,
  getAssignmentsByCourse,
  getGradesByStudent,
  getAssignmentById,
  getUserRole,
  getEnrollmentsByUser,
  getSubmissionsByAssignment,
  getSubmissionByStudent,
  getGradeBySubmission,
  getReflectionsByUser,
  getRecentGrades,
  getClassMedianGrade,
  getPeerBenchmark,
  getRecentFeedback
} = USE_REAL_DATA ? realData : mockData;

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
} from './mockData';

// Helper to check which data source is being used
export const isUsingRealData = () => USE_REAL_DATA;
export const getDataSourceInfo = () => ({
  source: USE_REAL_DATA ? 'Supabase (Real Data)' : 'Mock Data',
  environment: process.env.NODE_ENV,
  useRealDataFlag: process.env.USE_REAL_DATA
});