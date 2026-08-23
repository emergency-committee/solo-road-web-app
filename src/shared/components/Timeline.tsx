import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export function Timeline({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col', className)}>{children}</div>
}

interface TimelineBadge {
  label: string
  tone?: 'primary' | 'secondary' | 'success' | 'info' | 'neutral'
}

interface TimelineItemProps {
  index: number
  title: string
  isLast?: boolean
  time?: string
  durationLabel?: string
  imageUrl?: string
  imageAlt?: string
  subtitle?: string
  badges?: TimelineBadge[]
  after?: ReactNode
  editable?: boolean
  onEdit?: () => void
  onRemove?: () => void
  dragHandle?: ReactNode
  className?: string
}

const BADGE_TONE_CLASSES: Record<NonNullable<TimelineBadge['tone']>, string> = {
  primary: 'bg-[#00515f]/10 text-[#00515f]',
  secondary: 'bg-secondary/15 text-secondary',
  success: 'bg-[#ecfdf5] text-[#027a48]',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-surface-container text-on-surface-variant',
}

export function TimelineItem({
  index,
  title,
  isLast = false,
  time,
  durationLabel,
  imageUrl,
  imageAlt,
  subtitle,
  badges,
  after,
  editable = false,
  onEdit,
  onRemove,
  dragHandle,
  className,
}: TimelineItemProps) {
  return (
    <div className={cn('flex gap-4', className)}>
      <div className="flex shrink-0 flex-col items-center">
        <div className="bg-primary z-10 flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm">
          {index}
        </div>
        {!isLast && (
          <div
            className="mt-1 w-0.5 flex-1"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, #bec8cb 0, #bec8cb 4px, transparent 4px, transparent 8px)',
            }}
          />
        )}
      </div>
      <div className="pb-lg flex-1">
        {time && (
          <div className="mb-xs flex items-center gap-2">
            <span className="font-label-md text-label-md bg-primary-fixed text-primary rounded px-2 py-0.5">
              {time}
            </span>
            {durationLabel && (
              <span className="text-body-sm text-on-surface-variant">{durationLabel}</span>
            )}
          </div>
        )}
        <div className="border-outline-variant hover:border-primary overflow-hidden rounded-xl border bg-white shadow-sm transition-colors">
          <div className="flex min-h-24">
            {imageUrl && (
              <div className="w-1/3 shrink-0">
                <img src={imageUrl} alt={imageAlt ?? title} className="size-full object-cover" />
              </div>
            )}
            <div className="p-md flex min-w-0 flex-1 justify-between gap-2">
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="min-w-0">
                  <h4 className="font-headline-lg-mobile text-on-surface truncate text-[16px] leading-tight font-semibold">
                    {title}
                  </h4>
                  {subtitle && (
                    <p className="text-body-sm text-on-surface-variant line-clamp-2 leading-snug">
                      {subtitle}
                    </p>
                  )}
                </div>
                {badges && badges.length > 0 && (
                  <div className="gap-xs flex">
                    {badges.map((badge) => (
                      <span
                        key={badge.label}
                        className={cn(
                          'rounded px-1 text-[10px] font-bold',
                          BADGE_TONE_CLASSES[badge.tone ?? 'neutral'],
                        )}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {dragHandle}
            </div>
          </div>
          {editable && (
            <div className="border-outline-variant/20 p-sm flex gap-2 border-t">
              <button
                type="button"
                onClick={onEdit}
                className="font-label-md text-on-surface-variant hover:bg-surface-variant/40 flex-1 rounded-lg py-2 transition-colors"
              >
                메모
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="font-label-md hover:bg-error-container/20 text-error flex-1 rounded-lg py-2 transition-colors"
              >
                삭제
              </button>
            </div>
          )}
        </div>
        {after && <div className="mt-sm">{after}</div>}
      </div>
    </div>
  )
}
