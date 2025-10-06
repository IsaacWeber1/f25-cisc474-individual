'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  getCourseById,
  getCurrentUser,
  getUserRole,
  getAssignmentsByCourse,
  getGradesByStudent,
  getSubmissionByStudent,
  getGradeBySubmission,
  type Assignment,
  type Submission,
  type Grade
} from '../../../_lib/dataProviderClient';

interface CourseSubmission {
  assignment: Assignment;
  submission: Submission | null;
  grade: Grade | null;
}

export default function GradesPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courseSubmissions, setCourseSubmissions] = useState<CourseSubmission[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parallelize initial data fetching
        const [courseData, user] = await Promise.all([
          getCourseById(courseId),
          getCurrentUser()
        ]);

        if (!courseData || !user) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        setCourse(courseData);
        setCurrentUser(user);

        // Fetch user role and assignments in parallel
        const [role, assignmentsData] = await Promise.all([
          getUserRole(user.id, courseId),
          getAssignmentsByCourse(courseId)
        ]);

        setUserRole(role);

        const assignmentsArray = Array.isArray(assignmentsData) ? assignmentsData : [];
        setAssignments(assignmentsArray);

        // For students, fetch all submissions and grades in parallel
        if (role === 'student') {
          const submissionsData = await Promise.all(
            assignmentsArray.map(async (assignment) => {
              const submission = await getSubmissionByStudent(assignment.id, user.id);
              const grade = submission ? await getGradeBySubmission(submission.id) : null;
              return { assignment, submission, grade };
            })
          );

          setCourseSubmissions(submissionsData);

          // Calculate statistics
          const gradedSubmissions = submissionsData.filter(item => item.grade);
          const totalPoints = gradedSubmissions.reduce((sum, item) => sum + item.grade!.score, 0);
          const maxPoints = gradedSubmissions.reduce((sum, item) => sum + item.grade!.maxScore, 0);
          const percentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

          setStats({
            totalPoints,
            maxPoints,
            percentage,
            gradedCount: gradedSubmissions.length,
            totalCount: assignmentsArray.length
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('[Grades Page] Error loading grades:', err);
        setError('There was an error loading the grades. Please try again later.');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  const getGradeColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return { color: '#15803d', bg: '#dcfce7' };
    if (percentage >= 80) return { color: '#059669', bg: '#d1fae5' };
    if (percentage >= 70) return { color: '#d97706', bg: '#fef3c7' };
    if (percentage >= 60) return { color: '#dc2626', bg: '#fef2f2' };
    return { color: '#991b1b', bg: '#fef2f2' };
  };

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading grades...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ color: '#dc2626', fontSize: '1.5rem', fontWeight: 600 }}>
          Error Loading Grades
        </h1>
        <p style={{ color: '#6b7280' }}>{error}</p>
        <button
          onClick={handleRetry}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Grades
          </h1>
          <p style={{ color: '#6b7280' }}>
            {userRole === 'student' ?
              'View your grades and track your progress' :
              'Manage student grades and course performance'
            }
          </p>
        </div>
      </div>

      {userRole === 'student' && stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: stats.percentage >= 80 ? '#15803d' : stats.percentage >= 60 ? '#d97706' : '#dc2626',
              marginBottom: '0.5rem'
            }}>
              {stats.percentage.toFixed(1)}%
            </div>
            <div style={{ color: '#6b7280', fontWeight: 500 }}>
              Overall Grade
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#374151',
              marginTop: '0.25rem'
            }}>
              {getLetterGrade(stats.percentage)}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#2563eb',
              marginBottom: '0.5rem'
            }}>
              {stats.totalPoints}
            </div>
            <div style={{ color: '#6b7280', fontWeight: 500 }}>
              Points Earned
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#374151',
              marginTop: '0.25rem'
            }}>
              out of {stats.maxPoints}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
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
              {stats.gradedCount}
            </div>
            <div style={{ color: '#6b7280', fontWeight: 500 }}>
              Assignments Graded
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#374151',
              marginTop: '0.25rem'
            }}>
              out of {stats.totalCount}
            </div>
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
            margin: 0
          }}>
            Assignment Grades
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  Assignment
                </th>
                <th style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  Type
                </th>
                <th style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  Due Date
                </th>
                <th style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  Points
                </th>
                <th style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  Grade
                </th>
                <th style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, index) => {
                const submissionData = userRole === 'student' ?
                  courseSubmissions.find(cs => cs.assignment.id === assignment.id) : null;
                const submission = submissionData?.submission || null;
                const grade = submissionData?.grade || null;
                const gradeColor = grade ? getGradeColor(grade.score, grade.maxScore) : null;
                const percentage = grade ? (grade.score / grade.maxScore) * 100 : 0;

                return (
                  <tr key={assignment.id} style={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc'
                  }}>
                    <td style={{
                      padding: '1rem 1.5rem',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <Link
                        href={`/course/${courseId}/assignments/${assignment.id}`}
                        style={{
                          fontWeight: 500,
                          color: '#2563eb',
                          textDecoration: 'none'
                        }}
                      >
                        {assignment.title}
                      </Link>
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'center',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: assignment.type === 'REFLECTION' ? '#f3e8ff' :
                                       assignment.type === 'FILE' ? '#dbeafe' : '#dcfce7',
                        color: assignment.type === 'REFLECTION' ? '#7c3aed' :
                               assignment.type === 'FILE' ? '#2563eb' : '#15803d',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        textTransform: 'capitalize'
                      }}>
                        {assignment.type}
                        {assignment.type === 'REFLECTION' && ' '}
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      color: '#374151',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      {assignment.maxPoints}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'center',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      {grade ? (
                        <div>
                          <div style={{
                            fontWeight: 600,
                            color: gradeColor!.color
                          }}>
                            {grade.score}/{grade.maxScore}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}>
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      ) : (
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          —
                        </span>
                      )}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'center',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      {!submission ? (
                        <span style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem'
                        }}>
                          Not Submitted
                        </span>
                      ) : !grade ? (
                        <span style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#fef3c7',
                          color: '#d97706',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem'
                        }}>
                          Pending
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.75rem',
                          backgroundColor: gradeColor!.bg,
                          color: gradeColor!.color,
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem'
                        }}>
                          Graded
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {assignments.length === 0 && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              No assignments yet
            </h3>
            <p>Assignments and grades will appear here once they are created.</p>
          </div>
        )}
      </div>
    </div>
  );
}
