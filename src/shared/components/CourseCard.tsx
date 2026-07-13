import { ChevronRight, Clock, Heart, MapPin, Ruler, Star } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { StatBadge } from './StatBadge'

interface CourseCardBadge {
  label: string
  tone?: 'primary' | 'secondary' | 'success' | 'info' | 'neutral'
}

interface CourseCardBaseProps {
  title: string
  imageUrl: string
  imageAlt: string
  onClick?: () => void
  className?: string
}

interface CourseCardImageBadgeProps extends CourseCardBaseProps {
  variant: 'image-badge'
  badges: CourseCardBadge[]
  duration: string
  distance: string
  saved?: boolean
  onToggleSave?: () => void
}

interface CourseCardMapPreviewProps extends CourseCardBaseProps {
  variant: 'map-preview'
  badges: CourseCardBadge[]
  description: string
  duration: string
  placeCount: number
  onViewDetails?: () => void
}

interface CourseCardStatsGridProps extends CourseCardBaseProps {
  variant: 'stats-grid'
  rating: number
  reviewCount?: number
  stats: { label: string; value: string }[]
  saved?: boolean
  onToggleSave?: () => void
}

type CourseCardProps =
  CourseCardImageBadgeProps | CourseCardMapPreviewProps | CourseCardStatsGridProps

const CARD_CLASSES =
  'group relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_8px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-xl'

function SaveButton({ saved, onToggleSave }: { saved: boolean; onToggleSave: () => void }) {
  return (
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
  )
}

export function CourseCard(props: CourseCardProps) {
  const { title, imageUrl, imageAlt, onClick, className } = props

  if (props.variant === 'image-badge') {
    return (
      <div
        onClick={onClick}
        className={cn(CARD_CLASSES, onClick && 'cursor-pointer active:scale-[0.98]', className)}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {props.onToggleSave && (
            <SaveButton saved={props.saved ?? false} onToggleSave={props.onToggleSave} />
          )}
          <div className="glass-effect absolute inset-x-0 bottom-0 flex items-center gap-2 px-4 py-2">
            {props.badges.map((badge) => (
              <StatBadge key={badge.label} label={badge.label} tone={badge.tone ?? 'neutral'} />
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
              {title}
            </h3>
            <ChevronRight className="text-outline size-5" />
          </div>
          <div className="text-on-surface-variant font-body-sm flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="size-[18px]" />
              <span>{props.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler className="size-[18px]" />
              <span>{props.distance}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (props.variant === 'map-preview') {
    return (
      <div onClick={onClick} className={cn(CARD_CLASSES, onClick && 'cursor-pointer', className)}>
        <div className="flex h-full flex-col md:flex-row">
          <div className="relative h-48 overflow-hidden md:h-auto md:w-2/5">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="size-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-3">
              <span className="font-label-caps text-label-caps rounded border border-white/30 bg-white/20 px-2 py-1 text-white backdrop-blur-md">
                MAP PREVIEW
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                {props.badges.map((badge) => (
                  <StatBadge key={badge.label} label={badge.label} tone={badge.tone ?? 'neutral'} />
                ))}
              </div>
              <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
                {title}
              </h3>
              <p className="font-body-sm text-on-surface-variant line-clamp-2">
                {props.description}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-on-surface-variant font-label-md flex gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="size-4" />
                  <span>{props.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  <span>{props.placeCount} Places</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  props.onViewDetails?.()
                }}
                className="font-label-md text-primary flex items-center gap-1 hover:underline"
              >
                View Details
                <ChevronRight className="size-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={cn(CARD_CLASSES, onClick && 'cursor-pointer active:scale-[0.98]', className)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {props.onToggleSave && (
          <SaveButton saved={props.saved ?? false} onToggleSave={props.onToggleSave} />
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <Star className="text-primary size-3.5 fill-current" />
              <span className="font-label-md text-label-md text-on-surface-variant">
                {props.rating.toFixed(1)}
                {props.reviewCount !== undefined && ` (${props.reviewCount} reviews)`}
              </span>
            </div>
          </div>
          <ChevronRight className="text-outline size-5" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {props.stats.map((stat) => (
            <div key={stat.label} className="bg-surface-container rounded p-2 text-center">
              <p className="font-label-caps text-label-caps text-outline uppercase">{stat.label}</p>
              <p className="font-label-md text-label-md text-on-surface">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
