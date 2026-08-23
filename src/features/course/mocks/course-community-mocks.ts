import type {
  CourseDetailResponse,
  CourseReview,
  CourseTag,
  GamificationProfile,
  MyCourseItem,
  PublicCourseItem,
  TravelerProfile,
  TravelerRankingItem,
} from '../types/course.types'
import { isSafetyRouteRegion } from '../lib/course-region'

const TAGS: CourseTag[] = [
  { tagId: 1001, code: 'NATURAL_FLOW', name: '동선이 자연스러워요', category: 'HIGHLIGHT' },
  { tagId: 1002, code: 'EASY_SOLO_MEAL', name: '혼밥 걱정이 적어요', category: 'HIGHLIGHT' },
  { tagId: 1003, code: 'ENOUGH_REST', name: '쉬어갈 곳이 충분해요', category: 'HIGHLIGHT' },
  { tagId: 1004, code: 'COMFORTABLE_ALONE', name: '혼자 머물기 편해요', category: 'HIGHLIGHT' },
  { tagId: 1005, code: 'PHOTO_FRIENDLY', name: '사진 남기기 좋아요', category: 'HIGHLIGHT' },
  { tagId: 1006, code: 'EASY_NAVIGATION', name: '길 찾기 쉬워요', category: 'HIGHLIGHT' },
  { tagId: 1007, code: 'RELAXED_SCHEDULE', name: '일정이 여유로워요', category: 'HIGHLIGHT' },
  { tagId: 1101, code: 'LOTS_OF_WALKING', name: '걷는 구간이 많아요', category: 'CAUTION' },
  { tagId: 1102, code: 'CROWDED_HOURS', name: '붐비는 시간이 있어요', category: 'CAUTION' },
  { tagId: 1103, code: 'DAYTIME_RECOMMENDED', name: '밤보다는 낮이 좋아요', category: 'CAUTION' },
]

function tags(...ids: number[]) {
  return TAGS.filter((tag) => ids.includes(tag.tagId))
}

export const mockCommunityPublicCourses: PublicCourseItem[] = [
  {
    courseId: 910001,
    title: '동문시장부터 용두암까지, 혼자 걷기 좋은 제주 저녁',
    region: '제주',
    startDate: '2026-09-12',
    endDate: '2026-09-13',
    tripDays: 2,
    totalDurationMinutes: 250,
    totalDistanceM: 4200,
    thumbnailUrl: 'https://picsum.photos/seed/community-jeju-evening/720/360',
    description: '시장 혼밥으로 시작해 바다 산책으로 마무리하는, 서두르지 않아도 되는 제주 저녁 코스예요.',
    soloImpression: 'BETTER_ALONE',
    paceType: 'RELAXED',
    authorId: 501,
    authorName: '느린제주',
    authorLevel: 4,
    authorTitle: '제주 느린 여행자',
    likeCount: 128,
    copyCount: 46,
    reviewCount: 12,
    publishedAt: '2026-08-20T19:20:00',
    tags: tags(1001, 1002, 1007, 1102),
  },
  {
    courseId: 910002,
    title: '성수 골목과 서울숲을 잇는 혼행 반나절',
    region: '서울',
    startDate: '2026-09-19',
    endDate: '2026-09-19',
    tripDays: 1,
    totalDurationMinutes: 210,
    totalDistanceM: 3600,
    thumbnailUrl: 'https://picsum.photos/seed/community-seongsu-walk/720/360',
    description: '작은 전시와 혼자 앉기 편한 카페를 지나 서울숲까지 천천히 이어지는 코스입니다.',
    soloImpression: 'COMFORTABLE_SOLO',
    paceType: 'BALANCED',
    authorId: 502,
    authorName: '골목수집가',
    authorLevel: 3,
    authorTitle: '코스 메이커',
    likeCount: 94,
    copyCount: 31,
    reviewCount: 8,
    publishedAt: '2026-08-22T11:40:00',
    tags: tags(1001, 1004, 1005, 1101),
  },
  {
    courseId: 910003,
    title: '흰여울에서 영도 바다를 따라 걷는 하루',
    region: '부산',
    startDate: '2026-09-20',
    endDate: '2026-09-20',
    tripDays: 1,
    totalDurationMinutes: 300,
    totalDistanceM: 5100,
    thumbnailUrl: 'https://picsum.photos/seed/community-busan-yeongdo/720/360',
    description: '바다를 오래 바라보고 싶을 때 혼자 다녀오기 좋은 영도 산책 코스예요.',
    soloImpression: 'EASY_SOLO',
    paceType: 'RELAXED',
    authorId: 503,
    authorName: '파도옆자리',
    authorLevel: 2,
    authorTitle: '부산 여행자',
    likeCount: 71,
    copyCount: 18,
    reviewCount: 5,
    publishedAt: '2026-08-21T16:10:00',
    tags: tags(1003, 1005, 1007, 1103),
  },
  {
    courseId: 910004,
    title: '속초 중앙시장과 영랑호를 천천히 즐기는 코스',
    region: '속초',
    startDate: '2026-10-03',
    endDate: '2026-10-04',
    tripDays: 2,
    totalDurationMinutes: 270,
    totalDistanceM: 4800,
    thumbnailUrl: 'https://picsum.photos/seed/community-sokcho-lake/720/360',
    description: '시장 간식을 골라 들고 호수까지 이동하는 속초의 여유로운 하루 코스입니다.',
    soloImpression: 'COMFORTABLE_SOLO',
    paceType: 'RELAXED',
    authorId: 504,
    authorName: '혼자서도맑음',
    authorLevel: 2,
    likeCount: 36,
    copyCount: 9,
    reviewCount: 3,
    publishedAt: '2026-08-23T09:15:00',
    tags: tags(1002, 1003, 1007, 1101),
  },
]

