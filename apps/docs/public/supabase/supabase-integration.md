# Supabase Integration Documentation

## Learning Management System (LMS) Database Schema & Data

This document provides comprehensive documentation for the Supabase database integration for the Learning Management System, including Prisma schema details, seeded test data, and exported CSV files for review.

---

## 📋 Assignment Requirements Fulfilled

✅ **Prisma Schema Development** - Created comprehensive schema for LMS MVP
✅ **Test Data Generation** - Generated realistic, authentic test data
✅ **Database Seeding** - Successfully seeded Supabase database
✅ **CSV Data Export** - Exported all tables to CSV format
✅ **Documentation** - Complete documentation with links

---

## 🗂️ Prisma Schema

### 📄 [Prisma Schema File](https://github.com/IsaacWeber1/f25-cisc474-individual/blob/main/packages/database/prisma/schema.prisma)

**Location**: `packages/database/prisma/schema.prisma`

### Schema Overview

The LMS database schema includes **14 models** with comprehensive relationships supporting:

- **User Management**: Students, TAs, Professors, and Admins
- **Course Management**: Courses with enrollments and role-based access
- **Assignment System**: File, Text, and Reflection assignment types
- **Submission Tracking**: Student submissions with status management
- **Grading System**: Grades with feedback and audit trail
- **Reflection Feature**: Unique reflection assignments with guided prompts and skill tags
- **Comment System**: Threaded comments on submissions
- **Activity Logging**: Complete audit trail of user actions

### Key Features

#### **Enums for Type Safety**
```prisma
enum Role { STUDENT, TA, PROFESSOR, ADMIN }
enum AssignmentType { FILE, TEXT, REFLECTION }
enum SubmissionStatus { DRAFT, SUBMITTED, GRADED, LATE }
```

#### **Core Entities**
- **User**: Complete user profile with relationships
- **Course**: Course information with unique code/semester constraint
- **CourseEnrollment**: Many-to-many with role assignment
- **Assignment**: Flexible assignment system with type support
- **Submission**: Student submissions with file/text/reflection support
- **Grade**: Comprehensive grading with feedback

#### **Unique Reflection System** ✨
- **ReflectionTemplate**: Configurable prompts and data display
- **ReflectionResponse**: Student responses with skill selection
- **SkillTag**: Categorized skills for reflection focus
- **Many-to-many relationships** for template-skill and response-skill associations

#### **Audit & Communication**
- **GradeChange**: Complete audit trail for grade modifications
- **Comment**: Threaded comments with parent-child relationships
- **ActivityLog**: Comprehensive activity tracking

---

## 🎯 Test Data Strategy

### Data Authenticity
- **8 realistic users** across all roles (students, TAs, professors)
- **3 courses** representing different computer science subjects
- **6 assignments** including the distinctive reflection feature
- **Multiple submission states** (draft, submitted, graded)
- **Rich feedback and comments** mimicking real academic interactions

### Interesting Test Cases

#### **Course with No Assignments**
- CISC275 has enrollments but limited assignments for edge case testing

#### **Course with Multiple User Types**
- CISC474 includes students, TA, and professor for role-based testing

#### **Diverse Assignment Types**
- File submissions (algorithm analysis, recursion lab)
- Text submissions (component descriptions)
- Reflection assignments (guided self-assessment)

#### **Grade Audit Trail**
- Grade changes with reasons and timestamps
- Activity logs tracking all user interactions

---

## 📊 Exported CSV Data

All database tables have been exported to CSV format for review and grading:

### Core Tables

#### **[Users Table](./csv-exports/users.csv)**
- **8 users** across all role types
- Includes students, TAs, professors with realistic academic emails
- Creation timestamps and profile information

#### **[Courses Table](./csv-exports/courses.csv)**
- **3 courses**: CISC474 (Web Tech), CISC320 (Algorithms), CISC275 (Software Engineering)
- Complete course metadata with descriptions and instructors
- Fall 2024 semester designation

#### **[Course Enrollments Table](./csv-exports/course_enrollments.csv)**
- **10 enrollments** demonstrating role-based course participation
- Students enrolled in multiple courses
- TAs and professors assigned to their respective courses

