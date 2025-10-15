/**
 * Assignment Form Component
 *
 * Handles both creating and editing assignments with validation.
 * Uses Phase 1 infrastructure (DTOs, mutations, validation).
 *
 * Architecture:
 * - Uses useCreateMutation/useUpdateMutation from Phase 1
 * - TanStack Query manages loading/error states
 * - Automatic cache invalidation on success
 * - No manual fetch calls
 */

import { useState } from 'react';
import { useCreateMutation, useUpdateMutation } from '../../hooks/mutations';
import { COLORS } from '../../config/constants';
import type {
  AssignmentResponse,
  CreateAssignmentDto,
  UpdateAssignmentDto,
} from '@repo/api/assignments';

interface AssignmentFormProps {
  /** Assignment to edit (if undefined, creates new) */
  assignment?: AssignmentResponse;
  /** Course ID (required for create) */
  courseId?: string;
  /** Callback when form is submitted successfully */
  onSuccess?: (assignment: AssignmentResponse) => void;
  /** Callback to cancel/close form */
  onCancel?: () => void;
}

export function AssignmentForm({
  assignment,
  courseId,
  onSuccess,
  onCancel,
}: AssignmentFormProps) {
  const isEdit = !!assignment;

  // Form state
  const [title, setTitle] = useState(assignment?.title || '');
  const [description, setDescription] = useState(assignment?.description || '');
  const [type, setType] = useState<'FILE' | 'TEXT' | 'REFLECTION'>(
    assignment?.type || 'TEXT',
  );
  const [maxPoints, setMaxPoints] = useState(assignment?.maxPoints || 100);
  const [dueDate, setDueDate] = useState(
    assignment?.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : '',
  );
  const [isPublished, setIsPublished] = useState(assignment?.isPublished || false);
  const [instructions, setInstructions] = useState(
    assignment?.instructions?.join('\n') || '',
  );

  // Phase 1 Mutations - TanStack Query manages state and cache
  const createMutation = useCreateMutation<AssignmentResponse, CreateAssignmentDto>(
    '/assignments',
    {
      invalidateKeys: [
        ['assignments'],
        ['course', courseId || ''],
      ],
    },
  );

  const updateMutation = useUpdateMutation<AssignmentResponse, UpdateAssignmentDto>(
    (id) => `/assignments/${id}`,
    {
      invalidateKeys: [
        ['assignments'],
        ['course', courseId || ''],
        ['assignment', assignment?.id || ''],
      ],
    },
  );

  // Use React Query's loading/error states (no manual state needed)
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data
    const instructionsArray = instructions
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (isEdit) {
      // Update existing assignment using Phase 1 mutation hook
      const updateData: UpdateAssignmentDto = {
        title,
        description,
        type,
        maxPoints,
        dueDate: new Date(dueDate).toISOString(),
        instructions: instructionsArray.length > 0 ? instructionsArray : undefined,
        isPublished,
      };

      updateMutation.mutate(
        { id: assignment.id, data: updateData },
        {
          onSuccess: (result) => {
            console.log('[AssignmentForm] Update successful:', result);
            onSuccess?.(result);
          },
        },
      );
    } else {
      // Create new assignment using Phase 1 mutation hook
      if (!courseId) {
        console.error('[AssignmentForm] Course ID is required');
        return;
      }

      const createData: CreateAssignmentDto = {
        title,
        description,
        type,
        maxPoints,
        dueDate: new Date(dueDate).toISOString(),
        instructions: instructionsArray.length > 0 ? instructionsArray : undefined,
        isPublished,
        courseId,
      };

      createMutation.mutate(createData, {
        onSuccess: (result) => {
          console.log('[AssignmentForm] Create successful:', result);
          onSuccess?.(result);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '20px', color: COLORS.gray[800] }}>
        {isEdit ? 'Edit Assignment' : 'Create New Assignment'}
      </h3>

      {error && (
        <div
          style={{
            padding: '12px',
            marginBottom: '20px',
            backgroundColor: COLORS.error[100],
            border: `1px solid ${COLORS.error[300]}`,
            borderRadius: '4px',
            color: COLORS.error[700],
          }}
        >
          {error.message || 'An error occurred'}
        </div>
      )}

      {/* Title */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, color: COLORS.gray[700] }}>
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `2px solid ${COLORS.gray[300]}`,
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = COLORS.primary[500])}
          onBlur={(e) => (e.target.style.borderColor = COLORS.gray[300])}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, color: COLORS.gray[700] }}>
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={10000}
          rows={4}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `2px solid ${COLORS.gray[300]}`,
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s',
            resize: 'vertical',
          }}
          onFocus={(e) => (e.target.style.borderColor = COLORS.primary[500])}
          onBlur={(e) => (e.target.style.borderColor = COLORS.gray[300])}
        />
      </div>

      {/* Type */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, color: COLORS.gray[700] }}>
          Type *
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'FILE' | 'TEXT' | 'REFLECTION')}
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `2px solid ${COLORS.gray[300]}`,
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = COLORS.primary[500])}
          onBlur={(e) => (e.target.style.borderColor = COLORS.gray[300])}
        >
          <option value="TEXT">Text</option>
          <option value="FILE">File Upload</option>
          <option value="REFLECTION">Reflection</option>
        </select>
      </div>

      {/* Max Points & Due Date (side by side) */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, color: COLORS.gray[700] }}>
            Max Points *
          </label>
          <input
            type="number"
            value={maxPoints}
            onChange={(e) => setMaxPoints(parseInt(e.target.value))}
            required
            min={0}
            max={1000}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `2px solid ${COLORS.gray[300]}`,
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = COLORS.primary[500])}
            onBlur={(e) => (e.target.style.borderColor = COLORS.gray[300])}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, color: COLORS.gray[700] }}>
            Due Date *
          </label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `2px solid ${COLORS.gray[300]}`,
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = COLORS.primary[500])}
            onBlur={(e) => (e.target.style.borderColor = COLORS.gray[300])}
          />
        </div>
      </div>

      {/* Instructions (optional) */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, color: COLORS.gray[700] }}>
          Instructions (optional, one per line)
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={3}
          placeholder="Write clear instructions..."
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `2px solid ${COLORS.gray[300]}`,
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s',
            resize: 'vertical',
          }}
          onFocus={(e) => (e.target.style.borderColor = COLORS.primary[500])}
          onBlur={(e) => (e.target.style.borderColor = COLORS.gray[300])}
        />
      </div>

      {/* Is Published */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Publish assignment (make visible to students)
        </label>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 24px',
            backgroundColor: isSubmitting ? COLORS.gray[400] : COLORS.primary[500],
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Assignment' : 'Create Assignment'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              padding: '10px 24px',
              backgroundColor: 'transparent',
              color: COLORS.gray[700],
              border: `1px solid ${COLORS.gray[300]}`,
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
