import { useAuth0 } from '@auth0/auth0-react';

export function LoginButton() {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      disabled={isLoading}
      className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Loading...' : 'Log In'}
    </button>
  );
}
