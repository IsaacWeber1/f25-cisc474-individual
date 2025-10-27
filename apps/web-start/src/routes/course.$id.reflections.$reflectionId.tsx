import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthFetcher } from '../integrations/authFetcher';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import type { Assignment, Grade, User } from '../types/api';

export const Route = createFileRoute('/course/$id/reflections/$reflectionId')({
  component: ReflectionDetailPage,
});

function ReflectionDetailPage() {
  const authFetcher = useAuthFetcher();
  const { id: courseId, reflectionId } = Route.useParams();
  const { currentUserId } = useAuth();

  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: () => authFetcher<User>(`/users/${currentUserId}`),
    enabled: !!currentUserId, // Don't fetch if currentUserId is null
  });

  const {
    data: reflection,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['assignment', reflectionId],
    queryFn: () => authFetcher<Assignment>(`/assignments/${reflectionId}`),
  });

  const { data: allGrades } = useQuery({
    queryKey: ['grades'],
    queryFn: () => authFetcher<Array<Grade>>('/grades'),
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading reflection..." />;
  }

  if (error || !reflection) {
    return (
      <ErrorMessage
        error={error || new Error('Reflection not found')}
        title="Error Loading Reflection"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const submission = reflection.submissions.find(
    (s) => s.studentId === currentUserId,
  );
  const grade = allGrades?.find((g) => g.submissionId === submission?.id);
  const template = reflection.reflectionTemplate;

  return (
    <>
        {/* Breadcrumbs */}
        <div
          style={{
            marginBottom: '2rem',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}
        >
          <Link
            to={ROUTES.courseReflections(courseId)}
            style={{ color: COLORS.purple[500], textDecoration: 'none' }}
          >
            ← Back to Reflections
          </Link>
        </div>

        {/* Reflection Header */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem',
            }}
          >
            💭 {reflection.title}
          </h1>
          <p
            style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              marginBottom: '1rem',
            }}
          >
            {reflection.description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Due: {new Date(reflection.dueDate).toLocaleDateString()}
            </span>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Points: {reflection.maxPoints}
            </span>
            {grade && (
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#15803d',
                }}
              >
                Grade: {grade.score}/{grade.maxScore}
              </span>
            )}
          </div>
        </div>

        {/* Reflection Prompts */}
        {template && (
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
                marginBottom: '1.5rem',
              }}
            >
              Reflection Prompts
            </h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {template.prompts.map((prompt, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#7c3aed',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Prompt {idx + 1}
                  </div>
                  <div
                    style={{
                      fontSize: '1rem',
                      color: '#374151',
                      lineHeight: 1.6,
                    }}
                  >
                    {prompt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submission/Response Section */}
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
              Your Response
            </h2>
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '0.5rem',
                border: '1px solid #86efac',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#15803d',
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
                    color: '#166534',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {submission.content}
                </div>
              )}
            </div>
            {grade && grade.feedback && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#dbeafe',
                  borderRadius: '0.5rem',
                  border: '1px solid #93c5fd',
                }}
              >
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1e40af',
                    marginBottom: '0.5rem',
                  }}
                >
                  Instructor Feedback:
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    color: '#1e3a8a',
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
              Complete Your Reflection
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              You haven't submitted a response to this reflection yet.
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                fontStyle: 'italic',
              }}
            >
              Reflection form interface to be implemented
            </p>
          </div>
        )}
    </>
  );
}
