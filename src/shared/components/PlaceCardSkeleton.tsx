import { cn } from '@/shared/lib/utils'

interface PlaceCardSkeletonProps {
  imageAspect?: 'standard' | 'compact'
  className?: string
}

/** PlaceCard와 동일한 레이아웃의 로딩 스켈레톤. 데이터가 오기 전 빈 화면 대신 보여준다. */
export function PlaceCardSkeleton({ imageAspect = 'standard', className }: PlaceCardSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest overflow-hidden rounded-xl shadow-[0_8px_12px_rgba(0,0,0,0.08)]',
        className,
      )}
    >
      <div
        className={cn(
          'bg-surface-container-high w-full animate-pulse',
          imageAspect === 'compact' ? 'aspect-[3/1]' : 'aspect-[2/1]',
        )}
      />
      <div className="p-md gap-xs flex flex-col">
        <div className="bg-surface-container-high h-4 w-3/5 animate-pulse rounded-full" />
        <div className="bg-surface-container-high h-3 w-2/5 animate-pulse rounded-full" />
        <div className="gap-xs mt-1 flex">
          <div className="bg-surface-container-high h-5 w-16 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  )
}
