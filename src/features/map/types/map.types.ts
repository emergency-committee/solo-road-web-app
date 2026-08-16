export interface MapMarkerData {
  id: string
  name: string
  icon: 'coffee' | 'park'
  lat: number
  lng: number
  imageUrl: string
  imageAlt: string
  distanceLabel: string
  rating: number
  reviewCount: number
  tags: { label: string; tone: 'primary' | 'secondary' }[]
}

export const MAP_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'cafe', label: '카페/베이커리' },
  { value: 'landmark', label: '명소' },
  { value: 'safe-restaurant', label: '안전 식당' },
]

/** 위치 권한이 없거나 아직 못 받았을 때 쓰는 기본 지도 중심 (서울시 강남구, 강남역 기준). */
export const DEFAULT_MAP_CENTER = { lat: 37.4979, lng: 127.0276 }
