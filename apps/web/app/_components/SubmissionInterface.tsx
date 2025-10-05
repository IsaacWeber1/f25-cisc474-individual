'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSubmission, updateSubmission } from '../_lib/apiClient';

interface Submission {
  id: string;
  type: 'FILE' | 'TEXT' | 'REFLECTION';
  status: 'DRAFT' | 'SUBMITTED' | 'GRADED' | 'LATE';
  submittedAt: Date | null;
  content: string | null;
  files: File[] | null;
}

interface Grade {
  id: string;
  score: number;
  maxScore: number;
  feedback: string | null;
  gradedAt: Date;
}

interface Assignment {
  id: string;
  title: string;
  type: 'FILE' | 'TEXT' | 'REFLECTION';
  maxPoints: number;
  dueDate: Date;
}

interface SubmissionInterfaceProps {
  assignment: Assignment;
  submission: Submission | null;
  grade: Grade | null;
  courseId: string;
  currentUserId: string;
}

export default function SubmissionInterface({ assignment, submission, grade, courseId, currentUserId }: SubmissionInterfaceProps) {
  const [content, setContent] = useState(submission?.content || '');
  const [isDraft, setIsDraft] = useState(submission?.status === 'DRAFT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleSubmit = async (asDraft = false) => {
    if (assignment.type === 'TEXT' && !content.trim()) {
      alert('Please enter your submission text before submitting.');
      return;
    }

    if (assignment.type === 'FILE' && !uploadedFile && !submission) {
      alert('Please upload a file before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const status: 'DRAFT' | 'SUBMITTED' = asDraft ? 'DRAFT' : 'SUBMITTED';

      const submissionData = {
        assignmentId: assignment.id,
        studentId: currentUserId,
        type: assignment.type,
        status,
        content: assignment.type === 'TEXT' ? content : undefined,
        files: assignment.type === 'FILE' && uploadedFile ? [uploadedFile.name] : undefined,
      };

      let result;
      if (submission) {
        // Update existing submission
        result = await updateSubmission(submission.id, {
          status,
          content: assignment.type === 'TEXT' ? content : undefined,
          files: assignment.type === 'FILE' && uploadedFile ? [uploadedFile.name] : undefined,
        });
      } else {
        // Create new submission
        result = await createSubmission(submissionData);
      }

      if (!asDraft) {
        alert('Assignment submitted successfully!');
        router.refresh();
      } else {
        alert('Draft saved successfully!');
        setIsDraft(true);
      }

      console.log('Submission successful:', result);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, DOCX, or TXT file.');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return;
    }

    setUploadedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (grade) return; // Can't upload if already graded

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  if (assignment.type === 'TEXT') {
    return (
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Text Submission:
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            backgroundColor: grade ? '#f9fafb' : 'white'
          }}
          placeholder={submission ? 'Your submitted text...' : 'Enter your text submission here...'}
          disabled={!!grade}
        />

        {content.trim() && !grade && (
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginTop: '0.5rem',
            textAlign: 'right'
          }}>
            {content.trim().split(/\s+/).length} words
          </div>
        )}

        {!grade && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || !content.trim()}
              style={{
                backgroundColor: !content.trim() ? '#9ca3af' : '#15803d',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontWeight: 500,
                cursor: !content.trim() ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              {isSubmitting ? 'Submitting...' : (submission ? 'Update Submission' : 'Submit')}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting || !content.trim()}
              style={{
                backgroundColor: !content.trim() ? '#9ca3af' : '#6b7280',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontWeight: 500,
                cursor: !content.trim() ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        )}

        {isDraft && !grade && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#92400e'
          }}>
            💾 Draft saved - remember to submit before the due date!
          </div>
        )}
      </div>
    );
  }

  if (assignment.type === 'FILE') {
    return (
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          File Upload:
        </label>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? '2px dashed #2563eb' : '2px dashed #d1d5db',
            borderRadius: '0.5rem',
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: dragActive ? '#eff6ff' : (grade ? '#f9fafb' : '#f9fafb'),
            cursor: grade ? 'default' : 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => {
            if (!grade) {
              document.getElementById('file-input')?.click();
            }
          }}
        >
          <input
            id="file-input"
            type="file"
            onChange={handleFileInput}
            accept=".pdf,.doc,.docx,.txt"
            style={{ display: 'none' }}
            disabled={!!grade}
          />

          {uploadedFile || submission ? (
            <div>
              <div style={{
                fontSize: '2rem',
                marginBottom: '1rem'
              }}>📁</div>
              <p style={{
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                File: {uploadedFile?.name || (submission?.files?.[0] as File)?.name || 'uploaded-file.pdf'}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {uploadedFile ?
                  `Size: ${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` :
                  `Submitted on ${submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'Unknown'}`
                }
              </p>
              {uploadedFile && !grade && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                  style={{
                    marginTop: '0.5rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ) : (
            <div>
              <div style={{
                fontSize: '2rem',
                marginBottom: '1rem'
              }}>📤</div>
              <p style={{
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Drop files here or click to browse
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Supports PDF, DOC, DOCX, TXT files up to 10MB
              </p>
            </div>
          )}
        </div>

        {(uploadedFile || submission) && !grade && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              style={{
                backgroundColor: '#15803d',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              {isSubmitting ? 'Submitting...' : (submission ? 'Replace & Submit' : 'Upload & Submit')}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Reflection type - redirect to reflection page
  return (
    <div>
      <div style={{
        backgroundColor: '#f3e8ff',
        border: '1px solid #c4b5fd',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>✨</span>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#7c3aed',
            margin: 0
          }}>
            Guided Reflection
          </h3>
        </div>
        <p style={{
          color: '#6d28d9',
          fontSize: '0.875rem',
          margin: 0
        }}>
          This reflection helps you think about your learning progress with personalized prompts and insights.
        </p>
      </div>

      <a
        href={`/course/${courseId}/reflections/${assignment.id}`}
        style={{
          display: 'inline-block',
          backgroundColor: '#7c3aed',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 500,
          fontSize: '1rem'
        }}
      >
        {submission ? 'View Reflection' : 'Start Reflection'} →
      </a>
    </div>
  );
}