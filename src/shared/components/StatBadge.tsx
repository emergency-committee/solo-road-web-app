import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

type StatBadgeTone = 'primary' | 'secondary' | 'success' | 'info' | 'neutral'

const TONE_CLASSES: Record<StatBadgeTone, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/15 text-secondary',
  success: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-surface-container-high text-on-surface-variant',
}

interface StatBadgeProps {
  label: string
  tone?: StatBadgeTone
  icon?: ReactNode
  className?: string
}

export function StatBadge({ label, tone = 'neutral', icon, className }: StatBadgeProps) {
  return (
    <span
      className={cn(
        'font-label-caps text-label-caps inline-flex items-center gap-1 rounded px-2 py-0.5 uppercase',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {icon}
      {label}
    </span>
  )
}
