# NestJS Assignment Completion

## Deployed API Endpoints

### Users
- **GET All Users**: [https://f25-cisc474-individual-n1wv.onrender.com/users](https://f25-cisc474-individual-n1wv.onrender.com/users)
- **GET User by ID**: [https://f25-cisc474-individual-n1wv.onrender.com/users/{id}](https://f25-cisc474-individual-n1wv.onrender.com/users/{id})

### Courses
- **GET All Courses**: [https://f25-cisc474-individual-n1wv.onrender.com/courses](https://f25-cisc474-individual-n1wv.onrender.com/courses)
- **GET Course by ID**: [https://f25-cisc474-individual-n1wv.onrender.com/courses/{id}](https://f25-cisc474-individual-n1wv.onrender.com/courses/{id})

### Assignments
- **GET All Assignments**: [https://f25-cisc474-individual-n1wv.onrender.com/assignments](https://f25-cisc474-individual-n1wv.onrender.com/assignments)
- **GET Assignment by ID**: [https://f25-cisc474-individual-n1wv.onrender.com/assignments/{id}](https://f25-cisc474-individual-n1wv.onrender.com/assignments/{id})

### Submissions
- **GET All Submissions**: [https://f25-cisc474-individual-n1wv.onrender.com/submissions](https://f25-cisc474-individual-n1wv.onrender.com/submissions)
- **GET Submission by ID**: [https://f25-cisc474-individual-n1wv.onrender.com/submissions/{id}](https://f25-cisc474-individual-n1wv.onrender.com/submissions/{id})

### Grades
- **GET All Grades**: [https://f25-cisc474-individual-n1wv.onrender.com/grades](https://f25-cisc474-individual-n1wv.onrender.com/grades)
- **GET Grade by ID**: [https://f25-cisc474-individual-n1wv.onrender.com/grades/{id}](https://f25-cisc474-individual-n1wv.onrender.com/grades/{id})

## Implementation Details

All endpoints:
- Return valid JSON from PostgreSQL database via Prisma
- Use proper NestJS controller/service/module architecture
- Include comprehensive database relationships
- Support both "get all" and "get by ID" operations

Local testing available at `http://localhost:3000` before deployment.