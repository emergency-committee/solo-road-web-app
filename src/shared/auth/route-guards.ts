import { redirect } from '@tanstack/react-router'
import { useSessionStore } from './session-store'

/**
 * 홈(_shell) 진입 가드: 로그인 → 온보딩 순서를 강제한다.
 * (백엔드 온보딩 API가 로그인 사용자를 전제로 하므로 로그인이 먼저다)
 */
export function requireHomeAccess() {
  const { user, hasOnboarded } = useSessionStore.getState()
  if (!user) throw redirect({ to: '/login' })
  if (!hasOnboarded) throw redirect({ to: '/onboarding' })
}

/** 로그인 화면 가드: 이미 로그인했다면 온보딩 여부에 따라 온보딩/홈으로 보낸다. */
export function loginPageGuard() {
  const { user, hasOnboarded } = useSessionStore.getState()
  if (user && !hasOnboarded) throw redirect({ to: '/onboarding' })
  if (user) throw redirect({ to: '/' })
}

/** 온보딩 화면 가드: 로그인 전이면 로그인으로, 이미 온보딩했다면 홈으로 보낸다. */
export function onboardingPageGuard() {
  const { user, hasOnboarded } = useSessionStore.getState()
  if (!user) throw redirect({ to: '/login' })
  if (hasOnboarded) throw redirect({ to: '/' })
}