### Assignment & Submission Tables

#### **[Assignments Table](./csv-exports/assignments.csv)**
- **6 assignments** across different types and courses
- File assignments: NextJS Frontend, Algorithm Analysis, Recursion Lab
- Text assignment: React Components
- Reflection assignments: Week 8 Reflection, Mid-term Reflection
- Due dates, point values, and detailed instructions

#### **[Submissions Table](./csv-exports/submissions.csv)**
- **5 submissions** in various states (submitted, graded)
- File submissions with file arrays
- Text submissions with content
- Reflection submission linked to template responses

#### **[Grades Table](./csv-exports/grades.csv)**
- **3 graded submissions** with scores and detailed feedback
- Realistic grade distributions and instructor comments
- Grade timestamps and relationships to graders

### Reflection System Tables

#### **[Reflection Templates Table](./csv-exports/reflection_templates.csv)**
- **2 reflection templates** with different prompt sets
- JSON arrays of guided reflection questions
- Data display configurations for student context

#### **[Reflection Responses Table](./csv-exports/reflection_responses.csv)**
- **1 complete reflection response** with authentic student answers
- JSON object storing question-answer mappings
- Skill selection and help-seeking indicators

#### **[Skill Tags Table](./csv-exports/skill_tags.csv)**
- **6 skill categories**: React Components, State Management, API Integration, Testing, Debugging, Time Management
- Organized by categories: frontend, backend, quality, development, collaboration

#### **[Reflection Template Skills Table](./csv-exports/reflection_template_skills.csv)**
- **9 many-to-many relationships** linking templates to available skills
- Demonstrates flexible skill assignment to different reflection types

#### **[Reflection Response Skills Table](./csv-exports/reflection_response_skills.csv)**
- **1 selected skill** (State Management) for the reflection response
- Shows student's chosen focus area for improvement

### Communication & Audit Tables

#### **[Comments Table](./csv-exports/comments.csv)**
- **3 comments** including threaded discussion
- Instructor feedback and student responses
- Parent-child comment relationships demonstrating threading

#### **[Grade Changes Table](./csv-exports/grade_changes.csv)**
- **1 grade change** with detailed reasoning
- Complete audit trail showing old score, new score, and justification
- Demonstrates transparency in grading adjustments

#### **[Activity Logs Table](./csv-exports/activity_logs.csv)**
- **3 activity entries** tracking user actions
- Grade changes, submission creation, assignment viewing
- Comprehensive activity monitoring for system transparency

---

## 🚀 Technical Implementation

### Database Configuration
- **Provider**: PostgreSQL via Supabase
- **ORM**: Prisma with TypeScript generation
- **Connection**: Pooled connections for performance

### Seeding Process
1. **Schema Migration**: Prisma db push with force reset
2. **Prisma Client Generation**: TypeScript-safe database client
3. **Sequential Seeding**: Ordered data creation respecting foreign key constraints
4. **Data Validation**: Upsert operations preventing duplicate data

### CSV Export Process
- **Custom Export Script**: TypeScript utility for table-to-CSV conversion
- **JSON Handling**: Proper escaping and formatting of JSON fields
- **Comprehensive Coverage**: All 14 tables exported with complete data

---

## 🎨 LMS Features Demonstrated

### **Distinctive Reflection System** ✨
The centerpiece feature that differentiates this LMS:
- **Guided Prompts**: Pre-configured reflection questions
- **Data Context**: Shows recent grades, peer benchmarks, feedback
- **Skill Tagging**: Students select focus areas for improvement
- **Template Flexibility**: Different reflection types for different courses

### **Role-Based Access Control**
- **Students**: Submit assignments, view personal grades, complete reflections
- **TAs**: Grade submissions, provide feedback, monitor student progress
- **Professors**: Create assignments, manage courses, configure reflections
- **Admins**: System-wide access and user management

### **Comprehensive Assignment Types**
- **File Submissions**: Upload PDFs, code files, documents
- **Text Submissions**: In-browser text entry with rich formatting
- **Reflection Submissions**: Guided self-assessment with skill selection

