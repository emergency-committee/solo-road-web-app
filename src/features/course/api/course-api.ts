import { apiRequest } from '@/shared/api/client'
import { API_PREFIX } from '@/shared/api/config'
import { buildQueryString } from '@/shared/api/query-string'
import type { PageResponse } from '@/shared/api/types'
import type {
  CourseDetailResponse,
  CopyCourseResponse,
  CourseLikeResponse,
  CourseReview,
  CourseTag,
  CreateCourseReviewRequest,
  GamificationProfile,
  CourseRecommendationItem,
  GenerateCourseRequest,
  GenerateCourseResponse,
  MyCourseItem,
  PublicCourseItem,
  PublishCourseRequest,
  TravelerProfile,
  TravelerRankingItem,
  UpdateCourseRequest,
  UpdateCourseResponse,
} from '../types/course.types'
import {
  filterMockPublicCourses,
  mockCommunityCourseDetails,
  mockCommunityPublicCourses,
  mockCommunityReviews,
  mockCommunityTags,
  mockGamificationProfile,
  mockMyCourses,
  mockTravelerProfiles,
  mockTravelerRankings,
} from '../mocks/course-community-mocks'

const mockCopiedCourses: MyCourseItem[] = [...mockMyCourses]

function isCommunityMockEnabled() {
  return import.meta.env.VITE_AUTH_MOCK === 'true'
}

