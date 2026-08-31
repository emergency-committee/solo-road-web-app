import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LocateFixed, MapPinPlus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_MAP_CENTER,
  KakaoMap,
  type MapMarkerData,
  type MapMode,
  type MapRatingMode,
  MapRatingModeControl,
  MapSearchBar,
  type MarkerIconType,
  PlacePreviewSheet,
} from '@/features/map'
import { CreatePlaceModal, usePlaces } from '@/features/place'
import type { ApiPlacesParams, ApiPlaceSummary } from '@/features/place'
import { formatDistanceMeters } from '@/shared/lib/format'
import { useDebouncedValue } from '@/shared/lib/use-debounced-value'

interface MapSearch {
  keyword?: string
}

export const Route = createFileRoute('/_shell/map/')({
  validateSearch: (search: Record<string, unknown>): MapSearch => ({
    ...(typeof search.keyword === 'string' && { keyword: search.keyword }),
  }),
  component: MapPage,
})

const DINING_TYPES = [
  'RESTAURANT',
  'CAFE',
  '식당',
  '카페',
  '한식',
  '일식',
  '중식',
  '베이커리',
  '디저트',
]

function isDiningPlace(type: string): boolean {
  const upper = type.toUpperCase()
  return DINING_TYPES.some((candidate) => upper.includes(candidate))
}

function toPlacesParams(filter: string, mapMode: MapMode): ApiPlacesParams {
  if (filter === 'solo-friendly') {
    return {
      ...(mapMode === 'solo_dining' && { diningOnly: true }),
      soloFriendlyOnly: true,
      sort: 'SOLO_SCORE',
      radius: 10_000,
    }
  }
  if (filter === 'restaurant') return { type: 'RESTAURANT' }
  if (filter === 'cafe') return { type: 'CAFE' }
  if (filter === 'attraction') return { type: 'ATTRACTION' }
  if (filter === 'nature') return { type: 'NATURE' }
  if (filter === 'culture') return { type: 'CULTURE' }
  if (filter === 'stay') return { type: 'STAY' }
  if (mapMode === 'solo_dining') return { diningOnly: true, sort: 'DISTANCE' }
  return { sort: 'DISTANCE' }
}

function getMarkerIconAndLabel(type: string): { icon: MarkerIconType; label: string } {
  const upper = type.toUpperCase()
  if (upper.includes('CAFE') || upper.includes('카페') || upper.includes('베이커리')) {
    return { icon: 'coffee', label: '카페/디저트' }
  }
  if (
    upper.includes('RESTAURANT') ||
    upper.includes('식당') ||
    upper.includes('한식') ||
    upper.includes('일식') ||
    upper.includes('중식')
  ) {
    return { icon: 'restaurant', label: '혼밥 식당' }
  }
  if (upper.includes('NATURE') || upper.includes('자연') || upper.includes('산책')) {
    return { icon: 'nature', label: '자연/힐링' }
  }
  if (
    upper.includes('CULTURE') ||
    upper.includes('전시') ||
    upper.includes('문화') ||
    upper.includes('미술관')
  ) {
    return { icon: 'culture', label: '전시/문화' }
  }
  if (
    upper.includes('ATTRACTION') ||
    upper.includes('명소') ||
    upper.includes('관광') ||
    upper.includes('도서관')
  ) {
    return { icon: 'attraction', label: '혼행 명소' }
  }
  if (upper.includes('STAY') || upper.includes('숙소') || upper.includes('호텔')) {
    return { icon: 'stay', label: '숙소' }
  }
  return { icon: 'spot', label: type }
}

function toMarkerData(
  place: ApiPlaceSummary,
  mapMode: MapMode,
  isRecommendationView: boolean,
): MapMarkerData {
  const { icon, label } = getMarkerIconAndLabel(place.type)
  return {
    id: place.placeId.toString(),
    name: place.name,
    icon,
    categoryLabel: label,
    lat: place.latitude,
    lng: place.longitude,
    imageUrl: place.thumbnailUrl ?? null,
    imageAlt: place.name,
    summary: place.summary,
    distanceLabel: formatDistanceMeters(place.distanceM),
    ...(place.rating != null && { rating: place.rating }),
    soloScore: place.soloScore,
    scoreStatus: place.scoreStatus,
    soloRating: place.soloRating,
    soloReviewCount: place.soloReviewCount,
    tags:
      isRecommendationView && place.scoreStatus === 'DONE'
        ? [
            {
              label: mapMode === 'solo_dining' || isDiningPlace(place.type) ? '혼밥 추천' : '혼행 추천',
              tone: 'secondary' as const,
            },
          ]
        : [],
  }
}

