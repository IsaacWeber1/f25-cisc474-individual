/**
 * Backend API fetcher with retry logic for Render.com spin-up and network errors.
 *
 * This function returns a query function compatible with TanStack Query.
 * Promises are resolved by TanStack Query at the component level, not in the backend.
 *
 * Features:
 * - Automatic retry on 502 errors (Render.com backend spinning up)
 * - Automatic retry on network errors
 * - Exponential backoff for retries
 * - 10 second timeout per request
 * - Detailed logging for debugging
 */
export function backendFetcher<T>(
  endpoint: string,
  retryCount = 0,
): () => Promise<T> {
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds base delay

  return async () => {
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const url = backendUrl + endpoint;

    console.log('[fetcher] Backend URL:', backendUrl);
    console.log(
      `[fetcher] Making request to: ${url}${retryCount > 0 ? ` (retry ${retryCount}/${maxRetries})` : ''}`,
    );

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        // 10 second timeout (increased for Render.com spin-up)
        signal: AbortSignal.timeout(10000),
      });

      // Handle 502 Bad Gateway (Render.com spinning up)
      if (response.status === 502 && retryCount < maxRetries) {
        const delay = retryDelay * (retryCount + 1); // Exponential backoff
        console.log(
          `[fetcher] 502 error (backend starting up). Retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return backendFetcher<T>(endpoint, retryCount + 1)();
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[fetcher] ${response.status} error for ${url}: ${errorText}`,
        );
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Retry on network errors (CORS issues during Render spin-up)
      if (
        error instanceof TypeError &&
        error.message.includes('fetch') &&
        retryCount < maxRetries
      ) {
        const delay = retryDelay * (retryCount + 1);
        console.log(
          `[fetcher] Network error (possible backend spin-up). Retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return backendFetcher<T>(endpoint, retryCount + 1)();
      }

      // Log specific error types
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        console.error(`[fetcher] JSON parse error for ${url}:`, error);
      } else if (error instanceof Error && error.name === 'AbortError') {
        console.error(`[fetcher] Request timeout for ${url}`);
      } else {
        console.error(`[fetcher] Request failed for ${url}:`, error);
      }

      throw error;
    }
  };
}
