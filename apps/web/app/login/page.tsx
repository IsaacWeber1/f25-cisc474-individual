'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function LoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch all users from the API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/users`)
      .then(res => res.json())
      .then(data => {
        // Filter to show only one student and one professor for simplicity
        const student = data.find((u: User) =>
          u.enrollments.some(e => e.role === 'STUDENT')
        );
        const professor = data.find((u: User) =>
          u.enrollments.some(e => e.role === 'PROFESSOR')
        );

        const filteredUsers = [student, professor].filter(Boolean);
        setUsers(filteredUsers);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
        setLoading(false);
      });
  }, []);

  const handleLogin = async () => {
    if (selectedUserId) {
      try {
        // Call API route to set the session cookie
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: selectedUserId }),
        });

        if (response.ok) {
          // Redirect to dashboard
          router.push('/');
        } else {
          console.error('Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  const getUserRole = (user: User) => {
    if (user.enrollments.length === 0) return 'No Role';
    const roles = [...new Set(user.enrollments.map(e => e.role))];
    return roles.join(', ');
  };

  const getRoleColor = (role: string) => {
    if (role.includes('PROFESSOR')) return '#7c3aed';
    if (role.includes('TA')) return '#2563eb';
    if (role.includes('STUDENT')) return '#15803d';
    if (role.includes('ADMIN')) return '#dc2626';
    return '#6b7280';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '3rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Welcome to LMS
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            Select a user to continue
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Choose User Account
          </label>

          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="">-- Select a user --</option>
            {users.map(user => {
              const role = getUserRole(user);
              return (
                <option key={user.id} value={user.id}>
                  {user.name} - {role} ({user.email})
                </option>
              );
            })}
          </select>
        </div>

        {selectedUserId && (
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            {(() => {
              const user = users.find(u => u.id === selectedUserId);
              if (!user) return null;
              const role = getUserRole(user);

              return (
                <>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#0369a1',
                    marginBottom: '0.5rem'
                  }}>
                    Selected User Info
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#0c4a6e' }}>
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>Name:</strong> {user.name}
                    </div>
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong>Role:</strong>
                      <span style={{
                        backgroundColor: getRoleColor(role),
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        {role}
                      </span>
                    </div>
                    {user.enrollments.length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <strong>Courses:</strong>
                        <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
                          {user.enrollments.map((enrollment, idx) => (
                            <li key={idx} style={{ fontSize: '0.75rem', color: '#0c4a6e' }}>
                              {enrollment.course.code}: {enrollment.course.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={!selectedUserId}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: selectedUserId ? '#2563eb' : '#9ca3af',
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: selectedUserId ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s'
          }}
        >
          Continue as Selected User
        </button>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '0.5rem'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#0c4a6e',
            marginBottom: '0.5rem'
          }}>
            Available Test Accounts:
          </h4>
          <p style={{
            fontSize: '0.75rem',
            color: '#0c4a6e',
            margin: 0
          }}>
            Choose between a <strong>Student</strong> account or a <strong>Professor</strong> account to explore different views of the system.
          </p>
        </div>
      </div>
    </div>
  );
}