'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGrade, updateGrade } from '../_lib/apiClient';

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
  files: File[] | null;
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

export default function GradingInterface({ assignment, submission, grade, currentUserId, onGradeUpdate }: GradingInterfaceProps) {
  const [score, setScore] = useState(grade?.score?.toString() || '');
  const [feedback, setFeedback] = useState(grade?.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmitGrade = async () => {
    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > assignment.maxPoints) {
      alert(`Score must be between 0 and ${assignment.maxPoints}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const gradeData = {
        score: scoreNum,
        maxScore: assignment.maxPoints,
        feedback: feedback.trim() || undefined,
      };

      let result;
      if (grade) {
        // Update existing grade
        result = await updateGrade(grade.id, gradeData);
      } else {
        // Create new grade
        result = await createGrade({
          submissionId: submission.id,
          gradedById: currentUserId,
          ...gradeData,
        });
      }

      alert('Grade saved successfully!');
      if (onGradeUpdate) onGradeUpdate();
      router.refresh();

      console.log('Grade submission successful:', result);
    } catch (error) {
      console.error('Grading error:', error);
      alert('Failed to save grade. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginTop: '1rem'
    }}>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#111827',
        marginBottom: '1rem'
      }}>
        Grade Submission
      </h3>

      {/* Submission Content Preview */}
      {submission.content && (
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Student Submission:
          </h4>
          <p style={{
            fontSize: '0.875rem',
            color: '#4b5563',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap'
          }}>
            {submission.content}
          </p>
        </div>
      )}

      {/* Files Display */}
      {submission.files && Array.isArray(submission.files) && submission.files.length > 0 && (
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Submitted Files:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {submission.files.map((file, index) => (
              <span key={index} style={{
                fontSize: '0.875rem',
                color: '#2563eb',
                textDecoration: 'underline'
              }}>
                📁 {file.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grading Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Score (out of {assignment.maxPoints} points):
          </label>
          <input
            type="number"
            min="0"
            max={assignment.maxPoints}
            step="0.5"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            style={{
              width: '150px',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
            placeholder={`0-${assignment.maxPoints}`}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Feedback (optional):
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Provide feedback for the student..."
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={handleSubmitGrade}
            disabled={isSubmitting || !score.trim()}
            style={{
              backgroundColor: !score.trim() ? '#9ca3af' : '#15803d',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontWeight: 500,
              cursor: !score.trim() ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Saving...' : (grade ? 'Update Grade' : 'Submit Grade')}
          </button>

          {grade && (
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Last updated: {new Date(grade.gradedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}