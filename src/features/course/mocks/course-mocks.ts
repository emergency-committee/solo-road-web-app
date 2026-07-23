import type { CourseDetail, RecommendedCourse, SavedCourseRow } from '../types/course-ui.types'

export const mockRecommendedCourses: RecommendedCourse[] = [
  {
    id: 'gwangalli-beach-road',
    title: '광안리 해변 감성 로드',
    location: '부산 수영구',
    imageUrl: 'https://picsum.photos/seed/gwangalli-beach/480/270',
    imageAlt: '해안을 따라 걷는 안전한 산책로',
    durationLabel: '1시간 20분',
    badges: [
      { label: 'Safe Route', tone: 'primary' },
      { label: 'Low Crowd', tone: 'secondary' },
    ],
    saved: true,
  },
  {
    id: 'gyeongui-line-forest',
    title: '경의선 숲길 도심 산책',
    location: '서울 마포구',
    imageUrl: 'https://picsum.photos/seed/gyeongui-forest/480/270',
    imageAlt: '노을 지는 도심 공원 산책로',
    durationLabel: '50분',
    badges: [{ label: 'Safe Route', tone: 'primary' }],
    saved: false,
  },
]

export const mockSavedCourseRows: SavedCourseRow[] = [
  {
    id: 'ikseondong-alley-tour',
    title: '익선동 골목 탐방',
    location: '서울 종로구 • 1.2km',
    imageUrl: 'https://picsum.photos/seed/ikseondong-alley/240/240',
    imageAlt: '역사적인 골목길 탐방 지도',
  },
  {
    id: 'seokchon-lake-night',
    title: '석촌호수 야경 산책',
    location: '서울 송파구 • 2.5km',
    imageUrl: 'https://picsum.photos/seed/seokchon-lake/240/240',
    imageAlt: '호숫가 야경 산책로',
  },
]

export const mockCourseDetails: Record<string, CourseDetail> = {
  'seongsu-art-walk': {
    id: 'seongsu-art-walk',
    title: '성수동 예술 산책 코스',
    dateLabel: '2026년 7월 13일 (월)',
    totalDistanceLabel: '총 6.2km',
    mapImageUrl: 'https://picsum.photos/seed/seongsu-art-map/800/500',
    mapImageAlt: '성수동 도보 코스 지도',
    badges: ['Solo-friendly', 'Safe Route', 'Low Crowd'],
    stops: [
      {
        id: 'seongsu-mellow-cafe',
        time: '10:00 AM',
        durationLabel: '60분 체류 예정',
        title: '성수 멜로우 카페',
        subtitle: '로컬 로스터리 커피 전문점',
        imageUrl: 'https://picsum.photos/seed/seongsu-mellow-cafe/240/240',
        imageAlt: '아늑한 로스터리 카페',
        badges: [
          { label: 'S-Level: High', tone: 'primary' },
          { label: 'Safe: 98%', tone: 'success' },
        ],
      },
      {
        id: 'atelier-seongsu',
        time: '11:30 AM',
        durationLabel: '90분 체류 예정',
        title: '아뜰리에 성수',
        subtitle: '현대 미술 기획 전시 공간',
        imageUrl: 'https://picsum.photos/seed/atelier-seongsu/240/240',
        imageAlt: '현대적인 미술 전시 공간',
        badges: [
          { label: 'S-Level: Mid', tone: 'primary' },
          { label: 'Safe: 95%', tone: 'success' },
        ],
      },
      {
        id: 'haru-table',
        time: '01:15 PM',
        durationLabel: '120분 체류 예정',
        title: '하루 테이블',
        subtitle: '혼밥 특화 프리미엄 다이닝',
        imageUrl: 'https://picsum.photos/seed/haru-table/240/240',
        imageAlt: '아늑한 일본식 다이닝 공간',
        badges: [
          { label: 'S-Level: Ultra', tone: 'primary' },
          { label: 'Safe: 99%', tone: 'success' },
        ],
      },
    ],
  },
}
