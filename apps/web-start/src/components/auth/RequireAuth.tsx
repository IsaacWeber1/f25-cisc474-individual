import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from '@tanstack/react-router';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { ReactNode } from 'react';

interface RequireAuthProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Route guard component that requires authentication.
 * Redirects to login page if user is not authenticated.
 * Shows loading state while authentication is being determined.
 */
export function RequireAuth({ children, redirectTo = '/login' }: RequireAuthProps) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // Show loading state while Auth0 determines authentication status
  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Use Auth0's loginWithRedirect to trigger the login flow
    // This will redirect to Auth0 and back to the current page after login
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
    });
    return <LoadingSpinner message="Redirecting to login..." />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}