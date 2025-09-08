# Wireframes - Learning Management System

## Dashboard Page

```
┌─────────────────────────────────────────────────────────────────┐
│ [🏠 LMS Logo]        [Search...]           [👤 Profile] [🔔]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Welcome back, [Student Name]!                                 │
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │   Upcoming Tasks    │  │   Recent Activity   │             │
│  │                     │  │                     │             │
│  │ • Assignment 3 Due  │  │ ✓ Grade received    │             │
│  │   CS101 - Tomorrow  │  │   for Assignment 2  │             │
│  │                     │  │                     │             │
│  │ • Quiz 2 Available  │  │ 📝 New announcement │             │
│  │   MATH201 - Today   │  │   in CS101          │             │
│  │                     │  │                     │             │
│  │ [View All Tasks]    │  │ [View All Activity] │             │
│  └─────────────────────┘  └─────────────────────┘             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    My Courses                               │ │
│  │                                                             │ │
│  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │ │
│  │ │   CS101      │ │  MATH201     │ │   ENG105     │        │ │
│  │ │ Intro to CS  │ │  Calculus    │ │ Composition  │        │ │
│  │ │              │ │              │ │              │        │ │
│  │ │ Progress:    │ │ Progress:    │ │ Progress:    │        │ │
│  │ │ ████░░░ 70%  │ │ ██████░ 85%  │ │ ███░░░░ 45%  │        │ │
│  │ │              │ │              │ │              │        │ │
│  │ │ [Enter]      │ │ [Enter]      │ │ [Enter]      │        │ │
│  │ └──────────────┘ └──────────────┘ └──────────────┘        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Course Overview Page

```
┌─────────────────────────────────────────────────────────────────┐
│ [← Back] CS101 - Introduction to Computer Science               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─ Navigation Tabs ─────────────────────────────────────────────┐ │
│ │ [Overview] [Assignments] [Grades] [Resources] [Discussion]   │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Course Description:                                             │
│ This course introduces fundamental concepts of computer         │
│ science including programming, data structures, and algorithms. │
│                                                                 │
│ ┌─────────────────────┐  ┌─────────────────────────────────────┐ │
│ │   Announcements     │  │        Quick Stats              │ │
│ │                     │  │                                     │ │
│ │ 📢 Assignment 3     │  │ • Students Enrolled: 145           │ │
│ │    posted           │  │ • Assignments Completed: 8/12      │ │
│ │    Due: Oct 15      │  │ • Current Grade: B+ (87%)          │ │
│ │                     │  │ • Next Due Date: Tomorrow          │ │
│ │ 📢 Quiz 2 scheduled │  │                                     │ │
│ │    for next week    │  │                                     │ │
│ │                     │  │                                     │ │
│ │ [View All]          │  │                                     │ │
│ └─────────────────────┘  └─────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐   │
│ │                Recent Assignments                           │   │
│ │                                                             │   │
│ │ Assignment 2: Data Structures        [✓ Submitted] [A-]    │   │
│ │ Assignment 3: Algorithm Analysis     [⏰ Due Tomorrow]      │   │
│ │ Quiz 1: Basic Concepts              [✓ Completed] [B+]     │   │
│ │                                                             │   │
│ │                                     [View All Assignments] │   │
│ └─────────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Assignment Submission Page (Interactive Code)

