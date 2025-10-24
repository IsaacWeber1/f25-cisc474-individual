import { createContext, useContext } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthFetcher } from '../integrations/authFetcher';
import type { ReactNode } from 'react';
import type { User } from '../types/api';

interface AuthContextType {
  currentUser: User | null;
  currentUserId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: auth0Loading, user } = useAuth0();
  const authFetch = useAuthFetcher();

  console.log('[AuthContext] Auth0 state:', { isAuthenticated, isLoading: auth0Loading, hasUser: !!user });
  console.log('[AuthContext] Auth0 user object:', user);

  // Fetch current user from backend /users/me
  // IMPORTANT: Wait for Auth0 to finish loading AND have a user object before fetching
  const {
    data: currentUser,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ['currentUser', user?.sub],
    queryFn: () => {
      console.log('[AuthContext] Building query params with:', {
        email: user?.email,
        name: user?.name,
        email_verified: user?.email_verified
      });
      const params = new URLSearchParams();
      if (user?.email) params.append('email', user.email);
      if (user?.name) params.append('name', user.name);
      if (user?.email_verified !== undefined) {
        params.append('emailVerified', user.email_verified.toString());
      }
      const url = `/users/me?${params.toString()}`;
      console.log('[AuthContext] Fetching:', url);
      return authFetch<User>(url);
    },
    // Only fetch if:
    // 1. Auth0 has finished loading (!auth0Loading)
    // 2. User is authenticated (isAuthenticated)
    // 3. User object is available (!!user)
    enabled: !auth0Loading && isAuthenticated && !!user,
    retry: false,
  });

  const value = {
    currentUser: currentUser || null,
    currentUserId: currentUser?.id || null,
    isLoading: auth0Loading || userLoading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId || !audience) {
    throw new Error('Auth0 environment variables are not configured');
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/home` : undefined,
        audience: audience,
        scope: 'openid profile email'
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <AuthContextProvider>{children}</AuthContextProvider>
    </Auth0Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
