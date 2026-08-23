export { useGenerateCourse } from './hooks/use-generate-course'
export { useCourseRecommendations } from './hooks/use-course-recommendations'
export { useMyCourses } from './hooks/use-my-courses'
export { useCourseDetail } from './hooks/use-course-detail'
export { useUpdateCourse } from './hooks/use-update-course'
export { useDeleteCourse } from './hooks/use-delete-course'
export {
  useCopyCourse,
  useCourseReviews,
  useCourseTags,
  useCreateCourseReview,
  useEquipTitle,
  useMyGamification,
  usePublicCourses,
  usePublishCourse,
  useTravelerProfile,
  useTravelerPublicCourses,
  useTravelerRanking,
  useToggleCourseLike,
  useUnpublishCourse,
} from './hooks/use-course-community'
export type {
  CourseDetailResponse,
  CourseDetailStop,
  CourseRecommendationItem,
  GenerateCourseRequest,
  GenerateCourseResponse,
  MyCourseItem,
  PublicCourseItem,
  CourseReview,
  CourseTag,
  GamificationProfile,
  PaceType,
  SoloImpression,
  TravelerProfile,
  TravelerRankingItem,
} from './types/course.types'

export { CourseCreateForm } from './components/CourseCreateForm'
export type { CourseCreateFormData } from './components/CourseCreateForm'
export { CourseDateRangeCalendar } from './components/CourseDateRangeCalendar'
export { CourseLegButton } from './components/CourseLegButton'
export { CourseOverviewMap } from './components/CourseOverviewMap'
export { PublicCourseCard } from './components/PublicCourseCard'
export { PublishCourseDialog } from './components/PublishCourseDialog'
export { CourseReviewsSection } from './components/CourseReviewsSection'
export { GamificationSummary } from './components/GamificationSummary'
export {
  PACE_OPTIONS,
  SOLO_IMPRESSION_OPTIONS,
  paceLabel,
  soloImpressionLabel,
} from './lib/course-community-labels'
export { isSafetyRouteRegion } from './lib/course-region'
export {
  calculateTripDays,
  formatCourseDateRange,
  formatCourseDayDate,
  formatTripLength,
} from './lib/course-schedule'
export { mockCourseDetails, mockSavedCourseRows } from './mocks/course-mocks'
export { resolveFeaturedCourses } from './lib/featured-course-fallback'
export { getCourseDayColor } from './lib/course-map-days'
export type { DateRange } from './components/CourseDateRangeCalendar'
export { useCourseEditStore } from './store/course-edit-store'
export type { CourseDetail, CourseStop, DemoCourseStop } from './types/course-ui.types'
