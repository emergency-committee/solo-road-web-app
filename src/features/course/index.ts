export { useGenerateCourse } from './hooks/use-generate-course'
export { useCourseRecommendations } from './hooks/use-course-recommendations'
export { useMyCourses } from './hooks/use-my-courses'
export { useCourseDetail } from './hooks/use-course-detail'
export { useUpdateCourse } from './hooks/use-update-course'
export { useDeleteCourse } from './hooks/use-delete-course'
export type {
  CourseDetailResponse,
  CourseDetailStop,
  CourseRecommendationItem,
  GenerateCourseRequest,
  GenerateCourseResponse,
  MyCourseItem,
} from './types/course.types'

export { CourseCreateForm } from './components/CourseCreateForm'
export type { CourseCreateFormData } from './components/CourseCreateForm'
export { CourseDateRangeCalendar } from './components/CourseDateRangeCalendar'
export type { DateRange } from './components/CourseDateRangeCalendar'
export { useCourseEditStore } from './store/course-edit-store'
export type { CourseStop } from './types/course-ui.types'
