import { useQuery } from '@tanstack/react-query'
import { getMyReviews } from '../api/review-api'

export function useMyReviews(page = 0, size = 20) {
  return useQuery({
    queryKey: ['reviews', 'my', page, size],
    queryFn: () => getMyReviews(page, size),
  })
}
