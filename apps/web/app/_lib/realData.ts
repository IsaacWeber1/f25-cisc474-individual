// Real data access using Supabase via Prisma
import { prisma } from "@repo/database/client";
import { Role, AssignmentType, SubmissionStatus } from "@repo/database/generated/client";

// Types that match the mock data interfaces for compatibility
export interface User {
  id: string;
  name: string;
  role: 'student' | 'ta' | 'professor';
  email: string;
  courses: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  semester: string;
  description?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'file' | 'text' | 'reflection';
  dueDate: string;
  maxPoints: number;
  reflectionTemplate?: ReflectionTemplate;
  instructions?: string[];
}

export interface ReflectionTemplate {
  id: string;
  assignmentId: string;
  prompts: string[];
  dataToShow: string[];
  skillTags: string[];
}

export interface ReflectionResponse {
  id: string;
  submissionId: string;
  studentId: string;
  answers: Record<string, string>;
  selectedSkillTag?: string;
  needsHelp: boolean;
  submittedAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  type: 'file' | 'text' | 'reflection';
  content?: string;
  files?: string[];
  reflectionResponse?: ReflectionResponse;
  submittedAt: string;
  status: 'draft' | 'submitted' | 'graded';
}

export interface Grade {
  id: string;
  submissionId: string;
  score: number;
  maxScore: number;
  feedback?: string;
  gradedBy: string;
  gradedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  role: 'student' | 'ta' | 'professor';
  enrolledAt: string;
}

// Conversion utilities
function convertRole(role: Role): 'student' | 'ta' | 'professor' {
  switch (role) {
    case 'STUDENT': return 'student';
    case 'TA': return 'ta';
    case 'PROFESSOR': return 'professor';
    default: return 'student';
  }
}

function convertAssignmentType(type: AssignmentType): 'file' | 'text' | 'reflection' {
  switch (type) {
    case 'FILE': return 'file';
    case 'TEXT': return 'text';
    case 'REFLECTION': return 'reflection';
    default: return 'file';
  }
}

function convertSubmissionStatus(status: SubmissionStatus): 'draft' | 'submitted' | 'graded' {
  switch (status) {
    case 'DRAFT': return 'draft';
    case 'SUBMITTED': return 'submitted';
    case 'GRADED': return 'graded';
    case 'LATE': return 'submitted'; // Treat late as submitted for frontend
    default: return 'draft';
  }
}

// Helper functions - compatible with mockData.ts interface

export const getCurrentUser = async (): Promise<User> => {
  // For demo purposes, return John Student
  const user = await prisma.user.findFirst({
    where: { email: "john.student@example.edu" },
    include: {
      enrollments: { include: { course: true } }
    }
  });

  if (!user) {
    throw new Error('No users found in database');
  }

  return {
    id: user.id,
    name: user.name,
    role: 'student', // For demo, always student
    email: user.email,
    courses: user.enrollments.map(e => e.courseId)
  };
};

export const getCoursesByUser = async (userId: string): Promise<Course[]> => {
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { userId },
    include: { course: true }
  });

  return enrollments.map(enrollment => ({
    id: enrollment.course.id,
    code: enrollment.course.code,
    title: enrollment.course.title,
    instructor: enrollment.course.instructor,
    semester: enrollment.course.semester,
    description: enrollment.course.description || undefined
  }));
};

export const getCourseById = async (courseId: string): Promise<Course | undefined> => {
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!course) return undefined;

  return {
    id: course.id,
    code: course.code,
    title: course.title,
    instructor: course.instructor,
    semester: course.semester,
    description: course.description || undefined
  };
};

export const getAssignmentsByCourse = async (courseId: string): Promise<Assignment[]> => {
  const assignments = await prisma.assignment.findMany({
    where: { courseId },
    include: {
      reflectionTemplate: {
        include: {
          skillTags: {
            include: { skillTag: true }
          }
        }
      }
    }
  });

  return assignments.map(assignment => ({
    id: assignment.id,
    courseId: assignment.courseId,
    title: assignment.title,
    description: assignment.description,
    type: convertAssignmentType(assignment.type),
    dueDate: assignment.dueDate.toISOString(),
    maxPoints: assignment.maxPoints,
    instructions: assignment.instructions ? JSON.parse(JSON.stringify(assignment.instructions)) : undefined,
    reflectionTemplate: assignment.reflectionTemplate ? {
      id: assignment.reflectionTemplate.id,
      assignmentId: assignment.id,
      prompts: JSON.parse(JSON.stringify(assignment.reflectionTemplate.prompts)),
      dataToShow: JSON.parse(JSON.stringify(assignment.reflectionTemplate.dataToShow)),
      skillTags: assignment.reflectionTemplate.skillTags.map(st => st.skillTag.name)
    } : undefined
  }));
};

