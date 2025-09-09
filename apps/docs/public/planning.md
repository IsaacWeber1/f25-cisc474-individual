# LMS MVP — Planning

**Vision**
Build a flexible, friendly LMS for programming courses that helps **Students**, **Teaching Assistants**, **Professors**, and the **School / Institution** manage **courses, assignments, submissions, grades, and feedback**. Add one distinctive submission type: **Reflection**.

---

## Roles (plain language)

* **Student**: joins courses, submits work, sees grades/comments, completes reflections.
* **Teaching Assistant (TA)**: helps manage courses, comments, grades, and reflections.
* **Professor**: creates courses/assignments, reviews submissions, grades, comments, updates grades, launches reflections.
* **Institution/Admin**: high-level view of courses, enrollment, grade distributions, reflection outcomes.

---

## Core Actions (MVP)

**Submit**

* Assignment
* Grade(s) (TA/Professor only)
* Change grade(s) (TA/Professor only; record a reason)
* Comment / Reply (threaded on submissions and reflections)

**Views**

* Grades (personal for Student; roster/aggregate for TA/Professor; program-level for Institution)
* Courses (Student: enrolled; TA/Professor: teaching; Institution: all)

---

## User Stories (MVP-level)

**Student**

* I can see all my **courses** and upcoming **assignments** in one place.
* I can **submit** an assignment (file or text) and **see comments and grades**.
* I can complete a **Reflection** with guided prompts that reference my own course data.

**TA**

* I can see **submissions** for assignments I help with.
* I can **comment**, **grade**, and, if needed, **change grades** with a short note.

**Professor**

* I can **create** a course and **post assignments** with due dates.
* I can **review submissions**, **comment**, **grade**, and **update grades** with reasons.
* I can **launch a Reflection** for a course and see a simple summary of responses.

**Institution/Admin**

* I can view **course lists**, enrollment counts, and **high-level grade distributions**.
* I can see **Reflection** summaries to spot trends (e.g., skill gaps).

---

## Special Submission Type: **Reflection** (MVP)

A **Reflection** is a configurable submission that **pulls relevant LMS data** (e.g., recent grades, comments, activity, skill tags, peer benchmarks) and shows **guided prompts**.

**Example MVP flow**

1. Student opens Reflection from an assignment called “Course Reflection.”
2. The page shows: “Your average grade so far,” “Last 3 comments from staff,” and a simple peer benchmark (e.g., class median grade).
3. Prompts (short form):

   * *What helped you most this week?*
   * *Where did you get stuck?*
   * *Pick one skill tag to focus on next week.*
4. Student submits; Professor/TA sees responses in a simple list view with quick filters (e.g., “needs help”, chosen skill tag).

**Initial use-cases to keep in mind**

* Course Reflection / Survey
* Peer Benchmark Reflection
* Skill Gap Self-Assessment
* Collaboration Reflection (group work)
* Teaching Effectiveness (Professor/TA)
* Equity & Inclusion (Institution/Admin)

---

## Pages (Site Map — MVP)

* **Auth**

  * Login (school email)
* **Dashboard**

  * My Courses (Student) / Teaching (TA/Professor) / Overview (Institution)
* **Course**

  * Overview (announcements, roster snippet)
  * Assignments (list → detail)
  * Grades (table)
  * Reflections (list → detail)
* **Assignment**

  * Details (spec, due date)
  * Submit (file/text/reflection)
  * Submissions (TA/Professor list → review)
* **Submission**

  * Review (file/text viewer, comments, grade, change grade)
* **Reflection**

  * Complete (data summary + prompts)
  * Review (TA/Professor summary)
* **Admin**

  * Courses (all), Enrollment, Aggregate Grades, Reflection summaries

---

## Nouns (Basic Data “Things”)

* **School / Institution**
* **User** (roles: Student, TA, Professor, Admin)
* **Course**
* **Enrollment** (User ↔ Course; includes role in that course)
* **Assignment** (belongs to Course; has type: file, text, reflection)
* **Submission** (by User to Assignment; stores content or reflection answers)
* **Grade** (numeric/letter + rubric note)
* **Comment** (threaded; on Submission)
* **ReflectionTemplate** (prompts + what data to surface)
* **ReflectionResponse** (answers + quick tags like “needs help”)
* **SkillTag** (e.g., recursion, testing, debugging)
* **ActivityLog** (grade changes, important events)

