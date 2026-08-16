import { useSessionStore } from '@/shared/auth/session-store'
import { buildHeaders } from './build-headers'
import { AUTH_MOCK_ENABLED, BASE_URL } from './config'
import { ApiError, type ApiErrorBody } from './errors'

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { headers: extraHeaders, ...rest } = options
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    credentials: 'include',
    headers: buildHeaders(extraHeaders as HeadersInit | undefined),
  })

  if (!response.ok) {
    const body = await response.text()
    if (response.status === 401 && !AUTH_MOCK_ENABLED) {
      useSessionStore.getState().clearSession()
    }

    let errorBody: ApiErrorBody | undefined
    try {
      const parsed: unknown = JSON.parse(body)
      if (
        parsed &&
        typeof parsed === 'object' &&
        'message' in parsed &&
        typeof (parsed as { message: unknown }).message === 'string'
      ) {
        errorBody = parsed as ApiErrorBody
      }
    } catch {
      // 백엔드가 JSON이 아닌 본문(예: 빈 응답)을 내려준 경우 body 원문만 사용한다.
    }

    throw new ApiError(response.status, body, errorBody)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
