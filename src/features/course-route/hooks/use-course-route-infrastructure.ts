import { useQuery } from '@tanstack/react-query'
import {
  getCourseRouteCctv,
  getCourseRouteLights,
  getCourseRoutePolice,
} from '../api/course-route-api'
import type { MapBounds } from '../types/course-route.types'

export function useCourseRouteInfrastructure(
  bounds: MapBounds | null,
  options: { showLights: boolean; showCctv: boolean; showPolice: boolean },
) {
  const bboxKey = bounds
    ? [bounds.minLng, bounds.minLat, bounds.maxLng, bounds.maxLat].map(roundBounds)
    : null

  const lights = useQuery({
    queryKey: ['course-route', 'lights', bboxKey],
    queryFn: () => getCourseRouteLights(bounds!),
    enabled: bounds !== null && options.showLights,
    staleTime: 1000 * 60 * 5,
  })

  const cctv = useQuery({
    queryKey: ['course-route', 'cctv', bboxKey],
    queryFn: () => getCourseRouteCctv(bounds!),
    enabled: bounds !== null && options.showCctv,
    staleTime: 1000 * 60 * 5,
  })

  const police = useQuery({
    queryKey: ['course-route', 'police', bboxKey],
    queryFn: () => getCourseRoutePolice(bounds!),
    enabled: bounds !== null && options.showPolice,
    staleTime: 1000 * 60 * 5,
  })

  return {
    lights: lights.data ?? [],
    cctv: cctv.data ?? [],
    police: police.data ?? [],
  }
}

function roundBounds(value: number): number {
  return Math.round(value * 10_000) / 10_000
}
