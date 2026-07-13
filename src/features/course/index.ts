export { useCourseStream } from './hooks/use-course-stream'
export type { CourseRequest, SSEMessageData } from './types/course.types'

export { CourseCreateForm } from './components/CourseCreateForm'
export { CourseDateRangeCalendar } from './components/CourseDateRangeCalendar'
export type { DateRange } from './components/CourseDateRangeCalendar'
export { useCourseEditStore } from './store/course-edit-store'
export {
  mockCourseDetails,
  mockRecommendedCourses,
  mockSavedCourseRows,
} from './mocks/course-mocks'
export type {
  CourseDetail,
  CourseStop,
  RecommendedCourse,
  SavedCourseRow,
} from './types/course-ui.types'
