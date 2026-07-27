import { useNavigate } from '@tanstack/react-router'
import { useSessionStore } from '@/shared/auth/session-store'
import { kakaoAuthorizeUrl } from '../api/kakao-oauth'

export function useKakaoLogin() {
  const navigate = useNavigate()

  function startLogin() {
    if (import.meta.env.VITE_AUTH_MOCK === 'true') {
      useSessionStore.getState().setSession({
        user: { id: 'local-user', nickname: '솔로더 여행자' },
      })
      const hasOnboarded = useSessionStore.getState().hasOnboarded
      navigate({ to: hasOnboarded ? '/' : '/onboarding' })
      return
    }

    // 카카오 인가 화면으로 전체 페이지 리다이렉트. 콜백은 /login/kakao/callback 라우트가 처리한다.
    window.location.href = kakaoAuthorizeUrl()
  }

  return { startLogin }
}
