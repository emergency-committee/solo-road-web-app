import { Star } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface RatingStarsProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string
}

export function RatingStars({ rating, reviewCount, size = 'sm', className }: RatingStarsProps) {
  const iconSize = size === 'sm' ? 'size-3.5' : 'size-4'
  const rounded = Math.round(rating)

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="text-secondary flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={iconSize}
            fill={i < rounded ? 'currentColor' : 'none'}
            strokeWidth={i < rounded ? 0 : 1.5}
          />
        ))}
      </div>
      <span className="font-label-md text-label-md text-on-surface-variant">
        {rating.toFixed(1)}
        {reviewCount !== undefined && ` (${reviewCount})`}
      </span>
    </div>
  )
}
