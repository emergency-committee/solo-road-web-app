import { Heart } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { RatingStars } from './RatingStars'
import { StatBadge } from './StatBadge'

interface PlaceCardBadge {
  label: string
  tone?: 'primary' | 'secondary' | 'success' | 'info' | 'neutral'
}

interface PlaceCardProps {
  imageUrl: string
  imageAlt: string
  title: string
  subtitle?: string
  badges?: PlaceCardBadge[]
  rating?: number
  reviewCount?: number
  saved?: boolean
  onToggleSave?: () => void
  onClick?: () => void
  className?: string
}

export function PlaceCard({
  imageUrl,
  imageAlt,
  title,
  subtitle,
  badges,
  rating,
  reviewCount,
  saved = false,
  onToggleSave,
  onClick,
  className,
}: PlaceCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group bg-surface-container-lowest relative overflow-hidden rounded-xl shadow-[0_8px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-xl',
        onClick && 'cursor-pointer active:scale-[0.98]',
        className,
      )}
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave()
            }}
            aria-pressed={saved}
            aria-label="저장하기"
            className="text-secondary absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform active:scale-90"
          >
            <Heart className="size-4" fill={saved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <div className="p-md">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            {title}
          </h3>
          {rating !== undefined && (
            <RatingStars rating={rating} {...(reviewCount !== undefined && { reviewCount })} />
          )}
        </div>
        {subtitle && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">{subtitle}</p>
        )}
        {badges && badges.length > 0 && (
          <div className="gap-xs flex flex-wrap">
            {badges.map((badge) => (
              <StatBadge key={badge.label} label={badge.label} tone={badge.tone ?? 'neutral'} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
