import Link from 'next/link';
import FilterControls from '../../../_components/FilterControls';
import { 
  getAssignmentsByCourse, 
  getCurrentUser, 
  getUserRole,
  getSubmissionByStudent,
  getGradeBySubmission 
} from '../../../_lib/dataProvider';

interface AssignmentsListProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; status?: string }>;
}

export default async function AssignmentsList({ params, searchParams }: AssignmentsListProps) {
  try {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const courseId = resolvedParams.id; // Keep as string
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>Error Loading Assignments</h1>
          <p>Unable to load user data.</p>
        </div>
      );
    }

    const userRole = await getUserRole(currentUser.id, courseId);
    let assignments = await getAssignmentsByCourse(courseId);

    // Ensure assignments is an array
    const assignmentsArray = Array.isArray(assignments) ? assignments : [];

    // Filter by type if specified
    if (resolvedSearchParams.type && resolvedSearchParams.type !== 'all') {
      assignments = assignmentsArray.filter(assignment => assignment.type === resolvedSearchParams.type);
    } else {
      assignments = assignmentsArray;
    }

    // Filter by status for students
    if (userRole === 'STUDENT' && resolvedSearchParams.status && resolvedSearchParams.status !== 'all') {
      const filteredAssignments = [];
      for (const assignment of assignments) {
        const submission = await getSubmissionByStudent(assignment.id, currentUser.id);
        const grade = submission ? await getGradeBySubmission(submission.id) : null;

        let includeAssignment = false;
        switch (resolvedSearchParams.status) {
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
        if (includeAssignment) {
          filteredAssignments.push(assignment);
        }
      }
      assignments = filteredAssignments;
    }

    // Sort assignments by due date (newest first) - ensure assignments is still an array
    const sortedAssignments = Array.isArray(assignments) ? assignments.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()) : [];

    const getAssignmentStatus = async (assignmentId: string) => {
      if (userRole !== 'STUDENT') return null;

      const submission = await getSubmissionByStudent(assignmentId, currentUser.id);
      const grade = submission ? await getGradeBySubmission(submission.id) : null;

      if (!submission) return { status: 'pending', color: '#dc2626', bg: '#fef2f2' };
      if (!grade) return { status: 'submitted', color: '#d97706', bg: '#fef3c7' };
      return { status: 'graded', color: '#15803d', bg: '#dcfce7' };
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
            {sortedAssignments.length} assignment{sortedAssignments.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Quick create button for TAs and Professors */}
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

      {/* Filter Controls */}
      <FilterControls 
        currentType={resolvedSearchParams.type || 'all'}
        currentStatus={resolvedSearchParams.status || 'all'}
        courseId={resolvedParams.id}
        userRole={userRole}
      />

      {/* Assignments Grid */}
      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {sortedAssignments.length > 0 ? (
          await Promise.all(sortedAssignments.map(async (assignment) => {
            const statusInfo = await getAssignmentStatus(assignment.id);
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
                        href={`/course/${resolvedParams.id}/assignments/${assignment.id}`}
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
                          ✨ Special
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

                  {/* Status and Actions */}
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
                      href={`/course/${resolvedParams.id}/assignments/${assignment.id}`}
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

                {/* Assignment Instructions Preview */}
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
              {resolvedSearchParams.type || resolvedSearchParams.status ? 
                'Try adjusting your filters to see more assignments.' : 
                'No assignments have been created for this course yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
    );
  } catch (error) {
    console.error('[Assignments Page] Error loading assignments:', error);
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Error Loading Assignments</h1>
        <p style={{ color: '#6b7280' }}>
          There was an error loading the assignments. Please try again later.
        </p>
      </div>
    );
  }
}