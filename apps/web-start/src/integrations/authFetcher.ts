import { useAuth0 } from '@auth0/auth0-react';

/**
 * Auth-aware backend fetcher hook
 * Automatically includes JWT token in requests
 */
export function useAuthFetcher() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return async function authFetch<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const url = backendUrl + endpoint;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    // Add JWT token if authenticated
    if (isAuthenticated) {
      try {
        const token = await getAccessTokenSilently();
        headers['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('[authFetcher] Failed to get access token:', error);
        throw new Error('Authentication required');
      }
    }

    console.log('[authFetcher] Making request to:', url);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: options?.signal || AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[authFetcher] ${response.status} error for ${url}: ${errorText}`,
      );
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  };
}