### **Grade Transparency**
- **Detailed Feedback**: Text feedback on all graded submissions
- **Audit Trail**: Complete history of grade changes with reasons
- **Activity Tracking**: Monitor all user interactions with the system

---

## 📈 Data Statistics

| Table | Row Count | Key Features |
|-------|-----------|--------------|
| Users | 8 | Students, TAs, Professors across multiple courses |
| Courses | 3 | Computer Science courses with realistic metadata |
| Course Enrollments | 10 | Role-based course participation |
| Assignments | 6 | Mixed types including unique reflection assignments |
| Submissions | 5 | Various states demonstrating submission workflow |
| Grades | 3 | Realistic scoring with detailed feedback |
| Skill Tags | 6 | Categorized skills for reflection system |
| Reflection Templates | 2 | Different prompt sets for varied reflection types |
| Reflection Responses | 1 | Complete student reflection with skill selection |
| Comments | 3 | Threaded discussion on submissions |
| Grade Changes | 1 | Audit trail for grade transparency |
| Activity Logs | 3 | User action tracking for system monitoring |

**Total Records**: 60+ entries across all tables

---

## 🔗 Repository Links

### Primary Files
- **[Prisma Schema](https://github.com/IsaacWeber1/f25-cisc474-individual/blob/main/packages/database/prisma/schema.prisma)** - Complete database schema definition
- **[Seed Script](https://github.com/IsaacWeber1/f25-cisc474-individual/blob/main/packages/database/src/seed.ts)** - Comprehensive data generation script
- **[CSV Export Script](https://github.com/IsaacWeber1/f25-cisc474-individual/blob/main/packages/database/src/export-csv.ts)** - Table export utility

### CSV Data Files
All CSV exports are available in the `csv-exports` directory:

- **[users.csv](./csv-exports/users.csv)** - User profiles and authentication data
- **[courses.csv](./csv-exports/courses.csv)** - Course catalog with metadata
- **[course_enrollments.csv](./csv-exports/course_enrollments.csv)** - User-course relationships with roles
- **[assignments.csv](./csv-exports/assignments.csv)** - Assignment definitions and requirements
- **[submissions.csv](./csv-exports/submissions.csv)** - Student submissions across all types
- **[grades.csv](./csv-exports/grades.csv)** - Graded submissions with feedback
- **[skill_tags.csv](./csv-exports/skill_tags.csv)** - Categorized skills for reflections
- **[reflection_templates.csv](./csv-exports/reflection_templates.csv)** - Reflection prompt configurations
- **[reflection_responses.csv](./csv-exports/reflection_responses.csv)** - Student reflection submissions
- **[reflection_template_skills.csv](./csv-exports/reflection_template_skills.csv)** - Template-skill relationships
- **[reflection_response_skills.csv](./csv-exports/reflection_response_skills.csv)** - Response-skill selections
- **[comments.csv](./csv-exports/comments.csv)** - Threaded discussion on submissions
- **[grade_changes.csv](./csv-exports/grade_changes.csv)** - Grade modification audit trail
- **[activity_logs.csv](./csv-exports/activity_logs.csv)** - User activity monitoring

---

## ✅ Assignment Completion Summary

This Supabase integration successfully fulfills all assignment requirements:

1. **✅ Comprehensive Prisma Schema** - 14 models with complete relationships for LMS MVP
2. **✅ Realistic Test Data** - 60+ records across all tables with authentic academic content
3. **✅ Successful Database Seeding** - All data successfully migrated to Supabase
4. **✅ Complete CSV Export** - All 14 tables exported with proper formatting
5. **✅ Detailed Documentation** - This comprehensive guide with all required links

The schema supports the full Learning Management System vision with:
- **Flexible, user-friendly interface** through role-based access
- **Scalable architecture** supporting diverse learning needs
- **Structured yet adaptable environment** for programming problem management
- **Meaningful engagement** between students, TAs, and professors
- **Unique reflection submission type** as the distinctive feature

Ready for integration with the existing Next.js frontend application.

---

*Generated as part of CISC474 Advanced Web Technologies - Fall 2024*