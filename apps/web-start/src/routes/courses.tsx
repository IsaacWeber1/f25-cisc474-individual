import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { backendFetcher } from '../integrations/fetcher';

export const Route = createFileRoute('/courses')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, refetch, error, isFetching } = useQuery({
    queryKey: ['courses'],
    queryFn: backendFetcher('/courses'),
    initialData: [],
  });

  if (isFetching) return <div>Loading...</div>;

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return <div>Courses: {JSON.stringify(data)}</div>;
}
