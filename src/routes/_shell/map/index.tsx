import { createFileRoute } from '@tanstack/react-router'
import { LocateFixed } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_MAP_CENTER,
  KakaoMap,
  type MapMarkerData,
  type MapRatingMode,
  MapRatingModeControl,
  MapSearchBar,
  PlacePreviewSheet,
} from '@/features/map'
import { usePlaces } from '@/features/place'
import { formatDistanceMeters } from '@/shared/lib/format'
import type { ApiPlacesParams } from '@/features/place'

export const Route = createFileRoute('/_shell/map/')({
  component: MapPage,
})

function toPlacesParams(filter: string): ApiPlacesParams {
  if (filter === 'restaurant') return { type: 'RESTAURANT' }
  if (filter === 'cafe') return { type: 'CAFE' }
  if (filter === 'solo-friendly') return { soloFriendlyOnly: true, sort: 'SOLO_SCORE' }
  return {}
}

function MapPage() {
  const [filterValue, setFilterValue] = useState<string[]>(['all'])
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null)
  const [ratingMode, setRatingMode] = useState<MapRatingMode>('solo')
  const [center, setCenter] = useState(DEFAULT_MAP_CENTER)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => setCenter({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => {
        // 위치 권한이 없으면 기본 위치(서울시 강남구)를 그대로 사용한다.
      },
    )
  }, [])

  const placesQuery = usePlaces({
    ...toPlacesParams(filterValue[0] ?? 'all'),
    lat: center.lat,
    lng: center.lng,
  })

  const markers: MapMarkerData[] = useMemo(
    () =>
      (placesQuery.data?.content ?? []).map((place) => ({
        id: place.placeId.toString(),
        name: place.name,
        icon: place.type.toUpperCase() === 'CAFE' ? 'coffee' : 'restaurant',
        lat: place.latitude,
        lng: place.longitude,
        imageUrl:
          place.thumbnailUrl ??
          `https://picsum.photos/seed/place-${place.placeId.toString()}/480/480`,
        imageAlt: place.name,
        distanceLabel: formatDistanceMeters(place.distanceM),
        ...(place.rating !== undefined && { rating: place.rating }),
        soloRating: place.soloRating,
        soloReviewCount: place.soloReviewCount,
        tags: place.soloFriendlyBadge
          ? [{ label: '혼밥 편한 곳', tone: 'secondary' as const }]
          : [],
      })),
    [placesQuery.data],
  )

  const handleRecenter = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((position) =>
      setCenter({ lat: position.coords.latitude, lng: position.coords.longitude }),
    )
  }

  return (
    <div className="bg-surface-container relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      <MapSearchBar filterValue={filterValue} onFilterChange={setFilterValue} />

      <KakaoMap
        center={center}
        markers={markers}
        ratingMode={ratingMode}
        selectedId={selectedMarker?.id ?? null}
        onSelectMarker={setSelectedMarker}
        className="absolute inset-0 z-0"
      />

      <div className="right-margin-mobile absolute top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-3">
        <MapRatingModeControl value={ratingMode} onChange={setRatingMode} />
        <button
          type="button"
          title="현재 위치로 이동"
          aria-label="현재 위치로 이동"
          onClick={handleRecenter}
          className="text-primary flex size-12 items-center justify-center rounded-full bg-white shadow-md transition-transform active:scale-90"
        >
          <LocateFixed className="size-5" />
        </button>
      </div>

      <PlacePreviewSheet
        marker={selectedMarker}
        onOpenChange={(open) => !open && setSelectedMarker(null)}
      />
    </div>
  )
}
