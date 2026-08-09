export interface MapMarkerData {
  id: string
  name: string
  icon: 'coffee' | 'park'
  top: string
  left: string
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