export const getGradesByStudent = async (studentId: string): Promise<Grade[]> => {
  const grades = await prisma.grade.findMany({
    include: {
      submission: {
        where: { studentId }
      }
    }
  });

  return grades
    .filter(grade => grade.submission?.studentId === studentId)
    .map(grade => ({
      id: grade.id,
      submissionId: grade.submissionId,
      score: grade.score,
      maxScore: grade.maxScore,
      feedback: grade.feedback || undefined,
      gradedBy: grade.gradedById,
      gradedAt: grade.gradedAt.toISOString()
    }));
};

export const getAssignmentById = async (assignmentId: string): Promise<Assignment | undefined> => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      reflectionTemplate: {
        include: {
          skillTags: {
            include: { skillTag: true }
          }
        }
      }
    }
  });

  if (!assignment) return undefined;

  return {
    id: assignment.id,
    courseId: assignment.courseId,
    title: assignment.title,
    description: assignment.description,
    type: convertAssignmentType(assignment.type),
    dueDate: assignment.dueDate.toISOString(),
    maxPoints: assignment.maxPoints,
    instructions: assignment.instructions ? JSON.parse(JSON.stringify(assignment.instructions)) : undefined,
    reflectionTemplate: assignment.reflectionTemplate ? {
      id: assignment.reflectionTemplate.id,
      assignmentId: assignment.id,
      prompts: JSON.parse(JSON.stringify(assignment.reflectionTemplate.prompts)),
      dataToShow: JSON.parse(JSON.stringify(assignment.reflectionTemplate.dataToShow)),
      skillTags: assignment.reflectionTemplate.skillTags.map(st => st.skillTag.name)
    } : undefined
  };
};

export const getUserRole = async (userId: string, courseId: string): Promise<string> => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { userId_courseId: { userId, courseId } }
  });

  return enrollment ? convertRole(enrollment.role) : 'student';
};

export const getEnrollmentsByUser = async (userId: string): Promise<Enrollment[]> => {
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { userId }
  });

  return enrollments.map(enrollment => ({
    id: enrollment.id,
    userId: enrollment.userId,
    courseId: enrollment.courseId,
    role: convertRole(enrollment.role),
    enrolledAt: enrollment.enrolledAt.toISOString()
  }));
};

export const getSubmissionsByAssignment = async (assignmentId: string): Promise<Submission[]> => {
  const submissions = await prisma.submission.findMany({
    where: { assignmentId },
    include: {
      reflectionResponse: {
        include: {
          selectedSkills: {
            include: { skillTag: true }
          }
        }
      }
    }
  });

  return submissions.map(submission => ({
    id: submission.id,
    assignmentId: submission.assignmentId,
    studentId: submission.studentId,
    type: convertAssignmentType(submission.type),
    content: submission.content || undefined,
    files: submission.files ? JSON.parse(JSON.stringify(submission.files)) : undefined,
    submittedAt: submission.submittedAt?.toISOString() || '',
    status: convertSubmissionStatus(submission.status),
    reflectionResponse: submission.reflectionResponse ? {
      id: submission.reflectionResponse.id,
      submissionId: submission.id,
      studentId: submission.reflectionResponse.studentId,
      answers: JSON.parse(JSON.stringify(submission.reflectionResponse.answers)),
      selectedSkillTag: submission.reflectionResponse.selectedSkills[0]?.skillTag.name,
      needsHelp: submission.reflectionResponse.needsHelp,
      submittedAt: submission.reflectionResponse.submittedAt.toISOString()
    } : undefined
  }));
};

