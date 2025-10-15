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
  const { invalidateKeys = [], backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000' } = options;

  return useMutation({
    mutationFn: async (data: TVariables): Promise<TResponse> => {
      const url = `${backendUrl}${endpoint}`;

      console.log('[useCreateMutation] POST to:', url);
      console.log('[useCreateMutation] Data:', data);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Request failed: ${response.status} ${response.statusText}`;

        try {
          const errorJson = JSON.parse(errorBody);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          // Error body wasn't JSON, use default message
        }

        console.error('[useCreateMutation] Error:', errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('[useCreateMutation] Success:', result);
      return result as TResponse;
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
