import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getPlaces } from '../api/place-api'
import type { ApiPlacesParams } from '../types/place.types'

export function usePlaces(params: ApiPlacesParams = {}) {
  return useQuery({
    queryKey: ['places', 'list', params],
    queryFn: () => getPlaces(params),
    // bbox/center가 지도 드래그·줌마다 바뀌어 매번 새 쿼리 키가 되는데, 기본 동작대로 두면
    // 새 페이지를 불러오는 동안 목록/마커가 잠깐 비어 보인다. 이전 데이터를 유지해 그 깜빡임을 없앤다.
    placeholderData: keepPreviousData,
  })
}
