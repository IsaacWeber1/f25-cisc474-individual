import { useAuth0 } from '@auth0/auth0-react';

export function LogoutButton() {
  const { logout, isLoading } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({
          logoutParams: {
            returnTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
        })
      }
      disabled={isLoading}
      className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Loading...' : 'Log Out'}
    </button>
  );
}
