import { useNavigate } from '@tanstack/react-router'
import { useSessionStore } from '@/shared/auth/session-store'
import { logoutRequest } from '../api/auth-api'

export function useLogout() {
  const navigate = useNavigate()

  return async function logout() {
    try {
      await logoutRequest()
    } catch {
      // 로그아웃 API 실패와 무관하게 로컬 세션은 항상 정리한다.
    } finally {
      useSessionStore.getState().clearSession()
      navigate({ to: '/login' })
    }
  }
}
