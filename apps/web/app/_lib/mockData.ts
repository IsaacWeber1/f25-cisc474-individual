// Mock data for LMS application
export interface User {
  id: number;
  name: string;
  role: 'student' | 'ta' | 'professor';
  email: string;
  courses: number[];
}

export interface Course {
  id: number;
  code: string;
  title: string;
  instructor: string;
  semester: string;
  description?: string;
}

export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  maxPoints: number;
}

export interface Grade {
  id: number;
  assignmentId: number;
  studentId: number;
  score: number;
  maxScore: number;
  feedback?: string;
  gradedDate?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Student',
    role: 'student',
    email: 'john.student@example.edu',
    courses: [1, 2]
  },
  {
    id: 2,
    name: 'Jane Professor',
    role: 'professor',
    email: 'jane.professor@example.edu',
    courses: [1, 2, 3]
  },
  {
    id: 3,
    name: 'Mike TA',
    role: 'ta',
    email: 'mike.ta@example.edu',
    courses: [1]
  }
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: 1,
    code: 'CISC474',
    title: 'Advanced Web Technologies',
    instructor: 'Dr. Bart',
    semester: 'Fall 2024',
    description: 'Learn modern web development with React, Next.js, and more.'
  },
  {
    id: 2,
    code: 'CISC320',
    title: 'Introduction to Algorithms',
    instructor: 'Dr. Smith',
    semester: 'Fall 2024',
    description: 'Fundamental algorithms and data structures.'
  },
  {
    id: 3,
    code: 'CISC275',
    title: 'Introduction to Software Engineering',
    instructor: 'Dr. Johnson',
    semester: 'Fall 2024',
    description: 'Software development lifecycle and best practices.'
  }
];

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: 1,
    courseId: 1,
    title: 'NextJS Frontend',
    description: 'Build a Learning Management System frontend using NextJS',
    dueDate: '2024-12-15',
    status: 'pending',
    maxPoints: 100
  },
  {
    id: 2,
    courseId: 1,
    title: 'React Components',
    description: 'Create reusable React components',
    dueDate: '2024-11-30',
    status: 'submitted',
    maxPoints: 75
  },
  {
    id: 3,
    courseId: 2,
    title: 'Algorithm Analysis',
    description: 'Analyze time complexity of sorting algorithms',
    dueDate: '2024-11-20',
    status: 'graded',
    maxPoints: 100
  }
];

// Mock Grades
export const mockGrades: Grade[] = [
  {
    id: 1,
    assignmentId: 2,
    studentId: 1,
    score: 68,
    maxScore: 75,
    feedback: 'Good work on component structure. Could improve prop typing.',
    gradedDate: '2024-11-25'
  },
  {
    id: 2,
    assignmentId: 3,
    studentId: 1,
    score: 85,
    maxScore: 100,
    feedback: 'Excellent analysis of sorting algorithms.',
    gradedDate: '2024-11-22'
  }
];

// Helper functions
export const getCurrentUser = (): User => {
  // In a real app, this would get the current authenticated user
  // For demo purposes, return the first student
  const user = mockUsers[0];
  if (!user) {
    throw new Error('No users found in mock data');
  }
  return user;
};

export const getCoursesByUser = (userId: number): Course[] => {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return [];
  
  return mockCourses.filter(course => user.courses.includes(course.id));
};

export const getCourseById = (courseId: number): Course | undefined => {
  return mockCourses.find(course => course.id === courseId);
};

export const getAssignmentsByCourse = (courseId: number): Assignment[] => {
  return mockAssignments.filter(assignment => assignment.courseId === courseId);
};

export const getGradesByStudent = (studentId: number): Grade[] => {
  return mockGrades.filter(grade => grade.studentId === studentId);
};

export const getAssignmentById = (assignmentId: number): Assignment | undefined => {
  return mockAssignments.find(assignment => assignment.id === assignmentId);
};