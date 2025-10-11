import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { backendFetcher } from '../integrations/fetcher';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import type { Assignment, Grade, User } from '../types/api';

export const Route = createFileRoute('/course/$id/reflections/$reflectionId')({
  component: ReflectionDetailPage,
});

function ReflectionDetailPage() {
  const { id: courseId, reflectionId } = Route.useParams();
  const { currentUserId } = useAuth();

  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: backendFetcher<User>(`/users/${currentUserId}`),
  });

  const {
    data: reflection,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['assignment', reflectionId],
    queryFn: backendFetcher<Assignment>(`/assignments/${reflectionId}`),
  });

  const { data: allGrades } = useQuery({
    queryKey: ['grades'],
    queryFn: backendFetcher<Array<Grade>>('/grades'),
  });

  if (isLoading) {
    return (
      <>
        <Navigation currentUser={currentUser || null} />
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-block',
                width: '3rem',
                height: '3rem',
                border: '4px solid #e5e7eb',
                borderTopColor: '#7c3aed',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p
              style={{
                marginTop: '1rem',
                color: '#6b7280',
                fontSize: '1.125rem',
              }}
            >
              Loading reflection...
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </>
    );
  }

  if (error || !reflection) {
    return (
      <>
        <Navigation currentUser={currentUser || null} />
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              maxWidth: '600px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                color: '#dc2626',
              }}
            >
              Error Loading Reflection
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {error instanceof Error ? error.message : 'Reflection not found'}
            </p>
            <Link
              to="/course/$id/reflections"
              params={{ id: courseId }}
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                display: 'inline-block',
              }}
            >
              Back to Reflections
            </Link>
          </div>
        </div>
      </>
    );
  }

  const submission = reflection.submissions?.find(
    (s) => s.studentId === currentUserId,
  );
  const grade = allGrades?.find((g) => g.submissionId === submission?.id);
  const template = reflection.reflectionTemplate;

  return (
    <>
      <Navigation currentUser={currentUser || null} />
      <div
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}
      >
        {/* Breadcrumbs */}
        <div
          style={{
            marginBottom: '2rem',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}
        >
          <Link
            to="/course/$id/reflections"
            params={{ id: courseId }}
            style={{ color: '#7c3aed', textDecoration: 'none' }}
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
      </div>
    </>
  );
}
