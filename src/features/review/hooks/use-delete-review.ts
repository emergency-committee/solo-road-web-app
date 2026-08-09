import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteReview } from '../api/review-api'

export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews', 'my'] })
    },
  })
}
