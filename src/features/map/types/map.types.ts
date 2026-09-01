export type MarkerIconType =
  | 'restaurant'
  | 'coffee'
  | 'attraction'
  | 'nature'
  | 'culture'
  | 'stay'
  | 'wellness'
  | 'study'
  | 'exhibition'
  | 'activity'
  | 'shopping'
  | 'spot'

export interface MapMarkerData {
  id: string
  name: string
  icon: MarkerIconType
  categoryLabel?: string
  lat: number
  lng: number
  /** 등록된 이미지가 없으면 null. */
  imageUrl: string | null
  imageAlt: string
  summary?: string | undefined
  distanceLabel: string
  rating?: number | null
  soloScore?: number | null | undefined
  scoreStatus?: 'PENDING' | 'DONE' | null | undefined
  soloRating: number | null | undefined
  soloReviewCount: number
  saved: boolean
  tags: { label: string; tone: 'primary' | 'secondary' }[]
}

export type MapRatingMode = 'solo' | 'general'
export type MapMode = 'all' | 'solo_dining'

export const ALL_MAP_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'solo-friendly', label: '혼행 추천' },
  { value: 'restaurant', label: '식당' },
  { value: 'cafe', label: '카페/디저트' },
  { value: 'wellness', label: '웰니스' },
  { value: 'study', label: '스터디' },
  { value: 'exhibition', label: '전시·문화' },
  { value: 'nature', label: '자연/힐링' },
  { value: 'activity', label: '체험·활동' },
  { value: 'shopping', label: '쇼핑' },
]

export const SOLO_DINING_MAP_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'solo-friendly', label: '혼밥 추천' },
  { value: 'restaurant', label: '식당' },
  { value: 'cafe', label: '카페/디저트' },
]

export const SOLO_TRAVEL_MAP_FILTERS = ALL_MAP_FILTERS
export const MAP_FILTERS = ALL_MAP_FILTERS

/** 위치 권한이 없거나 아직 못 받았을 때 쓰는 기본 지도 중심 (서울시 강남구, 강남역 기준). */
export const DEFAULT_MAP_CENTER = { lat: 37.4979, lng: 127.0276 }
