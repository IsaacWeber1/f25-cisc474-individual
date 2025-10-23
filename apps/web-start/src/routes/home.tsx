import { createFileRoute, Link } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { LogoutButton } from '../components/auth/LogoutButton';

export const Route = createFileRoute('/home')({
  component: Home,
});

function Home() {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome, {user?.name}!
        </h1>

        <div className="mb-8 flex items-center space-x-4">
          {user?.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
          )}
          <div>
            <p className="text-lg text-gray-700">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Email Verified:</strong>{' '}
              {user?.email_verified ? (
                <span className="text-green-600">✓ Yes</span>
              ) : (
                <span className="text-red-600">✗ No</span>
              )}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What would you like to do?
          </h2>
          <div className="space-y-4">
            <Link
              to="/courses"
              className="block px-6 py-3 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Courses
            </Link>
            <Link
              to="/profile"
              className="block px-6 py-3 bg-gray-600 text-white text-center font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
