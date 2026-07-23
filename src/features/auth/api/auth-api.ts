import { apiRequest } from '@/shared/api/client'

export async function logoutRequest(): Promise<void> {
  if (import.meta.env.VITE_AUTH_MOCK === 'true') {
    return
  }

  // TODO: 백엔드 로그아웃/토큰 폐기 엔드포인트 확정 후 연결.
  // 실패하더라도 로컬 세션 삭제는 항상 수행되어야 하므로 호출부에서 에러를 삼킨다.
  await apiRequest<void>('/api/v1/auth/logout', { method: 'POST' })
}
