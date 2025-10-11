import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { backendFetcher } from '../integrations/fetcher';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { PageLayout } from '../components/common/PageLayout';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import type { Course, User } from '../types/api';

export const Route = createFileRoute('/course/$id')({
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { id: courseId } = Route.useParams();
  const { currentUserId } = useAuth();

  // Fetch current user for navigation
  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: backendFetcher<User>(`/users/${currentUserId}`),
  });

  // Fetch course with full nested data
  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: backendFetcher<Course>(`/courses/${courseId}`),
  });

  // Get user's role in this course
  const userRole =
    currentUser?.enrollments.find((e) => e.courseId === courseId)?.role ||
    'STUDENT';

  if (isLoading) {
    return <LoadingSpinner message="Loading course..." />;
  }

  if (error || !course) {
    return (
      <ErrorMessage
        error={error || new Error('Course not found')}
        title="Error Loading Course"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const assignments = course.assignments || [];
  const totalAssignments = assignments.length;
  const reflectionCount = assignments.filter(
    (a) => a.type === 'REFLECTION',
  ).length;

  // Get student count and staff count from enrollments
  const studentCount = course.enrollments.filter(
    (e) => e.role === 'STUDENT',
  ).length;
  const staffCount = course.enrollments.filter(
    (e) => e.role === 'PROFESSOR' || e.role === 'TA',
  ).length;

  return (
    <PageLayout currentUser={currentUser}>
        {/* Course Header */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: TYPOGRAPHY.sizes['4xl'],
                  fontWeight: TYPOGRAPHY.weights.bold,
                  color: COLORS.gray[900],
                  marginBottom: '0.5rem',
                }}
              >
                {course.code}: {course.title}
              </h1>
              <p style={{ color: COLORS.gray[600], fontSize: TYPOGRAPHY.sizes.lg }}>
                {course.instructor} • {course.semester}
              </p>
            </div>
            <span
              style={{
                fontSize: TYPOGRAPHY.sizes.sm,
                backgroundColor: COLORS.success[100],
                color: COLORS.success[500],
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                fontWeight: TYPOGRAPHY.weights.medium,
              }}
            >
              {userRole}
            </span>
          </div>

          {course.description && (
            <p
              style={{
                fontSize: TYPOGRAPHY.sizes.lg,
                color: COLORS.gray[600],
                lineHeight: 1.6,
                marginBottom: '1.5rem',
              }}
            >
              {course.description}
            </p>
          )}

          {/* Quick Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginTop: '1.5rem',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: COLORS.primary[100],
                border: `1px solid ${COLORS.primary[100]}`,
                borderRadius: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: TYPOGRAPHY.sizes['4xl'],
                  fontWeight: TYPOGRAPHY.weights.bold,
                  color: COLORS.primary[700],
                  marginBottom: '0.25rem',
                }}
              >
                {totalAssignments}
              </div>
              <div style={{ color: COLORS.primary[700], fontWeight: TYPOGRAPHY.weights.medium }}>
                Assignments
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: COLORS.success[100],
                border: `1px solid ${COLORS.success[100]}`,
                borderRadius: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: TYPOGRAPHY.sizes['4xl'],
                  fontWeight: TYPOGRAPHY.weights.bold,
                  color: COLORS.success[500],
                  marginBottom: '0.25rem',
                }}
              >
                {reflectionCount}
              </div>
              <div style={{ color: COLORS.success[500], fontWeight: TYPOGRAPHY.weights.medium }}>
                Reflections
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: COLORS.purple[100],
                border: `1px solid ${COLORS.purple[200]}`,
                borderRadius: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: TYPOGRAPHY.sizes['4xl'],
                  fontWeight: TYPOGRAPHY.weights.bold,
                  color: COLORS.purple[500],
                  marginBottom: '0.25rem',
                }}
              >
                {studentCount}
              </div>
              <div style={{ color: COLORS.purple[500], fontWeight: TYPOGRAPHY.weights.medium }}>Students</div>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: COLORS.warning[100],
                border: `1px solid ${COLORS.warning[100]}`,
                borderRadius: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: TYPOGRAPHY.sizes['4xl'],
                  fontWeight: TYPOGRAPHY.weights.bold,
                  color: COLORS.warning[500],
                  marginBottom: '0.25rem',
                }}
              >
                {staffCount}
              </div>
              <div style={{ color: COLORS.warning[500], fontWeight: TYPOGRAPHY.weights.medium }}>Staff</div>
            </div>
          </div>
        </div>

        {/* Course Navigation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <Link
            to={ROUTES.courseAssignments(courseId)}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              textDecoration: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              display: 'block',
            }}
          >
            <h3
              style={{
                fontSize: TYPOGRAPHY.sizes.xl,
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.primary[500],
                marginBottom: '0.5rem',
              }}
            >
              📝 Assignments
            </h3>
            <p style={{ color: COLORS.gray[600], fontSize: TYPOGRAPHY.sizes.sm }}>
              View and submit course assignments
            </p>
          </Link>

          <Link
            to={ROUTES.courseGrades(courseId)}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              textDecoration: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              display: 'block',
            }}
          >
            <h3
              style={{
                fontSize: TYPOGRAPHY.sizes.xl,
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.success[600],
                marginBottom: '0.5rem',
              }}
            >
              📊 Grades
            </h3>
            <p style={{ color: COLORS.gray[600], fontSize: TYPOGRAPHY.sizes.sm }}>
              View your grades and feedback
            </p>
          </Link>

          <Link
            to={ROUTES.courseReflections(courseId)}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              textDecoration: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              display: 'block',
            }}
          >
            <h3
              style={{
                fontSize: TYPOGRAPHY.sizes.xl,
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.purple[500],
                marginBottom: '0.5rem',
              }}
            >
              💭 Reflections
            </h3>
            <p style={{ color: COLORS.gray[600], fontSize: TYPOGRAPHY.sizes.sm }}>
              Complete course reflections
            </p>
          </Link>

          <Link
            to={ROUTES.home}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              textDecoration: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              display: 'block',
            }}
          >
            <h3
              style={{
                fontSize: TYPOGRAPHY.sizes.xl,
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.warning[500],
                marginBottom: '0.5rem',
              }}
            >
              🏠 Dashboard
            </h3>
            <p style={{ color: COLORS.gray[600], fontSize: TYPOGRAPHY.sizes.sm }}>
              Return to dashboard
            </p>
          </Link>
        </div>

        {/* Recent Assignments Preview */}
        {assignments.length > 0 && (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              marginTop: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: TYPOGRAPHY.sizes['2xl'],
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.gray[900],
                marginBottom: '1.5rem',
              }}
            >
              Recent Assignments
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {assignments.slice(0, 3).map((assignment) => {
                const dueDate = new Date(assignment.dueDate);
                const isOverdue = dueDate < new Date();

                return (
                  <Link
                    key={assignment.id}
                    to={ROUTES.courseAssignment(courseId, assignment.id)}
                    style={{
                      display: 'block',
                      padding: '1.5rem',
                      backgroundColor: COLORS.gray[50],
                      border: `1px solid ${COLORS.gray[200]}`,
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: TYPOGRAPHY.sizes.lg,
                            fontWeight: TYPOGRAPHY.weights.semibold,
                            color: COLORS.gray[900],
                            marginBottom: '0.5rem',
                          }}
                        >
                          {assignment.title}
                        </h3>
                        <p
                          style={{
                            fontSize: TYPOGRAPHY.sizes.sm,
                            color: COLORS.gray[600],
                            marginBottom: '0.5rem',
                          }}
                        >
                          {assignment.description}
                        </p>
                        <p
                          style={{
                            fontSize: TYPOGRAPHY.sizes.xs,
                            color: isOverdue ? COLORS.error[600] : COLORS.gray[600],
                          }}
                        >
                          Due: {dueDate.toLocaleDateString()} at{' '}
                          {dueDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          alignItems: 'flex-end',
                        }}
                      >
                        <span
                          style={{
                            fontSize: TYPOGRAPHY.sizes.xs,
                            backgroundColor:
                              assignment.type === 'REFLECTION'
                                ? COLORS.purple[100]
                                : assignment.type === 'FILE'
                                  ? COLORS.primary[100]
                                  : COLORS.success[100],
                            color:
                              assignment.type === 'REFLECTION'
                                ? COLORS.purple[500]
                                : assignment.type === 'FILE'
                                  ? COLORS.primary[500]
                                  : COLORS.success[500],
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontWeight: TYPOGRAPHY.weights.medium,
                          }}
                        >
                          {assignment.type}
                        </span>
                        <span
                          style={{
                            fontSize: TYPOGRAPHY.sizes.sm,
                            fontWeight: TYPOGRAPHY.weights.semibold,
                            color: COLORS.gray[600],
                          }}
                        >
                          {assignment.maxPoints} pts
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
    </PageLayout>
  );
}
