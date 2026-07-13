import { Coffee, Trees } from 'lucide-react'
import type { MapMarkerData } from '../types/map.types'

const ICON_MAP = { coffee: Coffee, park: Trees } as const

interface MapMarkerProps {
  marker: MapMarkerData
  onSelect: (marker: MapMarkerData) => void
}

export function MapMarker({ marker, onSelect }: MapMarkerProps) {
  const Icon = ICON_MAP[marker.icon]

  return (
    <button
      type="button"
      onClick={() => onSelect(marker)}
      style={{ top: marker.top, left: marker.left }}
      className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
    >
      <div className="bg-primary relative rounded-full border-2 border-white p-2 text-white shadow-lg transition-transform group-hover:scale-110">
        <Icon className="size-[18px]" />
        <div className="bg-primary absolute -bottom-1 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-white" />
      </div>
    </button>
  )
}
