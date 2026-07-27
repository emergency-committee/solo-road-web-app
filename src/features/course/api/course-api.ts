import { apiRequest } from '@/shared/api/client'
import type { GenerateCourseRequest, GenerateCourseResponse } from '../types/course.types'

export function generateCourse(req: GenerateCourseRequest) {
  return apiRequest<GenerateCourseResponse>('/api/v1/courses/generate', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}
