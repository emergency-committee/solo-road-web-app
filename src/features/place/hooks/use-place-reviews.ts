import { useQuery } from '@tanstack/react-query'
import { getPlaceReviews } from '../api/place-api'

export function usePlaceReviews(placeId: number, page = 0, size = 20) {
  return useQuery({
    queryKey: ['places', 'reviews', placeId, page, size],
    queryFn: () => getPlaceReviews(placeId, page, size),
    enabled: Number.isFinite(placeId),
  })
}