function detail(
  course: PublicCourseItem,
  stops: Array<
    Omit<CourseDetailResponse['stops'][number], 'dayNumber'> & { dayNumber?: number }
  >,
  safetyPriority: boolean,
  authorComment: string,
  schedule: { startDate: string; endDate: string },
): CourseDetailResponse {
  const tripDays = Math.max(
    1,
    Math.round(
      (new Date(`${schedule.endDate}T00:00:00`).getTime() -
        new Date(`${schedule.startDate}T00:00:00`).getTime()) /
        (24 * 60 * 60 * 1000),
    ) + 1,
  )
  return {
    courseId: course.courseId,
    title: course.title,
    totalDurationMinutes: course.totalDurationMinutes ?? 0,
    totalDistanceM: course.totalDistanceM ?? 0,
    safetyPriority,
    ...(course.region !== undefined && { region: course.region }),
    startDate: schedule.startDate,
    endDate: schedule.endDate,
    tripDays,
    nightCount: tripDays - 1,
    visibility: 'PUBLIC',
    owner: false,
    ...(course.description !== undefined && { description: course.description }),
    ...(course.soloImpression !== undefined && { soloImpression: course.soloImpression }),
    ...(course.paceType !== undefined && { paceType: course.paceType }),
    authorComment,
    authorId: course.authorId,
    authorName: course.authorName,
    authorLevel: course.authorLevel,
    ...(course.authorTitle !== undefined && { authorTitle: course.authorTitle }),
    liked: false,
    likeCount: course.likeCount,
    copyCount: course.copyCount,
    reviewCount: course.reviewCount,
    publishedAt: course.publishedAt,
    tags: course.tags,
    stops: stops.map((stop) => ({ ...stop, dayNumber: stop.dayNumber ?? 1 })),
  }
}

