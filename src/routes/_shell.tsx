import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BottomNav } from '@/shared/components/layout/BottomNav'
import { requireHomeAccess } from '@/shared/auth/route-guards'

export const Route = createFileRoute('/_shell')({
  beforeLoad: requireHomeAccess,
  component: ShellLayout,
})

function ShellLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  )
}
