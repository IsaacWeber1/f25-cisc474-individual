# Supabase Database CSV Exports

This directory contains CSV exports of all tables from the Supabase database for the Advanced Web Technologies LMS project.

## Export Details

**Export Date**: September 19, 2025
**Database**: Supabase PostgreSQL
**Total Tables Exported**: 14
**Total Records**: 74

## Files Included

| Table Name | File Name | Records | Description |
|------------|-----------|---------|-------------|
| User | users.csv | 8 | User accounts (students, TAs, professors) |
| Course | courses.csv | 3 | Course information |
| CourseEnrollment | course_enrollments.csv | 10 | Student-course relationships |
| Assignment | assignments.csv | 5 | Assignments and reflection prompts |
| Submission | submissions.csv | 5 | Student submissions |
| Grade | grades.csv | 3 | Graded submissions |
| GradeChange | grade_changes.csv | 1 | Grade modification history |
| Comment | comments.csv | 3 | Feedback comments |
| SkillTag | skill_tags.csv | 6 | Learning skill categories |
| ReflectionTemplate | reflection_templates.csv | 2 | Reflection assignment templates |
| ReflectionTemplateSkill | reflection_template_skills.csv | 9 | Skills associated with reflection templates |
| ReflectionResponse | reflection_responses.csv | 1 | Student reflection submissions |
| ReflectionResponseSkill | reflection_response_skills.csv | 1 | Skills assessed in reflection responses |
| ActivityLog | activity_logs.csv | 3 | System activity tracking |

## Export Command

The CSV files were exported using PostgreSQL's `\copy` command via psql:

```bash
PGPASSWORD="[password]" psql -h [host] -p 5432 -d postgres -U [username] -c "\copy \"[TableName]\" TO '[filename].csv' WITH CSV HEADER"
```

## Data Overview

The exported data represents a fully functional LMS with:
- **8 users** across different roles (students, TAs, professors)
- **3 courses** including CISC474 Advanced Web Technologies
- **10 enrollments** showing student-course relationships
- **5 assignments** including traditional and reflection-based assessments
- **Complete grading workflow** with submissions, grades, and feedback
- **Reflection system** with templates, skills, and student responses
- **Activity tracking** for user interactions

## File Format

All CSV files include headers and use standard CSV formatting:
- Comma-separated values
- Header row with column names
- UTF-8 encoding
- Quoted strings where necessary

## Usage

These CSV files can be:
- Imported into other database systems
- Used for data analysis and reporting
- Loaded into spreadsheet applications
- Used for backup and migration purposes

## Database Schema

The complete database schema is defined in `/packages/database/prisma/schema.prisma` with:
- 14 interconnected models
- UUID primary keys
- Proper foreign key relationships
- Comprehensive data validation