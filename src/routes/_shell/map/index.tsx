import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
import { useDebouncedValue } from '@/shared/lib/use-debounced-value'
import type { ApiPlacesParams } from '@/features/place'

interface MapSearch {
  keyword?: string
}

export const Route = createFileRoute('/_shell/map/')({
  validateSearch: (search: Record<string, unknown>): MapSearch => ({
    ...(typeof search.keyword === 'string' && { keyword: search.keyword }),
  }),
  component: MapPage,
})

function toPlacesParams(filter: string): ApiPlacesParams {
  if (filter === 'restaurant') return { type: 'RESTAURANT' }
  if (filter === 'cafe') return { type: 'CAFE' }
  if (filter === 'solo-friendly') return { soloFriendlyOnly: true, sort: 'SOLO_SCORE' }
  return {}
}

function MapPage() {
  const { keyword: keywordFromUrl } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [filterValue, setFilterValue] = useState<string[]>(['all'])
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null)
  const [ratingMode, setRatingMode] = useState<MapRatingMode>('solo')
  const [center, setCenter] = useState(DEFAULT_MAP_CENTER)
  const [keyword, setKeyword] = useState(keywordFromUrl ?? '')
  const debouncedKeyword = useDebouncedValue(keyword.trim(), 300)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => setCenter({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => {
        // 위치 권한이 없으면 기본 위치(서울시 강남구)를 그대로 사용한다.
      },
    )
  }, [])

  // 검색어를 URL에도 반영해 새로고침/공유 시에도 검색 결과가 유지되도록 한다.
  useEffect(() => {
    void navigate({
      search: () => (debouncedKeyword ? { keyword: debouncedKeyword } : {}),
      replace: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword])

  const placesQuery = usePlaces({
    ...toPlacesParams(filterValue[0] ?? 'all'),
    ...(debouncedKeyword && { keyword: debouncedKeyword }),
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
        ...(place.rating != null && { rating: place.rating }),
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
      <MapSearchBar
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        keyword={keyword}
        onKeywordChange={setKeyword}
      />

      <KakaoMap
        center={center}
        markers={markers}
        ratingMode={ratingMode}
        selectedId={selectedMarker?.id ?? null}
        onSelectMarker={setSelectedMarker}
        onCenterChanged={setCenter}
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
