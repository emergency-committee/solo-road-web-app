import type { CourseDetail } from '../types/course-ui.types'

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
        latitude: 37.5446,
        longitude: 127.0559,
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
        title: '아뜨리에 성수',
        subtitle: '현대 미술 기획 전시 공간',
        latitude: 37.5467,
        longitude: 127.0475,
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
        latitude: 37.5415,
        longitude: 127.0565,
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
