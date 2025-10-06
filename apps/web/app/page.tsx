'use client';

import { useState, useEffect } from 'react';
import Navigation from './_components/Navigation';
import CourseCard from './_components/CourseCard';
import { getCurrentUser, getCoursesByUser, getDataSourceInfo, type User, type Course } from './_lib/dataProviderClient';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [dataSource, setDataSource] = useState({ source: '', environment: '', apiUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if API is configured for production
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && (!apiUrl || apiUrl === 'http://localhost:3000')) {
          setError('API_CONFIG_REQUIRED');
          setLoading(false);
          return;
        }

        // Fetch current user
        const user = await getCurrentUser();
        setCurrentUser(user);

        // Fetch data source info and user courses in parallel
        const [sourceInfo, courses] = await Promise.all([
          Promise.resolve(getDataSourceInfo()),
          getCoursesByUser(user.id)
        ]);

        setDataSource(sourceInfo);
        setUserCourses(courses);
      } catch (err) {
        console.error('[Dashboard] Error loading data:', err);
        if (err instanceof Error && err.message.includes('No user session')) {
          setError('NO_SESSION');
        } else {
          setError('LOAD_ERROR');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
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
            color: '#6b7280',
            fontSize: '1.125rem'
          }}>
            Loading dashboard...
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

  // No session - redirect to login
  if (error === 'NO_SESSION') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            color: '#111827',
            fontWeight: 'bold'
          }}>
            Welcome to LMS
          </h1>
          <p style={{
            color: '#6b7280',
            marginBottom: '2rem',
            lineHeight: 1.6,
            fontSize: '1.125rem'
          }}>
            Your comprehensive Learning Management System for courses, assignments, and more.
          </p>
          <a
            href="/login"
            style={{
              display: 'inline-block',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'background-color 0.2s'
            }}
          >
            Get Started
          </a>
        </div>
      </div>
    );
  }

  // API config error
  if (error === 'API_CONFIG_REQUIRED') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#dc2626' }}>
            ⚠️ API Configuration Required
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: 1.6 }}>
            This application requires a backend API to function. Please configure the
            <code style={{
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              margin: '0 0.25rem',
              fontFamily: 'monospace'
            }}>
              NEXT_PUBLIC_API_URL
            </code>
            environment variable in your Vercel project settings.
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Current: <code style={{ fontFamily: 'monospace' }}>{process.env.NEXT_PUBLIC_API_URL || 'not set'}</code>
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error === 'LOAD_ERROR') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#dc2626' }}>
            Error Loading Dashboard
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            There was an error loading the dashboard. Please try again later.
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
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <>
      <Navigation currentUser={currentUser} />
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Welcome back, {currentUser?.name}!
          </h1>
          <p style={{ color: '#4b5563' }}>
            Here are your courses for this semester.
          </p>
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: dataSource.source.includes('Supabase') ? '#dcfce7' : '#fef3c7',
            border: `1px solid ${dataSource.source.includes('Supabase') ? '#86efac' : '#fcd34d'}`,
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: dataSource.source.includes('Supabase') ? '#15803d' : '#92400e'
          }}>
            📊 Data Source: {dataSource.source}
          </div>
        </div>

        {userCourses.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {userCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem 0'
          }}>
            <div style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              width: '6rem',
              height: '6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <span style={{
                fontSize: '2.25rem',
                color: '#9ca3af'
              }}>📚</span>
            </div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              No courses found
            </h3>
            <p style={{ color: '#6b7280' }}>
              You are not enrolled in any courses yet.
            </p>
          </div>
        )}

        <div style={{
          marginTop: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1e3a8a',
              marginBottom: '0.5rem'
            }}>
              Quick Actions
            </h3>
            <div>
              <a href="/profile" style={{
                display: 'block',
                color: '#1d4ed8',
                textDecoration: 'none'
              }}>
                Update Profile →
              </a>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#14532d',
              marginBottom: '0.5rem'
            }}>
              Recent Activity
            </h3>
            <p style={{
              color: '#15803d',
              fontSize: '0.875rem'
            }}>
              No recent activity to display.
            </p>
          </div>

          <div style={{
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#9a3412',
              marginBottom: '0.5rem'
            }}>
              Upcoming Deadlines
            </h3>
            <p style={{
              color: '#c2410c',
              fontSize: '0.875rem'
            }}>
              No upcoming deadlines.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
