import {
  Bed,
  Coffee,
  Landmark,
  MapPin,
  Palette,
  Trees,
  Utensils,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { getMapMarkerRating } from '../lib/map-rating'
import type { MapMarkerData, MapRatingMode, MarkerIconType } from '../types/map.types'

const ICON_MAP: Record<MarkerIconType, typeof Utensils> = {
  restaurant: Utensils,
  coffee: Coffee,
  attraction: Landmark,
  nature: Trees,
  culture: Palette,
  stay: Bed,
  spot: MapPin,
}

const CATEGORY_STYLE: Record<MarkerIconType, { bg: string; tail: string }> = {
  restaurant: { bg: 'bg-[#ff6b4a]', tail: 'bg-[#ff6b4a]' },
  coffee: { bg: 'bg-[#8d6e63]', tail: 'bg-[#8d6e63]' },
  attraction: { bg: 'bg-[#2563eb]', tail: 'bg-[#2563eb]' },
  nature: { bg: 'bg-[#059669]', tail: 'bg-[#059669]' },
  culture: { bg: 'bg-[#7c3aed]', tail: 'bg-[#7c3aed]' },
  stay: { bg: 'bg-[#4f46e5]', tail: 'bg-[#4f46e5]' },
  spot: { bg: 'bg-primary', tail: 'bg-primary' },
}

interface MapMarkerProps {
  marker: MapMarkerData
  ratingMode?: MapRatingMode
  selected?: boolean
  onSelect: (marker: MapMarkerData) => void
}

/**
 * 카카오맵 CustomOverlay의 content로 쓰이는 마커 핀.
 * 실제 화면 위치는 KakaoMap이 위경도 기준으로 CustomOverlay에 맡기므로
 * 이 컴포넌트는 위치 계산 없이 핀 모양만 그린다.
 */
export function MapMarker({
  marker,
  ratingMode = 'solo',
  selected = false,
  onSelect,
}: MapMarkerProps) {
  const Icon = ICON_MAP[marker.icon] ?? MapPin
  const style = CATEGORY_STYLE[marker.icon] ?? CATEGORY_STYLE.spot
  const displayRating = getMapMarkerRating(marker, ratingMode)
  const ratingLabel = ratingMode === 'solo' ? '혼밥/혼행 평점' : '일반 평점'

  return (
    <button
      type="button"
      onClick={() => onSelect(marker)}
      aria-label={`${marker.name}${displayRating != null ? `, ${ratingLabel} ${displayRating.toFixed(1)}` : ''}`}
      className="group flex cursor-pointer flex-col items-center"
    >
      <div
        className={cn(
          style.bg,
          'relative flex h-9 min-w-9 items-center justify-center gap-1 rounded-full border-2 border-white px-2 text-white shadow-lg transition-transform group-hover:scale-105',
          displayRating != null && 'min-w-[58px]',
          selected && 'scale-110 ring-2 ring-white/80',
        )}
      >
        <Icon className="size-4 shrink-0" />
        {displayRating != null && (
          <span className="text-xs font-bold tabular-nums">{displayRating.toFixed(1)}</span>
        )}
        <div
          className={cn(
            style.tail,
            'absolute -bottom-1 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-white',
          )}
        />
      </div>
    </button>
  )
}
