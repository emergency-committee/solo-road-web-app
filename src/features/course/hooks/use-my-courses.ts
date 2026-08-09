import { useQuery } from '@tanstack/react-query'
import { getMyCourses } from '../api/course-api'

export function useMyCourses() {
  return useQuery({
    queryKey: ['courses', 'my'],
    queryFn: () => getMyCourses(),
  })
}
