import Link from 'next/link';
import {
  getCurrentUser,
  getUserRole,
  getCoursesByStudent,
  getRecentGrades,
  getRecentActivityByUser,
  getSkillTagsByCategory
} from '../_lib/dataProvider';

// Dynamic rendering for API calls
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>User not found</h1>
        </div>
      );
    }

    // Parallelize all independent data fetching
    const [courses, recentGrades, recentActivity, skillTags] = await Promise.all([
      getCoursesByStudent(currentUser.id),
      getRecentGrades(currentUser.id, 5),
      getRecentActivityByUser(currentUser.id),
      getSkillTagsByCategory()
    ]);

    // Ensure arrays are properly handled
    const coursesArray = Array.isArray(courses) ? courses : [];
    const recentGradesArray = Array.isArray(recentGrades) ? recentGrades : [];
    const recentActivityArray = Array.isArray(recentActivity) ? recentActivity : [];
    const skillTagsArray = Array.isArray(skillTags) ? skillTags : [];

    // Calculate some stats
    const totalCourses = coursesArray.length;
    const averageGrade = recentGradesArray.length > 0
      ? recentGradesArray.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / recentGradesArray.length
      : 0;

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return '#15803d';
    if (percentage >= 80) return '#059669';
    if (percentage >= 70) return '#d97706';
    return '#dc2626';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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
                {recentActivityArray.length}
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
                {coursesArray.map((course) => (
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
                {recentActivityArray.length > 0 ? recentActivityArray.map((activity, index) => (
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
                {recentGradesArray.slice(0, 5).map((grade, index) => (
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
                {skillTagsArray.slice(0, 8).map((skill, index) => (
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
  } catch (error) {
    console.error('[Profile Page] Error loading profile:', error);
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Error Loading Profile</h1>
        <p style={{ color: '#6b7280' }}>
          There was an error loading the profile. Please try again later.
        </p>
      </div>
    );
  }
}