import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { setAppFrameElement } from '@/shared/lib/app-frame'

export const Route = createRootRoute({
  component: () => (
    <div className="app-frame" ref={setAppFrameElement}>
      <Outlet />
      {import.meta.env.VITE_ENABLE_DEVTOOLS === 'true' && <TanStackRouterDevtools />}
    </div>
  ),
})
