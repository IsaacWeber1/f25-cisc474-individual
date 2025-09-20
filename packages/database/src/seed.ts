import { prisma } from "./client";
import { Role, AssignmentType, SubmissionStatus } from "../generated/client";

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create Users
  console.log("Creating users...");
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "john.student@example.edu" },
      update: {},
      create: {
        name: "John Student",
        email: "john.student@example.edu",
      }
    }),
    prisma.user.upsert({
      where: { email: "jane.doe@example.edu" },
      update: {},
      create: {
        name: "Jane Doe",
        email: "jane.doe@example.edu",
      }
    }),
    prisma.user.upsert({
      where: { email: "mike.smith@example.edu" },
      update: {},
      create: {
        name: "Mike Smith",
        email: "mike.smith@example.edu",
      }
    }),
    prisma.user.upsert({
      where: { email: "jane.professor@example.edu" },
      update: {},
      create: {
        name: "Dr. Jane Professor",
        email: "jane.professor@example.edu",
      }
    }),
    prisma.user.upsert({
      where: { email: "mike.ta@example.edu" },
      update: {},
      create: {
        name: "Mike TA",
        email: "mike.ta@example.edu",
      }
    }),
    prisma.user.upsert({
      where: { email: "dr.bart@example.edu" },
      update: {},
      create: {
        name: "Dr. Bart",
        email: "dr.bart@example.edu",
      }
    }),
    prisma.user.upsert({
      where: { email: "dr.smith@example.edu" },
      update: {},
      create: {
        name: "Dr. Smith",
        email: "dr.smith@example.edu",
      }
    }),
    prisma.user.upsert({
      where: { email: "sarah.wilson@example.edu" },
      update: {},
      create: {
        name: "Sarah Wilson",
        email: "sarah.wilson@example.edu",
      }
    })
  ]);

  const [johnStudent, janeDoe, mikeSmith, janeProfessor, mikeTA, drBart, drSmith, sarahWilson] = users;

  // 2. Create Skill Tags
  console.log("Creating skill tags...");
  const skillTags = await Promise.all([
    prisma.skillTag.upsert({
      where: { id: "react-components-1" },
      update: {},
      create: {
        id: "react-components-1",
        name: "React Components",
        category: "frontend",
        description: "Building reusable UI components"
      }
    }),
    prisma.skillTag.upsert({
      where: { id: "state-management-2" },
      update: {},
      create: {
        id: "state-management-2",
        name: "State Management",
        category: "frontend",
        description: "Managing application state"
      }
    }),
    prisma.skillTag.upsert({
      where: { id: "api-integration-3" },
      update: {},
      create: {
        id: "api-integration-3",
        name: "API Integration",
        category: "backend",
        description: "Working with REST APIs"
      }
    }),
    prisma.skillTag.upsert({
      where: { id: "testing-4" },
      update: {},
      create: {
        id: "testing-4",
        name: "Testing",
        category: "quality",
        description: "Writing unit and integration tests"
      }
    }),
    prisma.skillTag.upsert({
      where: { id: "debugging-5" },
      update: {},
      create: {
        id: "debugging-5",
        name: "Debugging",
        category: "development",
        description: "Finding and fixing code issues"
      }
    }),
    prisma.skillTag.upsert({
      where: { id: "time-management-6" },
      update: {},
      create: {
        id: "time-management-6",
        name: "Time Management",
        category: "collaboration",
        description: "Managing project timelines"
      }
    })
  ]);

  // 3. Create Courses
  console.log("Creating courses...");
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: "course-cisc474-fall24" },
      update: {},
      create: {
        id: "course-cisc474-fall24",
        code: "CISC474",
        title: "Advanced Web Technologies",
        description: "Learn modern web development with React, Next.js, and more.",
        instructor: "Dr. Bart",
        semester: "Fall 2024",
        createdById: drBart.id
      }
    }),
    prisma.course.upsert({
      where: { id: "course-cisc320-fall24" },
      update: {},
      create: {
        id: "course-cisc320-fall24",
        code: "CISC320",
        title: "Introduction to Algorithms",
        description: "Fundamental algorithms and data structures.",
        instructor: "Dr. Smith",
        semester: "Fall 2024",
        createdById: drSmith.id
      }
    }),
    prisma.course.upsert({
      where: { id: "course-cisc275-fall24" },
      update: {},
      create: {
        id: "course-cisc275-fall24",
        code: "CISC275",
        title: "Introduction to Software Engineering",
        description: "Software development lifecycle and best practices.",
        instructor: "Dr. Johnson",
        semester: "Fall 2024",
        createdById: janeProfessor.id
      }
    })
  ]);

  const [cisc474, cisc320, cisc275] = courses;

  // 4. Create Course Enrollments
  console.log("Creating course enrollments...");
  await Promise.all([
    // CISC474 enrollments
    prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: johnStudent.id, courseId: cisc474.id } },
      update: {},
      create: {
        userId: johnStudent.id,
        courseId: cisc474.id,
        role: Role.STUDENT
      }
    }),
    prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: janeDoe.id, courseId: cisc474.id } },
      update: {},
      create: {
        userId: janeDoe.id,
        courseId: cisc474.id,
        role: Role.STUDENT
      }
    }),
    prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: mikeSmith.id, courseId: cisc474.id } },
      update: {},
      create: {
        userId: mikeSmith.id,
        courseId: cisc474.id,
        role: Role.STUDENT
      }
    }),
    prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: drBart.id, courseId: cisc474.id } },
      update: {},
      create: {
        userId: drBart.id,
        courseId: cisc474.id,
        role: Role.PROFESSOR
      }
    }),
    prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: mikeTA.id, courseId: cisc474.id } },
      update: {},
      create: {
        userId: mikeTA.id,
        courseId: cisc474.id,
        role: Role.TA
      }
    }),
    // CISC320 enrollments
    prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: johnStudent.id, courseId: cisc320.id } },
      update: {},
      create: {
        userId: johnStudent.id,
        courseId: cisc320.id,
        role: Role.STUDENT
      }
    }),
    prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: sarahWilson.id, courseId: cisc320.id } },
      update: {},
      create: {
        userId: sarahWilson.id,
        courseId: cisc320.id,
        role: Role.STUDENT
      }
    }),
    prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: drSmith.id, courseId: cisc320.id } },
      update: {},
      create: {
        userId: drSmith.id,
        courseId: cisc320.id,
        role: Role.PROFESSOR
      }
    }),
    // CISC275 enrollments
    prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: janeDoe.id, courseId: cisc275.id } },
      update: {},
      create: {
        userId: janeDoe.id,
        courseId: cisc275.id,
        role: Role.STUDENT
      }
    }),
    prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: janeProfessor.id, courseId: cisc275.id } },
      update: {},
      create: {
        userId: janeProfessor.id,
        courseId: cisc275.id,
        role: Role.PROFESSOR
      }
    })
  ]);

  // 5. Create Assignments
  console.log("Creating assignments...");
  const assignments = await Promise.all([
    // CISC474 Assignments
    prisma.assignment.upsert({
      where: { id: "assignment-nextjs-frontend-1" },
      update: {},
      create: {
        id: "assignment-nextjs-frontend-1",
        title: "NextJS Frontend",
        description: "Build a Learning Management System frontend using NextJS",
        type: AssignmentType.FILE,
        maxPoints: 100,
        dueDate: new Date("2024-12-15"),
        instructions: ["Create a responsive dashboard", "Implement dynamic routing", "Add TypeScript support"],
        isPublished: true,
        courseId: cisc474.id,
        createdById: drBart.id
      }
    }),
    prisma.assignment.upsert({
      where: { id: "assignment-react-components-2" },
      update: {},
      create: {
        id: "assignment-react-components-2",
        title: "React Components",
        description: "Create reusable React components",
        type: AssignmentType.TEXT,
        maxPoints: 75,
        dueDate: new Date("2024-11-30"),
        instructions: ["Build at least 3 components", "Include prop validation", "Add documentation"],
        isPublished: true,
        courseId: cisc474.id,
        createdById: drBart.id
      }
    }),
    prisma.assignment.upsert({
      where: { id: "assignment-week8-reflection-3" },
      update: {},
      create: {
        id: "assignment-week8-reflection-3",
        title: "Week 8 Course Reflection",
        description: "Reflect on your learning progress and challenges this week",
        type: AssignmentType.REFLECTION,
        maxPoints: 25,
        dueDate: new Date("2024-12-01"),
        isPublished: true,
        courseId: cisc474.id,
        createdById: drBart.id
      }
    }),
    // CISC320 Assignments
    prisma.assignment.upsert({
      where: { id: "assignment-algorithm-analysis-4" },
      update: {},
      create: {
        id: "assignment-algorithm-analysis-4",
        title: "Algorithm Analysis",
        description: "Analyze time complexity of sorting algorithms",
        type: AssignmentType.FILE,
        maxPoints: 100,
        dueDate: new Date("2024-11-20"),
        instructions: ["Analyze at least 3 algorithms", "Include Big O notation", "Provide code examples"],
        isPublished: true,
        courseId: cisc320.id,
        createdById: drSmith.id
      }
    }),
    prisma.assignment.upsert({
      where: { id: "assignment-midterm-reflection-5" },
      update: {},
      create: {
        id: "assignment-midterm-reflection-5",
        title: "Mid-term Reflection",
        description: "Reflect on your algorithm learning journey",
        type: AssignmentType.REFLECTION,
        maxPoints: 20,
        dueDate: new Date("2024-11-25"),
        isPublished: true,
        courseId: cisc320.id,
        createdById: drSmith.id
      }
    }),
    // Additional assignments for variety
    prisma.assignment.upsert({
      where: { id: "assignment-recursion-lab-6" },
      update: {},
      create: {
        id: "assignment-recursion-lab-6",
        title: "Recursion Lab",
        description: "Implement recursive algorithms for various problems",
        type: AssignmentType.FILE,
        maxPoints: 25,
        dueDate: new Date("2024-09-15"),
        isPublished: true,
        courseId: cisc474.id,
        createdById: drBart.id
      }
    })
  ]);

  const [nextjsAssignment, reactComponentsAssignment, week8ReflectionAssignment, algorithmAnalysisAssignment, midtermReflectionAssignment, recursionLabAssignment] = assignments;

  // 6. Create Reflection Templates
  console.log("Creating reflection templates...");
  const reflectionTemplates = await Promise.all([
    prisma.reflectionTemplate.upsert({
      where: { assignmentId: week8ReflectionAssignment.id },
      update: {},
      create: {
        assignmentId: week8ReflectionAssignment.id,
        prompts: [
          "What concepts from this week helped you the most?",
          "Where did you get stuck and how did you work through it?",
          "Pick one skill tag to focus on for next week."
        ],
        dataToShow: ["recent_grades", "peer_benchmark", "recent_feedback"]
      }
    }),
    prisma.reflectionTemplate.upsert({
      where: { assignmentId: midtermReflectionAssignment.id },
      update: {},
      create: {
        assignmentId: midtermReflectionAssignment.id,
        prompts: [
          "How did you approach this assignment differently than previous ones?",
          "What would you do differently if you started over?",
          "What resources were most helpful for completing this work?"
        ],
        dataToShow: ["recent_grades", "class_median", "submission_history"]
      }
    })
  ]);

  const [week8Template, midtermTemplate] = reflectionTemplates;

  // 7. Create Reflection Template Skills (many-to-many)
  console.log("Creating reflection template skills...");
  await Promise.all([
    // Week 8 reflection skills
    ...skillTags.slice(0, 5).map((skillTag, index) =>
      prisma.reflectionTemplateSkill.upsert({
        where: {
          templateId_skillTagId: {
            templateId: week8Template.id,
            skillTagId: skillTag.id
          }
        },
        update: {},
        create: {
          templateId: week8Template.id,
          skillTagId: skillTag.id
        }
      })
    ),
    // Midterm reflection skills
    ...skillTags.slice(2, 6).map((skillTag, index) =>
      prisma.reflectionTemplateSkill.upsert({
        where: {
          templateId_skillTagId: {
            templateId: midtermTemplate.id,
            skillTagId: skillTag.id
          }
        },
        update: {},
        create: {
          templateId: midtermTemplate.id,
          skillTagId: skillTag.id
        }
      })
    )
  ]);

  // 8. Create Submissions
  console.log("Creating submissions...");
  const submissions = await Promise.all([
    // John's submissions
    prisma.submission.upsert({
      where: { assignmentId_studentId: { assignmentId: reactComponentsAssignment.id, studentId: johnStudent.id } },
      update: {},
      create: {
        assignmentId: reactComponentsAssignment.id,
        studentId: johnStudent.id,
        type: AssignmentType.TEXT,
        status: SubmissionStatus.GRADED,
        content: "I created three React components: Header, Navigation, and CourseCard. Each component uses TypeScript interfaces for props and includes comprehensive documentation.",
        submittedAt: new Date("2024-11-28")
      }
    }),
    prisma.submission.upsert({
      where: { assignmentId_studentId: { assignmentId: algorithmAnalysisAssignment.id, studentId: johnStudent.id } },
      update: {},
      create: {
        assignmentId: algorithmAnalysisAssignment.id,
        studentId: johnStudent.id,
        type: AssignmentType.FILE,
        status: SubmissionStatus.GRADED,
        files: ["algorithm_analysis.pdf", "bubble_sort.js", "quick_sort.js"],
        submittedAt: new Date("2024-11-18")
      }
    }),
    prisma.submission.upsert({
      where: { assignmentId_studentId: { assignmentId: week8ReflectionAssignment.id, studentId: johnStudent.id } },
      update: {},
      create: {
        assignmentId: week8ReflectionAssignment.id,
        studentId: johnStudent.id,
        type: AssignmentType.REFLECTION,
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date("2024-11-29")
      }
    }),
    prisma.submission.upsert({
      where: { assignmentId_studentId: { assignmentId: recursionLabAssignment.id, studentId: johnStudent.id } },
      update: {},
      create: {
        assignmentId: recursionLabAssignment.id,
        studentId: johnStudent.id,
        type: AssignmentType.FILE,
        status: SubmissionStatus.GRADED,
        files: ["recursion_solutions.py"],
        submittedAt: new Date("2024-09-14")
      }
    }),
    // Jane's submissions
    prisma.submission.upsert({
      where: { assignmentId_studentId: { assignmentId: reactComponentsAssignment.id, studentId: janeDoe.id } },
      update: {},
      create: {
        assignmentId: reactComponentsAssignment.id,
        studentId: janeDoe.id,
        type: AssignmentType.TEXT,
        status: SubmissionStatus.SUBMITTED,
        content: "Built three components with full TypeScript support and comprehensive testing.",
        submittedAt: new Date("2024-11-29")
      }
    })
  ]);

  const [johnReactSubmission, johnAlgorithmSubmission, johnReflectionSubmission, johnRecursionSubmission, janeReactSubmission] = submissions;

  // 9. Create Grades
  console.log("Creating grades...");
  const grades = await Promise.all([
    prisma.grade.upsert({
      where: { submissionId: johnReactSubmission.id },
      update: {},
      create: {
        submissionId: johnReactSubmission.id,
        score: 68,
        maxScore: 75,
        feedback: "Good work on component structure. Could improve prop typing and add more detailed documentation.",
        gradedById: drBart.id,
        gradedAt: new Date("2024-11-25")
      }
    }),
    prisma.grade.upsert({
      where: { submissionId: johnAlgorithmSubmission.id },
      update: {},
      create: {
        submissionId: johnAlgorithmSubmission.id,
        score: 85,
        maxScore: 100,
        feedback: "Excellent analysis of sorting algorithms. Good use of Big O notation and clear code examples.",
        gradedById: drSmith.id,
        gradedAt: new Date("2024-11-22")
      }
    }),
    prisma.grade.upsert({
      where: { submissionId: johnRecursionSubmission.id },
      update: {},
      create: {
        submissionId: johnRecursionSubmission.id,
        score: 23,
        maxScore: 25,
        feedback: "Great recursive implementations! Clean code and excellent understanding of base cases.",
        gradedById: drBart.id,
        gradedAt: new Date("2024-09-18")
      }
    })
  ]);

  const [johnReactGrade, johnAlgorithmGrade, johnRecursionGrade] = grades;

  // 10. Create Grade Changes (for audit trail)
  console.log("Creating grade changes...");
  await prisma.gradeChange.upsert({
    where: { id: "grade-change-1" },
    update: {},
    create: {
      id: "grade-change-1",
      gradeId: johnReactGrade.id,
      oldScore: 65,
      newScore: 68,
      reason: "Added points for creative implementation approach after review",
      changedById: drBart.id,
      changedAt: new Date("2024-11-26")
    }
  });

  // 11. Create Reflection Responses
  console.log("Creating reflection responses...");
  const reflectionResponse = await prisma.reflectionResponse.upsert({
    where: { submissionId: johnReflectionSubmission.id },
    update: {},
    create: {
      templateId: week8Template.id,
      studentId: johnStudent.id,
      submissionId: johnReflectionSubmission.id,
      answers: {
        "What concepts from this week helped you the most?": "Working through the component lifecycle examples and getting hands-on practice with state management.",
        "Where did you get stuck and how did you work through it?": "I struggled with TypeScript interfaces at first, but the documentation and asking questions in class helped clarify the concepts.",
        "Pick one skill tag to focus on for next week.": "I want to get better at testing my components and understanding when to use different state management patterns."
      },
      needsHelp: false,
      submittedAt: new Date("2024-11-29")
    }
  });

  // 12. Create Reflection Response Skills
  console.log("Creating reflection response skills...");
  await prisma.reflectionResponseSkill.upsert({
    where: {
      responseId_skillTagId: {
        responseId: reflectionResponse.id,
        skillTagId: skillTags[1].id // State Management
      }
    },
    update: {},
    create: {
      responseId: reflectionResponse.id,
      skillTagId: skillTags[1].id // State Management
    }
  });

  // 13. Create Comments
  console.log("Creating comments...");
  // Create parent comment first
  const comment1 = await prisma.comment.upsert({
    where: { id: "comment-1" },
    update: {},
    create: {
      id: "comment-1",
      submissionId: johnReactSubmission.id,
      userId: drBart.id,
      content: "Nice work on the component structure! Consider adding PropTypes or TypeScript interfaces for better type safety."
    }
  });

  // Then create other comments (including the reply)
  const comments = await Promise.all([
    prisma.comment.upsert({
      where: { id: "comment-2" },
      update: {},
      create: {
        id: "comment-2",
        submissionId: johnReactSubmission.id,
        userId: johnStudent.id,
        content: "Thank you for the feedback! I'll work on adding better type definitions.",
        parentId: comment1.id
      }
    }),
    prisma.comment.upsert({
      where: { id: "comment-3" },
      update: {},
      create: {
        id: "comment-3",
        submissionId: johnAlgorithmSubmission.id,
        userId: drSmith.id,
        content: "Great job analyzing the time complexity! Your explanation of quicksort vs bubble sort was particularly clear."
      }
    })
  ]);

  // 14. Create Activity Logs
  console.log("Creating activity logs...");
  await Promise.all([
    prisma.activityLog.upsert({
      where: { id: "activity-1" },
      update: {},
      create: {
        id: "activity-1",
        userId: drBart.id,
        action: "grade_changed",
        entityType: "grade",
        entityId: johnReactGrade.id,
        details: "Changed grade from 65 to 68: Added points for creative implementation approach after review",
        timestamp: new Date("2024-11-26")
      }
    }),
    prisma.activityLog.upsert({
      where: { id: "activity-2" },
      update: {},
      create: {
        id: "activity-2",
        userId: johnStudent.id,
        action: "submission_created",
        entityType: "submission",
        entityId: johnReflectionSubmission.id,
        details: "Submitted reflection for Week 8 Course Reflection",
        timestamp: new Date("2024-11-29")
      }
    }),
    prisma.activityLog.upsert({
      where: { id: "activity-3" },
      update: {},
      create: {
        id: "activity-3",
        userId: johnStudent.id,
        action: "assignment_viewed",
        entityType: "assignment",
        entityId: nextjsAssignment.id,
        details: "Viewed NextJS Frontend assignment details",
        timestamp: new Date("2024-11-28")
      }
    })
  ]);

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
