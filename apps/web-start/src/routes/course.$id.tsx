import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthFetcher } from '../integrations/authFetcher';
import { useAuth } from '../contexts/AuthContext';
import { PageLayout } from '../components/common/PageLayout';
import type { User } from '../types/api';

export const Route = createFileRoute('/course/$id')({
  component: CourseLayout,
});

function CourseLayout() {
  const authFetcher = useAuthFetcher();
  const { currentUserId } = useAuth();

  // Fetch current user for navigation
  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: () => authFetcher<User>(`/users/${currentUserId}`),
  });

  return (
    <PageLayout currentUser={currentUser}>
      <Outlet />
    </PageLayout>
  );
}
