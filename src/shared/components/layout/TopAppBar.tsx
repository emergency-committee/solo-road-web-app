import type { ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface TopAppBarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  actions?: ReactNode
  sticky?: boolean
  className?: string
}

export function TopAppBar({
  title,
  showBack = false,
  onBack,
  actions,
  sticky = true,
  className,
}: TopAppBarProps) {
  const router = useRouter()

  return (
    <header
      className={cn(
        'bg-surface px-margin-mobile flex h-14 w-full items-center gap-4',
        sticky && 'sticky top-0 z-40',
        className,
      )}
    >
      {showBack && (
        <button
          type="button"
          onClick={onBack ?? (() => router.history.back())}
          className="hover:bg-surface-container-high text-primary -ml-2 flex size-10 shrink-0 items-center justify-center rounded-full transition-colors active:scale-95"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="size-6" />
        </button>
      )}
      {title && (
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary flex-1 truncate">
          {title}
        </h1>
      )}
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </header>
  )
}
