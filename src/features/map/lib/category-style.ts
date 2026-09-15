import type { MarkerIconType } from '../types/map.types'

/** 장소 타입 문자열(백엔드 `type`/추천 `tags`)을 지도 마커 아이콘/라벨로 분류한다. */
export function classifyPlaceType(type: string): { icon: MarkerIconType; label: string } {
  const upper = type.toUpperCase()
  if (upper.includes('WELLNESS') || upper.includes('웰니스')) {
    return { icon: 'wellness', label: '웰니스' }
  }
  if (upper.includes('STUDY') || upper.includes('스터디') || upper.includes('독서실')) {
    return { icon: 'study', label: '스터디' }
  }
  if (upper.includes('EXHIBITION') || upper.includes('전시')) {
    return { icon: 'exhibition', label: '전시·문화' }
  }
  if (upper.includes('ACTIVITY') || upper.includes('체험') || upper.includes('액티비티')) {
    return { icon: 'activity', label: '체험·활동' }
  }
  if (upper.includes('SHOPPING') || upper.includes('쇼핑') || upper.includes('시장')) {
    return { icon: 'shopping', label: '쇼핑' }
  }
  if (upper.includes('CAFE') || upper.includes('카페') || upper.includes('베이커리')) {
    return { icon: 'coffee', label: '카페/디저트' }
  }
  if (
    upper.includes('RESTAURANT') ||
    upper.includes('식당') ||
    upper.includes('한식') ||
    upper.includes('일식') ||
    upper.includes('중식')
  ) {
    return { icon: 'restaurant', label: '혼밥 식당' }
  }
  if (upper.includes('NATURE') || upper.includes('자연') || upper.includes('산책')) {
    return { icon: 'nature', label: '자연/힐링' }
  }
  if (
    upper.includes('CULTURE') ||
    upper.includes('전시') ||
    upper.includes('문화') ||
    upper.includes('미술관')
  ) {
    return { icon: 'culture', label: '전시/문화' }
  }
  if (
    upper.includes('ATTRACTION') ||
    upper.includes('명소') ||
    upper.includes('관광') ||
    upper.includes('도서관')
  ) {
    return { icon: 'attraction', label: '혼행 명소' }
  }
  if (upper.includes('STAY') || upper.includes('숙소') || upper.includes('호텔')) {
    return { icon: 'stay', label: '숙소' }
  }
  return { icon: 'spot', label: type }
}

/** 지도 마커(`MapMarker`)와 동일한 카테고리별 색상. 홈 카드 태그 뱃지 등에서 재사용해 색을 맞춘다. */
export const CATEGORY_COLOR: Record<MarkerIconType, string> = {
  restaurant: '#ff6b4a',
  coffee: '#8d6e63',
  attraction: '#2563eb',
  nature: '#059669',
  culture: '#7c3aed',
  stay: '#4f46e5',
  wellness: '#0f766e',
  study: '#475569',
  exhibition: '#7c3aed',
  activity: '#db2777',
  shopping: '#ca8a04',
  spot: '#6b7280',
}