function MapPage() {
  const { keyword: keywordFromUrl } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [mapMode, setMapMode] = useState<MapMode>('all')
  const [filterValue, setFilterValue] = useState<string[]>(['all'])
  const [keyword, setKeyword] = useState(keywordFromUrl ?? '')
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null)
  const [ratingMode, setRatingMode] = useState<MapRatingMode>('solo')
  const [center, setCenter] = useState(DEFAULT_MAP_CENTER)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const debouncedKeyword = useDebouncedValue(keyword.trim(), 300)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => setCenter({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => {
        // 위치 권한이 없으면 기본 위치를 그대로 사용한다.
      },
    )
  }, [])

  useEffect(() => {
    void navigate({
      search: () => (debouncedKeyword ? { keyword: debouncedKeyword } : {}),
      replace: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword])

  const handleMapModeChange = (nextMode: MapMode) => {
    setMapMode(nextMode)
    setRatingMode('solo')
    setFilterValue(['all'])
    setSelectedMarker(null)
  }

  const placesQuery = usePlaces({
    ...toPlacesParams(filterValue[0] ?? 'all', mapMode),
    ...(debouncedKeyword && { keyword: debouncedKeyword }),
    lat: center.lat,
    lng: center.lng,
  })

  const isRecommendationView = filterValue[0] === 'solo-friendly'
  const markers: MapMarkerData[] = useMemo(
    () =>
      (placesQuery.data?.content ?? [])
        .filter((place) => mapMode !== 'solo_dining' || isDiningPlace(place.type))
        .map((place) => toMarkerData(place, mapMode, isRecommendationView)),
    [placesQuery.data, mapMode, isRecommendationView],
  )

  const handleRecenter = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((position) =>
      setCenter({ lat: position.coords.latitude, lng: position.coords.longitude }),
    )
  }

  const handleSelectSuggestion = (place: ApiPlaceSummary) => {
    setKeyword(place.name)
    setCenter({ lat: place.latitude, lng: place.longitude })
    setSelectedMarker(toMarkerData(place, mapMode, isRecommendationView))
  }

  const isSoloDining = mapMode === 'solo_dining'

  return (
    <div className="bg-surface-container relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      <MapSearchBar
        mapMode={mapMode}
        onMapModeChange={handleMapModeChange}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSelectPlace={handleSelectSuggestion}
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
        <MapRatingModeControl
          value={ratingMode}
          onChange={setRatingMode}
          soloLabel={isSoloDining ? '혼밥' : '혼행'}
        />
        <button
          type="button"
          title="현재 위치로 이동"
          aria-label="현재 위치로 이동"
          onClick={handleRecenter}
          className="text-primary flex size-12 items-center justify-center rounded-full bg-white shadow-md transition-transform active:scale-90"
        >
          <LocateFixed className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedMarker(null)
            setIsCreateModalOpen(true)
          }}
          title={isSoloDining ? '혼밥 맛집 추천하기' : '장소 추천하기'}
          aria-label={isSoloDining ? '혼밥 맛집 추천하기' : '장소 추천하기'}
          className="text-on-primary flex size-12 items-center justify-center rounded-full bg-primary shadow-md transition-transform hover:bg-primary/90 active:scale-90"
        >
          <MapPinPlus className="size-5" />
        </button>
      </div>

      <PlacePreviewSheet
        marker={selectedMarker}
        onOpenChange={(open) => !open && setSelectedMarker(null)}
        soloLabel={isSoloDining ? '혼밥' : '혼행'}
      />

      <CreatePlaceModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialMode={isSoloDining ? 'dining' : 'travel'}
      />
    </div>
  )
}
