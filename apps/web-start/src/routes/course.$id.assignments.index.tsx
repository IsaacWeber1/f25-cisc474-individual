import { useState } from 'react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthFetcher } from '../integrations/authFetcher';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { AssignmentForm } from '../components/assignments/AssignmentForm';
import { AssignmentCard } from '../components/assignments/AssignmentCard';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import type { Course, Grade, User } from '../types/api';

export const Route = createFileRoute('/course/$id/assignments/')({
  component: AssignmentsListPage,
});

function AssignmentsListPage() {
  const authFetcher = useAuthFetcher();
  const { id: courseId } = Route.useParams();
  const { currentUserId } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch current user
  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: () => authFetcher<User>(`/users/${currentUserId}`),
  });

  // Fetch course with assignments
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => authFetcher<Course>(`/courses/${courseId}`),
  });

  // Fetch all grades to determine submission status
  const { data: allGrades } = useQuery({
    queryKey: ['grades'],
    queryFn: () => authFetcher<Array<Grade>>('/grades'),
    enabled: !!currentUser,
  });

  const assignments = course?.assignments || [];

  // Get user's role in this course
  const userRole =
    currentUser?.enrollments.find((e) => e.courseId === courseId)?.role ||
    'STUDENT';

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
    <>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
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

        {/* Create Assignment Button (for professors/TAs) */}
        {(userRole === 'PROFESSOR' || userRole === 'TA' || userRole === 'ADMIN') && !showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: COLORS.primary[500],
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            + Create Assignment
          </button>
        )}
      </div>

      {/* Create Assignment Form */}
      {showCreateForm && (
        <div style={{
          marginBottom: '2rem',
          padding: '24px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: `1px solid ${COLORS.gray[200]}`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
          <AssignmentForm
            courseId={courseId}
            onSuccess={() => {
              setShowCreateForm(false);
              // TanStack Query will automatically refetch due to cache invalidation
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Assignments List */}
      {sortedAssignments.length > 0 ? (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {sortedAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              courseId={courseId}
              userRole={userRole}
              currentUserId={currentUserId}
              allGrades={allGrades}
            />
          ))}
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
    </>
  );
}
