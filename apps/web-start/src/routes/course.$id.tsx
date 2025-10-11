import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { backendFetcher } from '../integrations/fetcher';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
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
    return (
      <>
        <Navigation currentUser={currentUser || null} />
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-block',
                width: '3rem',
                height: '3rem',
                border: '4px solid #e5e7eb',
                borderTopColor: '#2563eb',
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
              Loading course...
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Navigation currentUser={currentUser || null} />
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              maxWidth: '600px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                color: '#dc2626',
              }}
            >
              Error Loading Course
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {error instanceof Error ? error.message : 'Course not found'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </>
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
    <>
      <Navigation currentUser={currentUser || null} />
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem',
        }}
      >
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
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '0.5rem',
                }}
              >
                {course.code}: {course.title}
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                {course.instructor} • {course.semester}
              </p>
            </div>
            <span
              style={{
                fontSize: '0.875rem',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                fontWeight: 500,
              }}
            >
              {userRole}
            </span>
          </div>

          {course.description && (
            <p
              style={{
                fontSize: '1.125rem',
                color: '#4b5563',
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
                backgroundColor: '#dbeafe',
                border: '1px solid #bfdbfe',
                borderRadius: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#1e40af',
                  marginBottom: '0.25rem',
                }}
              >
                {totalAssignments}
              </div>
              <div style={{ color: '#1e40af', fontWeight: 500 }}>
                Assignments
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#15803d',
                  marginBottom: '0.25rem',
                }}
              >
                {reflectionCount}
              </div>
              <div style={{ color: '#15803d', fontWeight: 500 }}>
                Reflections
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#f3e8ff',
                border: '1px solid #e9d5ff',
                borderRadius: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#7c3aed',
                  marginBottom: '0.25rem',
                }}
              >
                {studentCount}
              </div>
              <div style={{ color: '#7c3aed', fontWeight: 500 }}>Students</div>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#d97706',
                  marginBottom: '0.25rem',
                }}
              >
                {staffCount}
              </div>
              <div style={{ color: '#d97706', fontWeight: 500 }}>Staff</div>
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
            to="/course/$id/assignments"
            params={{ id: courseId }}
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
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#2563eb',
                marginBottom: '0.5rem',
              }}
            >
              📝 Assignments
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              View and submit course assignments
            </p>
          </Link>

          <Link
            to="/course/$id/grades"
            params={{ id: courseId }}
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
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#059669',
                marginBottom: '0.5rem',
              }}
            >
              📊 Grades
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              View your grades and feedback
            </p>
          </Link>

          <Link
            to="/course/$id/reflections"
            params={{ id: courseId }}
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
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#7c3aed',
                marginBottom: '0.5rem',
              }}
            >
              💭 Reflections
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Complete course reflections
            </p>
          </Link>

          <Link
            to="/"
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
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#d97706',
                marginBottom: '0.5rem',
              }}
            >
              🏠 Dashboard
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
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
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#111827',
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
                    to="/course/$id/assignments/$assignmentId"
                    params={{ id: courseId, assignmentId: assignment.id }}
                    style={{
                      display: 'block',
                      padding: '1.5rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
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
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#111827',
                            marginBottom: '0.5rem',
                          }}
                        >
                          {assignment.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            marginBottom: '0.5rem',
                          }}
                        >
                          {assignment.description}
                        </p>
                        <p
                          style={{
                            fontSize: '0.75rem',
                            color: isOverdue ? '#dc2626' : '#6b7280',
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
                            fontSize: '0.75rem',
                            backgroundColor:
                              assignment.type === 'REFLECTION'
                                ? '#f3e8ff'
                                : assignment.type === 'FILE'
                                  ? '#dbeafe'
                                  : '#dcfce7',
                            color:
                              assignment.type === 'REFLECTION'
                                ? '#7c3aed'
                                : assignment.type === 'FILE'
                                  ? '#2563eb'
                                  : '#15803d',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontWeight: 500,
                          }}
                        >
                          {assignment.type}
                        </span>
                        <span
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#6b7280',
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
      </div>
    </>
  );
}
