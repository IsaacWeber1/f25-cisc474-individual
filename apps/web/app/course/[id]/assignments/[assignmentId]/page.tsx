import Link from 'next/link';
import { 
  getAssignmentById, 
  getCurrentUser, 
  getUserRole,
  getCourseById,
  getSubmissionByStudent,
  getGradeBySubmission,
  getReflectionTemplatesByAssignment
} from '../../../../_lib/mockData';

interface AssignmentDetailProps {
  params: Promise<{ id: string; assignmentId: string }>;
}

export default async function AssignmentDetail({ params }: AssignmentDetailProps) {
  const resolvedParams = await params;
  const courseId = parseInt(resolvedParams.id);
  const assignmentId = parseInt(resolvedParams.assignmentId);
  const currentUser = getCurrentUser();
  const userRole = getUserRole(currentUser.id, courseId);
  const course = getCourseById(courseId);
  const assignment = getAssignmentById(assignmentId);
  
  if (!course || !assignment) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Assignment not found</h1>
        <Link 
          href={`/course/${resolvedParams.id}/assignments`}
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          ← Back to Assignments
        </Link>
      </div>
    );
  }

  const submission = userRole === 'student' ? getSubmissionByStudent(assignmentId, currentUser.id) : null;
  const grade = submission ? getGradeBySubmission(submission.id) : null;
  const isOverdue = new Date(assignment.dueDate) < new Date() && !submission;
  
  const getStatusColor = () => {
    if (userRole !== 'student') return null;
    if (!submission) return { status: 'Not Started', color: '#dc2626', bg: '#fef2f2' };
    if (!grade) return { status: 'Submitted', color: '#d97706', bg: '#fef3c7' };
    return { status: 'Graded', color: '#15803d', bg: '#dcfce7' };
  };

  const statusInfo = getStatusColor();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reflection':
        return { color: '#7c3aed', bg: '#f3e8ff' };
      case 'file':
        return { color: '#2563eb', bg: '#dbeafe' };
      case 'text':
        return { color: '#15803d', bg: '#dcfce7' };
      default:
        return { color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const typeColor = getTypeColor(assignment.type);

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '1.5rem'
      }}>
        <Link 
          href={`/course/${resolvedParams.id}/assignments`}
          style={{ color: '#2563eb', textDecoration: 'none' }}
        >
          Assignments
        </Link>
        <span style={{ margin: '0 0.5rem' }}>›</span>
        <span>{assignment.title}</span>
      </div>

      {/* Header */}
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
              {assignment.title}
            </h1>
            
            <span style={{
              fontSize: '0.875rem',
              backgroundColor: typeColor.bg,
              color: typeColor.color,
              padding: '0.375rem 0.75rem',
              borderRadius: '0.375rem',
              textTransform: 'capitalize',
              fontWeight: 500
            }}>
              {assignment.type}
            </span>
            
            {assignment.type === 'reflection' && (
              <span style={{
                fontSize: '0.875rem',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                fontWeight: 500
              }}>
                ✨ Distinctive Feature
              </span>
            )}
          </div>

          <p style={{
            fontSize: '1.125rem',
            color: '#4b5563',
            lineHeight: 1.6,
            margin: 0
          }}>
            {assignment.description}
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

      {/* Assignment Info Grid */}
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
            {assignment.maxPoints}
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
            {new Date(assignment.dueDate).toLocaleDateString()}
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

      {/* Instructions */}
      {assignment.instructions && assignment.instructions.length > 0 && (
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
            {assignment.instructions.map((instruction, index) => (
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

      {/* Submission Interface */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: userRole === 'student' ? '2fr 1fr' : '1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Main Content - Submission Area */}
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
            {userRole === 'student' ? 'Your Submission' : 'Assignment Details'}
          </h2>

          {userRole === 'student' ? (
            <>
              {/* Student Submission Interface */}
              {assignment.type === 'text' && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Text Submission:
                  </label>
                  <textarea 
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit'
                    }}
                    placeholder={submission ? 'Your submitted text...' : 'Enter your text submission here...'}
                    defaultValue={submission?.content || ''}
                    disabled={!!grade}
                  />
                  {!grade && (
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      <button style={{
                        backgroundColor: '#15803d',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}>
                        {submission ? 'Update Submission' : 'Submit'}
                      </button>
                      <button style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}>
                        Save Draft
                      </button>
                    </div>
                  )}
                </div>
              )}

              {assignment.type === 'file' && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    File Upload:
                  </label>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '0.5rem',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb'
                  }}>
                    {submission ? (
                      <div>
                        <div style={{
                          fontSize: '2rem',
                          marginBottom: '1rem'
                        }}>📁</div>
                        <p style={{
                          fontWeight: 500,
                          color: '#374151',
                          marginBottom: '0.5rem'
                        }}>
                          File submitted: {submission.fileName}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div style={{
                          fontSize: '2rem',
                          marginBottom: '1rem'
                        }}>📤</div>
                        <p style={{
                          fontWeight: 500,
                          color: '#374151',
                          marginBottom: '0.5rem'
                        }}>
                          Drop files here or click to browse
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          Supports PDF, DOC, DOCX, TXT files up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                  {!grade && (
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      <button style={{
                        backgroundColor: '#15803d',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}>
                        {submission ? 'Replace File' : 'Upload & Submit'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {assignment.type === 'reflection' && (
                <div>
                  <div style={{
                    backgroundColor: '#f3e8ff',
                    border: '1px solid #c4b5fd',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>✨</span>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: '#7c3aed',
                        margin: 0
                      }}>
                        Guided Reflection
                      </h3>
                    </div>
                    <p style={{
                      color: '#6d28d9',
                      fontSize: '0.875rem',
                      margin: 0
                    }}>
                      This reflection helps you think about your learning progress with personalized prompts and insights.
                    </p>
                  </div>

                  <Link 
                    href={`/course/${resolvedParams.id}/reflections/${assignmentId}`}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}
                  >
                    {submission ? 'View Reflection' : 'Start Reflection'} →
                  </Link>
                </div>
              )}
            </>
          ) : (
            /* Instructor View */
            <div>
              <p style={{
                color: '#4b5563',
                marginBottom: '2rem',
                fontSize: '1rem'
              }}>
                Assignment created for {assignment.type} submission. Students can access this assignment through their assignments list.
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
                <button style={{
                  backgroundColor: '#15803d',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>
                  View Submissions
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Student Only */}
        {userRole === 'student' && (
          <div>
            {/* Grade Display */}
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

            {/* Submission Status */}
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
                      {new Date(submission.submittedAt).toLocaleDateString()}
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
                    {new Date(assignment.dueDate).toLocaleDateString()}
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