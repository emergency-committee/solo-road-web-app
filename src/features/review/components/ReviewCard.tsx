import { Pencil, Star, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { StatBadge } from '@/shared/components/StatBadge'
import type { Review } from '../types/review.types'

interface ReviewCardProps {
  review: Review
  onEdit?: () => void
  onDelete?: () => void
}

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  return (
    <article
      className={cn(
        'border-outline-variant/30 bg-surface-container-lowest rounded-xl border shadow-[0_8px_12px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]',
        review.imageUrl ? 'overflow-hidden' : 'p-md',
      )}
    >
      <div className={review.imageUrl ? 'p-md' : ''}>
        <div className="mb-xs flex items-start justify-between">
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
              {review.placeName}
            </h2>
            <p className="font-label-md text-label-md text-outline">
              {review.location} • {review.dateLabel}
            </p>
          </div>
          <div className="gap-xs flex">
            <button
              type="button"
              onClick={onEdit}
              aria-label="리뷰 수정"
              className="text-outline hover:text-primary p-1 transition-colors"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="리뷰 삭제"
              className="text-outline hover:text-error p-1 transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
        <div className="mb-sm gap-xs flex items-center">
          <div className="text-secondary flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className="size-[18px]"
                fill={i < review.rating ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <StatBadge label={review.tag.label} tone={review.tag.tone} />
        </div>
        <p
          className={cn(
            'font-body-md text-body-md text-on-surface-variant',
            review.imageUrl && 'mb-md line-clamp-3',
          )}
        >
          {review.content}
        </p>
      </div>
      {review.imageUrl && (
        <div className="bg-surface-container aspect-[2/1] w-full overflow-hidden">
          <img src={review.imageUrl} alt={review.imageAlt} className="size-full object-cover" />
        </div>
      )}
    </article>
  )
}
