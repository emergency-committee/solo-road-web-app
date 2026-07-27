import { useMutation } from '@tanstack/react-query'
import { generateCourse } from '../api/course-api'
import type { GenerateCourseRequest } from '../types/course.types'

export function useGenerateCourse() {
  return useMutation({
    mutationFn: (req: GenerateCourseRequest) => generateCourse(req),
  })
}
