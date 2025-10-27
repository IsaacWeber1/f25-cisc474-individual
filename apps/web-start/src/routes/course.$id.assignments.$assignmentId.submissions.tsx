import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthFetcher } from '../integrations/authFetcher';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import GradingInterface from '../components/GradingInterface';
import type { Assignment, Course, Grade, User } from '../types/api';

export const Route = createFileRoute(
  '/course/$id/assignments/$assignmentId/submissions',
)({
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const authFetcher = useAuthFetcher();
  const { id: courseId, assignmentId } = Route.useParams();
  const { currentUserId } = useAuth();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: () => authFetcher<User>(`/users/${currentUserId}`),
    enabled: !!currentUserId, // Don't fetch if currentUserId is null
  });

  const { data: course, error: courseError } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => authFetcher<Course>(`/courses/${courseId}`),
  });

  const {
    data: assignment,
    isLoading: assignmentLoading,
    error: assignmentError,
  } = useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: () => authFetcher<Assignment>(`/assignments/${assignmentId}`),
  });

  const { data: allGrades } = useQuery({
    queryKey: ['grades'],
    queryFn: () => authFetcher<Array<Grade>>('/grades'),
  });

  const { data: allUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => authFetcher<Array<User>>('/users'),
  });

  if (assignmentLoading) {
    return <LoadingSpinner message="Loading submissions..." />;
  }

  if (assignmentError || courseError || !assignment || !course) {
    return (
      <ErrorMessage
        error={assignmentError || courseError || new Error('Not found')}
        title="Error Loading Submissions"
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Check permissions
  const userRole =
    currentUser?.enrollments.find((e) => e.courseId === courseId)?.role || '';
  if (userRole !== 'TA' && userRole !== 'PROFESSOR' && userRole !== 'ADMIN') {
    return (
      <ErrorMessage
        error={new Error("You don't have permission to view submissions")}
        title="Permission Denied"
      />
    );
  }

  // Get submitted submissions
  const submissions = assignment.submissions.filter(
    (s) => s.status === 'SUBMITTED',
  );

  // Create grade map
  const gradeMap: Record<string, Grade | undefined> = {};
  if (allGrades) {
    allGrades.forEach((grade) => {
      gradeMap[grade.submissionId] = grade;
    });
  }

  const selectedSubmission = submissions.find(
    (s) => s.studentId === selectedStudentId,
  );
  const selectedGrade = selectedSubmission
    ? gradeMap[selectedSubmission.id]
    : null;

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to={ROUTES.courseAssignment(courseId, assignmentId)}
          style={{
            color: COLORS.primary[500],
            textDecoration: 'none',
            fontSize: TYPOGRAPHY.sizes.sm,
            marginBottom: '1rem',
            display: 'inline-block',
          }}
        >
          ← Back to Assignment
        </Link>
        <h1
          style={{
            fontSize: TYPOGRAPHY.sizes['3xl'],
            fontWeight: TYPOGRAPHY.weights.bold,
            color: COLORS.gray[900],
            marginBottom: '0.5rem',
          }}
        >
          Grade Submissions: {assignment.title}
        </h1>
        <p style={{ color: COLORS.gray[600], fontSize: TYPOGRAPHY.sizes.base }}>
          {course.code}: {course.title}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Student List */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{
              fontSize: TYPOGRAPHY.sizes.lg,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.gray[900],
              marginBottom: '1rem',
            }}
          >
            Submissions ({submissions.length})
          </h3>

          {submissions.length === 0 ? (
            <p style={{ color: COLORS.gray[600], fontSize: TYPOGRAPHY.sizes.sm }}>
              No submissions yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {submissions.map((submission) => {
                const student = allUsers?.find((u) => u.id === submission.studentId);
                const grade = gradeMap[submission.id];
                const isSelected = selectedStudentId === submission.studentId;

                return (
                  <button
                    key={submission.id}
                    onClick={() => setSelectedStudentId(submission.studentId)}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem',
                      backgroundColor: isSelected
                        ? COLORS.primary[50]
                        : 'white',
                      border: `1px solid ${
                        isSelected ? COLORS.primary[500] : COLORS.gray[200]
                      }`,
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        fontSize: TYPOGRAPHY.sizes.sm,
                        fontWeight: TYPOGRAPHY.weights.medium,
                        color: COLORS.gray[900],
                        marginBottom: '0.25rem',
                      }}
                    >
                      {student?.name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: TYPOGRAPHY.sizes.xs }}>
                      {grade ? (
                        <span style={{ color: COLORS.success[600] }}>
                          Graded: {grade.score}/{grade.maxScore}
                        </span>
                      ) : (
                        <span style={{ color: COLORS.warning[600] }}>
                          Not graded
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Grading Interface */}
        <div>
          {selectedSubmission ? (
            <GradingInterface
              assignment={assignment}
              submission={selectedSubmission}
              grade={selectedGrade || null}
              currentUserId={currentUserId}
              onGradeUpdate={() => {
                // Refresh will happen via query invalidation
              }}
            />
          ) : (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '3rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <p style={{ color: COLORS.gray[600] }}>
                Select a submission to grade
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
