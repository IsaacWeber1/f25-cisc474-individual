import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { backendFetcher } from '../integrations/fetcher';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import type { User } from '../types/api';

export const Route = createFileRoute('/users')({
  component: UsersPage,
});

function UsersPage() {
  // Get current user ID from AuthContext
  const { currentUserId } = useAuth();

  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: backendFetcher<User>(`/users/${currentUserId}`),
  });

  // Fetch all users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: backendFetcher<Array<User>>('/users'),
  });

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
              Loading users from backend API...
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

  if (error) {
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
              Error Loading Users
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {error instanceof Error ? error.message : 'Failed to load users'}
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
      <Navigation currentUser={currentUser || null} />
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
            User Directory
          </h1>
          <p style={{ color: '#4b5563' }}>
            All users in the system, loaded from the backend API.
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
            📊 Data Source: NestJS API via TanStack Query
          </div>
        </div>

        {users && users.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {users.map((user) => {
              // Determine user role from enrollments
              const roles = Array.from(
                new Set(user.enrollments.map((e) => e.role)),
              );
              const primaryRole = roles[0] || 'USER';

              // Count courses
              const courseCount = user.enrollments.length;

              return (
                <div
                  key={user.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 auto 1rem auto',
                      }}
                    >
                      {user.name
                        ? user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                        : 'U'}
                    </div>
                    <h3
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: '#111827',
                        marginBottom: '0.25rem',
                        textAlign: 'center',
                      }}
                    >
                      {user.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        textAlign: 'center',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {user.email}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      {roles.map((role) => (
                        <span
                          key={role}
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor:
                              role === 'PROFESSOR'
                                ? '#dbeafe'
                                : role === 'TA'
                                  ? '#fef3c7'
                                  : '#f3e8ff',
                            color:
                              role === 'PROFESSOR'
                                ? '#1e40af'
                                : role === 'TA'
                                  ? '#92400e'
                                  : '#6b21a8',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontWeight: 500,
                          }}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: '#2563eb',
                        }}
                      >
                        {courseCount}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginTop: '0.25rem',
                        }}
                      >
                        Courses
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: '#059669',
                        }}
                      >
                        {user.submissions?.length || 0}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginTop: '0.25rem',
                        }}
                      >
                        Submissions
                      </div>
                    </div>
                  </div>

                  {user.createdAt && (
                    <div
                      style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e2e8f0',
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        textAlign: 'center',
                      }}
                    >
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 0',
            }}
          >
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              No users found
            </p>
          </div>
        )}
      </main>
    </>
  );
}
