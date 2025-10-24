import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthFetcher } from '../integrations/authFetcher';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import type { Assignment, Grade, User } from '../types/api';

export const Route = createFileRoute('/course/$id/assignments/$assignmentId')({
  component: AssignmentDetailPage,
});

function AssignmentDetailPage() {
  const authFetcher = useAuthFetcher();
  const { id: courseId, assignmentId } = Route.useParams();
  const { currentUserId } = useAuth();

  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: () => authFetcher<User>(`/users/${currentUserId}`),
  });

  const {
    data: assignment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: () => authFetcher<Assignment>(`/assignments/${assignmentId}`),
  });

  const { data: allGrades } = useQuery({
    queryKey: ['grades'],
    queryFn: () => authFetcher<Array<Grade>>('/grades'),
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading assignment..." />;
  }

  if (error || !assignment) {
    return (
      <ErrorMessage
        error={error || new Error('Assignment not found')}
        title="Error Loading Assignment"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const submission = assignment.submissions.find(
    (s) => s.studentId === currentUserId,
  );
  const grade = allGrades?.find((g) => g.submissionId === submission?.id);
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date() && !submission;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'REFLECTION':
        return { color: COLORS.purple[500], bg: COLORS.purple[100] };
      case 'FILE':
        return { color: COLORS.primary[500], bg: COLORS.primary[100] };
      case 'TEXT':
        return { color: COLORS.success[500], bg: COLORS.success[100] };
      default:
        return { color: COLORS.gray[600], bg: COLORS.gray[100] };
    }
  };

  const getStatusInfo = () => {
    if (!submission)
      return { status: 'Not Submitted', color: COLORS.error[600], bg: COLORS.error[200] };
    if (grade) return { status: 'Graded', color: COLORS.success[500], bg: COLORS.success[100] };
    return { status: 'Submitted', color: COLORS.warning[500], bg: COLORS.warning[100] };
  };

  const typeColor = getTypeColor(assignment.type);
  const statusInfo = getStatusInfo();

  return (
    <>
        {/* Breadcrumbs */}
        <div
          style={{
            marginBottom: '2rem',
            fontSize: TYPOGRAPHY.sizes.sm,
            color: COLORS.gray[600],
          }}
        >
          <Link
            to={ROUTES.courseAssignments(courseId)}
            style={{ color: COLORS.primary[500], textDecoration: 'none' }}
          >
            ← Back to Assignments
          </Link>
        </div>

        {/* Assignment Header */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '0.5rem',
                }}
              >
                {assignment.title}
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                {assignment.course.code}: {assignment.course.title}
              </p>
            </div>
            <span
              style={{
                fontSize: '0.875rem',
                backgroundColor: typeColor.bg,
                color: typeColor.color,
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                fontWeight: 500,
              }}
            >
              {assignment.type}
            </span>
          </div>

          <p
            style={{
              fontSize: '1rem',
              color: '#4b5563',
              marginBottom: '1.5rem',
              lineHeight: 1.6,
            }}
          >
            {assignment.description}
          </p>

          {/* Assignment Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem',
                }}
              >
                Due Date
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: isOverdue ? '#dc2626' : '#111827',
                }}
              >
                {dueDate.toLocaleDateString()} at{' '}
                {dueDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem',
                }}
              >
                Points
              </div>
              <div
                style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}
              >
                {assignment.maxPoints} points
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem',
                }}
              >
                Status
              </div>
              <span
                style={{
                  fontSize: '0.875rem',
                  backgroundColor: statusInfo.bg,
                  color: statusInfo.color,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontWeight: 500,
                  display: 'inline-block',
                }}
              >
                {statusInfo.status}
              </span>
            </div>
            {grade && (
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem',
                  }}
                >
                  Grade
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#15803d',
                  }}
                >
                  {grade.score}/{grade.maxScore} (
                  {((grade.score / grade.maxScore) * 100).toFixed(1)}
                  %)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        {assignment.instructions && assignment.instructions.length > 0 && (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '1rem',
              }}
            >
              Instructions
            </h2>
            {Array.isArray(assignment.instructions) ? (
              <ul
                style={{
                  fontSize: '1rem',
                  color: '#4b5563',
                  paddingLeft: '1.5rem',
                  lineHeight: 1.8,
                }}
              >
                {assignment.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ul>
            ) : (
              <p
                style={{ fontSize: '1rem', color: '#4b5563', lineHeight: 1.6 }}
              >
                {assignment.instructions}
              </p>
            )}
          </div>
        )}

        {/* Submission Section */}
        {submission ? (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '1rem',
              }}
            >
              Your Submission
            </h2>
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                }}
              >
                Submitted:{' '}
                {new Date(submission.submittedAt || '').toLocaleDateString()}
              </div>
              {submission.content && (
                <div
                  style={{
                    fontSize: '1rem',
                    color: '#374151',
                    lineHeight: 1.6,
                  }}
                >
                  {submission.content}
                </div>
              )}
              {submission.files &&
                Array.isArray(submission.files) &&
                submission.files.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#111827',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Files:
                    </div>
                    <ul
                      style={{
                        fontSize: '0.875rem',
                        color: '#4b5563',
                        paddingLeft: '1.25rem',
                      }}
                    >
                      {(submission.files as Array<string>).map((file, idx) => (
                        <li key={idx}>{file}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
            {grade && grade.feedback && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#dcfce7',
                  borderRadius: '0.5rem',
                  border: '1px solid #86efac',
                }}
              >
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#15803d',
                    marginBottom: '0.5rem',
                  }}
                >
                  Instructor Feedback:
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    color: '#166534',
                    lineHeight: 1.6,
                  }}
                >
                  {grade.feedback}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '0.5rem',
              }}
            >
              No Submission Yet
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              You haven't submitted this assignment yet.
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                fontStyle: 'italic',
              }}
            >
              Submission interface to be implemented
            </p>
          </div>
        )}
    </>
  );
}
