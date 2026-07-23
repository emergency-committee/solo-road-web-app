import { buildHeaders } from './build-headers'
import { BASE_URL } from './config'
import { ApiError } from './errors'

export interface SSECallbacks<T> {
  onData: (data: T) => void
  onError: (error: Error) => void
  onDone: () => void
}

/**
 * POST 요청으로 SSE 스트림을 소비하는 유틸리티.
 * 백엔드 이벤트 형식: event: message|error|done + data: JSON
 */
export async function fetchSSE<TBody, TData>(
  endpoint: string,
  body: TBody,
  callbacks: SSECallbacks<TData>,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
    signal: signal ?? null,
  })

  if (!response.ok) {
    throw new ApiError(response.status, await response.text())
  }

  if (!response.body) {
    throw new Error('Response body is null')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let currentEvent = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const rawLine of lines) {
        const line = rawLine.trimEnd()

        if (line.startsWith('event: ')) {
          currentEvent = line.slice(7)
        } else if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6)
          if (currentEvent === 'done') {
            callbacks.onDone()
            return
          }
          if (currentEvent === 'error') {
            const errData = JSON.parse(jsonStr) as { error: string }
            callbacks.onError(new Error(errData.error))
            return
          }
          callbacks.onData(JSON.parse(jsonStr) as TData)
        } else if (line === '') {
          currentEvent = ''
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
