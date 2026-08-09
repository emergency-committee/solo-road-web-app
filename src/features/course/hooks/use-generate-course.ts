import { useMutation, useQueryClient } from '@tanstack/react-query'
import { generateCourse } from '../api/course-api'
import type { GenerateCourseRequest } from '../types/course.types'

export function useGenerateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (req: GenerateCourseRequest) => generateCourse(req),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses', 'my'] })
    },
  })
}
