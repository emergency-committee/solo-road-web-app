import { useQuery } from '@tanstack/react-query'
import { navigateCourseLeg } from '../api/course-route-api'
import type { Coordinate } from '../types/course-route.types'

export function useCourseLegRoute(origin: Coordinate, destination: Coordinate) {
  return useQuery({
    queryKey: ['course-leg-route', origin.lat, origin.lng, destination.lat, destination.lng],
    queryFn: () => navigateCourseLeg(origin, destination),
    staleTime: 1000 * 60 * 10,
  })
}
