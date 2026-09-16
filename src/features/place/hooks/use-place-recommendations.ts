import { useQuery } from '@tanstack/react-query'
import { getPlaceRecommendations, type PlaceRecommendationsParams } from '../api/place-api'

export function usePlaceRecommendations(params: PlaceRecommendationsParams = {}) {
  return useQuery({
    queryKey: ['places', 'recommendations', params],
    queryFn: () => getPlaceRecommendations(params),
    // 이 호출은 백엔드가 AI 큐레이션 실패 시 이미 자체적으로 재시도한다(최대 45초 소요).
    // 기본 쿼리 retry(5xx면 최대 2회 재시도)를 그대로 두면 느린 실패 하나가 브라우저에서
    // 또 한 번씩 풀 라운드트립을 3번 반복하게 돼 백엔드 부하만 키운다.
    retry: false,
  })
}
