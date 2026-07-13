import type { MapMarkerData } from '../types/map.types'

export const mockMapMarkers: MapMarkerData[] = [
  {
    id: 'noon-rest-cafe',
    name: '카페 정오의 휴식',
    icon: 'coffee',
    top: '40%',
    left: '30%',
    imageUrl: 'https://picsum.photos/seed/noon-rest-cafe/480/480',
    imageAlt: '따뜻한 우드톤의 아늑한 카페',
    distanceLabel: '240m',
    rating: 4.8,
    reviewCount: 120,
    tags: [
      { label: 'Solo-friendly', tone: 'secondary' },
      { label: '안심 경로', tone: 'primary' },
    ],
  },
  {
    id: 'moonlight-kids-park',
    name: '달빛 어린이 공원',
    icon: 'park',
    top: '35%',
    left: '70%',
    imageUrl: 'https://picsum.photos/seed/moonlight-park/480/480',
    imageAlt: '조용한 동네 공원',
    distanceLabel: '410m',
    rating: 4.6,
    reviewCount: 58,
    tags: [{ label: '안심 경로', tone: 'primary' }],
  },
]

export const mockMapFilters = [
  { value: 'all', label: '전체' },
  { value: 'cafe', label: '카페/베이커리' },
  { value: 'landmark', label: '명소' },
  { value: 'safe-restaurant', label: '안심 식당' },
]
