import { apiRequest } from '@/shared/api/client'

export interface KakaoLoginResult {
  isNewUser: boolean
  user: {
    userId: number
    gender: string | null
    provider: string
  }
}

export async function kakaoLoginRequest(kakaoAccessToken: string): Promise<KakaoLoginResult> {
  return apiRequest<KakaoLoginResult>('/api/v1/auth/kakao/login', {
    method: 'POST',
    body: JSON.stringify({ accessToken: kakaoAccessToken }),
  })
}

export async function logoutRequest(): Promise<void> {
  if (import.meta.env.VITE_AUTH_MOCK === 'true') {
    return
  }

  // 실패하더라도 로컬 세션 삭제는 항상 수행되어야 하므로 호출부에서 에러를 삼킨다.
  await apiRequest<void>('/api/v1/auth/logout', { method: 'POST' })
}
