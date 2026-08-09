import { apiRequest } from '@/shared/api/client'
import { API_PREFIX } from '@/shared/api/config'
import { buildQueryString } from '@/shared/api/query-string'
import type { PageResponse } from '@/shared/api/types'
import type {
  CourseDetailResponse,
  CourseRecommendationItem,
  GenerateCourseRequest,
  GenerateCourseResponse,
  MyCourseItem,
  UpdateCourseRequest,
  UpdateCourseResponse,
} from '../types/course.types'

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
  return apiRequest<{ content: MyCourseItem[] }>(`${API_PREFIX}/users/me/courses`)
}

export function getCourseDetail(courseId: number) {
  return apiRequest<CourseDetailResponse>(`${API_PREFIX}/courses/${courseId.toString()}`)
}

export function updateCourse(courseId: number, req: UpdateCourseRequest) {
  return apiRequest<UpdateCourseResponse>(`${API_PREFIX}/courses/${courseId.toString()}`, {
    method: 'PUT',
    body: JSON.stringify(req),
  })
}

export function deleteCourse(courseId: number) {
  return apiRequest<void>(`${API_PREFIX}/courses/${courseId.toString()}`, {
    method: 'DELETE',
  })
}
