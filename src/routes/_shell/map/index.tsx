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
  PlacePreviewSheet,
} from '@/features/map'
import { classifyPlaceType } from '@/features/map/lib/category-style'
import { CreatePlaceModal, usePlaces } from '@/features/place'
import type { ApiPlacesParams, ApiPlaceSummary } from '@/features/place'
import { SOLO_RECOMMENDATION_MIN_SCORE, SOLO_TRAVEL_TYPES } from '@/features/place/lib/solo-rating'
import { useSavedPlaces } from '@/features/saved'
import { formatDistanceMeters } from '@/shared/lib/format'
import { GEOLOCATION_OPTIONS } from '@/shared/lib/geolocation'
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
      ...(mapMode === 'solo_dining' ? { diningOnly: true } : { type: SOLO_TRAVEL_TYPES }),
      soloFriendlyOnly: true,
      sort: 'SOLO_SCORE',
    }
  }
  if (filter === 'restaurant') return { type: 'RESTAURANT' }
  if (filter === 'cafe') return { type: 'CAFE' }
  if (filter === 'wellness') return { type: 'WELLNESS' }
  if (filter === 'study') return { type: 'STUDY' }
  if (filter === 'exhibition') return { type: 'EXHIBITION' }
  // '명소/랜드마크': 백엔드 단일 타입이 없어 관광지 계열 묶음(EXHIBITION+NATURE+ACTIVITY)으로 조회한다.
  if (filter === 'attraction') return { type: 'EXHIBITION,NATURE,ACTIVITY' }
  if (filter === 'nature') return { type: 'NATURE' }
  if (filter === 'culture') return { type: 'EXHIBITION' }
  if (filter === 'activity') return { type: 'ACTIVITY' }
  if (filter === 'shopping') return { type: 'SHOPPING' }
  if (mapMode === 'solo_dining') return { diningOnly: true, sort: 'DISTANCE' }
  return { sort: 'DISTANCE' }
}

function toMarkerData(
  place: ApiPlaceSummary,
  mapMode: MapMode,
  isRecommendationView: boolean,
  saved: boolean,
): MapMarkerData {
  const { icon, label } = classifyPlaceType(place.type)
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
    saved,
    tags:
      isRecommendationView && place.scoreStatus === 'DONE'
        ? [
            {
              label:
                mapMode === 'solo_dining' || isDiningPlace(place.type) ? '혼밥 추천' : '혼행 추천',
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
  const [bbox, setBbox] = useState<string | undefined>(undefined)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const debouncedKeyword = useDebouncedValue(keyword.trim(), 300)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => setCenter({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => {
        // 위치 권한이 없으면 기본 위치를 그대로 사용한다.
      },
      GEOLOCATION_OPTIONS,
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

  const filterParams = toPlacesParams(filterValue[0] ?? 'all', mapMode)
  const placesQuery = usePlaces({
    ...filterParams,
    ...(debouncedKeyword && { keyword: debouncedKeyword }),
    lat: center.lat,
    lng: center.lng,
    // 모든 필터를 현재 보이는 지도 영역 기준으로 조회한다. 최초 bounds 계산 전의 짧은 구간만
    // 지도 중심 10km를 임시 범위로 사용해 전국 결과가 먼저 노출되는 것을 막는다.
    ...(bbox ? { bbox } : { radius: 10_000 }),
    size: filterValue[0] === 'solo-friendly' ? 100 : 60,
  })
  const savedPlacesQuery = useSavedPlaces(0, 500)
  const savedPlaceIds = useMemo(
    () => new Set((savedPlacesQuery.data?.content ?? []).map((place) => place.placeId)),
    [savedPlacesQuery.data],
  )

  const isRecommendationView = filterValue[0] === 'solo-friendly'
  const markers: MapMarkerData[] = useMemo(() => {
    const visiblePlaces = (placesQuery.data?.content ?? []).filter(
      (place) =>
        (mapMode !== 'solo_dining' || isDiningPlace(place.type)) &&
        (!isRecommendationView || (place.soloScore ?? 0) >= SOLO_RECOMMENDATION_MIN_SCORE),
    )
    const placesById = new Map(visiblePlaces.map((place) => [place.placeId, place]))

    if (filterValue[0] === 'all') {
      for (const savedPlace of savedPlacesQuery.data?.content ?? []) {
        if (mapMode === 'solo_dining' && !isDiningPlace(savedPlace.type)) continue
        if (!placesById.has(savedPlace.placeId)) {
          placesById.set(savedPlace.placeId, { ...savedPlace, isLiked: true })
        }
      }
    }

    return [...placesById.values()].map((place) =>
      toMarkerData(place, mapMode, isRecommendationView, savedPlaceIds.has(place.placeId)),
    )
  }, [
    placesQuery.data,
    savedPlacesQuery.data,
    mapMode,
    filterValue,
    isRecommendationView,
    savedPlaceIds,
  ])

  const handleRecenter = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => setCenter({ lat: position.coords.latitude, lng: position.coords.longitude }),
      undefined,
      GEOLOCATION_OPTIONS,
    )
  }

  const handleSelectSuggestion = (place: ApiPlaceSummary) => {
    setKeyword(place.name)
    setCenter({ lat: place.latitude, lng: place.longitude })
    setSelectedMarker(
      toMarkerData(place, mapMode, isRecommendationView, savedPlaceIds.has(place.placeId)),
    )
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
        declutterMarkers={!isRecommendationView}
        ratingMode={ratingMode}
        selectedId={selectedMarker?.id ?? null}
        onSelectMarker={setSelectedMarker}
        onCenterChanged={setCenter}
        onBoundsChanged={setBbox}
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
          className="text-on-primary bg-primary hover:bg-primary/90 flex size-12 items-center justify-center rounded-full shadow-md transition-transform active:scale-90"
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
