import { apiRequest } from '@/shared/api/client'
import { API_PREFIX } from '@/shared/api/config'
import { buildQueryString } from '@/shared/api/query-string'
import type { PageResponse } from '@/shared/api/types'
import type {
  ApiLikeResponse,
  ApiPlaceDetail,
  ApiPlaceRecommendations,
  ApiPlacesParams,
  ApiPlaceSummary,
  ApiReview,
} from '../types/place.types'

export interface PlaceRecommendationsParams {
  lat?: number
  lng?: number
  section?: string
}

export function getPlaceRecommendations(params: PlaceRecommendationsParams = {}) {
  const qs = buildQueryString({ ...params })
  return apiRequest<ApiPlaceRecommendations>(`${API_PREFIX}/places/recommendations${qs}`)
}

export function getPlaces(params: ApiPlacesParams = {}) {
  const qs = buildQueryString({ ...params })
  return apiRequest<PageResponse<ApiPlaceSummary>>(`${API_PREFIX}/places${qs}`)
}

export function getPlaceDetail(placeId: number) {
  return apiRequest<ApiPlaceDetail>(`${API_PREFIX}/places/${placeId.toString()}`)
}

export function getPlaceReviews(placeId: number, page = 0, size = 20) {
  const qs = buildQueryString({ page, size })
  return apiRequest<PageResponse<ApiReview>>(`${API_PREFIX}/places/${placeId.toString()}/reviews${qs}`)
}

export function likePlace(placeId: number) {
  return apiRequest<ApiLikeResponse>(`${API_PREFIX}/places/${placeId.toString()}/like`, {
    method: 'POST',
  })
}

export function unlikePlace(placeId: number) {
  return apiRequest<ApiLikeResponse>(`${API_PREFIX}/places/${placeId.toString()}/like`, {
    method: 'DELETE',
  })
}
