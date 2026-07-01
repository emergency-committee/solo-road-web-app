import { fetchSSE, type SSECallbacks } from '@/shared/api/sse-client'
import type { CourseRequest, SSEMessageData } from '../types/course.types'

export function streamCourse(
  req: CourseRequest,
  callbacks: SSECallbacks<SSEMessageData>,
  signal?: AbortSignal,
) {
  return fetchSSE<CourseRequest, SSEMessageData>('/api/v1/course', req, callbacks, signal)
}
