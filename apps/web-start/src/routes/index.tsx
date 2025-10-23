import { Link, createFileRoute } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from '../components/auth/LoginButton';
import { COLORS, TYPOGRAPHY } from '../config/constants';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome Back!
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            You're already logged in. Ready to continue?
          </p>
          <div className="space-y-4">
            <Link
              to="/home"
              className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <br />
            <Link
              to="/courses"
              className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              View Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Course Management System
          </h1>
          <p className="text-xl text-gray-700">
            Manage your courses, assignments, and submissions all in one place.
          </p>
        </div>

        <div className="mb-8">
          <LoginButton />
        </div>

        <div className="text-sm text-gray-600">
          <p>Powered by Auth0 + NestJS + TanStack</p>
        </div>
      </div>
    </div>
  );
}
