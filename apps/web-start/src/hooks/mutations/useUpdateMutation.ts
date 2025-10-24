/**
 * Reusable hook for UPDATE (PATCH) mutations
 *
 * Provides consistent pattern for updating entities with:
 * - Type-safe request/response
 * - Automatic cache invalidation
 * - Optimistic updates support
 * - Error handling
 *
 * @example
 * const updateAssignment = useUpdateMutation<AssignmentResponse, UpdateAssignmentDto>(
 *   (id) => `/assignments/${id}`,
 *   [['assignments'], ['assignment', assignmentId]]
 * );
 *
 * updateAssignment.mutate(
 *   { id: '123', data: { title: 'Updated Title' } },
 *   {
 *     onSuccess: (data) => console.log('Updated:', data),
 *   }
 * );
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { useAuthFetcher } from '../../integrations/authFetcher';

interface UpdateMutationVariables<TData> {
  id: string;
  data: TData;
}

interface UseUpdateMutationOptions {
  /**
   * Query keys to invalidate after successful update
   */
  invalidateKeys?: Array<Array<string | number>>;

  /**
   * Backend URL override
   */
  backendUrl?: string;
}

/**
 * Generic hook for PATCH requests (entity updates)
 *
 * @param endpointFn - Function that takes ID and returns endpoint URL
 * @param options - Configuration options
 * @returns TanStack Query mutation object
 *
 * @template TResponse - Type of the response data
 * @template TData - Type of the update data (partial DTO)
 */
export function useUpdateMutation<TResponse, TData>(
  endpointFn: (id: string) => string,
  options: UseUpdateMutationOptions = {},
): UseMutationResult<TResponse, Error, UpdateMutationVariables<TData>> {
  const queryClient = useQueryClient();
  const authFetch = useAuthFetcher();
  const { invalidateKeys = [], backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000' } = options;

  return useMutation({
    mutationFn: async ({ id, data }: UpdateMutationVariables<TData>): Promise<TResponse> => {
      const endpoint = endpointFn(id);
      const url = `${backendUrl}${endpoint}`;

      console.log('[useUpdateMutation] PATCH to:', url);
      console.log('[useUpdateMutation] Data:', data);

      const response = await authFetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Update failed: ${response.status} ${response.statusText}`;

        try {
          const errorJson = JSON.parse(errorBody);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          // Error body wasn't JSON
        }

        console.error('[useUpdateMutation] Error:', errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('[useUpdateMutation] Success:', result);
      return result as TResponse;
    },

    onSuccess: (data, variables) => {
      // Invalidate specified cache keys
      invalidateKeys.forEach((key) => {
        console.log('[useUpdateMutation] Invalidating cache key:', key);
        queryClient.invalidateQueries({ queryKey: key });
      });

      // Also invalidate the specific item that was updated
      console.log('[useUpdateMutation] Invalidating updated item cache');
      const endpoint = endpointFn(variables.id);
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },

    onError: (error) => {
      console.error('[useUpdateMutation] Mutation failed:', error);
    },
  });
}
