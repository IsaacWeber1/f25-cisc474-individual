'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  getCourseById,
  getCurrentUser,
  getUserRole,
  getAssignmentsByCourse,
  getSubmissionByStudent,
  getGradeBySubmission,
  getReflectionTemplatesByUser,
  type Assignment
} from '../../../_lib/dataProviderClient';

export default function ReflectionsList() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [reflections, setReflections] = useState<Assignment[]>([]);
  const [filteredReflections, setFilteredReflections] = useState<Assignment[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [reflectionStatuses, setReflectionStatuses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentStatus = searchParams.get('status') || 'all';

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

        if (!courseData) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        setCourse(courseData);
        setCurrentUser(user);

        // Fetch role, assignments, and templates in parallel
        const [role, allAssignments, templatesData] = await Promise.all([
          getUserRole(user.id, courseId),
          getAssignmentsByCourse(courseId),
          getReflectionTemplatesByUser(user.id)
        ]);

        setUserRole(role);
        setTemplates(templatesData);

        // Filter to reflection assignments only
        const reflectionAssignments = allAssignments.filter(assignment => assignment.type === 'REFLECTION');
        setReflections(reflectionAssignments);

        // Filter by status if specified - parallelize status checks
        let filtered = reflectionAssignments;
        if (currentStatus && currentStatus !== 'all') {
          const statusChecks = await Promise.all(
            reflectionAssignments.map(async (reflection) => {
              const submission = await getSubmissionByStudent(reflection.id, user.id);
              const grade = submission ? await getGradeBySubmission(submission.id) : null;

              let includeReflection = false;
              if (currentStatus === 'completed') {
                includeReflection = !!(submission && grade);
              } else if (currentStatus === 'pending') {
                includeReflection = !submission || !grade;
              } else {
                includeReflection = true;
              }

              return includeReflection ? reflection : null;
            })
          );
          filtered = statusChecks.filter(reflection => reflection !== null) as Assignment[];
        }

        setFilteredReflections(filtered);

        // Fetch all statuses in parallel
        const statusPromises = filtered.map(async (reflection) => {
          const submission = await getSubmissionByStudent(reflection.id, user.id);
          const grade = submission ? await getGradeBySubmission(submission.id) : null;

          if (submission && grade) {
            return { id: reflection.id, status: 'completed', color: '#15803d', bg: '#dcfce7' };
          }
          return { id: reflection.id, status: 'pending', color: '#d97706', bg: '#fef3c7' };
        });

        const statuses = await Promise.all(statusPromises);
        const statusMap = statuses.reduce((acc, status) => {
          acc[status.id] = status;
          return acc;
        }, {} as Record<string, any>);
        setReflectionStatuses(statusMap);

        setLoading(false);
      } catch (err) {
        console.error('[Reflections Page] Error loading reflections:', err);
        setError('There was an error loading the reflections. Please try again later.');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId, currentStatus]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
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
          borderTop: '4px solid #7c3aed',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading reflections...</p>
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
          Error Loading Reflections
        </h1>
        <p style={{ color: '#6b7280' }}>{error}</p>
        <button
          onClick={handleRetry}
          style={{
            backgroundColor: '#7c3aed',
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
            Reflections
          </h1>
          <p style={{ color: '#6b7280' }}>
            {userRole === 'student' ?
              'Complete reflections to reflect on your learning journey' :
              'View and manage student reflection responses'
            }
          </p>
        </div>

        {userRole === 'student' && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <Link
              href={`/course/${courseId}/reflections`}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                backgroundColor: !currentStatus || currentStatus === 'all' ? '#2563eb' : 'white',
                color: !currentStatus || currentStatus === 'all' ? 'white' : '#374151',
                border: '1px solid #2563eb',
                fontSize: '0.875rem'
              }}
            >
              All
            </Link>
            <Link
              href={`/course/${courseId}/reflections?status=pending`}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                backgroundColor: currentStatus === 'pending' ? '#d97706' : 'white',
                color: currentStatus === 'pending' ? 'white' : '#374151',
                border: '1px solid #d97706',
                fontSize: '0.875rem'
              }}
            >
              Pending
            </Link>
            <Link
              href={`/course/${courseId}/reflections?status=completed`}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                backgroundColor: currentStatus === 'completed' ? '#15803d' : 'white',
                color: currentStatus === 'completed' ? 'white' : '#374151',
                border: '1px solid #15803d',
                fontSize: '0.875rem'
              }}
            >
              Completed
            </Link>
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gap: '1.5rem'
      }}>
        {filteredReflections.length > 0 ? (
          filteredReflections.map((reflection) => {
            const statusInfo = reflectionStatuses[reflection.id];
            const template = templates.find(t => t.assignmentId === reflection.id);

            return (
              <div key={reflection.id} style={{
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
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#111827',
                        margin: 0
                      }}>
                        {reflection.title}
                      </h3>

                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: '#f3e8ff',
                        color: '#7c3aed',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontWeight: 500
                      }}>
                        Reflection
                      </span>
                    </div>

                    <p style={{
                      color: '#4b5563',
                      marginBottom: '1rem',
                      lineHeight: 1.5
                    }}>
                      {reflection.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <span>Due: {new Date(reflection.dueDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{template?.prompts?.length || 3} prompts</span>
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
                      href={`/course/${courseId}/reflections/${reflection.id}`}
                      style={{
                        backgroundColor: '#7c3aed',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}
                    >
                      {userRole === 'student' ? (
                        statusInfo?.status === 'completed' ? 'View Reflection' : 'Complete Reflection'
                      ) : (
                        'View Responses'
                      )}
                    </Link>
                  </div>
                </div>

                {template && template.prompts && template.prompts.length > 0 && (
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
                      Reflection Prompts:
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      fontSize: '0.875rem',
                      color: '#4b5563'
                    }}>
                      {template.prompts.slice(0, 2).map((prompt: string, index: number) => (
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
                          {prompt}
                        </li>
                      ))}
                      {template.prompts.length > 2 && (
                        <li style={{
                          color: '#6b7280',
                          fontStyle: 'italic',
                          marginTop: '0.5rem'
                        }}>
                          ... and {template.prompts.length - 2} more prompts
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
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              No reflections found
            </h3>
            <p style={{ color: '#6b7280' }}>
              {currentStatus && currentStatus !== 'all' ?
                'Try adjusting your filters to see more reflections.' :
                'No reflection assignments have been created for this course yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
