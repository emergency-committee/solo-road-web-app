import { apiRequest } from '@/shared/api/client'
import type { RecommendRequest, RecommendResponse } from '../types/recommend.types'

// TODO: 대응하는 백엔드 엔드포인트가 아직 없다. 자연어 기반 AI 추천은 프론트에서 AI 서버로
// 직접 호출하지 않고 반드시 Spring 백엔드를 경유해야 하므로, 백엔드에 게이트웨이 엔드포인트가
// 추가되기 전까지는 이 함수를 실제로 연결하지 말 것 (현재 어디에서도 사용되지 않는 미사용 코드).
export function fetchRecommendations(req: RecommendRequest) {
  return apiRequest<RecommendResponse>('/api/v1/recommend', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}
