/**
 * Reusable hook for DELETE mutations
 *
 * Provides consistent pattern for deleting entities with:
 * - Type-safe response
 * - Automatic cache invalidation
 * - Optimistic updates support
 * - Confirmation handling
 *
 * @example
 * const deleteAssignment = useDeleteMutation<DeleteResponse>(
 *   (id) => `/assignments/${id}`,
 *   [['assignments'], ['course', courseId, 'assignments']]
 * );
 *
 * deleteAssignment.mutate('assignment-id-123', {
 *   onSuccess: () => console.log('Deleted successfully'),
 * });
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import type { DeleteResponse } from '@repo/api/common';
import { useAuthFetcher } from '../../integrations/authFetcher';

interface UseDeleteMutationOptions {
  /**
   * Query keys to invalidate after successful deletion
   */
  invalidateKeys?: Array<Array<string | number>>;

  /**
   * Backend URL override
   */
  backendUrl?: string;

  /**
   * Whether to optimistically remove from cache before request completes
   * Use with caution - if request fails, UI will be out of sync
   */
  optimistic?: boolean;
}

/**
 * Generic hook for DELETE requests
 *
 * @param endpointFn - Function that takes ID and returns endpoint URL
 * @param options - Configuration options
 * @returns TanStack Query mutation object
 *
 * @template TResponse - Type of the response data (usually DeleteResponse)
 */
export function useDeleteMutation<TResponse = DeleteResponse>(
  endpointFn: (id: string) => string,
  options: UseDeleteMutationOptions = {},
): UseMutationResult<TResponse, Error, string> {
  const queryClient = useQueryClient();
  const authFetch = useAuthFetcher();
  const {
    invalidateKeys = [],
    backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
    optimistic = false,
  } = options;

  return useMutation({
    mutationFn: async (id: string): Promise<TResponse> => {
      const endpoint = endpointFn(id);

      console.log('[useDeleteMutation] DELETE to:', endpoint);

      const response = await authFetch(endpoint, {
        method: 'DELETE',
      });

      console.log('[useDeleteMutation] Success:', response);
      return response as TResponse;
    },

    onMutate: async (id: string) => {
      if (optimistic) {
        // Cancel outgoing refetches to avoid overwriting optimistic update
        await Promise.all(
          invalidateKeys.map((key) => queryClient.cancelQueries({ queryKey: key })),
        );

        // Snapshot previous values for rollback
        const previousData = invalidateKeys.map((key) => ({
          key,
          data: queryClient.getQueryData(key),
        }));

        console.log('[useDeleteMutation] Optimistic update - removing from cache');

        // Optimistically update cache (remove deleted item from lists)
        invalidateKeys.forEach((key) => {
          queryClient.setQueryData(key, (old: unknown) => {
            if (Array.isArray(old)) {
              return old.filter((item: { id?: string }) => item.id !== id);
            }
            return old;
          });
        });

        return { previousData };
      }
    },

    onError: (error, id, context) => {
      console.error('[useDeleteMutation] Mutation failed:', error);

      // Rollback optimistic update on error
      if (optimistic && context?.previousData) {
        console.log('[useDeleteMutation] Rolling back optimistic update');
        context.previousData.forEach(({ key, data }) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSuccess: (data, id) => {
      // Invalidate all specified cache keys
      invalidateKeys.forEach((key) => {
        console.log('[useDeleteMutation] Invalidating cache key:', key);
        queryClient.invalidateQueries({ queryKey: key });
      });

      // Also remove the specific item from cache
      const endpoint = endpointFn(id);
      console.log('[useDeleteMutation] Removing deleted item from cache:', endpoint);
      queryClient.removeQueries({ queryKey: [endpoint] });
    },
  });
}
