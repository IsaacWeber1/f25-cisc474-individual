# NestJS API Endpoints

## Deployed Endpoints

### Users
- **GET All Users**: [https://f25-cisc474-individual-n1wv.onrender.com/users](https://f25-cisc474-individual-n1wv.onrender.com/users)
- **GET User by ID**: [https://f25-cisc474-individual-n1wv.onrender.com/users/cmfr0jaq30000k07aol19m3z1](https://f25-cisc474-individual-n1wv.onrender.com/users/cmfr0jaq30000k07aol19m3z1)

### Courses
- **GET All Courses**: [https://f25-cisc474-individual-n1wv.onrender.com/courses](https://f25-cisc474-individual-n1wv.onrender.com/courses)
- **GET Course by ID**: [https://f25-cisc474-individual-n1wv.onrender.com/courses/course-cisc474-fall24](https://f25-cisc474-individual-n1wv.onrender.com/courses/course-cisc474-fall24)

### Assignments
- **GET All Assignments**: [https://f25-cisc474-individual-n1wv.onrender.com/assignments](https://f25-cisc474-individual-n1wv.onrender.com/assignments)
- **GET Assignment by ID**: [https://f25-cisc474-individual-n1wv.onrender.com/assignments/assignment-week8-reflection-3](https://f25-cisc474-individual-n1wv.onrender.com/assignments/assignment-week8-reflection-3)

### Submissions
- **GET All Submissions**: [https://f25-cisc474-individual-n1wv.onrender.com/submissions](https://f25-cisc474-individual-n1wv.onrender.com/submissions)
- **GET Submission by ID**: [https://f25-cisc474-individual-n1wv.onrender.com/submissions/cmfr0jge2001fk07a9n0ph6i9](https://f25-cisc474-individual-n1wv.onrender.com/submissions/cmfr0jge2001fk07a9n0ph6i9)

### Grades
- **GET All Grades**: [https://f25-cisc474-individual-n1wv.onrender.com/grades](https://f25-cisc474-individual-n1wv.onrender.com/grades)
- **GET Grade by ID**: [https://f25-cisc474-individual-n1wv.onrender.com/grades/cmfr0jgs0001pk07a6ydvwnsy](https://f25-cisc474-individual-n1wv.onrender.com/grades/cmfr0jgs0001pk07a6ydvwnsy)

## Implementation

All endpoints:
- Use NestJS controller/service/module architecture
- Connect to PostgreSQL database via Prisma
- Return valid JSON with database relationships
- Support both "get all" and "get by ID" operations
