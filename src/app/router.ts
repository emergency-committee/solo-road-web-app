import { createRouter } from '@tanstack/react-router'
import { useSessionStore } from '@/shared/auth/session-store'
import { routeTree } from '../routeTree.gen'
import { queryClient } from './query-client'

export const router = createRouter({
  routeTree,
  context: { queryClient },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// 로그인 상태였다가 세션이 사라지면(토큰 만료로 인한 401, 로그아웃) 즉시 로그인 화면으로 보낸다.
// 라우트의 beforeLoad 가드(requireHomeAccess 등)는 "이동할 때"만 실행되므로,
// 이미 열려 있는 화면에서 세션이 끊기는 경우는 여기서 별도로 처리해야 한다.
useSessionStore.subscribe((state, prevState) => {
  if (prevState.user && !state.user) {
    void router.navigate({ to: '/login' })
  }
})
