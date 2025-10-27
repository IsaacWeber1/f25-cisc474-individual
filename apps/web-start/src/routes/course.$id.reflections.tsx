import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthFetcher } from '../integrations/authFetcher';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import type { Assignment, Course, Grade, User } from '../types/api';

export const Route = createFileRoute('/course/$id/reflections')({
  component: ReflectionsPage,
});

function ReflectionsPage() {
  const authFetcher = useAuthFetcher();
  const { id: courseId } = Route.useParams();
  const { currentUserId } = useAuth();

  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: () => authFetcher<User>(`/users/${currentUserId}`),
    enabled: !!currentUserId, // Don't fetch if currentUserId is null
  });

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => authFetcher<Course>(`/courses/${courseId}`),
  });

  const { data: allGrades } = useQuery({
    queryKey: ['grades'],
    queryFn: () => authFetcher<Array<Grade>>('/grades'),
    enabled: !!currentUser,
  });

  // Filter to only reflection-type assignments
  const reflections =
    course?.assignments.filter((a) => a.type === 'REFLECTION') || [];

  const getReflectionStatus = (assignment: Assignment) => {
    const submission = assignment.submissions.find(
      (s) => s.studentId === currentUserId,
    );

    if (!submission) {
      return { status: 'Not Completed', color: COLORS.warning[500], bg: COLORS.warning[100] };
    }

    const grade = allGrades?.find((g) => g.submissionId === submission.id);

    if (grade) {
      return { status: 'Completed', color: COLORS.success[500], bg: COLORS.success[100] };
    }

    return { status: 'Pending Review', color: COLORS.primary[500], bg: COLORS.primary[100] };
  };

  if (courseLoading) {
    return <LoadingSpinner message="Loading reflections..." />;
  }

  if (courseError || !course) {
    return (
      <ErrorMessage
        error={courseError || new Error('Failed to load reflections')}
        title="Error Loading Reflections"
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to={ROUTES.course(courseId)}
            style={{
              color: COLORS.purple[500],
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
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem',
            }}
          >
            Reflections
          </h1>
          <p style={{ color: '#4b5563' }}>
            {course.code}: {course.title}
          </p>
        </div>

        {/* Reflections List */}
        {reflections.length > 0 ? (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {reflections
              .sort(
                (a, b) =>
                  new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
              )
              .map((reflection) => {
                const dueDate = new Date(reflection.dueDate);
                const isOverdue = dueDate < new Date();
                const status = getReflectionStatus(reflection);
                const submission = reflection.submissions.find(
                  (s) => s.studentId === currentUserId,
                );
                const grade = allGrades?.find(
                  (g) => g.submissionId === submission?.id,
                );

                return (
                  <div
                    key={reflection.id}
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
                          💭 {reflection.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            marginBottom: '0.75rem',
                            lineHeight: 1.5,
                          }}
                        >
                          {reflection.description}
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
                            Due: {dueDate.toLocaleDateString()}
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: '#6b7280',
                              fontWeight: 600,
                            }}
                          >
                            {reflection.maxPoints} points
                          </span>
                          {grade && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#15803d',
                              }}
                            >
                              Grade: {grade.score}/{grade.maxScore}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        to="/course/$id/reflections/$reflectionId"
                        params={{ id: courseId, reflectionId: reflection.id }}
                        style={{
                          backgroundColor: '#7c3aed',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {submission ? 'View Response' : 'Complete'} →
                      </Link>
                    </div>

                    {/* Reflection Template Info */}
                    {reflection.reflectionTemplate && (
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
                          Reflection Prompts (
                          {reflection.reflectionTemplate.prompts.length}):
                        </h4>
                        <ul
                          style={{
                            fontSize: '0.875rem',
                            color: '#4b5563',
                            paddingLeft: '1.25rem',
                          }}
                        >
                          {reflection.reflectionTemplate.prompts.map(
                            (prompt, idx) => (
                              <li key={idx}>{prompt}</li>
                            ),
                          )}
                        </ul>
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
              No reflections assigned yet
            </p>
          </div>
        )}

        {/* Nested route outlet for reflection details */}
        <Outlet />
    </>
  );
}
