import { cn } from '@/shared/lib/utils'

interface SectionHeaderProps {
  title: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function SectionHeader({ title, actionLabel, onAction, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{title}</h3>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="font-label-md text-label-md text-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
