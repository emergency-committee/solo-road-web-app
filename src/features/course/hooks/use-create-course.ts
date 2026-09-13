import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCourse } from '../api/course-api'
import type { CreateCourseRequest } from '../types/course.types'

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (req: CreateCourseRequest) => createCourse(req),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses', 'my'] })
    },
  })
}
