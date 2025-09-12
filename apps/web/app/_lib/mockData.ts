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
  type: 'file' | 'text' | 'reflection';
  dueDate: string;
  maxPoints: number;
  reflectionTemplate?: ReflectionTemplate;
  instructions?: string[];
}

export interface ReflectionTemplate {
  id: number;
  assignmentId: number;
  prompts: string[];
  dataToShow: string[];
  skillTags: string[];
}

export interface ReflectionResponse {
  id: number;
  submissionId: number;
  studentId: number;
  answers: Record<string, string>;
  selectedSkillTag?: string;
  needsHelp: boolean;
  submittedAt: string;
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  type: 'file' | 'text' | 'reflection';
  content?: string;
  files?: string[];
  reflectionResponse?: ReflectionResponse;
  submittedAt: string;
  status: 'draft' | 'submitted' | 'graded';
}

export interface Grade {
  id: number;
  submissionId: number;
  score: number;
  maxScore: number;
  feedback?: string;
  gradedBy: number;
  gradedAt: string;
}

export interface GradeChange {
  id: number;
  gradeId: number;
  oldScore: number;
  newScore: number;
  reason: string;
  changedBy: number;
  changedAt: string;
}

export interface Comment {
  id: number;
  submissionId: number;
  userId: number;
  content: string;
  parentId?: number;
  createdAt: string;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  role: 'student' | 'ta' | 'professor';
  enrolledAt: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  entityType: 'grade' | 'assignment' | 'submission';
  entityId: number;
  details: string;
  timestamp: string;
}

