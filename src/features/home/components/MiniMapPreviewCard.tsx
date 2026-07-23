import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'

export function MiniMapPreviewCard() {
  return (
    <Link
      to="/map"
      className="border-outline-variant/30 bg-surface-container-high flex h-32 cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-transform active:scale-[0.98]"
    >
      <div className="p-md flex flex-1 flex-col justify-center">
        <p className="text-body-sm text-on-surface leading-tight">
          지금 위치 기준 추천 장소가 지도에 표시됩니다.
          <br />
          <span className="text-primary font-bold">카드를 눌러 길찾기를 시작하세요.</span>
        </p>
      </div>
      <div className="border-outline-variant/20 bg-surface-variant relative w-1/3 border-l">
        <div className="absolute inset-0 bg-[#e0e9ed] opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="bg-primary/20 absolute -top-4 -left-4 size-8 animate-pulse rounded-full" />
            <MapPin className="text-primary relative z-10 size-8 fill-current" />
          </div>
        </div>
      </div>
    </Link>
  )
}
