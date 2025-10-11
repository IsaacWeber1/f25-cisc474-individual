import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { backendFetcher } from '../integrations/fetcher';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { PageLayout } from '../components/common/PageLayout';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import type { User } from '../types/api';

export const Route = createFileRoute('/users')({
  component: UsersPage,
});

function UsersPage() {
  const { currentUserId } = useAuth();

  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: backendFetcher<User>(`/users/${currentUserId}`),
  });

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: backendFetcher<Array<User>>('/users'),
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Error Loading Users" />;
  }

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'PROFESSOR':
        return { bg: COLORS.purple[100], color: COLORS.purple[800] };
      case 'TA':
        return { bg: COLORS.primary[100], color: COLORS.primary[700] };
      default:
        return { bg: COLORS.gray[100], color: COLORS.gray[700] };
    }
  };

  return (
    <PageLayout currentUser={currentUser}>
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: TYPOGRAPHY.sizes['3xl'],
            fontWeight: TYPOGRAPHY.weights.bold,
            color: COLORS.gray[900],
            marginBottom: '0.5rem',
          }}
        >
          Users Directory
        </h1>
        <p style={{ color: COLORS.gray[600] }}>
          All users in the system with their roles and activity.
        </p>
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
            const roleStyle = getRoleBadgeStyle(
              user.enrollments[0] ? user.enrollments[0].role : 'STUDENT',
            );

            return (
              <div
                key={user.id}
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${COLORS.gray[200]}`,
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      backgroundColor: COLORS.primary[100],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem',
                    }}
                  >
                    <span style={{ fontSize: TYPOGRAPHY.sizes.xl, color: COLORS.primary[700] }}>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: TYPOGRAPHY.sizes.lg,
                        fontWeight: TYPOGRAPHY.weights.semibold,
                        color: COLORS.gray[900],
                        marginBottom: '0.25rem',
                      }}
                    >
                      {user.name}
                    </h3>
                    <span
                      style={{
                        fontSize: TYPOGRAPHY.sizes.xs,
                        backgroundColor: roleStyle.bg,
                        color: roleStyle.color,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontWeight: TYPOGRAPHY.weights.medium,
                      }}
                    >
                      {user.enrollments[0] ? user.enrollments[0].role : 'STUDENT'}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.gray[600], marginBottom: '0.75rem' }}>
                  <div style={{ marginBottom: '0.25rem' }}>{user.email}</div>
                  <div>
                    Courses: {user.enrollments.length} • Submissions:{' '}
                    {user.submissions.length}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: TYPOGRAPHY.sizes.xs,
                    color: COLORS.gray[500],
                    paddingTop: '0.75rem',
                    borderTop: `1px solid ${COLORS.gray[200]}`,
                  }}
                >
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
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
          <p style={{ color: COLORS.gray[600], fontSize: TYPOGRAPHY.sizes.lg }}>
            No users found
          </p>
        </div>
      )}
    </PageLayout>
  );
}
