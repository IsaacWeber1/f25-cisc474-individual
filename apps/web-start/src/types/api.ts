/**
 * API Type Definitions
 * Matches Prisma schema and backend API responses
 */

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  enrollments: Array<Enrollment>;
  submissions: Array<Submission>;
  grades: Array<Grade>;
  reflectionResponses: Array<ReflectionResponse>;
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
  enrollments: Array<Enrollment>;
  assignments: Array<Assignment>;
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
  instructions: Array<string> | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
  createdById: string;
  course: Course;
  createdBy: User;
  submissions: Array<Submission>;
  reflectionTemplate?: ReflectionTemplate;
}

export interface Submission {
  id: string;
  type: 'FILE' | 'TEXT' | 'REFLECTION';
  status: 'DRAFT' | 'SUBMITTED' | 'GRADED' | 'LATE';
  submittedAt: Date | null;
  content: string | null;
  files: Array<File> | null;
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
  prompts: Array<string>;
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

export interface Session {
  userId: string;
}
