import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@/shared/lib/use-debounced-value'
import { getPlaces } from '../api/place-api'

const MIN_KEYWORD_LENGTH = 1
const SUGGESTION_SIZE = 6

/**
 * 검색창 자동완성. 전용 검색엔진(ES/Meilisearch 등) 없이, 이미 있는
 * `GET /places?keyword=` (이름 부분/대소문자 무시 매칭)을 그대로 재사용한 간단한 버전이다.
 * 입력을 살짝 디바운스해 몇 글자 이상일 때만 상위 몇 개를 가져온다.
 */
export function usePlaceAutocomplete(rawKeyword: string, coords?: { lat: number; lng: number }) {
  const keyword = useDebouncedValue(rawKeyword.trim(), 250)
  const enabled = keyword.length >= MIN_KEYWORD_LENGTH

  const query = useQuery({
    queryKey: ['places', 'autocomplete', keyword, coords],
    queryFn: () => getPlaces({ keyword, size: SUGGESTION_SIZE, ...coords }),
    enabled,
  })

  return {
    suggestions: enabled ? (query.data?.content ?? []) : [],
    isLoading: enabled && query.isLoading,
  }
}
