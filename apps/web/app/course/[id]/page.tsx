import Link from 'next/link';
import { 
  getCourseById, 
  getCurrentUser, 
  getUserRole, 
  getAssignmentsByCourse,
  getReflectionsByUser,
  getRecentGrades,
  getClassMedianGrade
} from '../../_lib/mockData';

interface CourseOverviewProps {
  params: Promise<{ id: string }>;
}

export default async function CourseOverview({ params }: CourseOverviewProps) {
  const resolvedParams = await params;
  const courseId = parseInt(resolvedParams.id);
  const course = getCourseById(courseId);
  const currentUser = getCurrentUser();
  const userRole = getUserRole(currentUser.id, courseId);
  const assignments = getAssignmentsByCourse(courseId);
  const reflections = getReflectionsByUser(currentUser.id, courseId);
  const recentGrades = getRecentGrades(currentUser.id, 3);
  const classMedian = getClassMedianGrade(courseId);

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Course not found</h1>
      </div>
    );
  }

  // Get recent assignments (last 3)
  const recentAssignments = assignments
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 3);

  // Calculate course stats
  const totalAssignments = assignments.length;
  const reflectionCount = reflections.length;
  const averageGrade = recentGrades.length > 0 
    ? recentGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / recentGrades.length
    : 0;

  return (
    <div>
      {/* Course Description */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1rem'
        }}>
          Course Overview
        </h1>
        
        {course.description && (
          <p style={{
            fontSize: '1.125rem',
            color: '#4b5563',
            marginBottom: '1.5rem',
            lineHeight: 1.6
          }}>
            {course.description}
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#dbeafe',
          border: '1px solid #bfdbfe',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1e40af',
            marginBottom: '0.5rem'
          }}>
            {totalAssignments}
          </div>
          <div style={{ color: '#1e40af', fontWeight: 500 }}>
            Total Assignments
          </div>
        </div>

        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#15803d',
            marginBottom: '0.5rem'
          }}>
            {reflectionCount}
          </div>
          <div style={{ color: '#15803d', fontWeight: 500 }}>
            Reflections
          </div>
        </div>

        {userRole === 'student' && (
          <>
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#d97706',
                marginBottom: '0.5rem'
              }}>
                {averageGrade.toFixed(1)}%
              </div>
              <div style={{ color: '#d97706', fontWeight: 500 }}>
                Your Average
              </div>
            </div>

            <div style={{
              backgroundColor: '#f3e8ff',
              border: '1px solid #c4b5fd',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#7c3aed',
                marginBottom: '0.5rem'
              }}>
                {classMedian.toFixed(1)}%
              </div>
              <div style={{ color: '#7c3aed', fontWeight: 500 }}>
                Class Median
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Assignments and Reflections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Recent Assignments */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#111827'
            }}>
              Recent Assignments
            </h3>
            <Link 
              href={`/course/${resolvedParams.id}/assignments`}
              style={{
                color: '#2563eb',
                fontSize: '0.875rem',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              View All →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentAssignments.length > 0 ? (
              recentAssignments.map((assignment) => (
                <div key={assignment.id} style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <Link 
                      href={`/course/${resolvedParams.id}/assignments/${assignment.id}`}
                      style={{
                        fontWeight: 500,
                        color: '#111827',
                        textDecoration: 'none'
                      }}
                    >
                      {assignment.title}
                    </Link>
                    <span style={{
                      fontSize: '0.75rem',
                      backgroundColor: assignment.type === 'reflection' ? '#dcfce7' : '#dbeafe',
                      color: assignment.type === 'reflection' ? '#15803d' : '#1e40af',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      textTransform: 'capitalize'
                    }}>
                      {assignment.type}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}>
                    {assignment.description}
                  </p>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#4b5563'
                  }}>
                    Due: {new Date(assignment.dueDate).toLocaleDateString()} • {assignment.maxPoints} pts
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                No assignments yet.
              </p>
            )}
          </div>
        </div>

        {/* Course Announcements / Activity Feed */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '1rem'
          }}>
            {userRole === 'student' ? 'Recent Activity' : 'Course Activity'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userRole === 'student' && recentGrades.length > 0 ? (
              recentGrades.map((grade, index) => (
                <div key={grade.id} style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontWeight: 500, color: '#111827' }}>
                      Grade Received
                    </span>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: grade.score / grade.maxScore >= 0.8 ? '#15803d' : 
                             grade.score / grade.maxScore >= 0.6 ? '#d97706' : '#dc2626'
                    }}>
                      {grade.score}/{grade.maxScore}
                    </span>
                  </div>
                  {grade.feedback && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '0.5rem'
                    }}>
                      {grade.feedback}
                    </p>
                  )}
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#4b5563'
                  }}>
                    {new Date(grade.gradedAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#6b7280'
              }}>
                {userRole === 'student' ? (
                  <p>No recent grades to display.</p>
                ) : (
                  <p>Course activity will appear here.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <Link 
          href={`/course/${resolvedParams.id}/assignments`}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          View All Assignments
        </Link>
        
        <Link 
          href={`/course/${resolvedParams.id}/reflections`}
          style={{
            backgroundColor: '#15803d',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          View Reflections
        </Link>
        
        {userRole === 'student' && (
          <Link 
            href={`/course/${resolvedParams.id}/grades`}
            style={{
              backgroundColor: '#d97706',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            View Grades
          </Link>
        )}
      </div>
    </div>
  );
}