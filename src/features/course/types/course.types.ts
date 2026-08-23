export interface GenerateCourseRequest {
  region: string
  startDate: string
  endDate: string
  startPointName?: string
  startLatitude?: number
  startLongitude?: number
  preferredMood?: string
  safetyPriority?: boolean
}

export interface GeneratedStop {
  stopOrder: number
  placeId: number
  stayDurationMinutes?: number
}

export interface GenerateCourseResponse {
  courseId: number
  title: string
  stops: GeneratedStop[]
}

export interface CourseStopResponse {
  courseStopId: number
  stopOrder: number
  dayNumber: number
  placeId: number
  stayDurationMinutes?: number
  memo?: string
}

/** GET /api/v1/courses/recommendations 의 목록 아이템. */
export interface CourseRecommendationItem {
  courseId: number
  title: string
  region?: string
  totalDurationMinutes: number
  thumbnailUrl?: string
  badges: string[]
}

/** GET /api/v1/users/me/courses 의 목록 아이템. */
export interface MyCourseItem {
  courseId: number
  title: string
  region?: string
  startDate?: string
  endDate?: string
  totalDistanceM: number
  visibility: 'PRIVATE' | 'PUBLIC'
  copiedFromCourseId?: number
}

export interface CourseTag {
  tagId: number
  code: string
  name: string
  category: 'HIGHLIGHT' | 'CAUTION'
}

export interface PublicCourseItem {
  courseId: number
  title: string
  region?: string
  startDate?: string
  endDate?: string
  tripDays?: number
  totalDurationMinutes?: number
  totalDistanceM?: number
  thumbnailUrl?: string
  description?: string
  soloImpression?: SoloImpression
  paceType?: PaceType
  authorId: number
  authorName: string
  authorLevel: number
  authorTitle?: string
  likeCount: number
  copyCount: number
  reviewCount: number
  publishedAt: string
  tags: CourseTag[]
}

export type SoloImpression =
  'BETTER_ALONE' | 'COMFORTABLE_SOLO' | 'EASY_SOLO' | 'PREPARATION_NEEDED' | 'BETTER_TOGETHER'

export type PaceType = 'RELAXED' | 'BALANCED' | 'FULL'

export interface CourseDetailStop {
  courseStopId: number
  stopOrder: number
  dayNumber: number
  placeId: number
  name: string
  address?: string
  thumbnailUrl?: string
  /** 경유지(Place)의 위도. Place.latitude 가 DB 상 NOT NULL 이라 항상 내려온다. */
  latitude: number
  /** 경유지(Place)의 경도. Place.longitude 가 DB 상 NOT NULL 이라 항상 내려온다. */
  longitude: number
  stayDurationMinutes?: number
  memo?: string
}

/** GET /api/v1/courses/{courseId} 응답. */
export interface CourseDetailResponse {
  courseId: number
  title: string
  totalDurationMinutes: number
  totalDistanceM: number
  safetyPriority: boolean
  region?: string
  startDate?: string
  endDate?: string
  tripDays: number
  nightCount: number
  visibility: 'PRIVATE' | 'PUBLIC'
  owner: boolean
  description?: string
  soloImpression?: SoloImpression
  paceType?: PaceType
  authorComment?: string
  authorId: number
  authorName: string
  authorLevel: number
  authorTitle?: string
  liked: boolean
  likeCount: number
  copyCount: number
  reviewCount: number
  copiedFromCourseId?: number
  copiedFromCourseTitle?: string
  publishedAt?: string
  tags: CourseTag[]
  stops: CourseDetailStop[]
}

export interface CourseStopInput {
  placeId: number
  stopOrder: number
  dayNumber: number
  stayDurationMinutes?: number
  memo?: string
}

export interface PublishCourseRequest {
  description?: string
  soloImpression?: SoloImpression
  paceType?: PaceType
  authorComment?: string
  tagIds: number[]
}

export interface CourseLikeResponse {
  courseId: number
  liked: boolean
  likeCount: number
}

export interface CopyCourseResponse {
  courseId: number
  copiedFromCourseId: number
  title: string
}

export interface CourseReview {
  reviewId: number
  userId: number
  userName: string
  userTitle?: string
  experienceType: 'FOLLOWED' | 'ADAPTED'
  contents: string
  createdAt: string
  tags: CourseTag[]
}

export interface CreateCourseReviewRequest {
  experienceType: 'FOLLOWED' | 'ADAPTED'
  usedCourseId?: number
  contents: string
  tagIds: number[]
}

export interface TitleProgress {
  code: string
  name: string
  description: string
  unlocked: boolean
  equipped: boolean
  progress: number
  target: number
}

export interface GamificationProfile {
  level: number
  levelName: string
  experiencePoint: number
  nextLevelExperiencePoint?: number
  equippedTitleCode?: string
  equippedTitleName?: string
  titles: TitleProgress[]
}

export interface TravelerRankingItem {
  ranking: number
  userId: number
  nickname: string
  profileImageUrl?: string
  level: number
  levelName: string
  experiencePoint: number
  equippedTitleName?: string
  publicCourseCount: number
  receivedLikeCount: number
  receivedCopyCount: number
  me: boolean
}

export interface TravelerProfile {
  userId: number
  nickname: string
  profileImageUrl?: string
  level: number
  levelName: string
  experiencePoint: number
  equippedTitleName?: string
  publicCourseCount: number
  receivedLikeCount: number
  receivedCopyCount: number
  me: boolean
}

/** PUT /api/v1/courses/{courseId} 요청. */
export interface UpdateCourseRequest {
  title: string
  stops: CourseStopInput[]
}

/** PUT /api/v1/courses/{courseId} 응답. */
export interface UpdateCourseResponse {
  courseId: number
  totalDurationMinutes: number
  totalDistanceM: number
  stops: CourseStopResponse[]
}