**Key relationships (plain language)**

* A Course has many Assignments and Enrollments.
* An Assignment has many Submissions.
* A Submission has one Grade (updatable) and many Comments.
* A Reflection is just an Assignment with type = “reflection” and a Template.
* Users join Courses through Enrollments with a role.

---

## MVP Scope (Keep it small)

* Auth with school email (mock or simple).
* Course list, Assignment list, Submission flow (file/text).
* Grading + grade change with a reason (record in ActivityLog).
* Commenting (threaded) on submissions.
* Reflection (simple data summary + 3 prompts + list summary).
* Views of grades and courses per role.

**Out of scope (for now)**

* Complex rubric builders, multi-file repos, late policies, deep analytics.
* Rich peer benchmarking beyond simple median/average.
* Real-time collab or chat.

---

## Files for Claude to Generate

Place all files **in** `apps/docs/public/` and link them below. Keep language concise and non-jargony.

1. **Requirements** → `requirements.md`

   * Expand the user stories above into short bullet lists per role.
   * Add clear acceptance checks (one-liners).
   * Keep it readable and brief.

2. **Site Map** → `sitemap.md`

   * Include a short overview list of pages.
   * Add a simple Mermaid diagram:

     ```mermaid
     flowchart TD
       A[Login] --> B[Dashboard]
       B --> C[Course]
       C --> D[Assignments]
       D --> E[Assignment Detail]
       E --> F[Submit]
       E --> G[Submissions Review]
       C --> H[Grades]
       C --> I[Reflections]
       I --> J[Reflection Detail]
       J --> K[Complete Reflection]
       B --> L[Admin Overview]
     ```

3. **Wireframes** → `wireframes.md`

   * Use **plain ASCII** wireframes (one per section) for:

     * Dashboard (My Courses)
     * Course → Assignments list
     * Assignment → Submit
     * Submission → Review/Grade
     * Reflection → Complete
   * Keep to 6–12 lines each; label major regions.

4. **Data Model (basic)** → `data_model.mmd`

   * A minimal Mermaid ER-style diagram with only the nouns above and the simplest relationships (no types, no indexes).
   * Example starter (expand as needed):

     ```mermaid
     erDiagram
       User ||--o{ Enrollment : enrolls
       Course ||--o{ Enrollment : has
       Course ||--o{ Assignment : includes
       Assignment ||--o{ Submission : receives
       Submission ||--|| Grade : gets
       Submission ||--o{ Comment : has
       Assignment ||--|| ReflectionTemplate : uses
       User ||--o{ Submission : submits
     ```

---

## Submission Index (this file will link everything)

* [Requirements](./requirements.md)
* [Site Map](./sitemap.md)
* [Wireframes](./wireframes.md)
* [Data Model](./data_model.mmd)

> When the above files exist in `apps/docs/public/`, these links should work directly in GitHub.

---

## Writing Style Notes (for generated docs)

* Be concise. Prefer plain language over jargon.
* Focus on **what** users can do, not how to implement it.
* Diagrams can be simple; readability first.
* If a REQUIRED PIECE spans multiple sections, add a one-line note indicating the mapping.

---

## Tiny Checklist

* [x] Requirements cover Students, TAs, Professors, Institution.
* [x] Actions include: submit assignment, grade/change grade, comment/reply; views for grades/courses.
* [x] Reflection flow shows data + prompts and a simple summary view.
* [x] Site map lists MVP pages.
* [x] Wireframes exist for 5 key screens.
* [x] Data model diagram includes the basic nouns and relationships.

---

## AI Assistance Disclosure

This project planning documentation was created with assistance from Claude AI (Anthropic). The AI helped with:

- Expanding the initial MVP concept into detailed requirements
- Creating comprehensive user stories and acceptance criteria  
- Designing site navigation flow and URL structure
- Developing ASCII wireframes for key user interfaces
- Building the entity relationship diagram with proper relationships
- Organizing and formatting all documentation for clarity

The unique "Reflection" submission feature concept and overall LMS vision were human-generated, with AI assistance in implementation planning and detailed specification.

---