export interface SkillTag {
  id: number;
  name: string;
  category: string;
  description?: string;
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

// Skill Tags for reflections
export const mockSkillTags: SkillTag[] = [
  { id: 1, name: 'React Components', category: 'frontend', description: 'Building reusable UI components' },
  { id: 2, name: 'State Management', category: 'frontend', description: 'Managing application state' },
  { id: 3, name: 'API Integration', category: 'backend', description: 'Working with REST APIs' },
  { id: 4, name: 'Testing', category: 'quality', description: 'Writing unit and integration tests' },
  { id: 5, name: 'Debugging', category: 'development', description: 'Finding and fixing code issues' },
  { id: 6, name: 'Time Management', category: 'collaboration', description: 'Managing project timelines' }
];

// Mock Reflection Templates
export const mockReflectionTemplates: ReflectionTemplate[] = [
  {
    id: 1,
    assignmentId: 3,
    prompts: [
      'What concepts from this week helped you the most?',
      'Where did you get stuck and how did you work through it?',
      'Pick one skill tag to focus on for next week.'
    ],
    dataToShow: ['recent_grades', 'peer_benchmark', 'recent_feedback'],
    skillTags: ['React Components', 'State Management', 'Debugging', 'Testing', 'Time Management']
  },
  {
    id: 2,
    assignmentId: 6,
    prompts: [
      'How did you approach this assignment differently than previous ones?',
      'What would you do differently if you started over?',
      'What resources were most helpful for completing this work?'
    ],
    dataToShow: ['recent_grades', 'class_median', 'submission_history'],
    skillTags: ['API Integration', 'Testing', 'Debugging', 'Time Management']
  },
  {
    id: 3,
    assignmentId: 9,
    prompts: [
      'What was the most challenging aspect of this project?',
      'How well did you manage your time on this assignment?',
      'What skills do you want to develop further?'
    ],
    dataToShow: ['recent_grades', 'peer_benchmark', 'submission_patterns'],
    skillTags: ['React Components', 'State Management', 'API Integration', 'Testing', 'Debugging', 'Time Management']
  }
];

// Mock Assignments with reflection support
export const mockAssignments: Assignment[] = [
  {
    id: 1,
    courseId: 1,
    title: 'NextJS Frontend',
    description: 'Build a Learning Management System frontend using NextJS',
    type: 'file',
    dueDate: '2024-12-15',
    maxPoints: 100,
    instructions: ['Create a responsive dashboard', 'Implement dynamic routing', 'Add TypeScript support']
  },
  {
    id: 2,
    courseId: 1,
    title: 'React Components',
    description: 'Create reusable React components',
    type: 'text',
    dueDate: '2024-11-30',
    maxPoints: 75,
    instructions: ['Build at least 3 components', 'Include prop validation', 'Add documentation']
  },
  {
    id: 3,
    courseId: 1,
    title: 'Week 8 Course Reflection',
    description: 'Reflect on your learning progress and challenges this week',
    type: 'reflection',
    dueDate: '2024-12-01',
    maxPoints: 25,
    reflectionTemplate: {
      id: 1,
      assignmentId: 3,
      prompts: [
        'What helped you learn the most this week?',
        'Where did you get stuck and how did you work through it?',
        'What would you like to focus on improving next week?'
      ],
      dataToShow: ['recent_grades', 'last_comments', 'peer_benchmark'],
      skillTags: ['React Components', 'State Management', 'Debugging', 'Time Management']
    }
  },
  {
    id: 4,
    courseId: 2,
    title: 'Algorithm Analysis',
    description: 'Analyze time complexity of sorting algorithms',
    type: 'file',
    dueDate: '2024-11-20',
    maxPoints: 100,
    instructions: ['Analyze at least 3 algorithms', 'Include Big O notation', 'Provide code examples']
  },
  {
    id: 5,
    courseId: 2,
    title: 'Mid-term Reflection',
    description: 'Reflect on your algorithm learning journey',
    type: 'reflection',
    dueDate: '2024-11-25',
    maxPoints: 20,
    reflectionTemplate: {
      id: 2,
      assignmentId: 5,
      prompts: [
        'Which algorithm concepts clicked for you?',
        'What strategies helped you understand complex algorithms?',
        'How do you plan to apply these concepts in projects?'
      ],
      dataToShow: ['recent_grades', 'peer_benchmark'],
      skillTags: ['Debugging', 'Testing', 'API Integration']
    }
  }
];

// Mock Enrollments
export const mockEnrollments: Enrollment[] = [
  { id: 1, userId: 1, courseId: 1, role: 'student', enrolledAt: '2024-08-15' },
  { id: 2, userId: 1, courseId: 2, role: 'student', enrolledAt: '2024-08-15' },
  { id: 3, userId: 2, courseId: 1, role: 'professor', enrolledAt: '2024-08-01' },
  { id: 4, userId: 2, courseId: 2, role: 'professor', enrolledAt: '2024-08-01' },
  { id: 5, userId: 3, courseId: 1, role: 'ta', enrolledAt: '2024-08-10' }
];

// Mock Submissions
export const mockSubmissions: Submission[] = [
  {
    id: 1,
    assignmentId: 2,
    studentId: 1,
    type: 'text',
    content: 'I created three React components: Header, Navigation, and CourseCard. Each component uses TypeScript interfaces for props and includes comprehensive documentation.',
    submittedAt: '2024-11-28',
    status: 'graded'
  },
  {
    id: 2,
    assignmentId: 4,
    studentId: 1,
    type: 'file',
    files: ['algorithm_analysis.pdf', 'bubble_sort.js', 'quick_sort.js'],
    submittedAt: '2024-11-18',
    status: 'graded'
  },
  {
    id: 3,
    assignmentId: 3,
    studentId: 1,
    type: 'reflection',
    submittedAt: '2024-11-29',
    status: 'submitted',
    reflectionResponse: {
      id: 1,
      submissionId: 3,
      studentId: 1,
      answers: {
        'What helped you learn the most this week?': 'Working through the component lifecycle examples and getting hands-on practice with state management.',
        'Where did you get stuck and how did you work through it?': 'I struggled with TypeScript interfaces at first, but the documentation and asking questions in class helped clarify the concepts.',
        'What would you like to focus on improving next week?': 'I want to get better at testing my components and understanding when to use different state management patterns.'
      },
      selectedSkillTag: 'State Management',
      needsHelp: false,
      submittedAt: '2024-11-29'
    }
  }
];

// Mock Grades
export const mockGrades: Grade[] = [
  {
    id: 1,
    submissionId: 1,
    score: 68,
    maxScore: 75,
    feedback: 'Good work on component structure. Could improve prop typing and add more detailed documentation.',
    gradedBy: 2,
    gradedAt: '2024-11-25'
  },
  {
    id: 2,
    submissionId: 2,
    score: 85,
    maxScore: 100,
    feedback: 'Excellent analysis of sorting algorithms. Good use of Big O notation and clear code examples.',
    gradedBy: 2,
    gradedAt: '2024-11-22'
  }
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: 1,
    submissionId: 1,
    userId: 2,
    content: 'Nice work on the component structure! Consider adding PropTypes or TypeScript interfaces for better type safety.',
    createdAt: '2024-11-25'
  },
  {
    id: 2,
    submissionId: 1,
    userId: 1,
    content: 'Thank you for the feedback! I\'ll work on adding better type definitions.',
    parentId: 1,
    createdAt: '2024-11-26'
  },
  {
    id: 3,
    submissionId: 2,
    userId: 2,
    content: 'Great job analyzing the time complexity! Your explanation of quicksort vs bubble sort was particularly clear.',
    createdAt: '2024-11-22'
  }
];

