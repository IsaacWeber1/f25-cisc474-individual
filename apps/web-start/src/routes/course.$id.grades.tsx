import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { backendFetcher } from '../integrations/fetcher';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import type { Course, Grade, User } from '../types/api';

export const Route = createFileRoute('/course/$id/grades')({
  component: GradesPage,
});

function GradesPage() {
  const { id: courseId } = Route.useParams();
  const { currentUserId } = useAuth();

  // Fetch current user
  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: backendFetcher<User>(`/users/${currentUserId}`),
  });

  // Fetch course with assignments
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: backendFetcher<Course>(`/courses/${courseId}`),
  });

  // Fetch all grades
  const { data: allGrades, isLoading: gradesLoading } = useQuery({
    queryKey: ['grades'],
    queryFn: backendFetcher<Array<Grade>>('/grades'),
  });

  const isLoading = courseLoading || gradesLoading;

  // Get user's role in this course
  const userRole =
    currentUser?.enrollments.find((e) => e.courseId === courseId)?.role ||
    'STUDENT';

  // Filter grades for this user and course
  const courseGrades =
    allGrades?.filter((grade) => {
      return (
        grade.submission.studentId === currentUserId &&
        grade.submission.assignment.courseId === courseId
      );
    }) || [];

  // Calculate statistics
  const totalPoints = courseGrades.reduce((sum, grade) => sum + grade.score, 0);
  const maxPoints = courseGrades.reduce(
    (sum, grade) => sum + grade.maxScore,
    0,
  );
  const percentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

  const getGradeColor = (score: number, maxScore: number) => {
    const pct = (score / maxScore) * 100;
    if (pct >= 90) return { color: COLORS.success[500], bg: COLORS.success[100] };
    if (pct >= 80) return { color: COLORS.success[600], bg: COLORS.success[50] };
    if (pct >= 70) return { color: COLORS.warning[500], bg: COLORS.warning[100] };
    if (pct >= 60) return { color: COLORS.error[600], bg: COLORS.error[200] };
    return { color: COLORS.error[700], bg: COLORS.error[200] };
  };

  const getLetterGrade = (pct: number) => {
    if (pct >= 97) return 'A+';
    if (pct >= 93) return 'A';
    if (pct >= 90) return 'A-';
    if (pct >= 87) return 'B+';
    if (pct >= 83) return 'B';
    if (pct >= 80) return 'B-';
    if (pct >= 77) return 'C+';
    if (pct >= 73) return 'C';
    if (pct >= 70) return 'C-';
    if (pct >= 60) return 'D';
    return 'F';
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading grades..." />;
  }

  if (courseError || !course) {
    return (
      <ErrorMessage
        error={courseError || new Error('Failed to load grades')}
        title="Error Loading Grades"
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to={ROUTES.course(courseId)}
            style={{
              color: COLORS.primary[500],
              textDecoration: 'none',
              fontSize: TYPOGRAPHY.sizes.sm,
              marginBottom: '1rem',
              display: 'inline-block',
            }}
          >
            ← Back to {course.code}
          </Link>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem',
            }}
          >
            Grades
          </h1>
          <p style={{ color: '#4b5563' }}>
            {course.code}: {course.title}
          </p>
        </div>

        {/* Overall Statistics */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '1.5rem',
            }}
          >
            Course Summary
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '0.5rem',
                border: '1px solid #bae6fd',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: getGradeColor(totalPoints, maxPoints).color,
                  marginBottom: '0.5rem',
                }}
              >
                {percentage.toFixed(1)}%
              </div>
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#0369a1',
                  marginBottom: '0.25rem',
                }}
              >
                {getLetterGrade(percentage)}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#0369a1' }}>
                Overall Grade
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: '#ecfdf5',
                borderRadius: '0.5rem',
                border: '1px solid #bbf7d0',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#15803d',
                  marginBottom: '0.5rem',
                }}
              >
                {courseGrades.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#15803d' }}>
                Graded Assignments
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.5rem',
                border: '1px solid #fcd34d',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#d97706',
                  marginBottom: '0.5rem',
                }}
              >
                {totalPoints}/{maxPoints}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#d97706' }}>
                Total Points
              </div>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        {courseGrades.length > 0 ? (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '1.5rem',
              }}
            >
              Grade Details
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {courseGrades
                .sort(
                  (a, b) =>
                    new Date(b.gradedAt).getTime() -
                    new Date(a.gradedAt).getTime(),
                )
                .map((grade) => {
                  const gradeStyle = getGradeColor(grade.score, grade.maxScore);
                  const pct = (grade.score / grade.maxScore) * 100;

                  return (
                    <div
                      key={grade.id}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontSize: '1.125rem',
                              fontWeight: 600,
                              color: '#111827',
                              marginBottom: '0.25rem',
                            }}
                          >
                            {grade.submission.assignment.title}
                          </h3>
                          <p
                            style={{
                              fontSize: '0.75rem',
                              color: '#6b7280',
                            }}
                          >
                            Graded on{' '}
                            {new Date(grade.gradedAt).toLocaleDateString()} by{' '}
                            {grade.gradedBy.name}
                          </p>
                        </div>
                        <div
                          style={{
                            textAlign: 'right',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '1.5rem',
                              fontWeight: 'bold',
                              color: gradeStyle.color,
                              marginBottom: '0.25rem',
                            }}
                          >
                            {grade.score}/{grade.maxScore}
                          </div>
                          <div
                            style={{
                              fontSize: '0.875rem',
                              color: gradeStyle.color,
                              fontWeight: 600,
                            }}
                          >
                            {pct.toFixed(1)}% ({getLetterGrade(pct)})
                          </div>
                        </div>
                      </div>

                      {grade.feedback && (
                        <div
                          style={{
                            marginTop: '1rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid #e2e8f0',
                          }}
                        >
                          <h4
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#111827',
                              marginBottom: '0.5rem',
                            }}
                          >
                            Feedback:
                          </h4>
                          <p
                            style={{
                              fontSize: '0.875rem',
                              color: '#4b5563',
                              lineHeight: 1.5,
                            }}
                          >
                            {grade.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 0',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              No grades available yet
            </p>
          </div>
        )}
    </div>
  );
}
