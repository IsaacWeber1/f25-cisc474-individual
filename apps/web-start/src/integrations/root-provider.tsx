import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * React Query configuration optimized for:
 * - Fast user experience with aggressive caching
 * - Promise resolution at component level (not backend)
 * - Authentication-ready (easy to add auth middleware later)
 * - Minimal refetching to reduce backend load
 */
export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 5 minutes before considering it stale
        staleTime: 1000 * 60 * 5,

        // Keep unused data in cache for 10 minutes
        gcTime: 1000 * 60 * 10,

        // Don't refetch on window focus (prevents unnecessary requests)
        refetchOnWindowFocus: false,

        // Don't refetch on component mount if data exists
        refetchOnMount: false,

        // Retry failed requests once (our fetcher handles additional retries)
        retry: 1,

        // Show cached data while refetching in background
        refetchOnReconnect: 'always',
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
      },
    },
  });

  return {
    queryClient,
  };
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
