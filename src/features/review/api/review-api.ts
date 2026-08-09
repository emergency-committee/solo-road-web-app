import { apiRequest } from '@/shared/api/client'
import { API_PREFIX } from '@/shared/api/config'
import { buildQueryString } from '@/shared/api/query-string'
import type { PageResponse } from '@/shared/api/types'
import type { ApiMyReview } from '../types/review.types'

export function getMyReviews(page = 0, size = 20) {
  const qs = buildQueryString({ page, size })
  return apiRequest<PageResponse<ApiMyReview>>(`${API_PREFIX}/users/me/reviews${qs}`)
}

export function deleteReview(reviewId: number) {
  return apiRequest<void>(`${API_PREFIX}/reviews/${reviewId.toString()}`, {
    method: 'DELETE',
  })
}
