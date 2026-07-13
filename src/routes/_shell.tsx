import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BottomNav } from '@/shared/components/layout/BottomNav'

export const Route = createFileRoute('/_shell')({
  component: ShellLayout,
})

function ShellLayout() {
  return (
    <div className="pb-16">
      <Outlet />
      <BottomNav />
    </div>
  )
}
