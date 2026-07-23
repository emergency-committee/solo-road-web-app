import { redirect } from '@tanstack/react-router'
import { useSessionStore } from './session-store'

/** 홈(_shell) 진입 가드: 온보딩 → 로그인 순서를 강제한다. */
export function requireHomeAccess() {
  const { accessToken, hasOnboarded } = useSessionStore.getState()
  if (!hasOnboarded) throw redirect({ to: '/onboarding' })
  if (!accessToken) throw redirect({ to: '/login' })
}

/** 로그인 화면 가드: 온보딩 전이면 온보딩으로, 이미 로그인했다면 홈으로 보낸다. */
export function loginPageGuard() {
  const { accessToken, hasOnboarded } = useSessionStore.getState()
  if (accessToken) throw redirect({ to: '/' })
  if (!hasOnboarded) throw redirect({ to: '/onboarding' })
}
