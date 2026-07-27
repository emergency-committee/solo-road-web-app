import { useSessionStore } from '@/shared/auth/session-store'
import { buildHeaders } from './build-headers'
import { BASE_URL } from './config'
import { ApiError } from './errors'

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { headers: extraHeaders, ...rest } = options
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    credentials: 'include',
    headers: buildHeaders(extraHeaders as HeadersInit | undefined),
  })

  if (!response.ok) {
    const body = await response.text()
    if (response.status === 401) {
      useSessionStore.getState().clearSession()
    }
    throw new ApiError(response.status, body)
  }

  return response.json() as Promise<T>
}