export function generateCourse(req: GenerateCourseRequest) {
  return apiRequest<GenerateCourseResponse>(`${API_PREFIX}/courses/generate`, {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

export interface CourseRecommendationsParams {
  region?: string
  lat?: number
  lng?: number
  page?: number
  size?: number
}

export function getCourseRecommendations(params: CourseRecommendationsParams = {}) {
  const qs = buildQueryString({ ...params })
  return apiRequest<PageResponse<CourseRecommendationItem>>(
    `${API_PREFIX}/courses/recommendations${qs}`,
  )
}

export function getMyCourses() {
  if (isCommunityMockEnabled()) return Promise.resolve({ content: mockCopiedCourses })
  return apiRequest<{ content: MyCourseItem[] }>(`${API_PREFIX}/users/me/courses`)
}

export function getCourseDetail(courseId: number) {
  const mockCourse = mockCommunityCourseDetails[courseId]
  if (isCommunityMockEnabled() && mockCourse) return Promise.resolve(mockCourse)
  return apiRequest<CourseDetailResponse>(`${API_PREFIX}/courses/${courseId.toString()}`)
}

export function updateCourse(courseId: number, req: UpdateCourseRequest) {
  const mockCourse = mockCommunityCourseDetails[courseId]
  if (isCommunityMockEnabled() && mockCourse) {
    mockCourse.title = req.title
    mockCourse.stops = req.stops.map((input, index) => {
      const existing = mockCourse.stops.find((stop) => stop.placeId === input.placeId)
      return {
        courseStopId: existing?.courseStopId ?? courseId * 10 + index,
        stopOrder: input.stopOrder,
        dayNumber: input.dayNumber,
        placeId: input.placeId,
        name: existing?.name ?? `추가한 장소 ${index + 1}`,
        latitude: existing?.latitude ?? 37.5665,
        longitude: existing?.longitude ?? 126.978,
        ...(existing?.thumbnailUrl !== undefined && { thumbnailUrl: existing.thumbnailUrl }),
        ...(input.stayDurationMinutes !== undefined && {
          stayDurationMinutes: input.stayDurationMinutes,
        }),
        ...(input.memo !== undefined && { memo: input.memo }),
      }
    })
    return Promise.resolve({
      courseId,
      totalDurationMinutes: mockCourse.totalDurationMinutes,
      totalDistanceM: mockCourse.totalDistanceM,
      stops: mockCourse.stops.map((stop) => ({
        courseStopId: stop.courseStopId,
        stopOrder: stop.stopOrder,
        dayNumber: stop.dayNumber,
        placeId: stop.placeId,
        ...(stop.stayDurationMinutes !== undefined && {
          stayDurationMinutes: stop.stayDurationMinutes,
        }),
        ...(stop.memo !== undefined && { memo: stop.memo }),
      })),
    })
  }
  return apiRequest<UpdateCourseResponse>(`${API_PREFIX}/courses/${courseId.toString()}`, {
    method: 'PUT',
    body: JSON.stringify(req),
  })
}

export function deleteCourse(courseId: number) {
  if (isCommunityMockEnabled() && mockCommunityCourseDetails[courseId]) {
    delete mockCommunityCourseDetails[courseId]
    const copiedIndex = mockCopiedCourses.findIndex((course) => course.courseId === courseId)
    if (copiedIndex >= 0) mockCopiedCourses.splice(copiedIndex, 1)
    return Promise.resolve()
  }
  return apiRequest<void>(`${API_PREFIX}/courses/${courseId.toString()}`, {
    method: 'DELETE',
  })
}

export interface DiscoverCoursesParams {
  sort?: 'HOT' | 'LATEST'
  region?: string
  page?: number
  size?: number
}

export function getPublicCourses(params: DiscoverCoursesParams = {}) {
  if (isCommunityMockEnabled()) {
    const page = params.page ?? 0
    const size = params.size ?? 20
    const filtered = filterMockPublicCourses(params.sort, params.region)
    const content = filtered.slice(page * size, page * size + size)
    return Promise.resolve({
      content,
      page,
      size,
      totalElements: filtered.length,
      hasNext: (page + 1) * size < filtered.length,
    })
  }
  const qs = buildQueryString({ ...params })
  return apiRequest<PageResponse<PublicCourseItem>>(`${API_PREFIX}/courses/discover${qs}`)
}

export function getTravelerPublicCourses(travelerId: number, page = 0, size = 20) {
  if (isCommunityMockEnabled()) {
    const filtered = mockCommunityPublicCourses.filter((course) => course.authorId === travelerId)
    return Promise.resolve({
      content: filtered.slice(page * size, page * size + size),
      page,
      size,
      totalElements: filtered.length,
      hasNext: (page + 1) * size < filtered.length,
    })
  }
  const qs = buildQueryString({ page, size })
  return apiRequest<PageResponse<PublicCourseItem>>(
    `${API_PREFIX}/users/${travelerId.toString()}/public-courses${qs}`,
  )
}

export function getCourseTags() {
  if (isCommunityMockEnabled()) return Promise.resolve(mockCommunityTags)
  return apiRequest<CourseTag[]>(`${API_PREFIX}/courses/tags`)
}

export function publishCourse(courseId: number, req: PublishCourseRequest) {
  const mockCourse = mockCommunityCourseDetails[courseId]
  if (isCommunityMockEnabled() && mockCourse) {
    mockCourse.visibility = 'PUBLIC'
    if (req.description !== undefined) mockCourse.description = req.description
    else delete mockCourse.description
    if (req.soloImpression !== undefined) mockCourse.soloImpression = req.soloImpression
    else delete mockCourse.soloImpression
    if (req.paceType !== undefined) mockCourse.paceType = req.paceType
    else delete mockCourse.paceType
    if (req.authorComment !== undefined) mockCourse.authorComment = req.authorComment
    else delete mockCourse.authorComment
    mockCourse.tags = mockCommunityTags.filter((tag) => req.tagIds.includes(tag.tagId))
    mockCourse.publishedAt = new Date().toISOString()
    return Promise.resolve(mockCourse)
  }
  return apiRequest<CourseDetailResponse>(`${API_PREFIX}/courses/${courseId.toString()}/publish`, {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

export function unpublishCourse(courseId: number) {
  const mockCourse = mockCommunityCourseDetails[courseId]
  if (isCommunityMockEnabled() && mockCourse) {
    mockCourse.visibility = 'PRIVATE'
    return Promise.resolve()
  }
  return apiRequest<void>(`${API_PREFIX}/courses/${courseId.toString()}/publish`, {
    method: 'DELETE',
  })
}

export function setCourseLike(courseId: number, liked: boolean) {
  const mockCourse = mockCommunityCourseDetails[courseId]
  if (isCommunityMockEnabled() && mockCourse) {
    if (mockCourse.liked !== liked) mockCourse.likeCount += liked ? 1 : -1
    mockCourse.liked = liked
    const listCourse = mockCommunityPublicCourses.find((course) => course.courseId === courseId)
    if (listCourse) listCourse.likeCount = mockCourse.likeCount
    return Promise.resolve({ courseId, liked, likeCount: mockCourse.likeCount })
  }
  return apiRequest<CourseLikeResponse>(`${API_PREFIX}/courses/${courseId.toString()}/like`, {
    method: liked ? 'POST' : 'DELETE',
  })
}

export function copyCourse(courseId: number) {
  const source = mockCommunityCourseDetails[courseId]
  if (isCommunityMockEnabled() && source) {
    const copiedCourseId = courseId + 100000
    mockCommunityCourseDetails[copiedCourseId] = {
      ...source,
      courseId: copiedCourseId,
      title: `${source.title} 나의 일정`,
      visibility: 'PRIVATE',
      owner: true,
      liked: false,
      likeCount: 0,
      copyCount: 0,
      reviewCount: 0,
      copiedFromCourseId: source.courseId,
      copiedFromCourseTitle: source.title,
      tags: [],
      stops: source.stops.map((stop) => ({ ...stop })),
    }
    if (!mockCopiedCourses.some((course) => course.courseId === copiedCourseId)) {
      mockCopiedCourses.unshift({
        courseId: copiedCourseId,
        title: `${source.title} 나의 일정`,
        ...(source.region !== undefined && { region: source.region }),
        totalDistanceM: source.totalDistanceM,
        visibility: 'PRIVATE',
        copiedFromCourseId: source.courseId,
      })
    }
    return Promise.resolve({ courseId: copiedCourseId, copiedFromCourseId: courseId, title: `${source.title} 나의 일정` })
  }
  return apiRequest<CopyCourseResponse>(`${API_PREFIX}/courses/${courseId.toString()}/copy`, {
    method: 'POST',
  })
}

export function getCourseReviews(courseId: number, page = 0, size = 20) {
  if (isCommunityMockEnabled() && mockCommunityCourseDetails[courseId]) {
    const reviews = mockCommunityReviews[courseId] ?? []
    return Promise.resolve({
      content: reviews.slice(page * size, page * size + size),
      page,
      size,
      totalElements: reviews.length,
      hasNext: (page + 1) * size < reviews.length,
    })
  }
  const qs = buildQueryString({ page, size })
  return apiRequest<PageResponse<CourseReview>>(
    `${API_PREFIX}/courses/${courseId.toString()}/reviews${qs}`,
  )
}

export function createCourseReview(courseId: number, req: CreateCourseReviewRequest) {
  if (isCommunityMockEnabled() && mockCommunityCourseDetails[courseId]) {
    const review: CourseReview = {
      reviewId: Date.now(),
      userId: 999,
      userName: '솔로더 여행자',
      experienceType: req.experienceType,
      contents: req.contents,
      createdAt: new Date().toISOString(),
      tags: mockCommunityTags.filter((tag) => req.tagIds.includes(tag.tagId)),
    }
    mockCommunityReviews[courseId] = [review, ...(mockCommunityReviews[courseId] ?? [])]
    return Promise.resolve(review)
  }
  return apiRequest<CourseReview>(`${API_PREFIX}/courses/${courseId.toString()}/reviews`, {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

export function getMyGamification() {
  if (isCommunityMockEnabled()) return Promise.resolve(mockGamificationProfile)
  return apiRequest<GamificationProfile>(`${API_PREFIX}/users/me/gamification`)
}

export function getTravelerRanking(page = 0, size = 30) {
  if (isCommunityMockEnabled()) {
    const content = mockTravelerRankings.slice(page * size, page * size + size)
    return Promise.resolve({
      content,
      page,
      size,
      totalElements: mockTravelerRankings.length,
      hasNext: (page + 1) * size < mockTravelerRankings.length,
    })
  }
  const qs = buildQueryString({ page, size })
  return apiRequest<PageResponse<TravelerRankingItem>>(`${API_PREFIX}/users/rankings${qs}`)
}

export function getTravelerProfile(travelerId: number) {
  if (isCommunityMockEnabled()) {
    const profile = mockTravelerProfiles[travelerId]
    if (profile) return Promise.resolve(profile)
  }
  return apiRequest<TravelerProfile>(
    `${API_PREFIX}/users/${travelerId.toString()}/community-profile`,
  )
}

export function equipTitle(titleCode: string) {
  if (isCommunityMockEnabled()) {
    const title = mockGamificationProfile.titles.find((item) => item.code === titleCode)
    if (title?.unlocked) {
      mockGamificationProfile.equippedTitleCode = titleCode
      mockGamificationProfile.equippedTitleName = title.name
      mockGamificationProfile.titles = mockGamificationProfile.titles.map((item) => ({
        ...item,
        equipped: item.code === titleCode,
      }))
    }
    return Promise.resolve(mockGamificationProfile)
  }
  return apiRequest<GamificationProfile>(`${API_PREFIX}/users/me/gamification/title`, {
    method: 'PATCH',
    body: JSON.stringify({ titleCode }),
  })
}
