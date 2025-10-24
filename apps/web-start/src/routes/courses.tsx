import { useQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useAuthFetcher } from '../integrations/authFetcher';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { PageLayout } from '../components/common/PageLayout';
import { RequireAuth } from '../components/auth/RequireAuth';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import type { Course } from '../types/api';

export const Route = createFileRoute('/courses')({
  component: CoursesCatalog,
});

/**
 * Courses Catalog Page
 *
 * Demonstrates TanStack Query promise resolution:
 * - Fetches all courses from backend API with authentication
 * - Promise resolved by TanStack Query at component level
 * - Automatic loading/error states
 * - Shows enrollment and assignment counts
 */
function CoursesCatalog() {
  const authFetcher = useAuthFetcher();

  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: () => authFetcher<Array<Course>>('/courses'),
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading courses from backend API..." />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Error Loading Courses" />;
  }

  return (
    <RequireAuth>
      <PageLayout currentUser={null}>
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: TYPOGRAPHY.sizes['3xl'],
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.gray[900],
              marginBottom: '0.5rem',
            }}
          >
            Course Catalog
          </h1>
          <p style={{ color: COLORS.gray[600] }}>
            All courses in the system, loaded from the backend API via TanStack
            Query.
          </p>
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: COLORS.success[100],
              border: `1px solid ${COLORS.success[500]}`,
              borderRadius: '0.375rem',
              fontSize: TYPOGRAPHY.sizes.sm,
              color: COLORS.success[700],
            }}
          >
            🔄 This page uses <strong>TanStack Query</strong> with{' '}
            <strong>automatic caching</strong>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {courses?.map((course) => {
            const studentCount = course.enrollments.filter(
              (e) => e.role === 'STUDENT',
            ).length;
            const instructorCount = course.enrollments.filter(
              (e) => e.role === 'PROFESSOR' || e.role === 'TA',
            ).length;

            return (
              <div
                key={course.id}
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${COLORS.gray[200]}`,
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: TYPOGRAPHY.sizes.xl,
                        fontWeight: TYPOGRAPHY.weights.semibold,
                        color: COLORS.gray[900],
                      }}
                    >
                      {course.code}
                    </h3>
                    <span
                      style={{
                        backgroundColor: COLORS.success[100],
                        color: COLORS.success[700],
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: TYPOGRAPHY.sizes.xs,
                        fontWeight: TYPOGRAPHY.weights.medium,
                      }}
                    >
                      {course.semester}
                    </span>
                  </div>
                  <h4
                    style={{
                      fontSize: TYPOGRAPHY.sizes.base,
                      fontWeight: TYPOGRAPHY.weights.medium,
                      color: COLORS.gray[700],
                      marginBottom: '0.5rem',
                    }}
                  >
                    {course.title}
                  </h4>
                  {course.description && (
                    <p
                      style={{
                        fontSize: TYPOGRAPHY.sizes.sm,
                        color: COLORS.gray[600],
                        lineHeight: 1.5,
                        marginBottom: '1rem',
                      }}
                    >
                      {course.description.length > 150
                        ? course.description.substring(0, 150) + '...'
                        : course.description}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    borderTop: `1px solid ${COLORS.gray[200]}`,
                    paddingTop: '1rem',
                    marginTop: 'auto',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '0.5rem',
                        backgroundColor: '#f0f9ff',
                        borderRadius: '0.25rem',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          color: '#0369a1',
                        }}
                      >
                        {studentCount}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#0369a1',
                        }}
                      >
                        Students
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '0.5rem',
                        backgroundColor: '#f0fdf4',
                        borderRadius: '0.25rem',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          color: '#15803d',
                        }}
                      >
                        {instructorCount}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#15803d',
                        }}
                      >
                        Staff
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '0.5rem',
                        backgroundColor: '#fef3c7',
                        borderRadius: '0.25rem',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          color: '#d97706',
                        }}
                      >
                        {course.assignments.length}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#d97706',
                        }}
                      >
                        Assignments
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: TYPOGRAPHY.sizes.sm,
                      color: COLORS.gray[600],
                      marginBottom: '0.75rem',
                    }}
                  >
                    <strong>Instructor:</strong> {course.instructor}
                  </div>

                  <Link
                    to={ROUTES.course(course.id)}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      backgroundColor: COLORS.success[600],
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      fontWeight: TYPOGRAPHY.weights.medium,
                      fontSize: TYPOGRAPHY.sizes.sm,
                      transition: 'background-color 0.2s',
                    }}
                  >
                    View Course →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </PageLayout>
    </RequireAuth>
  );
}
