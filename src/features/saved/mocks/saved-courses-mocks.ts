export interface SavedCourseImageBadge {
  id: string
  variant: 'image-badge'
  title: string
  imageUrl: string
  imageAlt: string
  badges: { label: string; tone: 'primary' | 'secondary' }[]
  duration: string
  distance: string
}

export interface SavedCourseMapPreview {
  id: string
  variant: 'map-preview'
  title: string
  imageUrl: string
  imageAlt: string
  badges: { label: string; tone: 'success' | 'info' }[]
  description: string
  duration: string
  placeCount: number
}

export interface SavedCourseStatsGrid {
  id: string
  variant: 'stats-grid'
  title: string
  imageUrl: string
  imageAlt: string
  rating: number
  reviewCount: number
  stats: { label: string; value: string }[]
}

export type SavedCourseMock = SavedCourseImageBadge | SavedCourseMapPreview | SavedCourseStatsGrid

export const mockSavedCourses: SavedCourseMock[] = [
  {
    id: 'autumn-seongsu-walk',
    variant: 'image-badge',
    title: 'Autumn Seongsu Walk',
    imageUrl: 'https://picsum.photos/seed/autumn-seongsu/640/360',
    imageAlt: '가을 은행나무길이 있는 성수동 거리',
    badges: [
      { label: 'SOLO-FRIENDLY', tone: 'secondary' },
      { label: '4 PLACES', tone: 'primary' },
    ],
    duration: '45 mins',
    distance: '3.2 km',
  },
  {
    id: 'city-night-safety-course',
    variant: 'map-preview',
    title: 'City Night Safety Course',
    imageUrl: 'https://picsum.photos/seed/city-night-safety/640/360',
    imageAlt: '조명이 밝은 도심 야간 안전 경로',
    badges: [
      { label: 'SAFE ROUTE', tone: 'success' },
      { label: 'LOW CROWD', tone: 'info' },
    ],
    description:
      '주요 교차로를 지나는 고가시성 경로로, 밝은 조명과 활발한 모니터링이 특징입니다. 혼자 하는 야간 산책에 적합합니다.',
    duration: '30 mins',
    placeCount: 5,
  },
  {
    id: 'riverside-zen-journey',
    variant: 'stats-grid',
    title: 'Riverside Zen Journey',
    imageUrl: 'https://picsum.photos/seed/riverside-zen/640/360',
    imageAlt: '일출 시각 안개 낀 강변길',
    rating: 4.9,
    reviewCount: 120,
    stats: [
      { label: 'Dist', value: '5.1 km' },
      { label: 'Time', value: '1h 15m' },
      { label: 'Places', value: '3' },
    ],
  },
]
