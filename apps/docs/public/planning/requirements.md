# LMS MVP Requirements

## Student Requirements

### User Stories
* As a student, I can view all my enrolled courses in one dashboard
* As a student, I can see upcoming assignments with due dates
* As a student, I can submit assignments (file upload or text)
* As a student, I can view my grades and feedback
* As a student, I can complete reflections with guided prompts
* As a student, I can view and reply to comments on my submissions

### Acceptance Criteria
✓ Dashboard displays all enrolled courses
✓ Assignment list shows due dates and submission status
✓ File upload accepts common formats (PDF, TXT, ZIP)
✓ Text submission supports basic formatting
✓ Grades display with rubric notes when available
✓ Comments show in threaded format with timestamps
✓ Reflections show relevant course data before prompts

---

## Teaching Assistant Requirements

### User Stories
* As a TA, I can view all submissions for my assigned courses
* As a TA, I can add comments to student submissions
* As a TA, I can assign grades to submissions
* As a TA, I can update grades with a reason
* As a TA, I can filter submissions by status
* As a TA, I can review reflection responses

### Acceptance Criteria
✓ Submission list shows student names and submission times
✓ Comment system supports threaded replies
✓ Grade entry validates format (numeric/letter)
✓ Grade changes require and record a reason
✓ Filter options include: graded/ungraded, late/on-time
✓ Reflection summary shows quick tags (e.g., "needs help")

---

## Professor Requirements

### User Stories
* As a professor, I can create and manage courses
* As a professor, I can create assignments with specifications
* As a professor, I can review and grade all submissions
* As a professor, I can update grades with documented reasons
* As a professor, I can launch reflection assignments
* As a professor, I can view aggregate reflection summaries
* As a professor, I can post announcements to courses

### Acceptance Criteria
✓ Course creation includes name, term, and description
✓ Assignment creation supports type selection (file/text/reflection)
✓ Due dates are configurable per assignment
✓ Grade updates log to activity history
✓ Reflection templates support custom prompts
✓ Reflection summaries filterable by tags/keywords
✓ Announcements display on course overview

---

## Institution/Admin Requirements

### User Stories
* As an admin, I can view all courses in the system
* As an admin, I can see enrollment counts per course
* As an admin, I can view grade distributions
* As an admin, I can access reflection trend summaries
* As an admin, I can monitor system-wide activity

### Acceptance Criteria
✓ Course list shows term, instructor, enrollment count
✓ Grade distribution displays as histogram or summary stats
✓ Reflection trends highlight common themes/concerns
✓ Activity log shows grade changes and key events
✓ Export capability for enrollment and grade data

---

## Core System Actions

### Submit Actions
* Submit assignment (Student)
* Submit grade (TA/Professor)
* Submit grade change with reason (TA/Professor)
* Submit comment/reply (All roles)
* Submit reflection response (Student)

### View Actions
* View personal grades (Student)
* View course roster grades (TA/Professor)
* View program-level grades (Admin)
* View enrolled courses (Student)
* View teaching courses (TA/Professor)
* View all courses (Admin)

---

## Reflection Feature Requirements

### MVP Reflection Flow
1. Student accesses reflection from assignment list
2. System displays relevant data:
   * Current average grade
   * Recent comments from staff (last 3)
   * Class median grade (anonymized)
3. Student responds to guided prompts
4. Response saved with optional tags
5. Professor/TA reviews in summary view

### Reflection Data Points
* Grade trends
* Recent feedback
* Peer benchmarks (anonymized)
* Activity metrics
* Skill tag associations

### Reflection Use Cases
* Course reflection/survey
* Peer benchmark reflection
* Skill gap self-assessment
* Collaboration reflection
* Teaching effectiveness
* Equity & inclusion monitoring

---

## Technical Requirements

### Authentication
* School email login
* Role-based access control
* Session management

### Data Management
* File upload support (10MB limit)
* Text submission with basic formatting
* Grade history tracking
* Comment threading
* Activity logging for auditing

### Performance
* Dashboard loads in < 2 seconds
* Assignment list paginated (25 per page)
* Real-time comment updates
* Async file upload processing

---

## Out of Scope (v1)
* Complex rubric builders
* Multi-file repository submissions
* Automated late penalties
* Deep analytics dashboards
* Real-time collaboration
* In-app messaging/chat
* Plagiarism detection
* LTI integration