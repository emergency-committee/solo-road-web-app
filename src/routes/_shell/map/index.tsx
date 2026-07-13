import { createFileRoute } from '@tanstack/react-router'
import { LocateFixed } from 'lucide-react'
import { useState } from 'react'
import {
  MapMarker,
  type MapMarkerData,
  MapSearchBar,
  mockMapMarkers,
  PlacePreviewSheet,
  SafetyTogglePanel,
} from '@/features/map'

export const Route = createFileRoute('/_shell/map/')({
  component: MapPage,
})

function MapPage() {
  const [filterValue, setFilterValue] = useState<string[]>(['all'])
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null)

  return (
    <div className="bg-surface-container relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      <MapSearchBar filterValue={filterValue} onFilterChange={setFilterValue} />

      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#e0e9ed] to-[#cfe3e8]" />

      <div className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="bg-primary/40 absolute size-12 animate-ping rounded-full" />
        <div className="bg-primary size-3.5 rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,0,0,0.2)]" />
      </div>

      {mockMapMarkers.map((marker) => (
        <MapMarker key={marker.id} marker={marker} onSelect={setSelectedMarker} />
      ))}

      <SafetyTogglePanel />

      <button
        type="button"
        aria-label="현재 위치로 이동"
        className="right-margin-mobile text-primary absolute bottom-[240px] z-30 flex size-12 items-center justify-center rounded-full bg-white shadow-md transition-transform active:scale-90"
      >
        <LocateFixed className="size-5" />
      </button>

      <PlacePreviewSheet
        marker={selectedMarker}
        onOpenChange={(open) => !open && setSelectedMarker(null)}
      />
    </div>
  )
}