export const mockCommunityCourseDetails: Record<number, CourseDetailResponse> = {
  910001: detail(
    mockCommunityPublicCourses[0]!,
    [
      { courseStopId: 920001, stopOrder: 0, placeId: 930001, name: '제주동문시장', latitude: 33.512836, longitude: 126.52843, stayDurationMinutes: 80, memo: '야시장 운영 시간 확인하기', thumbnailUrl: 'https://picsum.photos/seed/community-dongmun-market/240/240' },
      { courseStopId: 920002, stopOrder: 1, placeId: 930002, name: '관덕정', latitude: 33.51345, longitude: 126.52149, stayDurationMinutes: 35, memo: '해 질 무렵 쉬어가기', thumbnailUrl: 'https://picsum.photos/seed/community-gwandeokjeong/240/240' },
      { courseStopId: 920003, stopOrder: 2, dayNumber: 2, placeId: 930003, name: '용두암', latitude: 33.51611, longitude: 126.511958, stayDurationMinutes: 50, memo: '아침에는 바람이 강할 수 있어 겉옷 챙기기', thumbnailUrl: 'https://picsum.photos/seed/community-yongduam/240/240' },
    ],
    true,
    '시장에서는 한 곳에서 많이 먹기보다 조금씩 골라 먹는 게 좋았어요.',
    { startDate: '2026-09-12', endDate: '2026-09-13' },
  ),
  910002: detail(
    mockCommunityPublicCourses[1]!,
    [
      { courseStopId: 920011, stopOrder: 0, placeId: 930011, name: '성수연방', latitude: 37.54158, longitude: 127.05665, stayDurationMinutes: 50, thumbnailUrl: 'https://picsum.photos/seed/community-seongsu-start/240/240' },
      { courseStopId: 920012, stopOrder: 1, placeId: 930012, name: '성수동 카페거리', latitude: 37.54362, longitude: 127.0549, stayDurationMinutes: 70, memo: '바 좌석이 있는 카페 고르기', thumbnailUrl: 'https://picsum.photos/seed/community-seongsu-cafe/240/240' },
      { courseStopId: 920013, stopOrder: 2, placeId: 930013, name: '서울숲', latitude: 37.54439, longitude: 127.03745, stayDurationMinutes: 60, thumbnailUrl: 'https://picsum.photos/seed/community-seoul-forest/240/240' },
    ],
    true,
    '주말 오후에는 카페 대기가 길어서 오전 출발을 추천해요.',
    { startDate: '2026-09-19', endDate: '2026-09-19' },
  ),
  910003: detail(
    mockCommunityPublicCourses[2]!,
    [
      { courseStopId: 920021, stopOrder: 0, placeId: 930021, name: '흰여울문화마을', latitude: 35.07878, longitude: 129.04428, stayDurationMinutes: 90, thumbnailUrl: 'https://picsum.photos/seed/community-huinnyeoul/240/240' },
      { courseStopId: 920022, stopOrder: 1, placeId: 930022, name: '절영해안산책로', latitude: 35.07591, longitude: 129.05085, stayDurationMinutes: 70, memo: '편한 신발 필수', thumbnailUrl: 'https://picsum.photos/seed/community-jeoryeong/240/240' },
      { courseStopId: 920023, stopOrder: 2, placeId: 930023, name: '영도 카페거리', latitude: 35.08234, longitude: 129.05212, stayDurationMinutes: 60, thumbnailUrl: 'https://picsum.photos/seed/community-yeongdo-cafe/240/240' },
    ],
    true,
    '해안 산책로는 낮에 걷고, 해가 지기 전 카페 쪽으로 이동했어요.',
    { startDate: '2026-09-20', endDate: '2026-09-20' },
  ),
  910004: detail(
    mockCommunityPublicCourses[3]!,
    [
      { courseStopId: 920031, stopOrder: 0, placeId: 930031, name: '속초관광수산시장', latitude: 38.20417, longitude: 128.59072, stayDurationMinutes: 80, memo: '먹거리 포장은 조금씩', thumbnailUrl: 'https://picsum.photos/seed/community-sokcho-market/240/240' },
      { courseStopId: 920032, stopOrder: 1, placeId: 930032, name: '영랑호', latitude: 38.22215, longitude: 128.58418, stayDurationMinutes: 90, memo: '호수 한 바퀴보다 전망 좋은 구간만 걷기', thumbnailUrl: 'https://picsum.photos/seed/community-yeongnangho/240/240' },
    ],
    false,
    '속초는 안심경로 지원 지역은 아니지만 낮 시간에 혼자 걷기 편한 동선으로 골랐어요.',
    { startDate: '2026-10-03', endDate: '2026-10-04' },
  ),
}

const mockOwnedCourseId = 950001
mockCommunityCourseDetails[mockOwnedCourseId] = {
  ...mockCommunityCourseDetails[910002]!,
  courseId: mockOwnedCourseId,
  title: '서울숲에서 보내는 나만의 느린 오후',
  visibility: 'PRIVATE',
  owner: true,
  authorId: 999,
  authorName: '솔로더 여행자',
  authorLevel: 3,
  authorTitle: '첫 영감',
  liked: false,
  likeCount: 0,
  copyCount: 0,
  reviewCount: 0,
  tags: [],
}

export const mockMyCourses: MyCourseItem[] = [
  {
    courseId: mockOwnedCourseId,
    title: '서울숲에서 보내는 나만의 느린 오후',
    region: '서울',
    startDate: '2026-09-19',
    endDate: '2026-09-19',
    totalDistanceM: 3600,
    visibility: 'PRIVATE',
  },
]

