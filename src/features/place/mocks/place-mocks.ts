import type { PlaceDetail, PlaceSummary } from '../types/place.types'

export const mockPlaceSummaries: PlaceSummary[] = [
  {
    id: 'ramen-kitchen-forest',
    name: '라멘 키친 숲',
    category: '음식점',
    imageUrl: 'https://picsum.photos/seed/ramen-kitchen/480/270',
    imageAlt: '1인 좌석이 있는 아늑한 라멘 가게',
    address: '서울 강남구',
    tags: ['1인 좌석 완비', '여성 안심'],
  },
  {
    id: 'green-grid-gangnam',
    name: '그린 그리드 강남',
    category: '카페',
    imageUrl: 'https://picsum.photos/seed/green-grid/480/270',
    imageAlt: '채광 좋은 비건 카페',
    address: '서울 강남구',
    tags: ['바 테이블', '샐러드 전문'],
  },
  {
    id: 'unfold-bookstore',
    name: '언폴드 서점',
    category: '북카페',
    imageUrl: 'https://picsum.photos/seed/unfold-books/480/480',
    imageAlt: '조용한 미니멀 서점',
    address: '서울 강남구',
    tags: ['조용한 분위기'],
  },
  {
    id: 'arte-gallery',
    name: '아르떼 갤러리',
    category: '전시',
    imageUrl: 'https://picsum.photos/seed/arte-gallery/480/480',
    imageAlt: '한적한 현대 미술 갤러리',
    address: '서울 논현동',
    tags: ['한적함'],
  },
]

export const mockPlaceDetails: Record<string, PlaceDetail> = {
  'blue-forest-records': {
    id: 'blue-forest-records',
    name: '푸른 숲의 기록',
    category: '카페',
    imageUrl: 'https://picsum.photos/seed/blue-forest-records/800/600',
    imageAlt: '따뜻한 우드톤의 미니멀 카페',
    address: '서울, 성수동',
    tags: ['#QUIET', '#SAFE', '#SOLO-FRIENDLY'],
    distanceLabel: '1.2km',
    soloFriendliness: 'High',
    hashtags: ['#QuietAtmosphere', '#GoodForWork', '#SafeAtNight', '#SoloFriendly'],
    highlights: [
      { icon: 'seat', label: '1인 좌석 완비' },
      { icon: 'menu', label: '1인 메뉴 제공' },
      { icon: 'quiet', label: '조용한 구역' },
    ],
    recommenderCount: 45,
  },
}

export const mockNearbyPlaces = mockPlaceSummaries
