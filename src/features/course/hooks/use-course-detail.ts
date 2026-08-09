import { useQuery } from '@tanstack/react-query'
import { getCourseDetail } from '../api/course-api'

export function useCourseDetail(courseId: number) {
  return useQuery({
    queryKey: ['courses', 'detail', courseId],
    queryFn: () => getCourseDetail(courseId),
    enabled: Number.isFinite(courseId),
  })
}
