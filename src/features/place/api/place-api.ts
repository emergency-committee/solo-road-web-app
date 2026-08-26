import { apiRequest } from '@/shared/api/client'
import { API_PREFIX } from '@/shared/api/config'
import { buildQueryString } from '@/shared/api/query-string'
import { AUTH_MOCK_ENABLED, PLACE_DEMO_ENABLED } from '@/shared/api/config'
import type { PageResponse } from '@/shared/api/types'
import type {
  ApiLikeResponse,
  ApiPlaceDetail,
  ApiPlaceRecommendations,
  ApiPlacesParams,
  ApiPlaceSummary,
  ApiReview,
  ApiReviewTag,
  CreatePlaceReviewRequest,
  CreatePlaceReviewResponse,
} from '../types/place.types'
import {
  createMockPlaceReview,
  getMockPlaceDetail,
  getMockPlaceReviews,
  getMockPlaces,
  isMockPlace,
  mockReviewTags,
  setMockPlaceLiked,
} from '../mocks/place-rating-mocks'

export interface PlaceRecommendationsParams {
  lat?: number
  lng?: number
  section?: string
}

export function getPlaceRecommendations(params: PlaceRecommendationsParams = {}) {
  const qs = buildQueryString({ ...params })
  return apiRequest<ApiPlaceRecommendations>(`${API_PREFIX}/places/recommendations${qs}`)
}

function mergeDemoPlaces(
  response: PageResponse<ApiPlaceSummary>,
  params: ApiPlacesParams,
): PageResponse<ApiPlaceSummary> {
  if ((params.page ?? 0) > 0) return response

  const demoPlaces = getMockPlaces(params).content
  const responseIds = new Set(response.content.map((place) => place.placeId))
  const additionalDemos = demoPlaces.filter((place) => !responseIds.has(place.placeId))
  const content = [...additionalDemos, ...response.content]

  return {
    ...response,
    content,
    totalElements:
      response.totalElements == null
        ? content.length
        : response.totalElements + additionalDemos.length,
  }
}

export async function getPlaces(params: ApiPlacesParams = {}) {
  if (AUTH_MOCK_ENABLED) return getMockPlaces(params)
  const qs = buildQueryString({ ...params })
  try {
    const response = await apiRequest<PageResponse<ApiPlaceSummary>>(`${API_PREFIX}/places${qs}`)
    return PLACE_DEMO_ENABLED ? mergeDemoPlaces(response, params) : response
  } catch (error) {
    if (PLACE_DEMO_ENABLED) return getMockPlaces(params)
    throw error
  }
}

export function getPlaceDetail(placeId: number) {
  if (AUTH_MOCK_ENABLED || PLACE_DEMO_ENABLED) {
    const detail = getMockPlaceDetail(placeId)
    if (detail) return Promise.resolve({ ...detail })
  }
  return apiRequest<ApiPlaceDetail>(`${API_PREFIX}/places/${placeId.toString()}`)
}

export function getPlaceReviews(placeId: number, page = 0, size = 20) {
  if ((AUTH_MOCK_ENABLED || PLACE_DEMO_ENABLED) && isMockPlace(placeId)) {
    return Promise.resolve(getMockPlaceReviews(placeId))
  }
  const qs = buildQueryString({ page, size })
  return apiRequest<PageResponse<ApiReview>>(
    `${API_PREFIX}/places/${placeId.toString()}/reviews${qs}`,
  )
}

export async function getReviewTags() {
  if (AUTH_MOCK_ENABLED) return Promise.resolve({ tags: mockReviewTags })
  try {
    return await apiRequest<{ tags: ApiReviewTag[] }>(`${API_PREFIX}/review-tags`)
  } catch (error) {
    if (PLACE_DEMO_ENABLED) return { tags: mockReviewTags }
    throw error
  }
}

export function createPlaceReview(placeId: number, request: CreatePlaceReviewRequest) {
  if ((AUTH_MOCK_ENABLED || PLACE_DEMO_ENABLED) && isMockPlace(placeId)) {
    return Promise.resolve(createMockPlaceReview(placeId, request))
  }
  return apiRequest<CreatePlaceReviewResponse>(
    `${API_PREFIX}/places/${placeId.toString()}/reviews`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
  )
}

export function likePlace(placeId: number) {
  if ((AUTH_MOCK_ENABLED || PLACE_DEMO_ENABLED) && isMockPlace(placeId)) {
    return Promise.resolve(setMockPlaceLiked(placeId, true))
  }
  return apiRequest<ApiLikeResponse>(`${API_PREFIX}/places/${placeId.toString()}/like`, {
    method: 'POST',
  })
}

export function unlikePlace(placeId: number) {
  if ((AUTH_MOCK_ENABLED || PLACE_DEMO_ENABLED) && isMockPlace(placeId)) {
    return Promise.resolve(setMockPlaceLiked(placeId, false))
  }
  return apiRequest<ApiLikeResponse>(`${API_PREFIX}/places/${placeId.toString()}/like`, {
    method: 'DELETE',
  })
}
