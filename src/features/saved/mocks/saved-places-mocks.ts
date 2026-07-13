export interface SavedPlaceMock {
  id: string
  title: string
  imageUrl: string
  imageAlt: string
  rating: number
  reviewCount: number
  address: string
  tags: { label: string; tone: 'primary' | 'secondary' | 'neutral' }[]
}

export const mockSavedPlaces: SavedPlaceMock[] = [
  {
    id: 'blue-forest-records',
    title: 'Blue Forest Records',
    imageUrl: 'https://picsum.photos/seed/blue-forest-records-list/480/240',
    imageAlt: '따뜻한 조명의 미니멀 레코드 가게',
    rating: 4.8,
    reviewCount: 0,
    address: 'Seongsu-dong, Seoul',
    tags: [
      { label: '#QUIET', tone: 'secondary' },
      { label: '#SAFE', tone: 'primary' },
      { label: '#SOLO-FRIENDLY', tone: 'secondary' },
    ],
  },
  {
    id: 'cozy-morning-cafe',
    title: 'Cozy Morning Cafe',
    imageUrl: 'https://picsum.photos/seed/cozy-morning-cafe/480/240',
    imageAlt: '햇살 가득한 밝은 카페 인테리어',
    rating: 4.9,
    reviewCount: 0,
    address: 'Hannam-dong, Seoul',
    tags: [
      { label: '#SAFE', tone: 'primary' },
      { label: '#BRIGHT', tone: 'neutral' },
    ],
  },
  {
    id: 'silent-chapter-books',
    title: 'Silent Chapter Books',
    imageUrl: 'https://picsum.photos/seed/silent-chapter-books/480/240',
    imageAlt: '모던한 독립 서점 내부',
    rating: 4.7,
    reviewCount: 0,
    address: 'Yeonhui-dong, Seoul',
    tags: [
      { label: '#QUIET', tone: 'secondary' },
      { label: '#STUDY-SPOT', tone: 'neutral' },
    ],
  },
]
