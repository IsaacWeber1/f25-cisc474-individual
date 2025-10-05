'use client';

import { useState, useEffect } from 'react';
import { getAllCourses } from '../_lib/apiClient';
import Link from 'next/link';

interface Course {
  id: string;
  code: string;
  title: string;
  description: string | null;
  instructor: string;
  semester: string;
  enrollments: Array<{
    role: string;
    user: {
      name: string;
    };
  }>;
  assignments: Array<{
    id: string;
    title: string;
  }>;
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
          borderTopColor: '#15803d',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{
          marginTop: '1rem',
          color: '#6b7280'
        }}>
          Fetching courses...
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
        <p style={{ color: '#dc2626', fontWeight: 600 }}>Error loading courses</p>
        <p style={{ color: '#991b1b', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem'
    }}>
      {courses.map((course) => {
        const studentCount = course.enrollments.filter(e => e.role === 'STUDENT').length;
        const instructorCount = course.enrollments.filter(e =>
          e.role === 'PROFESSOR' || e.role === 'TA'
        ).length;

        return (
          <div
            key={course.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#111827'
                }}>
                  {course.code}
                </h3>
                <span style={{
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>
                  {course.semester}
                </span>
              </div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                {course.title}
              </h4>
              {course.description && (
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: 1.5,
                  marginBottom: '1rem'
                }}>
                  {course.description.length > 150
                    ? course.description.substring(0, 150) + '...'
                    : course.description}
                </p>
              )}
            </div>

            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1rem',
              marginTop: 'auto'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '0.5rem',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '0.25rem'
                }}>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#0369a1'
                  }}>
                    {studentCount}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#0369a1'
                  }}>
                    Students
                  </div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '0.5rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '0.25rem'
                }}>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#15803d'
                  }}>
                    {instructorCount}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#15803d'
                  }}>
                    Staff
                  </div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '0.5rem',
                  backgroundColor: '#fef3c7',
                  borderRadius: '0.25rem'
                }}>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#d97706'
                  }}>
                    {course.assignments.length}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#d97706'
                  }}>
                    Assignments
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '0.75rem'
              }}>
                <strong>Instructor:</strong> {course.instructor}
              </div>

              <Link
                href={`/course/${course.id}`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  backgroundColor: '#15803d',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#166534';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#15803d';
                }}
              >
                View Course →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
