import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { backendFetcher } from '../integrations/fetcher';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { PageLayout } from '../components/common/PageLayout';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import CourseCard from '../components/CourseCard';
import type { Course, User } from '../types/api';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

/**
 * Dashboard Component
 *
 * Demonstrates promise resolution strategy:
 * - Backend returns promises (via backendFetcher)
 * - TanStack Query resolves promises at component level
 * - Fast UX with loading states and caching
 * - Authentication-ready architecture
 */
function Dashboard() {
  // Get current user ID from AuthContext (centralized auth management)
  const { currentUserId } = useAuth();
  const userId = currentUserId;

  // Query 1: Fetch user data
  // Promise is resolved by TanStack Query, not the backend
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: backendFetcher<User>(`/users/${userId}`),
  });

  // Query 2: Fetch user's courses (runs in parallel)
  // Demonstrates parallel promise resolution for fast UX
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', userId],
    queryFn: async () => {
      // This promise is resolved by TanStack Query
      const userData = await backendFetcher<User>(`/users/${userId}`)();
      return userData.enrollments.map((e) => e.course);
    },
    enabled: !!user, // Only run after user is loaded
  });

  // Loading state - shown while promises are resolving
  if (userLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  // Error state
  if (userError) {
    return <ErrorMessage error={userError} title="Error Loading Dashboard" onRetry={() => window.location.reload()} />;
  }

  // Main dashboard content
  return (
    <PageLayout currentUser={user}>
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: TYPOGRAPHY.sizes['3xl'],
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.gray[900],
              marginBottom: '0.5rem',
            }}
          >
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: COLORS.gray[600] }}>
            Here are your courses for this semester.
          </p>
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: COLORS.success[100],
              border: `1px solid ${COLORS.success[500]}`,
              borderRadius: '0.375rem',
              fontSize: TYPOGRAPHY.sizes.sm,
              color: COLORS.success[700],
            }}
          >
            📊 Data Source: NestJS API via TanStack Query
          </div>
        </div>

        {coursesLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: COLORS.gray[600] }}>Loading courses...</p>
          </div>
        ) : courses && courses.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 0',
            }}
          >
            <div
              style={{
                backgroundColor: COLORS.gray[100],
                borderRadius: '50%',
                width: '6rem',
                height: '6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
            >
              <span
                style={{
                  fontSize: TYPOGRAPHY.sizes['3xl'],
                  color: COLORS.gray[400],
                }}
              >
                📚
              </span>
            </div>
            <h3
              style={{
                fontSize: TYPOGRAPHY.sizes.lg,
                fontWeight: TYPOGRAPHY.weights.medium,
                color: COLORS.gray[900],
                marginBottom: '0.5rem',
              }}
            >
              No courses found
            </h3>
            <p style={{ color: COLORS.gray[600] }}>
              You are not enrolled in any courses yet.
            </p>
          </div>
        )}

        <div
          style={{
            marginTop: '3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.primary[50],
              border: `1px solid ${COLORS.primary[100]}`,
              borderRadius: '0.5rem',
              padding: '1.5rem',
            }}
          >
            <h3
              style={{
                fontSize: TYPOGRAPHY.sizes.lg,
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.primary[900],
                marginBottom: '0.5rem',
              }}
            >
              Quick Actions
            </h3>
            <div>
              <Link
                to={ROUTES.profile}
                style={{
                  display: 'block',
                  color: COLORS.primary[600],
                  textDecoration: 'none',
                }}
              >
                Update Profile →
              </Link>
            </div>
          </div>

          <div
            style={{
              backgroundColor: COLORS.success[50],
              border: `1px solid ${COLORS.success[100]}`,
              borderRadius: '0.5rem',
              padding: '1.5rem',
            }}
          >
            <h3
              style={{
                fontSize: TYPOGRAPHY.sizes.lg,
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.success[700],
                marginBottom: '0.5rem',
              }}
            >
              Recent Activity
            </h3>
            <p
              style={{
                color: COLORS.success[500],
                fontSize: TYPOGRAPHY.sizes.sm,
              }}
            >
              No recent activity to display.
            </p>
          </div>

          <div
            style={{
              backgroundColor: COLORS.warning[100],
              border: `1px solid ${COLORS.warning[100]}`,
              borderRadius: '0.5rem',
              padding: '1.5rem',
            }}
          >
            <h3
              style={{
                fontSize: TYPOGRAPHY.sizes.lg,
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.warning[700],
                marginBottom: '0.5rem',
              }}
            >
              Upcoming Deadlines
            </h3>
            <p
              style={{
                color: COLORS.warning[500],
                fontSize: TYPOGRAPHY.sizes.sm,
              }}
            >
              No upcoming deadlines.
            </p>
          </div>
        </div>
    </PageLayout>
  );
}