```
┌─────────────────────────────────────────────────────────────────┐
│ CS101 - Assignment 3: Binary Search Implementation             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─ Assignment Instructions ─────────────────────────────────────┐ │
│ │ Implement a binary search algorithm that returns the index   │ │
│ │ of the target element. Your solution should have O(log n)    │ │
│ │ time complexity.                                              │ │
│ │                                                               │ │
│ │ Requirements:                                                 │ │
│ │ • Handle edge cases (empty array, element not found)         │ │
│ │ • Include proper error handling                               │ │
│ │ • Write clean, commented code                                 │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─ Code Editor ─────────────────────────────────────────────────┐ │
│ │ Language: [Python ▼]                            [💾 Save]    │ │
│ │                                                               │ │
│ │  1  def binary_search(arr, target):                          │ │
│ │  2      # TODO: Implement binary search                      │ │
│ │  3      left, right = 0, len(arr) - 1                       │ │
│ │  4                                                            │ │
│ │  5      while left <= right:                                 │ │
│ │  6          mid = (left + right) // 2                        │ │
│ │  7          if arr[mid] == target:                            │ │
│ │  8              return mid                                    │ │
│ │  9          elif arr[mid] < target:                           │ │
│ │ 10              left = mid + 1                                │ │
│ │ 11          else:                                             │ │
│ │ 12              right = mid - 1                               │ │
│ │ 13                                                            │ │
│ │ 14      return -1  # Not found                               │ │
│ │                                                               │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─ Test Console ────────────────────────────────────────────────┐ │
│ │ [▶ Run Tests] [🧪 Sample Tests] [📝 Custom Test]             │ │
│ │                                                               │ │
│ │ Running tests...                                              │ │
│ │                                                               │ │
│ │ ✅ Test 1: binary_search([1,2,3,4,5], 3) → Expected: 2      │ │
│ │ ✅ Test 2: binary_search([1,3,5,7], 7) → Expected: 3        │ │
│ │ ❌ Test 3: binary_search([], 1) → Expected: -1, Got: Error   │ │
│ │ ✅ Test 4: binary_search([1,2,3], 4) → Expected: -1         │ │
│ │                                                               │ │
│ │ 3/4 tests passing                                             │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ [💾 Save Draft] [📤 Submit Assignment] [❌ Cancel]             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Grading Center (Professor View)

```
┌─────────────────────────────────────────────────────────────────┐
│ CS101 - Grading Center                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Assignment: Binary Search Implementation                        │
│ Due Date: Oct 15, 2024                                          │
│ Submissions: 142/145 students                                   │
│                                                                 │
│ ┌─ Filter & Search ─────────────────────────────────────────────┐ │
│ │ Status: [All ▼] | Grade: [All ▼] | Search: [Student name...] │ │
│ │ [🔄 Ungraded] [✅ Graded] [⏰ Late] [🔍 Needs Review]        │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐   │
│ │ Student Submissions                                         │   │
│ │                                                             │   │
│ │ ┌─────────┬─────────────┬────────┬────────┬────────────────┐ │   │
│ │ │ Student │ Submit Time │ Status │ Grade  │ Action         │ │   │
│ │ ├─────────┼─────────────┼────────┼────────┼────────────────┤ │   │
│ │ │ Adams,J │ Oct 14 3:45p│   🔄   │   -    │ [Grade Now]    │ │   │
│ │ │ Brown,M │ Oct 14 11:30a│  ✅   │  A-    │ [Review]       │ │   │
│ │ │ Davis,S │ Oct 15 2:15p│   ⏰   │   -    │ [Grade Now]    │ │   │
│ │ │ Evans,L │ Oct 13 9:20a│   🔄   │   -    │ [Grade Now]    │ │   │
│ │ │ Frank,R │ Oct 14 4:55p│  ✅   │  B+    │ [Review]       │ │   │
│ │ └─────────┴─────────────┴────────┴────────┴────────────────┘ │   │
│ │                                                             │   │
│ │                                      [◀ Prev] [Next ▶]     │   │
│ └─────────────────────────────────────────────────────────────┘   │
│                                                                 │
│ [📊 Grade Statistics] [📧 Bulk Email] [📤 Export Grades]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Individual Submission Grading Interface

