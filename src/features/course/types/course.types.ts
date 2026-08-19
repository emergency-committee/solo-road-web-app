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
  placeId: number
  stayDurationMinutes?: number
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
  totalDistanceM: number
}

export interface CourseDetailStop {
  courseStopId: number
  stopOrder: number
  placeId: number
  name: string
  thumbnailUrl?: string
  /** 경유지(Place)의 위도. Place.latitude 가 DB 상 NOT NULL 이라 항상 내려온다. */
  latitude: number
  /** 경유지(Place)의 경도. Place.longitude 가 DB 상 NOT NULL 이라 항상 내려온다. */
  longitude: number
  stayDurationMinutes?: number
}

/** GET /api/v1/courses/{courseId} 응답. */
export interface CourseDetailResponse {
  courseId: number
  title: string
  totalDurationMinutes: number
  totalDistanceM: number
  safetyPriority: boolean
  stops: CourseDetailStop[]
}

export interface CourseStopInput {
  placeId: number
  stopOrder: number
  stayDurationMinutes?: number
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
