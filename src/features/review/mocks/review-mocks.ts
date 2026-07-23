import type { Review } from '../types/review.types'

export const mockReviews: Review[] = [
  {
    id: 'nordic-hearth',
    placeName: 'The Nordic Hearth',
    location: 'Stockholm, Sweden',
    dateLabel: '2026. 6. 12',
    rating: 5,
    tag: { label: 'Solo-friendly', tone: 'primary' },
    content:
      '혼자 여행하는 사람에게 정말 평화로운 분위기예요. 조명이 은은하고, 직원분들도 부담스럽지 않게 챙겨주셔서 좋았습니다. 소분 메뉴가 잘 되어있어 혼자 식사하기에 완벽했어요. 두 시간 동안 책을 읽었는데 전혀 눈치 보이지 않았습니다.',
    imageUrl: 'https://picsum.photos/seed/nordic-hearth/640/320',
    imageAlt: '따뜻한 벽난로가 있는 북유럽 스타일 레스토랑',
  },
  {
    id: 'midnight-gallery',
    placeName: 'Midnight Gallery',
    location: 'London, UK',
    dateLabel: '2026. 5. 28',
    rating: 4,
    tag: { label: 'Low Crowd', tone: 'secondary' },
    content:
      '늦은 밤 영감을 얻기 좋은 숨은 명소입니다. 큐레이션이 과감하고 개인 공간이 넉넉하게 확보되어 있어요. 메인 홀의 울림이 조금 있었지만 디지털 설치 작품이 인상 깊어서 크게 신경 쓰이지 않았습니다. 조용한 저녁 산책에 딱이에요.',
  },
  {
    id: 'cobalt-path',
    placeName: 'Cobalt Path',
    location: 'Portland, USA',
    dateLabel: '2026. 4. 15',
    rating: 5,
    tag: { label: 'Safe Route', tone: 'primary' },
    content:
      '조명이 매우 밝고 표지판이 명확한 트레일입니다. 해질 무렵 혼자 걸어도 완전히 안전하다고 느꼈어요. 경사가 완만하고 전망 포인트가 곳곳에 배치되어 있습니다. 아침 조깅이나 노을 산책에 강력 추천합니다.',
  },
]
