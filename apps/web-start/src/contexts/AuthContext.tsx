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
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const authFetch = useAuthFetcher();

  // Fetch current user from backend /users/me
  const {
    data: currentUser,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authFetch<User>('/users/me'),
    enabled: isAuthenticated, // Only fetch if authenticated
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
