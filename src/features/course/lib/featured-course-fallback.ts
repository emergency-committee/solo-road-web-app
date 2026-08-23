import { filterMockPublicCourses } from '../mocks/course-community-mocks'
import type { PublicCourseItem } from '../types/course.types'

export const mockFeaturedPublicCourses = filterMockPublicCourses('HOT').slice(0, 2)

export function resolveFeaturedCourses(courses: PublicCourseItem[]) {
  return courses.length > 0 ? courses : mockFeaturedPublicCourses
}
