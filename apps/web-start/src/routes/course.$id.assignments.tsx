import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/course/$id/assignments')({
  component: AssignmentsLayout,
});

function AssignmentsLayout() {
  return <Outlet />;
}
