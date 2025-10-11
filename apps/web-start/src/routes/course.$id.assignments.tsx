import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { backendFetcher } from '../integrations/fetcher';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { PageLayout } from '../components/common/PageLayout';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import type { Assignment, Course, Grade, User } from '../types/api';

export const Route = createFileRoute('/course/$id/assignments')({
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const { id: courseId } = Route.useParams();
  const { currentUserId } = useAuth();

  // Fetch current user
  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: backendFetcher<User>(`/users/${currentUserId}`),
  });

  // Fetch course with assignments
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: backendFetcher<Course>(`/courses/${courseId}`),
  });

  // Fetch all grades to determine submission status
  const { data: allGrades } = useQuery({
    queryKey: ['grades'],
    queryFn: backendFetcher<Array<Grade>>('/grades'),
    enabled: !!currentUser,
  });

  const assignments = course?.assignments || [];

  // Get user's role in this course
  const userRole =
    currentUser?.enrollments.find((e) => e.courseId === courseId)?.role ||
    'STUDENT';

  // Helper to get assignment status for current user
  const getAssignmentStatus = (assignment: Assignment) => {
    const submission = assignment.submissions?.find(
      (s) => s.studentId === currentUserId,
    );

    if (!submission) {
      return { status: 'Not Submitted', color: COLORS.error[600], bg: COLORS.error[200] };
    }

    const grade = allGrades?.find((g) => g.submissionId === submission.id);

    if (grade) {
      return { status: 'Graded', color: COLORS.success[500], bg: COLORS.success[100] };
    }

    if (submission.status === 'SUBMITTED') {
      return { status: 'Submitted', color: COLORS.warning[500], bg: COLORS.warning[100] };
    }

    return { status: 'Draft', color: COLORS.gray[600], bg: COLORS.gray[100] };
  };

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

  if (courseLoading) {
    return <LoadingSpinner message="Loading assignments..." />;
  }

  if (courseError || !course) {
    return (
      <ErrorMessage
        error={courseError || new Error('Failed to load assignments')}
        title="Error Loading Assignments"
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Sort assignments by due date (most recent first)
  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
  );

  return (
    <PageLayout currentUser={currentUser}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to={ROUTES.course(courseId)}
            style={{
              color: COLORS.primary[500],
              textDecoration: 'none',
              fontSize: TYPOGRAPHY.sizes.sm,
              marginBottom: '1rem',
              display: 'inline-block',
            }}
          >
            ← Back to {course.code}
          </Link>
          <h1
            style={{
              fontSize: TYPOGRAPHY.sizes['3xl'],
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem',
            }}
          >
            Assignments
          </h1>
          <p style={{ color: '#4b5563' }}>
            {course.code}: {course.title}
          </p>
        </div>

        {/* Assignments List */}
        {sortedAssignments.length > 0 ? (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {sortedAssignments.map((assignment) => {
              const dueDate = new Date(assignment.dueDate);
              const isOverdue = dueDate < new Date();
              const status = getAssignmentStatus(assignment);
              const typeStyle = getTypeColor(assignment.type);

              // Get grade if exists
              const submission = assignment.submissions?.find(
                (s) => s.studentId === currentUserId,
              );
              const grade = allGrades?.find(
                (g) => g.submissionId === submission?.id,
              );

              return (
                <div
                  key={assignment.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
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
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          color: '#111827',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {assignment.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          marginBottom: '0.75rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {assignment.description}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: typeStyle.bg,
                            color: typeStyle.color,
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontWeight: 500,
                          }}
                        >
                          {assignment.type}
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: status.bg,
                            color: status.color,
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontWeight: 500,
                          }}
                        >
                          {status.status}
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: isOverdue ? '#dc2626' : '#6b7280',
                            fontWeight: 500,
                          }}
                        >
                          Due: {dueDate.toLocaleDateString()} at{' '}
                          {dueDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            fontWeight: 600,
                          }}
                        >
                          {assignment.maxPoints} points
                        </span>
                        {grade && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color:
                                (grade.score / grade.maxScore) * 100 >= 90
                                  ? '#15803d'
                                  : (grade.score / grade.maxScore) * 100 >= 70
                                    ? '#d97706'
                                    : '#dc2626',
                            }}
                          >
                            Grade: {grade.score}/{grade.maxScore} (
                            {((grade.score / grade.maxScore) * 100).toFixed(1)}
                            %)
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      to="/course/$id/assignments/$assignmentId"
                      params={{ id: courseId, assignmentId: assignment.id }}
                      style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      View Details →
                    </Link>
                  </div>

                  {/* Instructions preview */}
                  {assignment.instructions && assignment.instructions.length > 0 && (
                    <div
                      style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e2e8f0',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#111827',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Instructions:
                      </h4>
                      {Array.isArray(assignment.instructions) ? (
                        <ul
                          style={{
                            fontSize: '0.875rem',
                            color: '#4b5563',
                            paddingLeft: '1.25rem',
                          }}
                        >
                          {assignment.instructions.map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                          {assignment.instructions}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 0',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              No assignments yet
            </p>
          </div>
        )}
    </PageLayout>
  );
}
