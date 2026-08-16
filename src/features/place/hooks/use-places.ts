import { useQuery } from '@tanstack/react-query'
import { getPlaces } from '../api/place-api'
import type { ApiPlacesParams } from '../types/place.types'

export function usePlaces(params: ApiPlacesParams = {}) {
  return useQuery({
    queryKey: ['places', 'list', params],
    queryFn: () => getPlaces(params),
  })
}
