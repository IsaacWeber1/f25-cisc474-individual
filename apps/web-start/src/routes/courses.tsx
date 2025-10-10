import { useQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { backendFetcher } from '../integrations/fetcher';
import Navigation from '../components/Navigation';
import type { Course } from '../types/api';

export const Route = createFileRoute('/courses')({
  component: CoursesCatalog,
});

/**
 * Courses Catalog Page
 *
 * Demonstrates TanStack Query promise resolution:
 * - Fetches all courses from backend API
 * - Promise resolved by TanStack Query at component level
 * - Automatic loading/error states
 * - Shows enrollment and assignment counts
 */
function CoursesCatalog() {
  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: backendFetcher<Array<Course>>('/courses'),
  });

  if (isLoading) {
    return (
      <>
        <Navigation currentUser={null} />
        <main
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem 1rem',
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem',
              }}
            >
              Course Catalog
            </h1>
            <p style={{ color: '#4b5563' }}>
              All courses in the system, loaded from the backend API.
            </p>
          </div>
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: '3rem',
                height: '3rem',
                border: '4px solid #e5e7eb',
                borderTopColor: '#15803d',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p
              style={{
                marginTop: '1rem',
                color: '#6b7280',
                fontSize: '1.125rem',
              }}
            >
              Loading courses from backend API...
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation currentUser={null} />
        <main
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem 1rem',
          }}
        >
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
            }}
          >
            <p style={{ color: '#dc2626', fontWeight: 600 }}>
              Error loading courses
            </p>
            <p
              style={{
                color: '#991b1b',
                fontSize: '0.875rem',
                marginTop: '0.5rem',
              }}
            >
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation currentUser={null} />
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem',
            }}
          >
            Course Catalog
          </h1>
          <p style={{ color: '#4b5563' }}>
            All courses in the system, loaded from the backend API via TanStack
            Query.
          </p>
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#dcfce7',
              border: '1px solid #86efac',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              color: '#15803d',
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
                  border: '1px solid #e5e7eb',
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
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      {course.code}
                    </h3>
                    <span
                      style={{
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      {course.semester}
                    </span>
                  </div>
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: '#374151',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {course.title}
                  </h4>
                  {course.description && (
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
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
                    borderTop: '1px solid #e5e7eb',
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
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <strong>Instructor:</strong> {course.instructor}
                  </div>

                  <Link
                    to="/course/$id"
                    params={{ id: course.id }}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      backgroundColor: '#15803d',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.875rem',
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
      </main>
    </>
  );
}
