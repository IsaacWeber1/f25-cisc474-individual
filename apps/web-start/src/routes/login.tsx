import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { backendFetcher } from '../integrations/fetcher';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import type { User } from '../types/api';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const navigate = useNavigate();

  const {
    data: allUsers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: backendFetcher<Array<User>>('/users'),
  });

  // Filter to one student and one professor
  const users = allUsers
    ? [
        allUsers.find((u) =>
          u.enrollments.some((e) => e.role === 'STUDENT'),
        ),
        allUsers.find((u) =>
          u.enrollments.some((e) => e.role === 'PROFESSOR'),
        ),
      ].filter(Boolean) as User[]
    : [];

  const handleLogin = () => {
    if (selectedUserId) {
      // For now, just navigate to dashboard
      // Note: AuthContext currently uses CURRENT_USER_ID constant
      // This login page demonstrates the UI, but actual auth switching
      // would require updating AuthContext to use localStorage/state
      navigate({ to: '/' });
    }
  };

  const getUserRole = (user: User) => {
    if (user.enrollments.length === 0) return 'No Role';
    const roles = [...new Set(user.enrollments.map((e) => e.role))];
    return roles.join(', ');
  };

  const getRoleColor = (role: string) => {
    if (role.includes('PROFESSOR')) return COLORS.purple[500];
    if (role.includes('TA')) return COLORS.primary[500];
    if (role.includes('STUDENT')) return COLORS.success[500];
    if (role.includes('ADMIN')) return COLORS.error[600];
    return COLORS.gray[600];
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        title="Error Loading Users"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.gray[50],
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '3rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <h1
            style={{
              fontSize: TYPOGRAPHY.sizes['4xl'],
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.gray[900],
              marginBottom: '0.5rem',
            }}
          >
            Welcome to LMS
          </h1>
          <p
            style={{
              color: COLORS.gray[600],
              fontSize: TYPOGRAPHY.sizes.base,
            }}
          >
            Select a user to continue
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: TYPOGRAPHY.sizes.sm,
              fontWeight: TYPOGRAPHY.weights.medium,
              color: COLORS.gray[700],
              marginBottom: '0.5rem',
            }}
          >
            Choose User Account
          </label>

          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${COLORS.gray[300]}`,
              borderRadius: '0.5rem',
              fontSize: TYPOGRAPHY.sizes.base,
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="">-- Select a user --</option>
            {users.map((user) => {
              const role = getUserRole(user);
              return (
                <option key={user.id} value={user.id}>
                  {user.name} - {role} ({user.email})
                </option>
              );
            })}
          </select>
        </div>

        {selectedUser && (
          <div
            style={{
              backgroundColor: COLORS.primary[50],
              border: `1px solid ${COLORS.primary[200]}`,
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '2rem',
            }}
          >
            <h3
              style={{
                fontSize: TYPOGRAPHY.sizes.base,
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.primary[700],
                marginBottom: '0.5rem',
              }}
            >
              Selected User Info
            </h3>
            <div
              style={{
                fontSize: TYPOGRAPHY.sizes.sm,
                color: COLORS.primary[900],
              }}
            >
              <div style={{ marginBottom: '0.25rem' }}>
                <strong>Name:</strong> {selectedUser.name}
              </div>
              <div style={{ marginBottom: '0.25rem' }}>
                <strong>Email:</strong> {selectedUser.email}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <strong>Role:</strong>
                <span
                  style={{
                    backgroundColor: getRoleColor(getUserRole(selectedUser)),
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: TYPOGRAPHY.sizes.xs,
                    fontWeight: TYPOGRAPHY.weights.medium,
                  }}
                >
                  {getUserRole(selectedUser)}
                </span>
              </div>
              {selectedUser.enrollments.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Courses:</strong>
                  <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
                    {selectedUser.enrollments.map((enrollment, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: TYPOGRAPHY.sizes.xs,
                          color: COLORS.primary[900],
                        }}
                      >
                        {enrollment.course.code}: {enrollment.course.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={!selectedUserId}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: selectedUserId
              ? COLORS.primary[500]
              : COLORS.gray[400],
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: TYPOGRAPHY.sizes.base,
            fontWeight: TYPOGRAPHY.weights.medium,
            cursor: selectedUserId ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
          }}
        >
          Continue as Selected User
        </button>

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: COLORS.primary[50],
            border: `1px solid ${COLORS.primary[200]}`,
            borderRadius: '0.5rem',
          }}
        >
          <h4
            style={{
              fontSize: TYPOGRAPHY.sizes.sm,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.primary[900],
              marginBottom: '0.5rem',
            }}
          >
            Available Test Accounts:
          </h4>
          <p
            style={{
              fontSize: TYPOGRAPHY.sizes.xs,
              color: COLORS.primary[900],
              margin: 0,
            }}
          >
            Choose between a <strong>Student</strong> account or a{' '}
            <strong>Professor</strong> account to explore different views of the
            system.
          </p>
        </div>
      </div>
    </div>
  );
}
