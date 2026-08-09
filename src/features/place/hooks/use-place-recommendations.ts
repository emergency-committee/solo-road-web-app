import { useQuery } from '@tanstack/react-query'
import { getPlaceRecommendations, type PlaceRecommendationsParams } from '../api/place-api'

export function usePlaceRecommendations(params: PlaceRecommendationsParams = {}) {
  return useQuery({
    queryKey: ['places', 'recommendations', params],
    queryFn: () => getPlaceRecommendations(params),
  })
}
