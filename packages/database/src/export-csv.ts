import { prisma } from "./client";
import fs from "fs";
import path from "path";

const CSV_EXPORT_DIR = "../../apps/docs/public/supabase/csv-exports";

function convertToCSV(data: any[], headers: string[]): string {
  if (data.length === 0) return headers.join(",") + "\n";

  const csvLines = [headers.join(",")];

  for (const item of data) {
    const values = headers.map(header => {
      let value = item[header];

      // Handle special data types
      if (value === null || value === undefined) {
        return "";
      } else if (typeof value === "object") {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      } else if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
        return `"${value.replace(/"/g, '""')}"`;
      } else {
        return String(value);
      }
    });

    csvLines.push(values.join(","));
  }

  return csvLines.join("\n");
}

async function exportTableToCSV(tableName: string, data: any[], headers: string[]) {
  const csvContent = convertToCSV(data, headers);
  const filePath = path.join(CSV_EXPORT_DIR, `${tableName}.csv`);

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, csvContent);
  console.log(`✅ Exported ${data.length} rows to ${tableName}.csv`);
}

async function main() {
  console.log("🗂️ Starting CSV export...");

  try {
    // Export Users
    const users = await prisma.user.findMany();
    await exportTableToCSV("users", users, ["id", "name", "email", "emailVerified", "createdAt", "updatedAt"]);

    // Export Courses
    const courses = await prisma.course.findMany();
    await exportTableToCSV("courses", courses, ["id", "code", "title", "description", "instructor", "semester", "createdById", "createdAt", "updatedAt"]);

    // Export Course Enrollments
    const enrollments = await prisma.courseEnrollment.findMany();
    await exportTableToCSV("course_enrollments", enrollments, ["id", "userId", "courseId", "role", "enrolledAt"]);

    // Export Skill Tags
    const skillTags = await prisma.skillTag.findMany();
    await exportTableToCSV("skill_tags", skillTags, ["id", "name", "category", "description", "createdAt"]);

    // Export Assignments
    const assignments = await prisma.assignment.findMany();
    await exportTableToCSV("assignments", assignments, ["id", "title", "description", "type", "maxPoints", "dueDate", "instructions", "isPublished", "courseId", "createdById", "createdAt", "updatedAt"]);

    // Export Submissions
    const submissions = await prisma.submission.findMany();
    await exportTableToCSV("submissions", submissions, ["id", "assignmentId", "studentId", "type", "status", "submittedAt", "content", "files", "createdAt", "updatedAt"]);

    // Export Grades
    const grades = await prisma.grade.findMany();
    await exportTableToCSV("grades", grades, ["id", "submissionId", "score", "maxScore", "feedback", "gradedById", "gradedAt", "createdAt", "updatedAt"]);

    // Export Grade Changes
    const gradeChanges = await prisma.gradeChange.findMany();
    await exportTableToCSV("grade_changes", gradeChanges, ["id", "gradeId", "oldScore", "newScore", "reason", "changedById", "changedAt"]);

    // Export Comments
    const comments = await prisma.comment.findMany();
    await exportTableToCSV("comments", comments, ["id", "submissionId", "userId", "content", "parentId", "createdAt", "updatedAt"]);

    // Export Reflection Templates
    const reflectionTemplates = await prisma.reflectionTemplate.findMany();
    await exportTableToCSV("reflection_templates", reflectionTemplates, ["id", "assignmentId", "prompts", "dataToShow", "createdAt", "updatedAt"]);

    // Export Reflection Template Skills
    const reflectionTemplateSkills = await prisma.reflectionTemplateSkill.findMany();
    await exportTableToCSV("reflection_template_skills", reflectionTemplateSkills, ["id", "templateId", "skillTagId"]);

    // Export Reflection Responses
    const reflectionResponses = await prisma.reflectionResponse.findMany();
    await exportTableToCSV("reflection_responses", reflectionResponses, ["id", "templateId", "studentId", "submissionId", "answers", "needsHelp", "submittedAt", "createdAt", "updatedAt"]);

    // Export Reflection Response Skills
    const reflectionResponseSkills = await prisma.reflectionResponseSkill.findMany();
    await exportTableToCSV("reflection_response_skills", reflectionResponseSkills, ["id", "responseId", "skillTagId"]);

    // Export Activity Logs
    const activityLogs = await prisma.activityLog.findMany();
    await exportTableToCSV("activity_logs", activityLogs, ["id", "userId", "action", "entityType", "entityId", "details", "timestamp"]);

    console.log("\n🎉 CSV export completed successfully!");
    console.log(`📁 Files saved to: ${CSV_EXPORT_DIR}`);

  } catch (error) {
    console.error("❌ CSV export failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();