import { useMutation } from '@tanstack/react-query'
import { fetchRecommendations } from '../api/recommend-api'
import type { RecommendRequest } from '../types/recommend.types'

export function useRecommend() {
  return useMutation({
    mutationFn: (req: RecommendRequest) => fetchRecommendations(req),
  })
}