```
┌─────────────────────────────────────────────────────────────────┐
│ Grading: Adams, John - Binary Search Implementation             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─ Student Code ────────────────────────────────────────────────┐ │
│ │ [▶ Run Code] [🧪 Test Cases] [📋 Copy Code]                  │ │
│ │                                                               │ │
│ │  1  def binary_search(arr, target):                          │ │
│ │  2      if not arr:                                           │ │
│ │  3          return -1                                         │ │
│ │  4      left, right = 0, len(arr) - 1                       │ │
│ │  5      while left <= right:                                 │ │
│ │  6          mid = (left + right) // 2                        │ │
│ │  7          if arr[mid] == target:                            │ │
│ │  8              return mid                                    │ │
│ │  9          elif arr[mid] < target:                           │ │
│ │ 10              left = mid + 1                                │ │
│ │ 11          else:                                             │ │
│ │ 12              right = mid - 1                               │ │
│ │ 13      return -1                                             │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─ Test Results ────────────────────────────────────────────────┐ │
│ │ ✅ All visible tests passed (4/4)                            │ │
│ │ ✅ All hidden tests passed (3/3)                             │ │
│ │ ✅ Performance: O(log n) confirmed                           │ │
│ │ ✅ Edge cases handled correctly                              │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─ Grading Rubric ──────────────────────────────────────────────┐ │
│ │ Correctness (40 pts):     [38] ████████████████████░░        │ │
│ │ Code Quality (30 pts):    [28] ████████████████████░░        │ │
│ │ Comments (15 pts):        [12] ████████████████░░░░░░        │ │
│ │ Efficiency (15 pts):      [15] ████████████████████████      │ │
│ │                                                               │ │
│ │ Total: [93/100] Grade: [A-]                                  │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─ Feedback ────────────────────────────────────────────────────┐ │
│ │ Excellent implementation! Your code correctly handles all    │ │
│ │ test cases and edge conditions. The algorithm is efficient   │ │
│ │ with O(log n) time complexity as required.                   │ │
│ │                                                               │ │
│ │ Minor suggestions:                                            │ │
│ │ • Line 4: Consider adding a comment explaining the two-      │ │
│ │   pointer approach                                            │ │
│ │ • Overall: More descriptive variable names would improve     │ │
│ │   readability                                                 │ │
│ │                                                               │ │
│ │ Great work overall!                                           │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ [💾 Save Grade] [📤 Publish] [◀ Previous] [Next ▶] [❌ Cancel] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Admin Panel - User Management

```
┌─────────────────────────────────────────────────────────────────┐
│ Admin Panel - User Management                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─ Controls ────────────────────────────────────────────────────┐ │
│ │ [➕ Add User] [📧 Bulk Invite] [📊 User Reports]              │ │
│ │                                                               │ │
│ │ Search: [Name, email, or ID...]          Role: [All ▼]       │ │
│ │ Status: [Active ▼]                       Sort: [Name ▼]      │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─ User Directory ──────────────────────────────────────────────┐ │
│ │                                                               │ │
│ │ ┌──────┬─────────────┬─────────────┬──────┬────────┬─────────┐ │ │
│ │ │ ID   │ Name        │ Email       │ Role │ Status │ Actions │ │ │
│ │ ├──────┼─────────────┼─────────────┼──────┼────────┼─────────┤ │ │
│ │ │ 1001 │ Dr.Smith    │smith@edu    │ Prof │ Active │ [Edit]  │ │ │
│ │ │ 1002 │ Adams,John  │jadams@edu   │ Stud │ Active │ [Edit]  │ │ │
│ │ │ 1003 │ Brown,Mary  │mbrown@edu   │ TA   │ Active │ [Edit]  │ │ │
│ │ │ 1004 │ Davis,Sam   │sdavis@edu   │ Stud │ Inactive│[Edit] │ │ │
│ │ │ 1005 │ Evans,Lisa  │levans@edu   │ Stud │ Pending│ [Edit]  │ │ │
│ │ └──────┴─────────────┴─────────────┴──────┴────────┴─────────┘ │ │
│ │                                                               │ │
│ │                                    [◀ Prev] Page 1 [Next ▶] │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─ Quick Stats ─────────────────────────────────────────────────┐ │
│ │ Total Users: 1,247     Active: 1,156     Pending: 43         │ │
│ │ Students: 1,089        Professors: 67     TAs: 91            │ │
│ │ New This Week: 23      Login Rate: 94%                       │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Mobile Responsive - Dashboard (Phone View)

```
┌──────────────────────────┐
│ ☰ LMS    [🔔] [👤]      │
├──────────────────────────┤
│                          │
│ Welcome, John!           │
│                          │
│ ┌──────────────────────┐ │
│ │ 📚 My Courses (3)    │ │
│ │                      │ │
│ │ CS101 - Due Tomorrow │ │
│ │ ████░░░ 70%         │ │
│ │ [Enter Course]       │ │
│ │                      │ │
│ │ MATH201 - Quiz Today │ │
│ │ ██████░ 85%         │ │
│ │ [Enter Course]       │ │
│ │                      │ │
│ │ [View All Courses]   │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │ ⏰ Upcoming (2)      │ │
│ │                      │ │
│ │ • Assignment 3       │ │
│ │   Due: Tomorrow      │ │
│ │                      │ │
│ │ • Quiz 2 Available   │ │
│ │   Due: Friday        │ │
│ │                      │ │
│ │ [View All Tasks]     │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │ 📊 Recent Activity   │ │
│ │                      │ │
│ │ ✓ Grade: Assignment 2│ │
│ │   Score: A-          │ │
│ │                      │ │
│ │ 📢 New announcement  │ │
│ │   in CS101           │ │
│ │                      │ │
│ │ [View All Activity]  │ │
│ └──────────────────────┘ │
│                          │
└──────────────────────────┘
```

## Design Notes

### Color Scheme & Visual Hierarchy
- **Primary Colors:** Blue (#2563eb) for actions, Green (#059669) for success states
- **Status Colors:** Red (#dc2626) for errors/late, Yellow (#d97706) for warnings, Gray (#6b7280) for neutral
- **Typography:** Clean, readable fonts with proper contrast ratios
- **Spacing:** Consistent 8px grid system for layouts

### Interactive Elements
- **Buttons:** Clear call-to-action styling with hover/focus states
- **Form Fields:** Prominent borders and validation feedback
- **Code Editor:** Syntax highlighting, line numbers, auto-complete
- **Test Results:** Clear pass/fail indicators with detailed feedback

### Accessibility Considerations
- **Keyboard Navigation:** All interactive elements accessible via keyboard
- **Screen Readers:** Proper ARIA labels and semantic HTML structure
- **Color Blind Friendly:** Status indicators use shapes/icons in addition to color
- **High Contrast:** Text meets WCAG AA standards for readability

### Responsive Breakpoints
- **Mobile First:** Optimized for touch interactions and smaller screens
- **Progressive Enhancement:** Additional features unlock on larger screens
- **Flexible Layouts:** Grid systems that adapt to different screen sizes