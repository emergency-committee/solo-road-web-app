import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCourse } from '../api/course-api'

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: number) => deleteCourse(courseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses', 'my'] })
    },
  })
}
