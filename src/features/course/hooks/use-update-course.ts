import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCourse } from '../api/course-api'
import type { UpdateCourseRequest } from '../types/course.types'

export function useUpdateCourse(courseId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (req: UpdateCourseRequest) => updateCourse(courseId, req),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses', 'detail', courseId] })
      void queryClient.invalidateQueries({ queryKey: ['courses', 'my'] })
    },
  })
}
