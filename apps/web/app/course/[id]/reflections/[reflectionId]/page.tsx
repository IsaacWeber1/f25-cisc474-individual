import Link from 'next/link';
import { 
  getAssignmentById, 
  getCurrentUser, 
  getUserRole,
  getCourseById,
  getSubmissionByStudent,
  getGradeBySubmission,
  getReflectionTemplatesByAssignment,
  getRecentGrades,
  getPeerBenchmark,
  getRecentFeedback
} from '../../../../_lib/mockData';

interface ReflectionDetailProps {
  params: Promise<{ id: string; reflectionId: string }>;
}

export default async function ReflectionDetail({ params }: ReflectionDetailProps) {
  const resolvedParams = await params;
  const courseId = parseInt(resolvedParams.id);
  const assignmentId = parseInt(resolvedParams.reflectionId);
  const currentUser = getCurrentUser();
  const userRole = getUserRole(currentUser.id, courseId);
  const course = getCourseById(courseId);
  const assignment = getAssignmentById(assignmentId);
  
  if (!course || !assignment || assignment.type !== 'reflection') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Reflection not found</h1>
        <Link 
          href={`/course/${resolvedParams.id}/reflections`}
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          ← Back to Reflections
        </Link>
      </div>
    );
  }

  const submission = userRole === 'student' ? getSubmissionByStudent(assignmentId, currentUser.id) : null;
  const grade = submission ? getGradeBySubmission(submission.id) : null;
  const templates = getReflectionTemplatesByAssignment(assignmentId);
  const template = templates.length > 0 ? templates[0] : null;
  
  // Get data for the reflection based on template requirements
  const recentGrades = getRecentGrades(currentUser.id, 5);
  const peerBenchmark = getPeerBenchmark(courseId);
  const recentFeedback = getRecentFeedback(currentUser.id, 3);

  const getStatusColor = () => {
    if (userRole !== 'student') return null;
    if (!submission) return { status: 'Not Started', color: '#dc2626', bg: '#fef2f2' };
    if (!grade) return { status: 'Submitted', color: '#d97706', bg: '#fef3c7' };
    return { status: 'Completed', color: '#15803d', bg: '#dcfce7' };
  };

  const statusInfo = getStatusColor();

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '1.5rem'
      }}>
        <Link 
          href={`/course/${resolvedParams.id}/reflections`}
          style={{ color: '#2563eb', textDecoration: 'none' }}
        >
          Reflections
        </Link>
        <span style={{ margin: '0 0.5rem' }}>›</span>
        <span>{assignment.title}</span>
      </div>

      {/* Header */}
      <div style={{
        backgroundColor: '#f3e8ff',
        border: '1px solid #c4b5fd',
        borderRadius: '0.5rem',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>✨</span>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#7c3aed',
                margin: 0,
                marginBottom: '0.5rem'
              }}>
                {assignment.title}
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: '#6d28d9',
                margin: 0
              }}>
                Guided Learning Reflection
              </p>
            </div>
          </div>

          {statusInfo && (
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
          )}
        </div>

        <p style={{
          fontSize: '1rem',
          color: '#6d28d9',
          lineHeight: 1.6,
          margin: 0
        }}>
          {assignment.description}
        </p>
      </div>

      {userRole === 'student' && !grade ? (
        /* Student Reflection Interface */
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '2rem'
        }}>
          {/* Main Reflection Form */}
          <div>
            <form style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              padding: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '2rem'
              }}>
                Reflection Prompts
              </h2>

              {template?.prompts && template.prompts.map((prompt, index) => (
                <div key={index} style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '1rem'
                  }}>
                    {index + 1}. {prompt}
                  </label>
                  <textarea
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      backgroundColor: 'white'
                    }}
                    placeholder="Share your thoughts here..."
                    defaultValue={submission?.reflectionResponse?.answers?.[index.toString()] || ''}
                  />
                </div>
              ))}

              {/* Skill Tags Selection */}
              {template?.skillTags && (
                <div style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #bbf7d0',
                  borderRadius: '0.5rem'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '1rem'
                  }}>
                    Focus Skill for Next Week:
                  </label>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    {template.skillTags.map((skill, index) => (
                      <label key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}>
                        <input 
                          type="radio" 
                          name="focusSkill" 
                          value={skill}
                          style={{ margin: 0 }}
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                <button type="submit" style={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}>
                  {submission ? 'Update Reflection' : 'Submit Reflection'}
                </button>
                <button type="button" style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}>
                  Save Draft
                </button>
              </div>
            </form>
          </div>

          {/* Data Insights Sidebar */}
          <div>
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
                Your Learning Data
              </h3>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                Use this data to help inform your reflection
              </div>

              {/* Recent Grades */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  Recent Grades:
                </h4>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {recentGrades.slice(0, 3).map((gradeRecord, index) => (
                    <div key={gradeRecord.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      <span style={{ color: '#4b5563' }}>
                        Assignment {index + 1}
                      </span>
                      <span style={{
                        fontWeight: 600,
                        color: gradeRecord.score / gradeRecord.maxScore >= 0.8 ? '#15803d' : 
                               gradeRecord.score / gradeRecord.maxScore >= 0.6 ? '#d97706' : '#dc2626'
                      }}>
                        {gradeRecord.score}/{gradeRecord.maxScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peer Benchmark */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  Class Performance:
                </h4>
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '0.375rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#0369a1',
                    marginBottom: '0.25rem'
                  }}>
                    {peerBenchmark.toFixed(1)}%
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#0369a1'
                  }}>
                    Class Average
                  </div>
                </div>
              </div>

              {/* Recent Feedback */}
              <div>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  Recent Feedback:
                </h4>
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#fef7ff',
                  border: '1px solid #e9d5ff',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  color: '#6b21a8',
                  fontStyle: 'italic'
                }}>
                  {recentFeedback.length > 0 
                    ? `"${recentFeedback[0]}"` 
                    : 'No recent feedback available'
                  }
                </div>
              </div>
            </div>

            {/* Assignment Info */}
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
                Assignment Details
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#6b7280' }}>Due Date:</span>
                  <span style={{ color: '#374151', fontWeight: 500 }}>
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#6b7280' }}>Points:</span>
                  <span style={{ color: '#374151', fontWeight: 500 }}>
                    {assignment.maxPoints}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#6b7280' }}>Prompts:</span>
                  <span style={{ color: '#374151', fontWeight: 500 }}>
                    {template?.prompts?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : grade ? (
        /* Completed Reflection View */
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          padding: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#111827',
              margin: 0
            }}>
              Your Reflection
            </h2>
            
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#15803d',
                marginBottom: '0.25rem'
              }}>
                {grade.score}/{grade.maxScore}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#15803d',
                fontWeight: 500
              }}>
                Completed
              </div>
            </div>
          </div>

          {submission?.reflectionResponse?.answers && template?.prompts && template.prompts.map((prompt, index) => (
            <div key={index} style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '1rem'
              }}>
                {index + 1}. {prompt}
              </h4>
              <div style={{
                fontSize: '0.875rem',
                color: '#4b5563',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {submission.reflectionResponse?.answers?.[index.toString()] || 'No response provided.'}
              </div>
            </div>
          ))}

          {grade.feedback && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#ecfdf5',
              border: '1px solid #bbf7d0',
              borderRadius: '0.5rem'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                Instructor Feedback:
              </h4>
              <p style={{
                fontSize: '0.875rem',
                color: '#15803d',
                lineHeight: 1.6,
                margin: 0
              }}>
                {grade.feedback}
              </p>
            </div>
          )}

          <div style={{
            marginTop: '1.5rem',
            fontSize: '0.75rem',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            Submitted on {submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'Unknown'} • 
            Graded on {new Date(grade.gradedAt).toLocaleDateString()}
          </div>
        </div>
      ) : (
        /* Instructor View */
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
            Reflection Overview
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              backgroundColor: '#dbeafe',
              border: '1px solid #bfdbfe',
              borderRadius: '0.5rem'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1e40af',
                marginBottom: '0.5rem'
              }}>
                {template?.prompts?.length || 0}
              </div>
              <div style={{ color: '#1e40af', fontWeight: 500 }}>
                Reflection Prompts
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: '0.5rem'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#15803d',
                marginBottom: '0.5rem'
              }}>
                {assignment.maxPoints}
              </div>
              <div style={{ color: '#15803d', fontWeight: 500 }}>
                Total Points
              </div>
            </div>
          </div>

          {template?.prompts && (
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Reflection Prompts:
              </h3>
              <ol style={{
                paddingLeft: '1.5rem',
                fontSize: '0.875rem',
                color: '#4b5563',
                lineHeight: 1.6
              }}>
                {template.prompts.map((prompt, index) => (
                  <li key={index} style={{ marginBottom: '0.75rem' }}>
                    {prompt}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem'
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
              View All Submissions
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
              Grade Reflections
            </button>
          </div>
        </div>
      )}
    </div>
  );
}