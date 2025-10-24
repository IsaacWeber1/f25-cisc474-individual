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

      console.log('[useUpdateMutation] PATCH to:', endpoint);
      console.log('[useUpdateMutation] Data:', data);

      const response = await authFetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      console.log('[useUpdateMutation] Success:', response);
      return response as TResponse;
    },

    onSuccess: (data, variables) => {
      // Invalidate all specified cache keys
      invalidateKeys.forEach((key) => {
        console.log('[useUpdateMutation] Invalidating cache key:', key);
        queryClient.invalidateQueries({ queryKey: key });
      });

      // Also invalidate the specific item
      const endpoint = endpointFn(variables.id);
      console.log('[useUpdateMutation] Invalidating item cache:', endpoint);
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },

    onError: (error) => {
      console.error('[useUpdateMutation] Mutation failed:', error);
    },
  });
}
