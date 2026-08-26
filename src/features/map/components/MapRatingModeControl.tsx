import { Star, UserRound } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { MapRatingMode } from '../types/map.types'

interface MapRatingModeControlProps {
  value: MapRatingMode
  onChange: (value: MapRatingMode) => void
}

const OPTIONS: {
  value: MapRatingMode
  label: string
  shortLabel: string
  icon: typeof Star
}[] = [
  { value: 'solo', label: '혼밥 평점으로 보기', shortLabel: '혼밥', icon: UserRound },
  { value: 'general', label: '일반 평점으로 보기', shortLabel: '일반', icon: Star },
]

export function MapRatingModeControl({ value, onChange }: MapRatingModeControlProps) {
  return (
    <div className="border-outline-variant/40 flex flex-col overflow-visible rounded-xl border bg-white shadow-md">
      {OPTIONS.map((option, index) => {
        const selected = value === option.value
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            title={option.label}
            aria-label={option.label}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'group relative flex h-14 w-14 flex-col items-center justify-center gap-0.5 transition-colors first:rounded-t-[11px] last:rounded-b-[11px]',
              index > 0 && 'border-outline-variant/30 border-t',
              selected ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container',
            )}
          >
            <Icon
              className={cn(
                'size-5',
                option.value === 'general' && selected && 'fill-current',
              )}
            />
            <span className="text-[10px] font-bold leading-none">{option.shortLabel}</span>
            <span className="bg-on-surface text-surface pointer-events-none absolute top-1/2 right-full mr-2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[11px] opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
