'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getCurrentUser,
  getCoursesByStudent,
  getRecentGrades,
  getRecentActivityByUser,
  getSkillTagsByCategory,
  type User,
  type Course,
  type Grade
} from '../_lib/dataProviderClient';

interface Activity {
  action: string;
  timestamp: string;
}

interface SkillTag {
  id: string;
  name: string;
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [recentGrades, setRecentGrades] = useState<Grade[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [skillTags, setSkillTags] = useState<SkillTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = await getCurrentUser();
        setCurrentUser(user);

        // Parallelize all independent data fetching
        const [coursesData, gradesData, activityData, skillsData] = await Promise.all([
          getCoursesByStudent(user.id),
          getRecentGrades(user.id, 5),
          getRecentActivityByUser(user.id),
          getSkillTagsByCategory()
        ]);

        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setRecentGrades(Array.isArray(gradesData) ? gradesData : []);
        setRecentActivity(Array.isArray(activityData) ? activityData : []);
        setSkillTags(Array.isArray(skillsData) ? skillsData : []);
      } catch (err) {
        console.error('[Profile Page] Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return '#15803d';
    if (percentage >= 80) return '#059669';
    if (percentage >= 70) return '#d97706';
    return '#dc2626';
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString();
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

  if (error || !currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#dc2626' }}>
            Error Loading Profile
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            {error || 'User not found'}
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

  // Calculate some stats
  const totalCourses = courses.length;
  const averageGrade = recentGrades.length > 0
    ? recentGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / recentGrades.length
    : 0;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      paddingTop: '2rem'
    }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '1rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <Link
              href="/"
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                textDecoration: 'none'
              }}
            >
              LMS
            </Link>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link
                href="/"
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.25rem',
                  backgroundColor: 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.25rem',
                  backgroundColor: '#1d4ed8',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}
              >
                Profile
              </Link>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '0.875rem' }}>
              Welcome, <span style={{ fontWeight: 600 }}>{currentUser.name}</span>
            </span>
            <span style={{
              fontSize: '0.75rem',
              backgroundColor: '#1d4ed8',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              textTransform: 'capitalize'
            }}>
              User
            </span>
          </div>
        </div>
      </nav>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        marginTop: '4rem'
      }}>
        {/* Profile Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                {currentUser.name}
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: '#6b7280',
                marginBottom: '0.5rem'
              }}>
                {currentUser.email}
              </p>
              <span style={{
                display: 'inline-block',
                fontSize: '0.875rem',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                textTransform: 'capitalize',
                fontWeight: 500
              }}>
                User
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '0.5rem',
              border: '1px solid #bae6fd'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#0369a1',
                marginBottom: '0.25rem'
              }}>
                {totalCourses}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#0369a1',
                fontWeight: 500
              }}>
                Enrolled Courses
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#ecfdf5',
              borderRadius: '0.5rem',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: getGradeColor(averageGrade),
                marginBottom: '0.25rem'
              }}>
                {averageGrade.toFixed(1)}%
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#15803d',
                fontWeight: 500
              }}>
                Overall Average
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#fef7ff',
              borderRadius: '0.5rem',
              border: '1px solid #e9d5ff'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#7c3aed',
                marginBottom: '0.25rem'
              }}>
                {recentActivity.length}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#7c3aed',
                fontWeight: 500
              }}>
                Recent Activities
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Courses */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '1.5rem'
              }}>
                My Courses
              </h2>

              <div style={{
                display: 'grid',
                gap: '1rem'
              }}>
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/course/${course.id}`}
                    style={{
                      display: 'block',
                      padding: '1.5rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          color: '#111827',
                          marginBottom: '0.25rem'
                        }}>
                          {course.code}: {course.title}
                        </h3>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          {course.instructor} • {course.semester}
                        </p>
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        fontWeight: 500
                      }}>
                        Active
                      </span>
                    </div>
                    {course.description && (
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#4b5563',
                        lineHeight: 1.5
                      }}>
                        {course.description.length > 100
                          ? `${course.description.substring(0, 100)}...`
                          : course.description
                        }
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '1.5rem'
              }}>
                Recent Activity
              </h2>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb'
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        marginBottom: '0.25rem'
                      }}>
                        {activity.action}
                      </p>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p style={{
                    textAlign: 'center',
                    color: '#6b7280',
                    fontStyle: 'italic',
                    padding: '2rem'
                  }}>
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Recent Grades */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Recent Grades
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {recentGrades.slice(0, 5).map((grade, index) => (
                  <div key={grade.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#374151',
                        marginBottom: '0.25rem'
                      }}>
                        Assignment {index + 1}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        {formatDate(grade.gradedAt.toString())}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: getGradeColor((grade.score / grade.maxScore) * 100)
                    }}>
                      {grade.score}/{grade.maxScore}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Focus Areas
              </h3>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {skillTags.slice(0, 8).map((skill) => (
                  <span key={skill.id} style={{
                    fontSize: '0.75rem',
                    backgroundColor: '#f3e8ff',
                    color: '#7c3aed',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '1rem',
                    fontWeight: 500,
                    border: '1px solid #c4b5fd'
                  }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Quick Actions
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <button style={{
                  padding: '0.75rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>
                  Update Profile
                </button>
                <button style={{
                  padding: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>
                  Change Password
                </button>
                <button style={{
                  padding: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>
                  Notification Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
