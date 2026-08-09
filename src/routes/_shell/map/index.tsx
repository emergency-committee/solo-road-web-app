import { createFileRoute } from '@tanstack/react-router'
import { LocateFixed } from 'lucide-react'
import { useState } from 'react'
import {
  MapMarker,
  type MapMarkerData,
  MapSearchBar,
  PlacePreviewSheet,
  SafetyTogglePanel,
} from '@/features/map'
import { derivePosition } from '@/features/map/lib/marker-layout'
import { usePlaces } from '@/features/place'
import { formatDistanceMeters } from '@/shared/lib/format'
import type { ApiPlacesParams } from '@/features/place'

export const Route = createFileRoute('/_shell/map/')({
  component: MapPage,
})

function toPlacesParams(filter: string): ApiPlacesParams {
  if (filter === 'cafe') return { type: '카페' }
  if (filter === 'landmark') return { type: '명소' }
  if (filter === 'safe-restaurant') return { soloFriendlyOnly: true }
  return {}
}

function MapPage() {
  const [filterValue, setFilterValue] = useState<string[]>(['all'])
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null)

  const placesQuery = usePlaces(toPlacesParams(filterValue[0] ?? 'all'))
  const markers: MapMarkerData[] = (placesQuery.data?.content ?? []).map((place) => {
    const { top, left } = derivePosition(place.placeId)
    return {
      id: place.placeId.toString(),
      name: place.name,
      icon: place.type.includes('공원') || place.type.includes('park') ? 'park' : 'coffee',
      top,
      left,
      imageUrl: place.thumbnailUrl ?? `https://picsum.photos/seed/place-${place.placeId.toString()}/480/480`,
      imageAlt: place.name,
      distanceLabel: formatDistanceMeters(place.distanceM),
      rating: place.rating ?? 0,
      reviewCount: 0,
      tags: place.soloFriendlyBadge ? [{ label: '혼행 친화', tone: 'secondary' as const }] : [],
    }
  })

  return (
    <div className="bg-surface-container relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      <MapSearchBar filterValue={filterValue} onFilterChange={setFilterValue} />

      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#e0e9ed] to-[#cfe3e8]" />

      <div className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="bg-primary/40 absolute size-12 animate-ping rounded-full" />
        <div className="bg-primary size-3.5 rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,0,0,0.2)]" />
      </div>

      {markers.map((marker) => (
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
