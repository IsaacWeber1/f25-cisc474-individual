import Link from 'next/link';
import {
  getCourseById,
  getCurrentUser,
  getUserRole,
  getAssignmentsByCourse,
  getGradesByStudent,
  getSubmissionByStudent,
  getGradeBySubmission,
  getEnrollmentsByUser,
  type Assignment,
  type Submission,
  type Grade
} from '../../../_lib/dataProvider';

interface GradesPageProps {
  params: Promise<{ id: string }>;
}

export default async function GradesPage({ params }: GradesPageProps) {
  try {
    const resolvedParams = await params;
    const courseId = resolvedParams.id; // Keep as string
    const course = await getCourseById(courseId);
    const currentUser = await getCurrentUser();
    const userRole = await getUserRole(currentUser.id, courseId);
    const assignments = await getAssignmentsByCourse(courseId);

    // Ensure assignments is an array
    const assignmentsArray = Array.isArray(assignments) ? assignments : [];

    if (!course || !currentUser) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>Course not found</h1>
        </div>
      );
    }

    // For students, show their own grades
    const studentGrades = userRole === 'student' ? await getGradesByStudent(currentUser.id) : [];

  // Calculate student's course statistics
  let stats = null;
  interface CourseSubmission {
    assignment: Assignment;
    submission: Submission | null;
    grade: Grade | null;
  }
  let courseSubmissions: CourseSubmission[] = [];
  if (userRole === 'student') {
    courseSubmissions = await Promise.all(
      assignmentsArray.map(async assignment => {
        const submission = await getSubmissionByStudent(assignment.id, currentUser.id);
        const grade = submission ? await getGradeBySubmission(submission.id) : null;
        return { assignment, submission, grade };
      })
    );

    const gradedSubmissions = courseSubmissions.filter(item => item.grade);
    const totalPoints = gradedSubmissions.reduce((sum, item) => sum + item.grade!.score, 0);
    const maxPoints = gradedSubmissions.reduce((sum, item) => sum + item.grade!.maxScore, 0);
    const percentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

    stats = {
      totalPoints,
      maxPoints,
      percentage,
      gradedCount: gradedSubmissions.length,
      totalCount: assignmentsArray.length
    };
  }

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

      {/* Student Statistics */}
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

      {/* Grades Table */}
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
              {assignmentsArray.map((assignment, index) => {
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
                        href={`/course/${resolvedParams.id}/assignments/${assignment.id}`}
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
                        {assignment.type === 'REFLECTION' && ' ✨'}
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

        {assignmentsArray.length === 0 && (
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
  } catch (error) {
    console.error('[Grades Page] Error loading grades:', error);
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Error Loading Grades</h1>
        <p style={{ color: '#6b7280' }}>
          There was an error loading the grades. Please try again later.
        </p>
      </div>
    );
  }
}