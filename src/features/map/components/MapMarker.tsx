import { Coffee, Trees } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { MapMarkerData } from '../types/map.types'

const ICON_MAP = { coffee: Coffee, park: Trees } as const

interface MapMarkerProps {
  marker: MapMarkerData
  selected?: boolean
  onSelect: (marker: MapMarkerData) => void
}

/**
 * 카카오맵 CustomOverlay의 content로 쓰이는 마커 핀.
 * 실제 화면 위치는 KakaoMap이 위경도 기준으로 CustomOverlay에 맡기므로
 * 이 컴포넌트는 위치 계산 없이 핀 모양만 그린다.
 */
export function MapMarker({ marker, selected = false, onSelect }: MapMarkerProps) {
  const Icon = ICON_MAP[marker.icon]

  return (
    <button
      type="button"
      onClick={() => onSelect(marker)}
      className="group flex cursor-pointer flex-col items-center"
    >
      <div
        className={cn(
          'bg-primary relative rounded-full border-2 border-white p-2 text-white shadow-lg transition-transform group-hover:scale-110',
          selected && 'scale-110 ring-2 ring-white/70',
        )}
      >
        <Icon className="size-[18px]" />
        <div className="bg-primary absolute -bottom-1 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-white" />
      </div>
    </button>
  )
}
