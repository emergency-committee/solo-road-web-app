import { useQuery } from '@tanstack/react-query'
import { getSavedPlaces } from '../api/saved-api'

export function useSavedPlaces(page = 0, size = 20, type?: string) {
  return useQuery({
    queryKey: ['places', 'saved', page, size, type ?? 'all'],
    queryFn: () => getSavedPlaces(page, size, type),
  })
}
