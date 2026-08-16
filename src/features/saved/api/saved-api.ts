import { apiRequest } from '@/shared/api/client'
import { API_PREFIX } from '@/shared/api/config'
import { buildQueryString } from '@/shared/api/query-string'
import type { PageResponse } from '@/shared/api/types'
import type { ApiSavedPlace } from '../types/saved.types'

export function getSavedPlaces(page = 0, size = 20) {
  const qs = buildQueryString({ page, size })
  return apiRequest<PageResponse<ApiSavedPlace>>(`${API_PREFIX}/users/me/saved-places${qs}`)
}
