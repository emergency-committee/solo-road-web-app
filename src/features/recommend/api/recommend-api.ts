import { apiRequest } from '@/shared/api/client'
import type { RecommendRequest, RecommendResponse } from '../types/recommend.types'

export function fetchRecommendations(req: RecommendRequest) {
  return apiRequest<RecommendResponse>('/api/v1/recommend', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}
