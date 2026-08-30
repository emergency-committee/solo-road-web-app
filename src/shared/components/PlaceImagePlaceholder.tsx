import { UtensilsCrossed } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

/**
 * 등록된 사진이 없는 장소에 대신 보여주는 기본 이미지.
 * picsum 같은 무관한 사진을 붙이면 실제 사진처럼 오해할 수 있어서,
 * 브랜드 색만 쓰는 은은한 일러스트로 "사진 없음"을 정직하게 표현한다.
 */
export function PlaceImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-surface-container text-primary/60 relative flex size-full items-center justify-center overflow-hidden',
        className,
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 200 200" className="text-primary/10 absolute inset-0 size-full">
        <circle cx="24" cy="16" r="48" fill="currentColor" />
        <circle cx="176" cy="164" r="64" fill="currentColor" />
      </svg>
      <UtensilsCrossed className="relative size-8" />
    </div>
  )
}
