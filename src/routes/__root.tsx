import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useEffect } from 'react'
import { useSessionStore } from '@/shared/auth/session-store'
import { setAppFrameElement } from '@/shared/lib/app-frame'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const router = useRouter()

  useEffect(() => {
    const syncSessionAcrossTabs = (event: StorageEvent) => {
      if (event.key !== 'solo-road-session') return

      void Promise.resolve(useSessionStore.persist.rehydrate()).then(() => router.invalidate())
    }

    window.addEventListener('storage', syncSessionAcrossTabs)
    return () => window.removeEventListener('storage', syncSessionAcrossTabs)
  }, [router])

  return (
    <div className="app-frame" ref={setAppFrameElement}>
      <Outlet />
      {import.meta.env.VITE_ENABLE_DEVTOOLS === 'true' && <TanStackRouterDevtools />}
    </div>
  )
}
