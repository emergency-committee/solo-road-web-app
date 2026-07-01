import { useCallback, useRef, useState } from 'react'
import { streamCourse } from '../api/course-api'
import type { CourseRequest } from '../types/course.types'

interface UseCourseStreamReturn {
  content: string
  isStreaming: boolean
  error: Error | null
  generate: (req: CourseRequest) => Promise<void>
  abort: () => void
}

export function useCourseStream(): UseCourseStreamReturn {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const generate = useCallback(async (req: CourseRequest) => {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setContent('')
    setError(null)
    setIsStreaming(true)

    try {
      await streamCourse(
        req,
        {
          onData: (data) => {
            if (!data.done) setContent((prev) => prev + data.content)
          },
          onError: (err) => {
            setError(err)
            setIsStreaming(false)
          },
          onDone: () => setIsStreaming(false),
        },
        controller.signal,
      )
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setIsStreaming(false)
    }
  }, [])

  const abort = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
  }, [])

  return { content, isStreaming, error, generate, abort }
}
