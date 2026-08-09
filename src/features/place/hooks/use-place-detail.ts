import { useQuery } from '@tanstack/react-query'
import { getPlaceDetail } from '../api/place-api'

export function usePlaceDetail(placeId: number) {
  return useQuery({
    queryKey: ['places', 'detail', placeId],
    queryFn: () => getPlaceDetail(placeId),
    enabled: Number.isFinite(placeId),
  })
}
