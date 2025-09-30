import Link from 'next/link';
import GradingInterface from '../../../../../_components/GradingInterface';
import {
  getAssignmentById,
  getCurrentUser,
  getUserRole,
  getCourseById,
  getSubmissionsByAssignment,
  getGradeBySubmission,
  getAllUsers
} from '../../../../../_lib/dataProvider';

interface SubmissionsPageProps {
  params: Promise<{ id: string; assignmentId: string }>;
  searchParams: Promise<{ student?: string }>;
}

export default async function SubmissionsPage({ params, searchParams }: SubmissionsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  try {
    const courseId = resolvedParams.id;
    const assignmentId = resolvedParams.assignmentId;
    const currentUser = await getCurrentUser();
    const userRole = await getUserRole(currentUser.id, courseId);
    const course = await getCourseById(courseId);
    const assignment = await getAssignmentById(assignmentId);

    // Check if user has permission to view submissions
    if (userRole !== 'TA' && userRole !== 'PROFESSOR' && userRole !== 'ADMIN') {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>Access Denied</h1>
          <p style={{ color: '#6b7280' }}>You don't have permission to view submissions.</p>
          <Link href={`/course/${courseId}/assignments/${assignmentId}`}>
            ← Back to Assignment
          </Link>
        </div>
      );
    }

    if (!course || !assignment) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>Assignment not found</h1>
          <Link href={`/course/${courseId}/assignments`}>
            ← Back to Assignments
          </Link>
        </div>
      );
    }

    const submissions = await getSubmissionsByAssignment(assignmentId);
    const users = await getAllUsers();

    // Filter to only submitted assignments (not drafts)
    const submittedSubmissions = submissions.filter(sub => sub.status === 'SUBMITTED');

    // If a specific student is selected, show grading interface
    const selectedStudentId = resolvedSearchParams.student;
    const selectedSubmission = selectedStudentId
      ? submittedSubmissions.find(sub => sub.studentId === selectedStudentId)
      : null;

    let selectedGrade = null;
    if (selectedSubmission) {
      selectedGrade = await getGradeBySubmission(selectedSubmission.id);
    }

    return (
      <div>
        {/* Breadcrumb */}
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
          <Link
            href={`/course/${courseId}/assignments/${assignmentId}`}
            style={{ color: '#2563eb', textDecoration: 'none' }}
          >
            {assignment.title}
          </Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span>Submissions</span>
        </div>

        {/* Header */}
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
              Submissions: {assignment.title}
            </h1>
            <p style={{ color: '#6b7280' }}>
              {submittedSubmissions.length} submission{submittedSubmissions.length !== 1 ? 's' : ''} received
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedSubmission ? '1fr 2fr' : '1fr',
          gap: '2rem'
        }}>
          {/* Submissions List */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Student Submissions
            </h2>

            {submittedSubmissions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {submittedSubmissions.map(async (submission) => {
                  const student = users.find(u => u.id === submission.studentId);
                  const grade = await getGradeBySubmission(submission.id);
                  const isSelected = submission.studentId === selectedStudentId;

                  return (
                    <div
                      key={submission.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        borderRadius: '0.375rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Link
                        href={`/course/${courseId}/assignments/${assignmentId}/submissions?student=${submission.studentId}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{
                            fontWeight: 500,
                            color: '#111827'
                          }}>
                            {student?.name || 'Unknown Student'}
                          </span>

                          <span style={{
                            fontSize: '0.75rem',
                            backgroundColor: grade ? '#dcfce7' : '#fef3c7',
                            color: grade ? '#15803d' : '#d97706',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontWeight: 500
                          }}>
                            {grade ? 'Graded' : 'Needs Grading'}
                          </span>
                        </div>

                        <div style={{
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          Submitted: {new Date(submission.submittedAt || '').toLocaleDateString()}
                          {grade && (
                            <span style={{ marginLeft: '1rem' }}>
                              Score: {grade.score}/{grade.maxScore}
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#6b7280'
              }}>
                <p>No submissions received yet.</p>
              </div>
            )}
          </div>

          {/* Grading Interface */}
          {selectedSubmission && (
            <div>
              <GradingInterface
                assignment={assignment}
                submission={selectedSubmission}
                grade={selectedGrade}
                onGradeUpdate={() => {
                  // Refresh the page to show updated grade
                  window.location.reload();
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('[Submissions Page] Error loading submissions:', error);
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Error Loading Submissions</h1>
        <p style={{ color: '#6b7280' }}>
          There was an error loading the submissions. Please try again later.
        </p>
        <Link href={`/course/${resolvedParams.id}/assignments/${resolvedParams.assignmentId}`}>
          ← Back to Assignment
        </Link>
      </div>
    );
  }
}