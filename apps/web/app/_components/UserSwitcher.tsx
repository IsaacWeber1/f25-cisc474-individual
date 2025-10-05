'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllUsers, type User as ApiUser } from '../_lib/apiClient';

type User = ApiUser;

interface UserSwitcherProps {
  currentUser: User | null;
}

export default function UserSwitcher({ currentUser }: UserSwitcherProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        // Filter to show only one student and one professor for simplicity
        const student = allUsers.find(u =>
          u.enrollments.some(e => e.role === 'STUDENT')
        );
        const professor = allUsers.find(u =>
          u.enrollments.some(e => e.role === 'PROFESSOR')
        );

        const filteredUsers = [student, professor].filter(Boolean) as User[];
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    if (isOpen && users.length === 0) {
      fetchUsers();
    }
  }, [isOpen, users.length]);

  const handleUserSwitch = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        router.refresh();
        window.location.reload();
      } else {
        console.error('Failed to switch user');
      }
    } catch (error) {
      console.error('Error switching user:', error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const getUserRole = (user: User) => {
    if (user.enrollments.length === 0) return 'No Role';
    const roles = [...new Set(user.enrollments.map(e => e.role))];
    return roles[0] || 'STUDENT';
  };

  const getRoleColor = (role: string) => {
    if (role.includes('PROFESSOR')) return '#7c3aed';
    if (role.includes('TA')) return '#2563eb';
    if (role.includes('STUDENT')) return '#15803d';
    if (role.includes('ADMIN')) return '#dc2626';
    return '#6b7280';
  };

  if (!currentUser) return null;

  const currentRole = getUserRole(currentUser);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          color: 'white',
          cursor: loading ? 'wait' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {currentUser.name}
          </div>
          <div style={{
            fontSize: '0.75rem',
            opacity: 0.9,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <span style={{
              backgroundColor: getRoleColor(currentRole),
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              display: 'inline-block'
            }}></span>
            {currentRole}
          </div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          minWidth: '280px',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 50
        }}>
          <div style={{
            padding: '0.75rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              margin: 0
            }}>
              Switch User
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: '0.25rem 0 0 0'
            }}>
              Select a user to switch to their view
            </p>
          </div>

          <div style={{ padding: '0.5rem' }}>
            {users.map(user => {
              const role = getUserRole(user);
              const isCurrentUser = user.id === currentUser.id;

              return (
                <button
                  key={user.id}
                  onClick={() => !isCurrentUser && handleUserSwitch(user.id)}
                  disabled={isCurrentUser || loading}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem',
                    backgroundColor: isCurrentUser ? '#f3f4f6' : 'transparent',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: isCurrentUser ? 'default' : 'pointer',
                    opacity: isCurrentUser ? 0.7 : 1,
                    transition: 'background-color 0.2s',
                    marginBottom: '0.25rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrentUser && !loading) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrentUser && !loading) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#111827',
                        marginBottom: '0.125rem'
                      }}>
                        {user.name}
                        {isCurrentUser && (
                          <span style={{
                            marginLeft: '0.5rem',
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}>
                            (current)
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        {user.email}
                      </div>
                    </div>
                    <span style={{
                      backgroundColor: getRoleColor(role),
                      color: 'white',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap'
                    }}>
                      {role}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{
            padding: '0.75rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <button
              onClick={() => {
                router.push('/login');
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
              }}
            >
              Sign Out / Change Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}