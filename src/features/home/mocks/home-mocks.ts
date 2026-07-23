export interface HomePlaceCardData {
  id: string
  title: string
  imageUrl: string
  imageAlt: string
  subtitle: string
  badges: { label: string; tone: 'primary' | 'secondary' }[]
}

export const mockSoloDiningPlaces: HomePlaceCardData[] = [
  {
    id: 'ramen-kitchen-forest',
    title: '라멘 키친 숲',
    imageUrl: 'https://picsum.photos/seed/ramen-kitchen/480/270',
    imageAlt: '1인 좌석이 있는 아늑한 라멘 가게',
    subtitle: '300m • 조용한 분위기',
    badges: [
      { label: '1인 좌석 완비', tone: 'secondary' },
      { label: '여성 안심', tone: 'primary' },
    ],
  },
  {
    id: 'green-grid-gangnam',
    title: '그린 그리드 강남',
    imageUrl: 'https://picsum.photos/seed/green-grid/480/270',
    imageAlt: '채광 좋은 비건 카페',
    subtitle: '550m • 채광 좋은 창가',
    badges: [
      { label: '바 테이블', tone: 'secondary' },
      { label: '샐러드 전문', tone: 'primary' },
    ],
  },
]

export const mockHiddenGems: HomePlaceCardData[] = [
  {
    id: 'unfold-bookstore',
    title: '언폴드 서점',
    imageUrl: 'https://picsum.photos/seed/unfold-books/480/480',
    imageAlt: '조용한 미니멀 서점',
    subtitle: '북카페 • 강남구',
    badges: [],
  },
  {
    id: 'arte-gallery',
    title: '아르떼 갤러리',
    imageUrl: 'https://picsum.photos/seed/arte-gallery/480/480',
    imageAlt: '한적한 현대 미술 갤러리',
    subtitle: '전시 • 논현동',
    badges: [],
  },
]
