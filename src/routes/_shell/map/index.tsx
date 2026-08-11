import { createFileRoute } from '@tanstack/react-router'
import { LocateFixed } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_MAP_CENTER,
  KakaoMap,
  type MapMarkerData,
  MapSearchBar,
  PlacePreviewSheet,
  SafetyTogglePanel,
} from '@/features/map'
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
        icon: place.type.includes('공원') || place.type.includes('park') ? 'park' : 'coffee',
        lat: place.latitude,
        lng: place.longitude,
        imageUrl:
          place.thumbnailUrl ?? `https://picsum.photos/seed/place-${place.placeId.toString()}/480/480`,
        imageAlt: place.name,
        distanceLabel: formatDistanceMeters(place.distanceM),
        rating: place.rating ?? 0,
        reviewCount: 0,
        tags: place.soloFriendlyBadge ? [{ label: '혼행 친화', tone: 'secondary' as const }] : [],
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
        selectedId={selectedMarker?.id ?? null}
        onSelectMarker={setSelectedMarker}
        className="absolute inset-0 z-0"
      />

      <SafetyTogglePanel />

      <button
        type="button"
        aria-label="현재 위치로 이동"
        onClick={handleRecenter}
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
