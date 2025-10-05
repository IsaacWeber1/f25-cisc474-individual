'use client';

import { useState, useEffect } from 'react';
import { getAllUsers } from '../_lib/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  enrollments: Array<{
    role: string;
    course: {
      code: string;
      title: string;
    };
  }>;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          width: '3rem',
          height: '3rem',
          border: '4px solid #e5e7eb',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{
          marginTop: '1rem',
          color: '#6b7280'
        }}>
          Fetching users...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem'
      }}>
        <p style={{ color: '#dc2626', fontWeight: 600 }}>Error loading users</p>
        <p style={{ color: '#991b1b', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    if (role === 'PROFESSOR') return '#7c3aed';
    if (role === 'TA') return '#2563eb';
    if (role === 'STUDENT') return '#15803d';
    if (role === 'ADMIN') return '#dc2626';
    return '#6b7280';
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.5rem'
    }}>
      {users.map((user) => {
        const roles = [...new Set(user.enrollments.map(e => e.role))];
        const primaryRole = roles[0] || 'No Role';

        return (
          <div
            key={user.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '0.25rem'
                }}>
                  {user.name}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  {user.email}
                </p>
              </div>
              <span style={{
                backgroundColor: getRoleColor(primaryRole),
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                {primaryRole}
              </span>
            </div>

            {user.enrollments.length > 0 && (
              <div>
                <p style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#4b5563',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Courses ({user.enrollments.length})
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {user.enrollments.slice(0, 3).map((enrollment, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        padding: '0.5rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.25rem',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>
                        {enrollment.course.code}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: '0.125rem'
                      }}>
                        {enrollment.course.title}
                      </div>
                    </div>
                  ))}
                  {user.enrollments.length > 3 && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      +{user.enrollments.length - 3} more...
                    </p>
                  )}
                </div>
              </div>
            )}

            {user.enrollments.length === 0 && (
              <p style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
                fontStyle: 'italic'
              }}>
                No course enrollments
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
