import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-outline-variant gap-md p-xl flex flex-col items-center rounded-xl border-2 border-dashed text-center',
        className,
      )}
    >
      <div className="bg-primary-fixed text-on-primary-fixed flex size-14 items-center justify-center rounded-full">
        {icon}
      </div>
      <div>
        <p className="font-label-md text-label-md text-on-surface">{title}</p>
        {description && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{description}</p>
        )}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="font-label-md text-label-md bg-primary px-lg py-sm text-on-primary rounded-full transition-colors active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
