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
} from '../../../_lib/dataProvider';

interface ReflectionsListProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function ReflectionsList({ params, searchParams }: ReflectionsListProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams.id;
  const course = getCourseById(courseId);
  const currentUser = await getCurrentUser();
  const userRole = await getUserRole(currentUser.id, courseId);
  
  // Get reflection assignments for this course
  const allAssignments = await getAssignmentsByCourse(courseId);
  const reflections = allAssignments.filter(assignment => assignment.type === 'REFLECTION');
  const templates = await getReflectionTemplatesByUser(currentUser.id);

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Course not found</h1>
      </div>
    );
  }

  // Filter reflections by status if specified
  let filteredReflections = reflections;
  if (resolvedSearchParams.status && resolvedSearchParams.status !== 'all') {
    const filteredResults = await Promise.all(
      reflections.map(async reflection => {
        const submission = await getSubmissionByStudent(reflection.id, currentUser.id);
        const grade = submission ? await getGradeBySubmission(submission.id) : null;

        let includeReflection = false;
        if (resolvedSearchParams.status === 'completed') {
          includeReflection = !!(submission && grade);
        } else if (resolvedSearchParams.status === 'pending') {
          includeReflection = !submission || !grade;
        } else {
          includeReflection = true;
        }

        return includeReflection ? reflection : null;
      })
    );
    filteredReflections = filteredResults.filter(reflection => reflection !== null);
  }

  const getReflectionStatus = async (reflection: Assignment) => {
    const submission = await getSubmissionByStudent(reflection.id, currentUser.id);
    const grade = submission ? await getGradeBySubmission(submission.id) : null;
    if (submission && grade) {
      return { status: 'completed', color: '#15803d', bg: '#dcfce7' };
    }
    return { status: 'pending', color: '#d97706', bg: '#fef3c7' };
  };

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
            Reflections ✨
          </h1>
          <p style={{ color: '#6b7280' }}>
            {userRole === 'student' ? 
              'Complete reflections to reflect on your learning journey' :
              'View and manage student reflection responses'
            }
          </p>
        </div>

        {/* Status Filter */}
        {userRole === 'student' && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <Link 
              href={`/course/${resolvedParams.id}/reflections`}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                backgroundColor: !resolvedSearchParams.status || resolvedSearchParams.status === 'all' ? '#2563eb' : 'white',
                color: !resolvedSearchParams.status || resolvedSearchParams.status === 'all' ? 'white' : '#374151',
                border: '1px solid #2563eb',
                fontSize: '0.875rem'
              }}
            >
              All
            </Link>
            <Link 
              href={`/course/${resolvedParams.id}/reflections?status=pending`}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                backgroundColor: resolvedSearchParams.status === 'pending' ? '#d97706' : 'white',
                color: resolvedSearchParams.status === 'pending' ? 'white' : '#374151',
                border: '1px solid #d97706',
                fontSize: '0.875rem'
              }}
            >
              Pending
            </Link>
            <Link 
              href={`/course/${resolvedParams.id}/reflections?status=completed`}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                backgroundColor: resolvedSearchParams.status === 'completed' ? '#15803d' : 'white',
                color: resolvedSearchParams.status === 'completed' ? 'white' : '#374151',
                border: '1px solid #15803d',
                fontSize: '0.875rem'
              }}
            >
              Completed
            </Link>
          </div>
        )}
      </div>

      {/* Reflections Grid */}
      <div style={{
        display: 'grid',
        gap: '1.5rem'
      }}>
        {filteredReflections.length > 0 ? (
          await Promise.all(filteredReflections.map(async (reflection) => {
            const statusInfo = await getReflectionStatus(reflection);
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
                        ✨ Reflection
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

                  {/* Status and Actions */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.75rem'
                  }}>
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

                    <Link
                      href={`/course/${resolvedParams.id}/reflections/${reflection.id}`}
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
                        statusInfo.status === 'completed' ? 'View Reflection' : 'Complete Reflection'
                      ) : (
                        'View Responses'
                      )}
                    </Link>
                  </div>
                </div>

                {/* Template Preview */}
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
          }))
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
              ✨
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
              {resolvedSearchParams.status ? 
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