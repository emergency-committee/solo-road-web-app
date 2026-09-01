import { apiRequest } from '@/shared/api/client'
import { API_PREFIX, AUTH_MOCK_ENABLED } from '@/shared/api/config'
import { buildQueryString } from '@/shared/api/query-string'
import type { PageResponse } from '@/shared/api/types'
import { getMockPlaces } from '@/features/place/mocks/place-rating-mocks'
import type { ApiSavedPlace } from '../types/saved.types'

export function getSavedPlaces(page = 0, size = 20, type?: string) {
  if (AUTH_MOCK_ENABLED) {
    const saved = getMockPlaces({ size: 500 }).content
      .filter((place) => place.isLiked)
      .filter((place) => !type || place.type === type)
      .map((place) => ({
        placeId: place.placeId,
        name: place.name,
        type: place.type,
        ...(place.rating !== undefined && { rating: place.rating }),
        ...(place.soloScore !== undefined && { soloScore: place.soloScore }),
        ...(place.scoreStatus !== undefined && { scoreStatus: place.scoreStatus }),
        ...(place.soloRating !== undefined && { soloRating: place.soloRating }),
        soloReviewCount: place.soloReviewCount,
        ...(place.summary !== undefined && { summary: place.summary }),
        latitude: place.latitude,
        longitude: place.longitude,
        ...(place.thumbnailUrl && { thumbnailUrl: place.thumbnailUrl }),
        soloFriendlyBadge: place.soloFriendlyBadge,
      }))
    const start = page * size
    const content = saved.slice(start, start + size)
    return Promise.resolve<PageResponse<ApiSavedPlace>>({
      content,
      page,
      size,
      totalElements: saved.length,
      hasNext: start + size < saved.length,
    })
  }
  const qs = buildQueryString({ page, size, type })
  return apiRequest<PageResponse<ApiSavedPlace>>(`${API_PREFIX}/users/me/saved-places${qs}`)
}
