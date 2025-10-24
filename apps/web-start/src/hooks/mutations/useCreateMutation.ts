/**
 * Reusable hook for CREATE (POST) mutations
 *
 * Provides consistent pattern for creating entities with:
 * - Type-safe request/response
 * - Automatic cache invalidation
 * - Error handling
 * - Loading states
 *
 * @example
 * const createAssignment = useCreateMutation<AssignmentResponse, CreateAssignmentDto>(
 *   '/assignments',
 *   [['assignments'], ['course', courseId, 'assignments']]
 * );
 *
 * createAssignment.mutate(
 *   { title: 'HW1', description: '...', courseId: '...' },
 *   {
 *     onSuccess: (data) => console.log('Created:', data),
 *     onError: (error) => console.error('Failed:', error),
 *   }
 * );
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { useAuthFetcher } from '../../integrations/authFetcher';

interface UseCreateMutationOptions {
  /**
   * Query keys to invalidate after successful creation
   * This triggers refetch of stale data
   */
  invalidateKeys?: Array<Array<string | number>>;

  /**
   * Backend URL override (defaults to VITE_BACKEND_URL)
   */
  backendUrl?: string;
}

/**
 * Generic hook for POST requests (entity creation)
 *
 * @param endpoint - API endpoint (e.g., '/assignments')
 * @param options - Configuration options
 * @returns TanStack Query mutation object
 *
 * @template TResponse - Type of the response data
 * @template TVariables - Type of the request body (DTO)
 */
export function useCreateMutation<TResponse, TVariables>(
  endpoint: string,
  options: UseCreateMutationOptions = {},
): UseMutationResult<TResponse, Error, TVariables> {
  const queryClient = useQueryClient();
  const authFetch = useAuthFetcher();
  const { invalidateKeys = [] } = options;

  return useMutation({
    mutationFn: async (data: TVariables): Promise<TResponse> => {
      console.log('[useCreateMutation] POST to:', endpoint);
      console.log('[useCreateMutation] Data:', data);

      const response = await authFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('[useCreateMutation] Success:', response);
      return response as TResponse;
    },

    onSuccess: () => {
      // Invalidate all specified query keys to trigger refetch
      invalidateKeys.forEach((key) => {
        console.log('[useCreateMutation] Invalidating cache key:', key);
        queryClient.invalidateQueries({ queryKey: key });
      });
    },

    onError: (error) => {
      console.error('[useCreateMutation] Mutation failed:', error);
    },
  });
}
