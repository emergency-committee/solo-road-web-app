import { useQuery } from '@tanstack/react-query'
import { getCourseRecommendations, type CourseRecommendationsParams } from '../api/course-api'

export function useCourseRecommendations(params: CourseRecommendationsParams = {}) {
  return useQuery({
    queryKey: ['courses', 'recommendations', params],
    queryFn: () => getCourseRecommendations(params),
  })
}
