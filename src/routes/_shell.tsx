import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { BottomNav } from '@/shared/components/layout/BottomNav'
import { requireHomeAccess } from '@/shared/auth/route-guards'

export const Route = createFileRoute('/_shell')({
  beforeLoad: requireHomeAccess,
  component: ShellLayout,
})

function ShellLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const hideBottomNav = pathname.startsWith('/course/')

  return (
    <div className="pb-16">
      <Outlet />
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}
