'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SubmissionInterface from '../../../../_components/SubmissionInterface';
import {
  getAssignmentById,
  getCurrentUser,
  getUserRole,
  getCourseById,
  getSubmissionByStudent,
  getGradeBySubmission
} from '../../../../_lib/dataProviderClient';

export default function AssignmentDetail() {
  const params = useParams();
  const courseId = params.id as string;
  const assignmentId = params.assignmentId as string;

  const [course, setCourse] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [submission, setSubmission] = useState<any>(null);
  const [grade, setGrade] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parallelize initial data fetching
        const [user, courseData, assignmentData] = await Promise.all([
          getCurrentUser(),
          getCourseById(courseId),
          getAssignmentById(assignmentId)
        ]);

        if (!courseData || !assignmentData || !user) {
          setError('Assignment not found');
          setLoading(false);
          return;
        }

        setCurrentUser(user);
        setCourse(courseData);
        setAssignment(assignmentData);

        // Fetch user role
        const role = await getUserRole(user.id, courseId);
        setUserRole(role);

        // For students, fetch submission and grade
        if (role === 'STUDENT') {
          const submissionData = await getSubmissionByStudent(assignmentId, user.id);
          setSubmission(submissionData);

          if (submissionData) {
            const gradeData = await getGradeBySubmission(submissionData.id);
            setGrade(gradeData);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('[Assignment Detail] Error loading assignment:', err);
        setError('There was an error loading the assignment. Please try again later.');
        setLoading(false);
      }
    };

    if (courseId && assignmentId) {
      fetchData();
    }
  }, [courseId, assignmentId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  const getStatusColor = () => {
    if (userRole !== 'STUDENT') return null;
    if (!submission) return { status: 'Not Started', color: '#dc2626', bg: '#fef2f2' };
    if (!grade) return { status: 'Submitted', color: '#d97706', bg: '#fef3c7' };
    return { status: 'Graded', color: '#15803d', bg: '#dcfce7' };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'REFLECTION':
        return { color: '#7c3aed', bg: '#f3e8ff' };
      case 'FILE':
        return { color: '#2563eb', bg: '#dbeafe' };
      case 'TEXT':
        return { color: '#15803d', bg: '#dcfce7' };
      default:
        return { color: '#6b7280', bg: '#f3f4f6' };
    }
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
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading assignment...</p>
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
          Error Loading Assignment
        </h1>
        <p style={{ color: '#6b7280' }}>{error}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
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
          <Link
            href={`/course/${courseId}/assignments`}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusColor();
  const typeColor = assignment ? getTypeColor(assignment.type) : null;
  const isOverdue = assignment && new Date(assignment.dueDate) < new Date() && !submission;

  return (
    <div>
      <div style={{
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '1.5rem'
      }}>
        <Link
          href={`/course/${courseId}/assignments`}
          style={{ color: '#2563eb', textDecoration: 'none' }}
        >
          Assignments
        </Link>
        <span style={{ margin: '0 0.5rem' }}>›</span>
        <span>{assignment?.title}</span>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        gap: '2rem'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.5rem'
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0
            }}>
              {assignment?.title}
            </h1>

            {typeColor && (
              <span style={{
                fontSize: '0.875rem',
                backgroundColor: typeColor.bg,
                color: typeColor.color,
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                textTransform: 'capitalize',
                fontWeight: 500
              }}>
                {assignment?.type}
              </span>
            )}

            {assignment?.type === 'REFLECTION' && (
              <span style={{
                fontSize: '0.875rem',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                fontWeight: 500
              }}>
                Distinctive Feature
              </span>
            )}
          </div>

          <p style={{
            fontSize: '1.125rem',
            color: '#4b5563',
            lineHeight: 1.6,
            margin: 0
          }}>
            {assignment?.description}
          </p>
        </div>

        {statusInfo && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '1rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              backgroundColor: statusInfo.bg,
              color: statusInfo.color,
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              fontWeight: 500
            }}>
              {statusInfo.status}
            </span>

            {isOverdue && (
              <span style={{
                fontSize: '0.75rem',
                color: '#dc2626',
                backgroundColor: '#fef2f2',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.25rem',
                fontWeight: 500
              }}>
                Overdue
              </span>
            )}
          </div>
        )}
      </div>

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
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '0.5rem'
          }}>
            {assignment?.maxPoints}
          </div>
          <div style={{ color: '#6b7280', fontWeight: 500 }}>
            Total Points
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
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: isOverdue ? '#dc2626' : '#15803d',
            marginBottom: '0.5rem'
          }}>
            {assignment?.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}
          </div>
          <div style={{ color: '#6b7280', fontWeight: 500 }}>
            Due Date
          </div>
        </div>

        {grade && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: grade.score / grade.maxScore >= 0.8 ? '#15803d' :
                     grade.score / grade.maxScore >= 0.6 ? '#d97706' : '#dc2626',
              marginBottom: '0.5rem'
            }}>
              {grade.score}/{grade.maxScore}
            </div>
            <div style={{ color: '#6b7280', fontWeight: 500 }}>
              Your Grade
            </div>
          </div>
        )}
      </div>

      {assignment?.instructions && assignment.instructions.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Instructions
          </h2>
          <ol style={{
            padding: 0,
            margin: 0,
            fontSize: '1rem',
            color: '#374151',
            lineHeight: 1.6
          }}>
            {assignment.instructions.map((instruction: string, index: number) => (
              <li key={index} style={{
                marginBottom: '1rem',
                paddingLeft: '2rem',
                position: 'relative',
                listStyle: 'none'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '0',
                  fontWeight: 600,
                  color: '#2563eb'
                }}>
                  {index + 1}.
                </span>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: userRole === 'STUDENT' ? '2fr 1fr' : '1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          padding: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            {userRole === 'STUDENT' ? 'Your Submission' : 'Assignment Details'}
          </h2>

          {userRole === 'STUDENT' ? (
            <SubmissionInterface
              assignment={assignment}
              submission={submission}
              grade={grade}
              courseId={courseId}
              currentUserId={currentUser?.id}
            />
          ) : (
            <div>
              <p style={{
                color: '#4b5563',
                marginBottom: '2rem',
                fontSize: '1rem'
              }}>
                Assignment created for {assignment?.type} submission. Students can access this assignment through their assignments list.
              </p>

              <div style={{
                display: 'flex',
                gap: '1rem'
              }}>
                <button style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>
                  Edit Assignment
                </button>
                <Link
                  href={`/course/${courseId}/assignments/${assignmentId}/submissions`}
                  style={{
                    backgroundColor: '#15803d',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontWeight: 500,
                    display: 'inline-block'
                  }}
                >
                  View Submissions
                </Link>
              </div>
            </div>
          )}
        </div>

        {userRole === 'STUDENT' && (
          <div>
            {grade && (
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Your Grade
                </h3>

                <div style={{
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: grade.score / grade.maxScore >= 0.8 ? '#15803d' :
                           grade.score / grade.maxScore >= 0.6 ? '#d97706' : '#dc2626',
                    marginBottom: '0.5rem'
                  }}>
                    {grade.score}/{grade.maxScore}
                  </div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: grade.score / grade.maxScore >= 0.8 ? '#15803d' :
                           grade.score / grade.maxScore >= 0.6 ? '#d97706' : '#dc2626'
                  }}>
                    {Math.round((grade.score / grade.maxScore) * 100)}%
                  </div>
                </div>

                {grade.feedback && (
                  <div>
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Feedback:
                    </h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#4b5563',
                      lineHeight: 1.5,
                      backgroundColor: '#f8fafc',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      {grade.feedback}
                    </p>
                  </div>
                )}

                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: '1rem',
                  textAlign: 'center'
                }}>
                  Graded on {new Date(grade.gradedAt).toLocaleDateString()}
                </div>
              </div>
            )}

            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Status
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Submission:
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    backgroundColor: statusInfo?.bg,
                    color: statusInfo?.color,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontWeight: 500
                  }}>
                    {statusInfo?.status}
                  </span>
                </div>

                {submission && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Submitted:
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'Not submitted'}
                    </span>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Due Date:
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    color: isOverdue ? '#dc2626' : '#374151',
                    fontWeight: isOverdue ? 600 : 'normal'
                  }}>
                    {assignment?.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