export const getSubmissionByStudent = async (assignmentId: string, studentId: string): Promise<Submission | undefined> => {
  const submission = await prisma.submission.findUnique({
    where: { assignmentId_studentId: { assignmentId, studentId } },
    include: {
      reflectionResponse: {
        include: {
          selectedSkills: {
            include: { skillTag: true }
          }
        }
      }
    }
  });

  if (!submission) return undefined;

  return {
    id: submission.id,
    assignmentId: submission.assignmentId,
    studentId: submission.studentId,
    type: convertAssignmentType(submission.type),
    content: submission.content || undefined,
    files: submission.files ? JSON.parse(JSON.stringify(submission.files)) : undefined,
    submittedAt: submission.submittedAt?.toISOString() || '',
    status: convertSubmissionStatus(submission.status),
    reflectionResponse: submission.reflectionResponse ? {
      id: submission.reflectionResponse.id,
      submissionId: submission.id,
      studentId: submission.reflectionResponse.studentId,
      answers: JSON.parse(JSON.stringify(submission.reflectionResponse.answers)),
      selectedSkillTag: submission.reflectionResponse.selectedSkills[0]?.skillTag.name,
      needsHelp: submission.reflectionResponse.needsHelp,
      submittedAt: submission.reflectionResponse.submittedAt.toISOString()
    } : undefined
  };
};

export const getGradeBySubmission = async (submissionId: string): Promise<Grade | undefined> => {
  const grade = await prisma.grade.findUnique({
    where: { submissionId }
  });

  if (!grade) return undefined;

  return {
    id: grade.id,
    submissionId: grade.submissionId,
    score: grade.score,
    maxScore: grade.maxScore,
    feedback: grade.feedback || undefined,
    gradedBy: grade.gradedById,
    gradedAt: grade.gradedAt.toISOString()
  };
};

export const getReflectionsByUser = async (userId: string, courseId?: string): Promise<Assignment[]> => {
  const whereClause: any = { type: AssignmentType.REFLECTION };
  if (courseId) {
    whereClause.courseId = courseId;
  }

  const assignments = await prisma.assignment.findMany({
    where: whereClause,
    include: {
      reflectionTemplate: {
        include: {
          skillTags: {
            include: { skillTag: true }
          }
        }
      }
    }
  });

  return assignments.map(assignment => ({
    id: assignment.id,
    courseId: assignment.courseId,
    title: assignment.title,
    description: assignment.description,
    type: 'reflection' as const,
    dueDate: assignment.dueDate.toISOString(),
    maxPoints: assignment.maxPoints,
    instructions: assignment.instructions ? JSON.parse(JSON.stringify(assignment.instructions)) : undefined,
    reflectionTemplate: assignment.reflectionTemplate ? {
      id: assignment.reflectionTemplate.id,
      assignmentId: assignment.id,
      prompts: JSON.parse(JSON.stringify(assignment.reflectionTemplate.prompts)),
      dataToShow: JSON.parse(JSON.stringify(assignment.reflectionTemplate.dataToShow)),
      skillTags: assignment.reflectionTemplate.skillTags.map(st => st.skillTag.name)
    } : undefined
  }));
};

// Additional helper functions that may be used by the frontend
export const getRecentGrades = async (studentId: string, limit: number = 3): Promise<Grade[]> => {
  const grades = await prisma.grade.findMany({
    where: {
      submission: { studentId }
    },
    orderBy: { gradedAt: 'desc' },
    take: limit
  });

  return grades.map(grade => ({
    id: grade.id,
    submissionId: grade.submissionId,
    score: grade.score,
    maxScore: grade.maxScore,
    feedback: grade.feedback || undefined,
    gradedBy: grade.gradedById,
    gradedAt: grade.gradedAt.toISOString()
  }));
};

export const getClassMedianGrade = async (courseId: string): Promise<number> => {
  const grades = await prisma.grade.findMany({
    where: {
      submission: {
        assignment: { courseId }
      }
    }
  });

  if (grades.length === 0) return 0;

  const percentages = grades.map(g => (g.score / g.maxScore) * 100).sort((a, b) => a - b);
  const mid = Math.floor(percentages.length / 2);

  return percentages.length % 2 === 0
    ? (percentages[mid - 1] + percentages[mid]) / 2
    : percentages[mid];
};

export const getPeerBenchmark = async (courseId: string): Promise<number> => {
  return getClassMedianGrade(courseId);
};

export const getRecentFeedback = async (userId: string, limit: number = 3): Promise<string[]> => {
  const grades = await prisma.grade.findMany({
    where: {
      submission: { studentId: userId },
      feedback: { not: null }
    },
    orderBy: { gradedAt: 'desc' },
    take: limit
  });

  return grades.map(g => g.feedback).filter(Boolean) as string[];
};