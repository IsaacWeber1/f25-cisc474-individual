import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS, COLORS, TYPOGRAPHY } from '../config/constants';

interface Grade {
  id: string;
  score: number;
  maxScore: number;
  feedback: string | null;
  gradedAt: Date;
}

interface Submission {
  id: string;
  type: 'FILE' | 'TEXT' | 'REFLECTION';
  status: 'DRAFT' | 'SUBMITTED' | 'GRADED' | 'LATE';
  submittedAt: Date | null;
  content: string | null;
  files: Array<File> | null;
}

interface Assignment {
  id: string;
  title: string;
  type: 'FILE' | 'TEXT' | 'REFLECTION';
  maxPoints: number;
  dueDate: Date;
}

interface GradingInterfaceProps {
  assignment: Assignment;
  submission: Submission;
  grade: Grade | null;
  currentUserId: string;
  onGradeUpdate?: () => void;
}

export default function GradingInterface({
  assignment,
  submission,
  grade,
  currentUserId,
  onGradeUpdate,
}: GradingInterfaceProps) {
  const [score, setScore] = useState(grade?.score.toString() || '');
  const [feedback, setFeedback] = useState(grade?.feedback || '');
  const queryClient = useQueryClient();

  const createGradeMutation = useMutation({
    mutationFn: async (gradeData: {
      submissionId: string;
      gradedById: string;
      score: number;
      maxScore: number;
      feedback?: string;
    }) => {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradeData),
      });
      if (!response.ok) throw new Error('Failed to create grade');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      alert('Grade saved successfully!');
      if (onGradeUpdate) onGradeUpdate();
    },
  });

  const updateGradeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { score: number; maxScore: number; feedback?: string } }) => {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/grades/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update grade');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      alert('Grade updated successfully!');
      if (onGradeUpdate) onGradeUpdate();
    },
  });

  const handleSubmitGrade = () => {
    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > assignment.maxPoints) {
      alert(`Score must be between 0 and ${assignment.maxPoints}`);
      return;
    }

    const gradeData = {
      score: scoreNum,
      maxScore: assignment.maxPoints,
      feedback: feedback.trim() || undefined,
    };

    if (grade) {
      updateGradeMutation.mutate({ id: grade.id, data: gradeData });
    } else {
      createGradeMutation.mutate({
        submissionId: submission.id,
        gradedById: currentUserId,
        ...gradeData,
      });
    }
  };

  const isSubmitting = createGradeMutation.isPending || updateGradeMutation.isPending;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2
        style={{
          fontSize: TYPOGRAPHY.sizes['2xl'],
          fontWeight: TYPOGRAPHY.weights.bold,
          color: COLORS.gray[900],
          marginBottom: '1.5rem',
        }}
      >
        {grade ? 'Edit Grade' : 'Grade Submission'}
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3
          style={{
            fontSize: TYPOGRAPHY.sizes.lg,
            fontWeight: TYPOGRAPHY.weights.semibold,
            color: COLORS.gray[800],
            marginBottom: '1rem',
          }}
        >
          Submission Content
        </h3>
        <div
          style={{
            backgroundColor: COLORS.gray[50],
            padding: '1rem',
            borderRadius: '0.5rem',
            border: `1px solid ${COLORS.gray[200]}`,
            whiteSpace: 'pre-wrap',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {submission.content || 'No content provided'}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: TYPOGRAPHY.sizes.sm,
            fontWeight: TYPOGRAPHY.weights.medium,
            color: COLORS.gray[700],
            marginBottom: '0.5rem',
          }}
        >
          Score (out of {assignment.maxPoints})
        </label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          min={0}
          max={assignment.maxPoints}
          step={0.5}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${COLORS.gray[300]}`,
            borderRadius: '0.5rem',
            fontSize: TYPOGRAPHY.sizes.base,
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: TYPOGRAPHY.sizes.sm,
            fontWeight: TYPOGRAPHY.weights.medium,
            color: COLORS.gray[700],
            marginBottom: '0.5rem',
          }}
        >
          Feedback (optional)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={6}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${COLORS.gray[300]}`,
            borderRadius: '0.5rem',
            fontSize: TYPOGRAPHY.sizes.base,
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      </div>

      <button
        onClick={handleSubmitGrade}
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: isSubmitting ? COLORS.gray[400] : COLORS.primary[500],
          color: 'white',
          borderRadius: '0.5rem',
          border: 'none',
          fontSize: TYPOGRAPHY.sizes.base,
          fontWeight: TYPOGRAPHY.weights.medium,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? 'Saving...' : grade ? 'Update Grade' : 'Submit Grade'}
      </button>
    </div>
  );
}
