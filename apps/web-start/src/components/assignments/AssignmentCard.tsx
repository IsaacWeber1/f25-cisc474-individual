/**
 * Assignment Card Component
 *
 * Displays a single assignment with inline edit functionality.
 * Each card manages its own edit state, allowing multiple assignments
 * to be edited simultaneously.
 */

import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { COLORS } from '../../config/constants';
import { useDeleteMutation } from '../../hooks/mutations';
import { AssignmentForm } from './AssignmentForm';
import type { Assignment, Grade } from '../../types/api';
import type { DeleteResponse } from '@repo/api/common';

interface AssignmentCardProps {
  assignment: Assignment;
  courseId: string;
  userRole: string;
  currentUserId: string;
  allGrades?: Array<Grade>;
}

export function AssignmentCard({
  assignment,
  courseId,
  userRole,
  currentUserId,
  allGrades,
}: AssignmentCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Delete mutation with cache invalidation
  const deleteMutation = useDeleteMutation<DeleteResponse>(
    (id) => `/assignments/${id}`,
    {
      invalidateKeys: [
        ['assignments'],
        ['course', courseId],
      ],
    },
  );

  const handleDelete = () => {
    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${assignment.title}"?\n\nThis action cannot be undone.`,
    );

    if (confirmed) {
      deleteMutation.mutate(assignment.id, {
        onSuccess: () => {
          console.log('[AssignmentCard] Assignment deleted successfully');
          // TanStack Query will automatically remove from cache
        },
        onError: (error) => {
          alert(`Failed to delete assignment: ${error.message}`);
        },
      });
    }
  };

  // Helper to get assignment status for current user
  const getAssignmentStatus = () => {
    const submission = assignment.submissions.find(
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

  // If editing, show form instead of card content
  if (isEditing) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
        }}
      >
        <AssignmentForm
          assignment={assignment}
          courseId={courseId}
          onSuccess={() => {
            setIsEditing(false);
            // TanStack Query will automatically refetch due to cache invalidation
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  // Regular card display
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date();
  const status = getAssignmentStatus();
  const typeStyle = getTypeColor(assignment.type);

  // Get grade if exists
  const submission = assignment.submissions.find(
    (s) => s.studentId === currentUserId,
  );
  const grade = allGrades?.find((g) => g.submissionId === submission?.id);

  return (
    <div
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
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Edit & Delete Buttons (for professors/TAs/admins) */}
          {(userRole === 'PROFESSOR' || userRole === 'TA' || userRole === 'ADMIN') && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                disabled={deleteMutation.isPending}
                style={{
                  backgroundColor: deleteMutation.isPending ? COLORS.gray[400] : COLORS.warning[500],
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  border: 'none',
                  cursor: deleteMutation.isPending ? 'not-allowed' : 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                style={{
                  backgroundColor: deleteMutation.isPending ? COLORS.gray[400] : COLORS.error[600],
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  border: 'none',
                  cursor: deleteMutation.isPending ? 'not-allowed' : 'pointer',
                }}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
          <Link
            to="/course/$id/assignments/$assignmentId"
            params={{ id: courseId, assignmentId: assignment.id }}
            style={{
              backgroundColor: COLORS.primary[500],
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              opacity: deleteMutation.isPending ? 0.5 : 1,
              pointerEvents: deleteMutation.isPending ? 'none' : 'auto',
            }}
          >
            View Details →
          </Link>
        </div>
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
}
