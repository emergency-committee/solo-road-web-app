export interface MapMarkerData {
  id: string
  name: string
  icon: 'restaurant' | 'coffee'
  lat: number
  lng: number
  imageUrl: string
  imageAlt: string
  distanceLabel: string
  rating?: number | null
  soloRating: number | null | undefined
  soloReviewCount: number
  tags: { label: string; tone: 'primary' | 'secondary' }[]
}

export type MapRatingMode = 'solo' | 'general'

export const MAP_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'restaurant', label: '식당' },
  { value: 'cafe', label: '카페/베이커리' },
  { value: 'solo-friendly', label: '혼밥 편한 곳' },
]

/** 위치 권한이 없거나 아직 못 받았을 때 쓰는 기본 지도 중심 (서울시 강남구, 강남역 기준). */
export const DEFAULT_MAP_CENTER = { lat: 37.4979, lng: 127.0276 }
