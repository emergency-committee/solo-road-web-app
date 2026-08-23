import { Link } from '@tanstack/react-router'
import { Home, Route, User, Utensils } from 'lucide-react'
import { createPortal } from 'react-dom'

const NAV_ITEMS = [
  { to: '/', label: '홈', icon: Home, exact: true },
  { to: '/map', label: '혼밥지도', icon: Utensils, exact: false },
  { to: '/course', label: '코스', icon: Route, exact: false },
  { to: '/my', label: '마이', icon: User, exact: false },
] as const

export function BottomNav() {
  return createPortal(
    <nav className="bg-surface border-outline-variant px-gutter-mobile fixed bottom-0 left-1/2 z-50 flex h-16 w-full max-w-[430px] -translate-x-1/2 items-center justify-around border-t pb-[env(safe-area-inset-bottom)]">
      {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact }}
          activeProps={{ className: 'text-primary border-primary' }}
          className="text-on-surface-variant flex min-w-16 flex-col items-center justify-center gap-1 border-t-2 border-transparent pt-2 transition-colors"
        >
          <Icon className="size-6" />
          <span className="font-label-md text-label-md">{label}</span>
        </Link>
      ))}
    </nav>,
    document.body,
  )
}
