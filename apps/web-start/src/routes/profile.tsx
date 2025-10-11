import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { backendFetcher } from '../integrations/fetcher';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { PageLayout } from '../components/common/PageLayout';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import type { Course, Grade, User } from '../types/api';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

interface SkillTag {
  id: string;
  name: string;
  category: string;
  description: string | null;
}

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
  userId: string;
}

function ProfilePage() {
  // Get current user ID from AuthContext
  const { currentUserId } = useAuth();
  const userId = currentUserId;

  // Fetch user data
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: backendFetcher<User>(`/users/${userId}`),
  });

  // Fetch all grades to calculate stats
  const { data: allGrades } = useQuery({
    queryKey: ['grades'],
    queryFn: backendFetcher<Array<Grade>>('/grades'),
    enabled: !!user,
  });

  // Calculate user's courses from enrollments
  const courses = user?.enrollments.map((e) => e.course) || [];

  // Calculate recent grades for this user
  const recentGrades =
    allGrades
      ?.filter((g) => g.submission.studentId === userId)
      .sort(
        (a, b) =>
          new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime(),
      )
      .slice(0, 5) || [];

  // Calculate average grade
  const averageGrade =
    recentGrades.length > 0
      ? recentGrades.reduce(
          (sum, grade) => sum + (grade.score / grade.maxScore) * 100,
          0,
        ) / recentGrades.length
      : 0;

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return '#15803d';
    if (percentage >= 80) return '#059669';
    if (percentage >= 70) return '#d97706';
    return '#dc2626';
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (userLoading) {
    return (
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
            Loading profile...
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <>
        <Navigation currentUser={null} />
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
              Error Loading Profile
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {userError instanceof Error
                ? userError.message
                : 'User not found'}
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

  return (
    <>
      <Navigation currentUser={user} />
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem',
        }}
      >
        {/* Profile Header */}
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
              alignItems: 'center',
              gap: '2rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {user.name
                ? user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                : 'U'}
            </div>
            <div>
              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '0.5rem',
                }}
              >
                {user.name}
              </h1>
              <p
                style={{
                  fontSize: '1.125rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                }}
              >
                {user.email}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.875rem',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontWeight: 500,
                }}
              >
                Student
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '0.5rem',
                border: '1px solid #bae6fd',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#0369a1',
                  marginBottom: '0.25rem',
                }}
              >
                {courses.length}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#0369a1',
                  fontWeight: 500,
                }}
              >
                Enrolled Courses
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#ecfdf5',
                borderRadius: '0.5rem',
                border: '1px solid #bbf7d0',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: getGradeColor(averageGrade),
                  marginBottom: '0.25rem',
                }}
              >
                {averageGrade.toFixed(1)}%
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#15803d',
                  fontWeight: 500,
                }}
              >
                Overall Average
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#fef7ff',
                borderRadius: '0.5rem',
                border: '1px solid #e9d5ff',
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
                {recentGrades.length}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#7c3aed',
                  fontWeight: 500,
                }}
              >
                Graded Assignments
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '2rem',
          }}
        >
          {/* Main Content */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            {/* Courses */}
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
                My Courses
              </h2>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    to="/course/$id"
                    params={{ id: course.id }}
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
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#111827',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {course.code}: {course.title}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {course.instructor} • {course.semester}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          fontWeight: 500,
                        }}
                      >
                        Active
                      </span>
                    </div>
                    {course.description && (
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: '#4b5563',
                          lineHeight: 1.5,
                        }}
                      >
                        {course.description.length > 100
                          ? `${course.description.substring(0, 100)}...`
                          : course.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            {/* Recent Grades */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '1rem',
                }}
              >
                Recent Grades
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {recentGrades.length > 0 ? (
                  recentGrades.slice(0, 5).map((grade) => (
                    <div
                      key={grade.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '0.375rem',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#374151',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {grade.submission.assignment.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {formatDate(grade.gradedAt.toString())}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: getGradeColor(
                            (grade.score / grade.maxScore) * 100,
                          ),
                        }}
                      >
                        {grade.score}/{grade.maxScore}
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    style={{
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      fontStyle: 'italic',
                    }}
                  >
                    No grades yet
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '1rem',
                }}
              >
                Quick Actions
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <Link
                  to="/"
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '0.375rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  View Dashboard
                </Link>
                <Link
                  to="/courses"
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    borderRadius: '0.375rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  Browse All Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
