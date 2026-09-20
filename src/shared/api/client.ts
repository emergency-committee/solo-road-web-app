import { useSessionStore } from '@/shared/auth/session-store'
import { buildHeaders } from './build-headers'
import { API_PREFIX, AUTH_MOCK_ENABLED, BASE_URL } from './config'
import { ApiError, type ApiErrorBody } from './errors'

const AUTH_PATH_PREFIX = `${API_PREFIX}/auth/`

let refreshPromise: Promise<boolean> | null = null

/**
 * 액세스 토큰(1시간) 만료 시 리프레시 토큰(14일) 쿠키로 재발급을 시도한다.
 * 동시에 여러 요청이 401을 받아도 리프레시 호출은 한 번만 나가도록 진행 중인 프로미스를 공유한다.
 */
function refreshAccessToken(): Promise<boolean> {
  refreshPromise ??= fetch(`${BASE_URL}${API_PREFIX}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetryAfterRefresh = false,
): Promise<T> {
  const { headers: extraHeaders, ...rest } = options
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    credentials: 'include',
    headers: buildHeaders(extraHeaders as HeadersInit | undefined),
  })

  if (!response.ok) {
    const body = await response.text()
    if (response.status === 401 && !AUTH_MOCK_ENABLED) {
      // /auth/** 호출 자체의 401(로그인 필요/리프레시 만료)은 재발급 대상이 아니다.
      const shouldTryRefresh = !isRetryAfterRefresh && !endpoint.startsWith(AUTH_PATH_PREFIX)
      const refreshed = shouldTryRefresh && (await refreshAccessToken())
      if (refreshed) {
        return apiRequest<T>(endpoint, options, true)
      }
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
