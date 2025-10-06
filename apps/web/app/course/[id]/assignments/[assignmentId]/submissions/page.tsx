'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import GradingInterface from '../../../../../_components/GradingInterface';
import {
  getAssignmentById,
  getCurrentUser,
  getUserRole,
  getCourseById,
  getSubmissionsByAssignment,
  getGradeBySubmission,
  getAllUsers
} from '../../../../../_lib/dataProviderClient';

export default function SubmissionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.id as string;
  const assignmentId = params.assignmentId as string;

  const [course, setCourse] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [submissionGrades, setSubmissionGrades] = useState<Record<string, any>>({});
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedStudentId = searchParams.get('student');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parallelize initial data fetching
        const [user, courseData, assignmentData] = await Promise.all([
          getCurrentUser(),
          getCourseById(courseId),
          getAssignmentById(assignmentId)
        ]);

        if (!courseData || !assignmentData) {
          setError('Assignment not found');
          setLoading(false);
          return;
        }

        setCurrentUser(user);
        setCourse(courseData);
        setAssignment(assignmentData);

        // Check user permissions
        const role = await getUserRole(user.id, courseId);
        setUserRole(role);

        if (role !== 'TA' && role !== 'PROFESSOR' && role !== 'ADMIN') {
          setError('You don\'t have permission to view submissions.');
          setLoading(false);
          return;
        }

        // Fetch submissions and users in parallel
        const [submissionsData, usersData] = await Promise.all([
          getSubmissionsByAssignment(assignmentId),
          getAllUsers()
        ]);

        setUsers(usersData);

        // Filter to only submitted assignments
        const submittedSubmissions = submissionsData.filter(sub => sub.status === 'SUBMITTED');
        setSubmissions(submittedSubmissions);

        // Fetch all grades in parallel
        const gradePromises = submittedSubmissions.map(async (submission) => {
          const grade = await getGradeBySubmission(submission.id);
          return { submissionId: submission.id, grade };
        });

        const grades = await Promise.all(gradePromises);
        const gradeMap = grades.reduce((acc, { submissionId, grade }) => {
          acc[submissionId] = grade;
          return acc;
        }, {} as Record<string, any>);
        setSubmissionGrades(gradeMap);

        // If a specific student is selected, find their submission and grade
        if (selectedStudentId) {
          const submission = submittedSubmissions.find(sub => sub.studentId === selectedStudentId);
          setSelectedSubmission(submission || null);

          if (submission) {
            const grade = gradeMap[submission.id];
            setSelectedGrade(grade || null);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('[Submissions Page] Error loading submissions:', err);
        setError('There was an error loading the submissions. Please try again later.');
        setLoading(false);
      }
    };

    if (courseId && assignmentId) {
      fetchData();
    }
  }, [courseId, assignmentId, selectedStudentId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading submissions...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ color: '#dc2626', fontSize: '1.5rem', fontWeight: 600 }}>
          {error.includes('permission') ? 'Access Denied' : 'Error Loading Submissions'}
        </h1>
        <p style={{ color: '#6b7280' }}>{error}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {!error.includes('permission') && (
            <button
              onClick={handleRetry}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          )}
          <Link
            href={`/course/${courseId}/assignments/${assignmentId}`}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Back to Assignment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '1.5rem'
      }}>
        <Link
          href={`/course/${courseId}/assignments`}
          style={{ color: '#2563eb', textDecoration: 'none' }}
        >
          Assignments
        </Link>
        <span style={{ margin: '0 0.5rem' }}>›</span>
        <Link
          href={`/course/${courseId}/assignments/${assignmentId}`}
          style={{ color: '#2563eb', textDecoration: 'none' }}
        >
          {assignment?.title}
        </Link>
        <span style={{ margin: '0 0.5rem' }}>›</span>
        <span>Submissions</span>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Submissions: {assignment?.title}
          </h1>
          <p style={{ color: '#6b7280' }}>
            {submissions.length} submission{submissions.length !== 1 ? 's' : ''} received
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedSubmission ? '1fr 2fr' : '1fr',
        gap: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Student Submissions
          </h2>

          {submissions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {submissions.map((submission) => {
                const student = users.find(u => u.id === submission.studentId);
                const grade = submissionGrades[submission.id];
                const isSelected = submission.studentId === selectedStudentId;

                return (
                  <div
                    key={submission.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Link
                      href={`/course/${courseId}/assignments/${assignmentId}/submissions?student=${submission.studentId}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{
                          fontWeight: 500,
                          color: '#111827'
                        }}>
                          {student?.name || 'Unknown Student'}
                        </span>

                        <span style={{
                          fontSize: '0.75rem',
                          backgroundColor: grade ? '#dcfce7' : '#fef3c7',
                          color: grade ? '#15803d' : '#d97706',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontWeight: 500
                        }}>
                          {grade ? 'Graded' : 'Needs Grading'}
                        </span>
                      </div>

                      <div style={{
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        Submitted: {new Date(submission.submittedAt || '').toLocaleDateString()}
                        {grade && (
                          <span style={{ marginLeft: '1rem' }}>
                            Score: {grade.score}/{grade.maxScore}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#6b7280'
            }}>
              <p>No submissions received yet.</p>
            </div>
          )}
        </div>

        {selectedSubmission && (
          <div>
            <GradingInterface
              assignment={assignment}
              submission={selectedSubmission}
              grade={selectedGrade}
              currentUserId={currentUser?.id}
              onGradeUpdate={() => {
                window.location.reload();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