// Mock Grade Changes
export const mockGradeChanges: GradeChange[] = [
  {
    id: 1,
    gradeId: 1,
    oldScore: 65,
    newScore: 68,
    reason: 'Added points for creative implementation approach after review',
    changedBy: 2,
    changedAt: '2024-11-26'
  }
];

// Mock Activity Log
export const mockActivityLog: ActivityLog[] = [
  {
    id: 1,
    userId: 2,
    action: 'grade_changed',
    entityType: 'grade',
    entityId: 1,
    details: 'Changed grade from 65 to 68: Added points for creative implementation approach after review',
    timestamp: '2024-11-26'
  },
  {
    id: 2,
    userId: 1,
    action: 'submission_created',
    entityType: 'submission',
    entityId: 3,
    details: 'Submitted reflection for Week 8 Course Reflection',
    timestamp: '2024-11-29'
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

// New helper functions for Phase 2
export const getUserRole = (userId: number, courseId: number): string => {
  const enrollment = mockEnrollments.find(e => e.userId === userId && e.courseId === courseId);
  return enrollment?.role || 'student';
};

export const getEnrollmentsByUser = (userId: number): Enrollment[] => {
  return mockEnrollments.filter(enrollment => enrollment.userId === userId);
};

export const getSubmissionsByAssignment = (assignmentId: number): Submission[] => {
  return mockSubmissions.filter(submission => submission.assignmentId === assignmentId);
};

export const getSubmissionByStudent = (assignmentId: number, studentId: number): Submission | undefined => {
  return mockSubmissions.find(s => s.assignmentId === assignmentId && s.studentId === studentId);
};

export const getGradeBySubmission = (submissionId: number): Grade | undefined => {
  return mockGrades.find(grade => grade.submissionId === submissionId);
};

export const getCommentsBySubmission = (submissionId: number): Comment[] => {
  return mockComments.filter(comment => comment.submissionId === submissionId);
};

export const getReflectionsByUser = (userId: number, courseId?: number): Assignment[] => {
  let reflections = mockAssignments.filter(assignment => assignment.type === 'reflection');
  if (courseId) {
    reflections = reflections.filter(assignment => assignment.courseId === courseId);
  }
  return reflections;
};

export const getRecentGrades = (studentId: number, limit: number = 3): Grade[] => {
  const userSubmissions = mockSubmissions.filter(s => s.studentId === studentId);
  const submissionIds = userSubmissions.map(s => s.id);
  return mockGrades
    .filter(grade => submissionIds.includes(grade.submissionId))
    .sort((a, b) => new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime())
    .slice(0, limit);
};

export const getRecentComments = (studentId: number, limit: number = 3): Comment[] => {
  const userSubmissions = mockSubmissions.filter(s => s.studentId === studentId);
  const submissionIds = userSubmissions.map(s => s.id);
  return mockComments
    .filter(comment => submissionIds.includes(comment.submissionId) && comment.userId !== studentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getClassMedianGrade = (courseId: number): number => {
  // Simple calculation for peer benchmarking
  const courseAssignments = mockAssignments.filter(a => a.courseId === courseId);
  const assignmentIds = courseAssignments.map(a => a.id);
  const courseSubmissions = mockSubmissions.filter(s => assignmentIds.includes(s.assignmentId));
  const submissionIds = courseSubmissions.map(s => s.id);
  const grades = mockGrades.filter(g => submissionIds.includes(g.submissionId));
  
  if (grades.length === 0) return 0;
  
  const percentages = grades.map(g => (g.score / g.maxScore) * 100);
  percentages.sort((a, b) => a - b);
  const mid = Math.floor(percentages.length / 2);
  return percentages.length % 2 === 0 
    ? (percentages[mid - 1] + percentages[mid]) / 2 
    : percentages[mid];
};

export const getSkillTagsByCategory = (category?: string): SkillTag[] => {
  return category 
    ? mockSkillTags.filter(tag => tag.category === category)
    : mockSkillTags;
};

export const getActivityLogByUser = (userId: number, limit: number = 10): ActivityLog[] => {
  return mockActivityLog
    .filter(log => log.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

export const getReflectionTemplatesByUser = (userId: number, courseId?: number): ReflectionTemplate[] => {
  // For MVP, return all templates - in real app would filter by user permissions
  let templates = mockReflectionTemplates;
  if (courseId) {
    // Filter templates that are used by assignments in this course
    const courseReflections = mockAssignments.filter(a => a.courseId === courseId && a.type === 'reflection');
    const templateIds = courseReflections.map(a => a.reflectionTemplateId).filter(Boolean);
    templates = templates.filter(t => templateIds.includes(t.id));
  }
  return templates;
};

export const getReflectionTemplatesByAssignment = (assignmentId: number): ReflectionTemplate[] => {
  return mockReflectionTemplates.filter(t => t.assignmentId === assignmentId);
};

export const getPeerBenchmark = (courseId: number): number => {
  // Return the class median grade for peer benchmarking
  return getClassMedianGrade(courseId);
};

export const getRecentFeedback = (userId: number, limit: number = 3): string[] => {
  // Get recent feedback from grades
  const userSubmissions = mockSubmissions.filter(s => s.studentId === userId);
  const submissionIds = userSubmissions.map(s => s.id);
  const gradesWithFeedback = mockGrades
    .filter(g => submissionIds.includes(g.submissionId) && g.feedback)
    .sort((a, b) => new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime())
    .slice(0, limit);
  
  return gradesWithFeedback.map(g => g.feedback).filter(Boolean) as string[];
};

export const getCoursesByStudent = (studentId: number): Course[] => {
  const user = mockUsers.find(u => u.id === studentId);
  if (!user) return [];
  return mockCourses.filter(c => user.courses.includes(c.id));
};

export const getRecentActivityByUser = (userId: number, limit: number = 10): any[] => {
  // For MVP, return some mock activity data
  return [
    { action: 'Submitted Week 8 Course Reflection', timestamp: '2024-11-29T10:30:00Z' },
    { action: 'Viewed Assignment: JavaScript Fundamentals', timestamp: '2024-11-28T14:15:00Z' },
    { action: 'Received grade for React Components Project', timestamp: '2024-11-27T09:45:00Z' },
    { action: 'Completed Database Design Quiz', timestamp: '2024-11-26T16:20:00Z' },
    { action: 'Started reflection for Web Development Course', timestamp: '2024-11-25T11:00:00Z' }
  ].slice(0, limit);
};