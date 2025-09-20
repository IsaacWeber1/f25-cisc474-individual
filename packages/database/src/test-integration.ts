// Test script to verify Supabase integration
import { prisma } from "./client";

async function testIntegration() {
  console.log("🔍 Testing Supabase Integration...\n");

  try {
    // Test 1: Count all users
    const userCount = await prisma.user.count();
    console.log(`✅ Users in database: ${userCount}`);

    // Test 2: Get a sample user with enrollments
    const sampleUser = await prisma.user.findFirst({
      where: { email: "john.student@example.edu" },
      include: {
        enrollments: {
          include: { course: true }
        }
      }
    });

    if (sampleUser) {
      console.log(`✅ Sample user: ${sampleUser.name} (${sampleUser.email})`);
      console.log(`   - Enrolled in ${sampleUser.enrollments.length} courses`);
      sampleUser.enrollments.forEach(enrollment => {
        console.log(`   - ${enrollment.course.code}: ${enrollment.course.title} (${enrollment.role})`);
      });
    }

    // Test 3: Get assignments with reflection templates
    const reflectionAssignments = await prisma.assignment.findMany({
      where: { type: "REFLECTION" },
      include: {
        course: true,
        reflectionTemplate: {
          include: {
            skillTags: {
              include: { skillTag: true }
            }
          }
        }
      }
    });

    console.log(`✅ Reflection assignments: ${reflectionAssignments.length}`);
    reflectionAssignments.forEach(assignment => {
      console.log(`   - ${assignment.title} (${assignment.course.code})`);
      if (assignment.reflectionTemplate) {
        const prompts = JSON.parse(JSON.stringify(assignment.reflectionTemplate.prompts));
        console.log(`     Prompts: ${prompts.length}`);
        console.log(`     Skills: ${assignment.reflectionTemplate.skillTags.length}`);
      }
    });

    // Test 4: Get graded submissions
    const gradedSubmissions = await prisma.submission.findMany({
      where: { status: "GRADED" },
      include: {
        assignment: true,
        student: true,
        grade: true
      }
    });

    console.log(`✅ Graded submissions: ${gradedSubmissions.length}`);
    gradedSubmissions.forEach(submission => {
      console.log(`   - ${submission.assignment.title} by ${submission.student.name}`);
      if (submission.grade) {
        console.log(`     Grade: ${submission.grade.score}/${submission.grade.maxScore} (${((submission.grade.score / submission.grade.maxScore) * 100).toFixed(1)}%)`);
      }
    });

    // Test 5: Complex query - Get reflection responses with skills
    const reflectionResponses = await prisma.reflectionResponse.findMany({
      include: {
        student: true,
        template: {
          include: { assignment: true }
        },
        selectedSkills: {
          include: { skillTag: true }
        }
      }
    });

    console.log(`✅ Reflection responses: ${reflectionResponses.length}`);
    reflectionResponses.forEach(response => {
      const answers = JSON.parse(JSON.stringify(response.answers));
      console.log(`   - ${response.student.name} - ${response.template.assignment.title}`);
      console.log(`     Questions answered: ${Object.keys(answers).length}`);
      console.log(`     Skills selected: ${response.selectedSkills.length}`);
      if (response.selectedSkills.length > 0) {
        console.log(`     Focused skill: ${response.selectedSkills[0].skillTag.name}`);
      }
    });

    console.log("\n🎉 All integration tests passed!");
    console.log("\n📊 Database Summary:");
    console.log(`   - Users: ${await prisma.user.count()}`);
    console.log(`   - Courses: ${await prisma.course.count()}`);
    console.log(`   - Assignments: ${await prisma.assignment.count()}`);
    console.log(`   - Submissions: ${await prisma.submission.count()}`);
    console.log(`   - Grades: ${await prisma.grade.count()}`);
    console.log(`   - Skill Tags: ${await prisma.skillTag.count()}`);
    console.log(`   - Reflection Templates: ${await prisma.reflectionTemplate.count()}`);
    console.log(`   - Reflection Responses: ${await prisma.reflectionResponse.count()}`);
    console.log(`   - Comments: ${await prisma.comment.count()}`);
    console.log(`   - Activity Logs: ${await prisma.activityLog.count()}`);

  } catch (error) {
    console.error("❌ Integration test failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testIntegration();