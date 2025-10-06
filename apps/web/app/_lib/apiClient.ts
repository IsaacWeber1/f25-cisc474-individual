// API client for connecting to our NestJS backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Generic API fetch helper with retry logic for Render.com spin-up
async function apiRequest<T>(endpoint: string, retryCount = 0): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds base delay

  console.log(`[apiClient] Making request to: ${url}${retryCount > 0 ? ` (retry ${retryCount}/${maxRetries})` : ''}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout and handle connection errors better on Vercel
      signal: AbortSignal.timeout(10000), // 10 second timeout (increased for Render spin-up)
    });

    // Handle 502 Bad Gateway (Render.com spinning up)
    if (response.status === 502 && retryCount < maxRetries) {
      const delay = retryDelay * (retryCount + 1); // Exponential backoff
      console.log(`[apiClient] 502 error (backend starting up). Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiRequest<T>(endpoint, retryCount + 1);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[apiClient] ${response.status} error for ${url}: ${errorText}`);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Retry on network errors (CORS issues during Render spin-up)
    if (error instanceof TypeError && error.message.includes('fetch') && retryCount < maxRetries) {
      const delay = retryDelay * (retryCount + 1);
      console.log(`[apiClient] Network error (possible backend spin-up). Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiRequest<T>(endpoint, retryCount + 1);
    }

    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      console.error(`[apiClient] JSON parse error for ${url}:`, error);
    } else if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[apiClient] Request timeout for ${url}`);
    } else {
      console.error(`[apiClient] Request failed for ${url}:`, error);
    }
    throw error;
  }
}

// API functions that directly call our NestJS endpoints
// Note: This is a client-side function. For server-side, use getCurrentUserServer from dataProvider
export async function getCurrentUserClient(userId: string): Promise<User> {
  return getUserById(userId);
}

export async function getAllUsers(): Promise<User[]> {
  return apiRequest<User[]>('/users');
}

export async function getUserById(id: string): Promise<User> {
  if (!id || id === 'undefined' || id === 'null') {
    throw new Error('Invalid user ID provided');
  }
  return apiRequest<User>(`/users/${id}`);
}

export async function getAllCourses(): Promise<Course[]> {
  return apiRequest<Course[]>('/courses');
}

export async function getCourseById(id: string): Promise<Course> {
  if (!id || id === 'undefined' || id === 'null' || id === 'NaN') {
    throw new Error('Invalid course ID provided');
  }
  return apiRequest<Course>(`/courses/${id}`);
}

export async function getCoursesByUser(userId: string): Promise<Course[]> {
  const user = await getUserById(userId);
  return user.enrollments.map(enrollment => enrollment.course);
}

export async function getAllAssignments(): Promise<Assignment[]> {
  return apiRequest<Assignment[]>('/assignments');
}

export async function getAssignmentById(id: string): Promise<Assignment> {
  if (!id || id === 'undefined' || id === 'null' || id === 'NaN') {
    throw new Error('Invalid assignment ID provided');
  }
  return apiRequest<Assignment>(`/assignments/${id}`);
}

export async function getAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
  try {
    const assignments = await getAllAssignments();
    if (!Array.isArray(assignments)) {
      console.error('[apiClient] getAllAssignments did not return an array:', assignments);
      return [];
    }
    return assignments.filter(assignment => assignment.courseId === courseId);
  } catch (error) {
    console.error('[apiClient] Error in getAssignmentsByCourse:', error);
    return [];
  }
}

export async function getAllSubmissions(): Promise<Submission[]> {
  return apiRequest<Submission[]>('/submissions');
}

export async function getSubmissionById(id: string): Promise<Submission> {
  return apiRequest<Submission>(`/submissions/${id}`);
}

export async function getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]> {
  const submissions = await getAllSubmissions();
  return submissions.filter(submission => submission.assignmentId === assignmentId);
}

export async function getSubmissionByStudent(assignmentId: string, studentId: string): Promise<Submission | null> {
  const submissions = await getAllSubmissions();
  return submissions.find(submission =>
    submission.assignmentId === assignmentId && submission.studentId === studentId
  ) || null;
}

export async function createSubmission(submissionData: {
  assignmentId: string;
  studentId: string;
  type: 'FILE' | 'TEXT' | 'REFLECTION';
  status: 'DRAFT' | 'SUBMITTED';
  content?: string;
  files?: string[];
}): Promise<Submission> {
  const url = `${API_BASE_URL}/submissions`;
  console.log(`[apiClient] Creating submission:`, submissionData);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submissionData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[apiClient] ${response.status} error creating submission: ${errorText}`);
    throw new Error(`Failed to create submission: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export async function updateSubmission(submissionId: string, updateData: {
  status?: 'DRAFT' | 'SUBMITTED';
  content?: string;
  files?: string[];
}): Promise<Submission> {
  const url = `${API_BASE_URL}/submissions/${submissionId}`;
  console.log(`[apiClient] Updating submission ${submissionId}:`, updateData);

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[apiClient] ${response.status} error updating submission: ${errorText}`);
    throw new Error(`Failed to update submission: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export async function getAllGrades(): Promise<Grade[]> {
  return apiRequest<Grade[]>('/grades');
}

export async function getGradeById(id: string): Promise<Grade> {
  return apiRequest<Grade>(`/grades/${id}`);
}

export async function getGradesByStudent(studentId: string): Promise<Grade[]> {
  const submissions = await getAllSubmissions();
  const studentSubmissions = submissions.filter(sub => sub.studentId === studentId);
  const grades = await getAllGrades();

  return grades.filter(grade =>
    studentSubmissions.some(sub => sub.id === grade.submissionId)
  );
}

export async function getGradeBySubmission(submissionId: string): Promise<Grade | null> {
  const grades = await getAllGrades();
  return grades.find(grade => grade.submissionId === submissionId) || null;
}

export async function createGrade(gradeData: {
  submissionId: string;
  gradedById: string;
  score: number;
  maxScore: number;
  feedback?: string;
}): Promise<Grade> {
  const url = `${API_BASE_URL}/grades`;
  console.log(`[apiClient] Creating grade:`, gradeData);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gradeData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[apiClient] ${response.status} error creating grade: ${errorText}`);
    throw new Error(`Failed to create grade: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export async function updateGrade(gradeId: string, updateData: {
  score?: number;
  maxScore?: number;
  feedback?: string;
}): Promise<Grade> {
  const url = `${API_BASE_URL}/grades/${gradeId}`;
  console.log(`[apiClient] Updating grade ${gradeId}:`, updateData);

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[apiClient] ${response.status} error updating grade: ${errorText}`);
    throw new Error(`Failed to update grade: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Helper functions for enrollment and user role checking
export async function getUserRole(userId: string, courseId: string): Promise<string> {
  if (!userId || userId === 'undefined' || userId === 'null') {
    throw new Error('Invalid user ID provided to getUserRole');
  }
  if (!courseId || courseId === 'undefined' || courseId === 'null' || courseId === 'NaN') {
    throw new Error('Invalid course ID provided to getUserRole');
  }
  const user = await getUserById(userId);
  const enrollment = user.enrollments.find(e => e.courseId === courseId);
  return enrollment?.role || 'STUDENT';
}

export async function getEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
  const user = await getUserById(userId);
  return user.enrollments;
}

// Reflection-related functions
export async function getReflectionsByUser(userId: string): Promise<ReflectionResponse[]> {
  const user = await getUserById(userId);
  return user.reflectionResponses || [];
}

// Grade analytics functions
export async function getRecentGrades(studentId: string, limit: number = 3): Promise<Grade[]> {
  const grades = await getGradesByStudent(studentId);
  return grades
    .sort((a, b) => new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime())
    .slice(0, limit);
}

export async function getClassMedianGrade(courseId: string): Promise<number> {
  const assignments = await getAssignmentsByCourse(courseId);
  const submissions = await getAllSubmissions();
  const grades = await getAllGrades();

  const courseGrades = grades
    .filter(grade => {
      const submission = submissions.find(sub => sub.id === grade.submissionId);
      return submission && assignments.some(assignment => assignment.id === submission.assignmentId);
    })
    .map(grade => (grade.score / grade.maxScore) * 100);

  if (courseGrades.length === 0) return 0;

  courseGrades.sort((a, b) => a - b);
  const mid = Math.floor(courseGrades.length / 2);
  return courseGrades.length % 2 !== 0
    ? courseGrades[mid]!
    : (courseGrades[mid - 1]! + courseGrades[mid]!) / 2;
}

export async function getPeerBenchmark(studentId: string, courseId: string): Promise<number> {
  return getClassMedianGrade(courseId);
}

export async function getRecentFeedback(studentId: string, limit: number = 3): Promise<string[]> {
  const grades = await getRecentGrades(studentId, limit);
  return grades
    .filter(grade => grade.feedback)
    .map(grade => grade.feedback!);
}

// Additional functions needed by the frontend components
export async function getCoursesByStudent(studentId: string): Promise<Course[]> {
  return getCoursesByUser(studentId);
}

export async function getReflectionTemplatesByUser(userId: string): Promise<ReflectionTemplate[]> {
  // This would need to be implemented based on user's assignments with reflection templates
  // For now, return empty array as a placeholder
  return [];
}

export async function getReflectionTemplatesByAssignment(assignmentId: string): Promise<ReflectionTemplate[]> {
  // This would need to be implemented to get templates for a specific assignment
  // For now, return empty array as a placeholder
  return [];
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  action: string;
}

export async function getRecentActivityByUser(userId: string): Promise<ActivityItem[]> {
  // This would need to be implemented to get recent activity for a user
  // For now, return empty array as a placeholder
  return [];
}

interface SkillTag {
  id: string;
  name: string;
  category: string;
}

export async function getSkillTagsByCategory(): Promise<SkillTag[]> {
  // This would need to be implemented to get skill tags grouped by category
  // For now, return empty array as a placeholder
  return [];
}

// Type definitions (matching Prisma schema)
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  enrollments: Enrollment[];
  submissions: Submission[];
  grades: Grade[];
  reflectionResponses: ReflectionResponse[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string | null;
  instructor: string;
  semester: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: User;
  enrollments: Enrollment[];
  assignments: Assignment[];
}

export interface Enrollment {
  id: string;
  role: 'STUDENT' | 'TA' | 'PROFESSOR' | 'ADMIN';
  enrolledAt: Date;
  userId: string;
  courseId: string;
  user: User;
  course: Course;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: 'FILE' | 'TEXT' | 'REFLECTION';
  maxPoints: number;
  dueDate: Date;
  instructions: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
  createdById: string;
  course: Course;
  createdBy: User;
  submissions: Submission[];
  reflectionTemplate?: ReflectionTemplate;
}

export interface Submission {
  id: string;
  type: 'FILE' | 'TEXT' | 'REFLECTION';
  status: 'DRAFT' | 'SUBMITTED' | 'GRADED' | 'LATE';
  submittedAt: Date | null;
  content: string | null;
  files: File[] | null;
  createdAt: Date;
  updatedAt: Date;
  assignmentId: string;
  studentId: string;
  assignment: Assignment;
  student: User;
  grade?: Grade;
}

export interface Grade {
  id: string;
  score: number;
  maxScore: number;
  feedback: string | null;
  gradedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  submissionId: string;
  gradedById: string;
  submission: Submission;
  gradedBy: User;
}

export interface ReflectionTemplate {
  id: string;
  prompts: string[];
  dataToShow: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  assignmentId: string;
}

export interface ReflectionResponse {
  id: string;
  answers: Record<string, string>;
  needsHelp: boolean;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  templateId: string;
  studentId: string;
  submissionId?: string;
}