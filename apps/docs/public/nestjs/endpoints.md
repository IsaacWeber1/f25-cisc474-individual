# NestJS API Endpoints

## Deployed Endpoints

### Users
- **GET All Users**: [https://render-deployment-url/users](https://render-deployment-url/users)
- **GET User by ID**: [https://render-deployment-url/users/{id}](https://render-deployment-url/users/{id})

### Courses
- **GET All Courses**: [https://render-deployment-url/courses](https://render-deployment-url/courses)
- **GET Course by ID**: [https://render-deployment-url/courses/{id}](https://render-deployment-url/courses/{id})

### Assignments
- **GET All Assignments**: [https://render-deployment-url/assignments](https://render-deployment-url/assignments)
- **GET Assignment by ID**: [https://render-deployment-url/assignments/{id}](https://render-deployment-url/assignments/{id})

### Submissions
- **GET All Submissions**: [https://render-deployment-url/submissions](https://render-deployment-url/submissions)
- **GET Submission by ID**: [https://render-deployment-url/submissions/{id}](https://render-deployment-url/submissions/{id})

### Grades
- **GET All Grades**: [https://render-deployment-url/grades](https://render-deployment-url/grades)
- **GET Grade by ID**: [https://render-deployment-url/grades/{id}](https://render-deployment-url/grades/{id})

## Implementation

All endpoints:
- Use NestJS controller/service/module architecture
- Connect to PostgreSQL database via Prisma
- Return valid JSON with database relationships
- Support both "get all" and "get by ID" operations

Local testing available at `http://localhost:3000`