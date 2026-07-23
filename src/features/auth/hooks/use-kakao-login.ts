import { useNavigate } from '@tanstack/react-router'
import { useSessionStore } from '@/shared/auth/session-store'

export function useKakaoLogin() {
  const navigate = useNavigate()

  function startLogin() {
    // TODO: 실제 카카오 OAuth 연동(Authorization Code 방식) 및 백엔드 토큰 교환으로 교체.
    // 지금은 버튼 클릭 시 바로 다음 화면(홈)으로 넘어가는 자리표시자 동작만 수행한다.
    useSessionStore.getState().setSession({
      accessToken: 'local-session-token',
      user: { id: 'local-user', nickname: '솔로더 여행자' },
    })
    navigate({ to: '/' })
  }

  return { startLogin }
}
