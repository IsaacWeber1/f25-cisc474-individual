'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import FilterControls from '../../../_components/FilterControls';
import {
  getAssignmentsByCourse,
  getCurrentUser,
  getUserRole,
  getSubmissionByStudent,
  getGradeBySubmission
} from '../../../_lib/dataProviderClient';

export default function AssignmentsList() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.id as string;

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([]);
  const [assignmentStatuses, setAssignmentStatuses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentType = searchParams.get('type') || 'all';
  const currentStatus = searchParams.get('status') || 'all';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parallelize initial data fetching
        const [user, assignmentsData] = await Promise.all([
          getCurrentUser(),
          getAssignmentsByCourse(courseId)
        ]);

        if (!user) {
          setError('Unable to load user data.');
          setLoading(false);
          return;
        }

        setCurrentUser(user);

        const role = await getUserRole(user.id, courseId);
        setUserRole(role);

        // Ensure assignments is an array
        const assignmentsArray = Array.isArray(assignmentsData) ? assignmentsData : [];
        setAssignments(assignmentsArray);

        // Filter by type if specified
        let filtered = assignmentsArray;
        if (currentType && currentType !== 'all') {
          filtered = assignmentsArray.filter(assignment => assignment.type === currentType);
        }

        // Filter by status for students - parallelize submission and grade fetching
        if (role === 'STUDENT' && currentStatus && currentStatus !== 'all') {
          const statusChecks = await Promise.all(
            filtered.map(async (assignment) => {
              const submission = await getSubmissionByStudent(assignment.id, user.id);
              const grade = submission ? await getGradeBySubmission(submission.id) : null;

              let includeAssignment = false;
              switch (currentStatus) {
                case 'pending':
                  includeAssignment = !submission;
                  break;
                case 'submitted':
                  includeAssignment = !!submission && !grade;
                  break;
                case 'graded':
                  includeAssignment = !!submission && !!grade;
                  break;
                default:
                  includeAssignment = true;
              }

              return includeAssignment ? assignment : null;
            })
          );
          filtered = statusChecks.filter(assignment => assignment !== null);
        }

        // Sort assignments by due date (newest first)
        const sortedAssignments = filtered.sort((a, b) =>
          new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        );
        setFilteredAssignments(sortedAssignments);

        // Fetch all statuses in parallel for students
        if (role === 'STUDENT') {
          const statusPromises = sortedAssignments.map(async (assignment) => {
            const submission = await getSubmissionByStudent(assignment.id, user.id);
            const grade = submission ? await getGradeBySubmission(submission.id) : null;

            if (!submission) return { id: assignment.id, status: 'pending', color: '#dc2626', bg: '#fef2f2' };
            if (!grade) return { id: assignment.id, status: 'submitted', color: '#d97706', bg: '#fef3c7' };
            return { id: assignment.id, status: 'graded', color: '#15803d', bg: '#dcfce7' };
          });

          const statuses = await Promise.all(statusPromises);
          const statusMap = statuses.reduce((acc, status) => {
            acc[status.id] = status;
            return acc;
          }, {} as Record<string, any>);
          setAssignmentStatuses(statusMap);
        }

        setLoading(false);
      } catch (err) {
        console.error('[Assignments Page] Error loading assignments:', err);
        setError('There was an error loading the assignments. Please try again later.');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId, currentType, currentStatus]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
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
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading assignments...</p>
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
          Error Loading Assignments
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
            Assignments
          </h1>
          <p style={{ color: '#6b7280' }}>
            {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {(userRole === 'TA' || userRole === 'PROFESSOR') && (
          <div style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: 500
          }}>
            + Create Assignment
          </div>
        )}
      </div>

      <FilterControls
        currentType={currentType}
        currentStatus={currentStatus}
        courseId={courseId}
        userRole={userRole}
      />

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => {
            const statusInfo = assignmentStatuses[assignment.id];
            const typeColor = getTypeColor(assignment.type);
            const isOverdue = new Date(assignment.dueDate) < new Date() && statusInfo?.status === 'pending';

            return (
              <div key={assignment.id} style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.5rem'
                    }}>
                      <Link
                        href={`/course/${courseId}/assignments/${assignment.id}`}
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          color: '#111827',
                          textDecoration: 'none'
                        }}
                      >
                        {assignment.title}
                      </Link>

                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: typeColor.bg,
                        color: typeColor.color,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        textTransform: 'capitalize',
                        fontWeight: 500
                      }}>
                        {assignment.type === 'REFLECTION' ? 'Reflection' :
                         assignment.type === 'FILE' ? 'File' :
                         assignment.type === 'TEXT' ? 'Text' : assignment.type}
                      </span>

                      {assignment.type === 'REFLECTION' && (
                        <span style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#fef3c7',
                          color: '#d97706',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontWeight: 500
                        }}>
                          Special
                        </span>
                      )}
                    </div>

                    <p style={{
                      color: '#4b5563',
                      marginBottom: '1rem',
                      lineHeight: 1.5
                    }}>
                      {assignment.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <span style={{
                        color: isOverdue ? '#dc2626' : '#6b7280'
                      }}>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        {isOverdue && ' (Overdue)'}
                      </span>
                      <span>•</span>
                      <span>{assignment.maxPoints} points</span>
                      {assignment.instructions && (
                        <>
                          <span>•</span>
                          <span>{assignment.instructions.length} instruction{assignment.instructions.length !== 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.75rem'
                  }}>
                    {statusInfo && (
                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}>
                        {statusInfo.status}
                      </span>
                    )}

                    <Link
                      href={`/course/${courseId}/assignments/${assignment.id}`}
                      style={{
                        backgroundColor: assignment.type === 'REFLECTION' ? '#7c3aed' : '#2563eb',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}
                    >
                      {userRole === 'STUDENT' ? (
                        statusInfo?.status === 'pending' ? 'Start Assignment' :
                        statusInfo?.status === 'submitted' ? 'View Submission' : 'View Results'
                      ) : (
                        'View Assignment'
                      )}
                    </Link>
                  </div>
                </div>

                {assignment.instructions && assignment.instructions.length > 0 && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Instructions:
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      fontSize: '0.875rem',
                      color: '#4b5563'
                    }}>
                      {assignment.instructions.slice(0, 3).map((instruction: string, index: number) => (
                        <li key={index} style={{
                          marginBottom: '0.25rem',
                          paddingLeft: '1rem',
                          position: 'relative'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: '0',
                            color: '#9ca3af'
                          }}>
                            •
                          </span>
                          {instruction}
                        </li>
                      ))}
                      {assignment.instructions.length > 3 && (
                        <li style={{
                          color: '#6b7280',
                          fontStyle: 'italic',
                          marginTop: '0.5rem'
                        }}>
                          ... and {assignment.instructions.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              📝
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              No assignments found
            </h3>
            <p style={{ color: '#6b7280' }}>
              {currentType !== 'all' || currentStatus !== 'all' ?
                'Try adjusting your filters to see more assignments.' :
                'No assignments have been created for this course yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
