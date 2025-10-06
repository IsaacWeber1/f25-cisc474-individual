'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../../_components/Navigation';
import { getCourseById, getCurrentUser, getUserRole, type User, type Course } from '../../_lib/dataProviderClient';

interface CourseLayoutProps {
  children: React.ReactNode;
}

export default function CourseLayout({ children }: CourseLayoutProps) {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [courseData, userData] = await Promise.all([
          getCourseById(courseId),
          getCurrentUser()
        ]);

        setCourse(courseData);
        setCurrentUser(userData);

        const role = await getUserRole(userData.id, courseId);
        setUserRole(role);
      } catch (err) {
        console.error('[Course Layout] Error loading course data:', err);
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  if (loading) {
    return (
      <>
        <Navigation currentUser={null} />
        <div style={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
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

  if (error || !course || !currentUser) {
    return (
      <>
        <Navigation currentUser={currentUser} />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#dc2626' }}>
            {!course ? 'Course Not Found' : 'Error Loading Course'}
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            {!course
              ? "The course you're looking for doesn't exist."
              : 'There was an error loading the course data. Please try again later.'}
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
      </>
    );
  }

  return (
    <>
      <Navigation currentUser={currentUser} />

      {/* Course Header */}
      <div style={{
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '1.5rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          {/* Breadcrumb */}
          <div style={{
            marginBottom: '1rem',
            fontSize: '0.875rem',
            opacity: 0.9
          }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <span style={{ margin: '0 0.5rem' }}>›</span>
            <span>{course.code}</span>
          </div>

          {/* Course Info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}>
            <div>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>
                {course.code}: {course.title}
              </h1>
              <p style={{ opacity: 0.9 }}>
                {course.instructor} • {course.semester}
              </p>
            </div>

            <div style={{
              fontSize: '0.875rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              textTransform: 'capitalize'
            }}>
              {userRole}
            </div>
          </div>
        </div>
      </div>

      {/* Course Navigation Tabs */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <nav style={{
            display: 'flex',
            gap: '2rem'
          }}>
            <Link
              href={`/course/${courseId}`}
              style={{
                padding: '1rem 0',
                color: '#374151',
                textDecoration: 'none',
                borderBottom: '2px solid transparent',
                fontWeight: 500
              }}
            >
              Overview
            </Link>

            <Link
              href={`/course/${courseId}/assignments`}
              style={{
                padding: '1rem 0',
                color: '#374151',
                textDecoration: 'none',
                borderBottom: '2px solid transparent',
                fontWeight: 500
              }}
            >
              Assignments
            </Link>

            <Link
              href={`/course/${courseId}/grades`}
              style={{
                padding: '1rem 0',
                color: '#374151',
                textDecoration: 'none',
                borderBottom: '2px solid transparent',
                fontWeight: 500
              }}
            >
              Grades
            </Link>

            <Link
              href={`/course/${courseId}/reflections`}
              style={{
                padding: '1rem 0',
                color: '#374151',
                textDecoration: 'none',
                borderBottom: '2px solid transparent',
                fontWeight: 500
              }}
            >
              Reflections
            </Link>

            {/* Role-based navigation - only show submission review for TAs and Professors */}
            {(userRole === 'ta' || userRole === 'professor') && (
              <Link
                href={`/course/${courseId}/submissions`}
                style={{
                  padding: '1rem 0',
                  color: '#374151',
                  textDecoration: 'none',
                  borderBottom: '2px solid transparent',
                  fontWeight: 500
                }}
              >
                Submissions
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {children}
      </div>
    </>
  );
}