export const mockCommunityReviews: Record<number, CourseReview[]> = {
  910001: [
    { reviewId: 940001, userId: 601, userName: '제주한바퀴', userTitle: '첫 영감', experienceType: 'FOLLOWED', contents: '혼밥 장소와 산책 순서가 자연스러워서 그대로 다녀왔어요. 저녁에도 일정이 부담스럽지 않았습니다.', createdAt: '2026-08-22T20:10:00', tags: tags(1001, 1002) },
    { reviewId: 940002, userId: 602, userName: '가벼운배낭', experienceType: 'ADAPTED', contents: '관덕정 대신 근처 책방을 넣었는데 전체 흐름이 잘 이어졌어요.', createdAt: '2026-08-21T14:30:00', tags: tags(1007) },
  ],
}

export const mockCommunityTags = TAGS

export const mockGamificationProfile: GamificationProfile = {
  level: 3,
  levelName: '코스 메이커',
  experiencePoint: 520,
  nextLevelExperiencePoint: 700,
  equippedTitleCode: 'FIRST_INSPIRATION',
  equippedTitleName: '첫 영감',
  titles: [
    { code: 'FIRST_JOURNEY', name: '첫 여정', description: '첫 코스를 공개했어요.', unlocked: true, equipped: false, progress: 1, target: 1 },
    { code: 'FIRST_INSPIRATION', name: '첫 영감', description: '내 코스가 다른 여행자의 일정이 되었어요.', unlocked: true, equipped: true, progress: 1, target: 1 },
    { code: 'COURSE_MAKER', name: '코스 메이커', description: '공개 코스 5개를 만들어요.', unlocked: false, equipped: false, progress: 3, target: 5 },
    { code: 'BELOVED_ROUTE', name: '사랑받는 길', description: '내 코스가 좋아요 100개를 받아요.', unlocked: false, equipped: false, progress: 72, target: 100 },
  ],
}

export const mockTravelerRankings: TravelerRankingItem[] = [
  {
    ranking: 1,
    userId: 501,
    nickname: '느린제주',
    profileImageUrl: 'https://picsum.photos/seed/traveler-slow-jeju/160/160',
    level: 4,
    levelName: '혼행 길잡이',
    experiencePoint: 1120,
    equippedTitleName: '제주 느린 여행자',
    publicCourseCount: 1,
    receivedLikeCount: 128,
    receivedCopyCount: 46,
    me: false,
  },
  {
    ranking: 2,
    userId: 502,
    nickname: '골목수집가',
    profileImageUrl: 'https://picsum.photos/seed/traveler-alley/160/160',
    level: 3,
    levelName: '코스 메이커',
    experiencePoint: 680,
    equippedTitleName: '코스 메이커',
    publicCourseCount: 1,
    receivedLikeCount: 94,
    receivedCopyCount: 31,
    me: false,
  },
  {
    ranking: 3,
    userId: 503,
    nickname: '파도옆자리',
    profileImageUrl: 'https://picsum.photos/seed/traveler-wave/160/160',
    level: 2,
    levelName: '혼행 탐험가',
    experiencePoint: 240,
    equippedTitleName: '부산 여행자',
    publicCourseCount: 1,
    receivedLikeCount: 71,
    receivedCopyCount: 18,
    me: false,
  },
  {
    ranking: 4,
    userId: 504,
    nickname: '혼자서도맑음',
    profileImageUrl: 'https://picsum.photos/seed/traveler-clear/160/160',
    level: 2,
    levelName: '혼행 탐험가',
    experiencePoint: 150,
    publicCourseCount: 1,
    receivedLikeCount: 36,
    receivedCopyCount: 9,
    me: false,
  },
]

export const mockTravelerProfiles: Record<number, TravelerProfile> = Object.fromEntries(
  mockTravelerRankings.map(({ ranking: _ranking, ...traveler }) => [traveler.userId, traveler]),
)

export function filterMockPublicCourses(sort: 'HOT' | 'LATEST' = 'HOT', region?: string) {
  const filtered = mockCommunityPublicCourses.filter((course) => {
    if (!region) return true
    if (region === 'OTHER') return !isSafetyRouteRegion(course.region ?? '')
    return course.region?.includes(region) ?? false
  })
  return [...filtered].sort((a, b) =>
    sort === 'LATEST'
      ? b.publishedAt.localeCompare(a.publishedAt)
      : b.likeCount + b.copyCount * 3 - (a.likeCount + a.copyCount * 3),
  )
}
