import { apiRequest } from '@/shared/api/client'
import type {
  CctvItem,
  Coordinate,
  LightItem,
  MapBounds,
  NavigateRouteResponse,
  PoliceItem,
} from '../types/course-route.types'

export function navigateCourseLeg(
  origin: Coordinate,
  destination: Coordinate,
): Promise<NavigateRouteResponse> {
  return apiRequest('/api/v1/routes/navigate', {
    method: 'POST',
    body: JSON.stringify({ origin, destination, waypoints: [], safetyPriority: true }),
  })
}

export async function getCourseRouteLights(bounds: MapBounds): Promise<LightItem[]> {
  const response = await apiRequest<{ items: LightItem[] }>(
    `/api/v1/safety/lights?bbox=${encodeURIComponent(toBbox(bounds))}`,
  )
  return response.items
}

export async function getCourseRouteCctv(bounds: MapBounds): Promise<CctvItem[]> {
  const response = await apiRequest<{ items: CctvItem[] }>(
    `/api/v1/safety/cctv?bbox=${encodeURIComponent(toBbox(bounds))}`,
  )
  return response.items
}

export async function getCourseRoutePolice(bounds: MapBounds): Promise<PoliceItem[]> {
  const response = await apiRequest<{ items: PoliceItem[] }>(
    `/api/v1/safety/police?bbox=${encodeURIComponent(toBbox(bounds))}`,
  )
  return response.items
}

function toBbox(bounds: MapBounds): string {
  return [bounds.minLng, bounds.minLat, bounds.maxLng, bounds.maxLat]
    .map((value) => value.toFixed(7))
    .join(',')
}
