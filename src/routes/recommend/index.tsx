import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Compass, Plus, Search, Utensils } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CreatePlaceModal, usePlaces } from '@/features/place'
import { SOLO_RECOMMENDATION_MIN_SCORE, SOLO_TRAVEL_TYPES } from '@/features/place/lib/solo-rating'
import { CATEGORY_COLOR, classifyPlaceType } from '@/features/map/lib/category-style'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { PlaceCardSkeleton } from '@/shared/components/PlaceCardSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { formatDistanceMeters } from '@/shared/lib/format'
import { GEOLOCATION_OPTIONS } from '@/shared/lib/geolocation'
import { cn } from '@/shared/lib/utils'

type RecommendTab = 'all' | 'travel' | 'dining'

interface RecommendSearch {
  tab?: RecommendTab
}

const TRAVEL_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'wellness', label: '웰니스' },
  { value: 'study', label: '스터디' },
  { value: 'culture', label: '전시/문화' },
  { value: 'nature', label: '자연/산책' },
  { value: 'activity', label: '체험/활동' },
  { value: 'shopping', label: '쇼핑' },
]

const DINING_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'solo-friendly', label: '혼밥 편한 곳' },
  { value: 'restaurant', label: '혼밥 맛집' },
  { value: 'cafe', label: '카페/디저트' },
]

const ALL_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'solo-friendly', label: '혼행 명소' },
  { value: 'restaurant', label: '식당' },
  { value: 'cafe', label: '카페' },
  { value: 'wellness', label: '웰니스' },
  { value: 'study', label: '스터디' },
  { value: 'culture', label: '전시/문화' },
  { value: 'nature', label: '자연/산책' },
  { value: 'activity', label: '체험/활동' },
  { value: 'shopping', label: '쇼핑' },
]

function getPlaceholderVariant(type: string) {
  const upper = type.toUpperCase()
  return upper.includes('RESTAURANT') ||
    upper.includes('CAFE') ||
    upper.includes('식당') ||
    upper.includes('카페') ||
    upper.includes('맛집')
    ? 'food'
    : 'place'
}

export const Route = createFileRoute('/recommend/')({
  validateSearch: (search: Record<string, unknown>): RecommendSearch => {
    const tab = search.tab
    return tab === 'all' || tab === 'travel' || tab === 'dining' ? { tab } : {}
  },
  component: RecommendPage,
})

function toPlacesParams(tab: RecommendTab, filter: string) {
  if (tab === 'travel') {
    if (filter === 'wellness') return { type: 'WELLNESS' }
    if (filter === 'study') return { type: 'STUDY' }
    if (filter === 'nature') return { type: 'NATURE' }
    if (filter === 'culture') return { type: 'EXHIBITION' }
    if (filter === 'activity') return { type: 'ACTIVITY' }
    if (filter === 'shopping') return { type: 'SHOPPING' }
    return { type: SOLO_TRAVEL_TYPES }
  }
  if (tab === 'dining') {
    if (filter === 'solo-friendly')
      return { diningOnly: true, soloFriendlyOnly: true, sort: 'SOLO_SCORE' }
    if (filter === 'restaurant') return { type: 'RESTAURANT' }
    if (filter === 'cafe') return { type: 'CAFE' }
    return { diningOnly: true }
  }
  // all
  if (filter === 'solo-friendly')
    return { type: SOLO_TRAVEL_TYPES, soloFriendlyOnly: true, sort: 'SOLO_SCORE' }
  if (filter === 'wellness') return { type: 'WELLNESS' }
  if (filter === 'study') return { type: 'STUDY' }
  if (filter === 'nature') return { type: 'NATURE' }
  if (filter === 'culture') return { type: 'EXHIBITION' }
  if (filter === 'activity') return { type: 'ACTIVITY' }
  if (filter === 'shopping') return { type: 'SHOPPING' }
  if (filter === 'restaurant') return { type: 'RESTAURANT' }
  if (filter === 'cafe') return { type: 'CAFE' }
  return {}
}

function RecommendPage() {
  const navigate = useNavigate()
  const { tab: activeTab = 'all' } = Route.useSearch()
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState<string[]>(['all'])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => setCoords({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setCoords(null),
      GEOLOCATION_OPTIONS,
    )
  }, [])

  const currentFilters =
    activeTab === 'travel' ? TRAVEL_FILTERS : activeTab === 'dining' ? DINING_FILTERS : ALL_FILTERS

  const handleTabChange = (tab: RecommendTab) => {
    setFilter(['all'])
    void navigate({ to: '/recommend', search: { tab }, replace: true })
  }

  const placesQuery = usePlaces({
    ...(keyword.trim() && { keyword: keyword.trim() }),
    ...(coords && { lat: coords.lat, lng: coords.lng }),
    ...toPlacesParams(activeTab, filter[0] ?? 'all'),
  })
  const isSoloTravelRecommendation = activeTab === 'all' && filter[0] === 'solo-friendly'
  const places = (placesQuery.data?.content ?? []).filter(
    (place) =>
      !isSoloTravelRecommendation || (place.soloScore ?? 0) >= SOLO_RECOMMENDATION_MIN_SCORE,
  )

  return (
    <div className="bg-surface min-h-screen">
      <TopAppBar
        title="장소 추천 & 탐색"
        showBack
        actions={
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="text-primary bg-primary/10 hover:bg-primary/20 flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors"
          >
            <Plus className="size-3.5" />
            <span>장소 추천</span>
          </button>
        }
      />

      <main className="px-margin-mobile pt-4 pb-20">
        {/* 상단 추천 탭 (전체 vs 혼행 vs 혼밥) */}
        <div className="bg-surface-container-high mb-4 flex items-center rounded-2xl p-1">
          <button
            type="button"
            onClick={() => handleTabChange('all')}
            className={cn(
              'flex-1 rounded-xl py-2 text-xs font-bold transition-all',
              activeTab === 'all'
                ? 'bg-surface text-on-surface font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            전체 추천
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('travel')}
            className={cn(
              'flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold transition-all',
              activeTab === 'travel'
                ? 'bg-primary font-bold text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            <Compass className="size-3.5" />
            <span>혼행 장소</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('dining')}
            className={cn(
              'flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold transition-all',
              activeTab === 'dining'
                ? 'bg-[#ff6b4a] font-bold text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            <Utensils className="size-3.5" />
            <span>혼밥 맛집</span>
          </button>
        </div>

        {/* 검색바 */}
        <div className="border-outline-variant bg-surface-container-lowest px-md py-sm mb-3 flex items-center rounded-xl border shadow-sm">
          <Search className="mr-xs text-outline size-5" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="placeholder:text-outline-variant text-body-md w-full border-none bg-transparent focus:ring-0"
            placeholder={
              activeTab === 'dining'
                ? '혼밥 맛집, 1인석 식당, 메뉴로 검색'
                : '명소, 숲길 산책로, 전시관으로 검색'
            }
            type="text"
          />
        </div>

        {/* 카테고리 필터칩 */}
        <FilterChipGroup
          options={currentFilters}
          value={filter}
          onChange={setFilter}
          className="mb-6"
        />

        {/* 장소 목록 */}
        {placesQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <PlaceCardSkeleton key={index} />
            ))}
          </div>
        ) : places.length === 0 ? (
          <EmptyState
            icon={<Search className="size-6" />}
            title="조건에 맞는 추천 장소가 없어요"
            description="새로운 혼행이나 혼밥 장소를 직접 추천해보세요!"
            actionLabel="+ 새 장소 추천하기"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {places.map((place) => {
              const { label: categoryLabel, icon: categoryIcon } = classifyPlaceType(place.type)
              return (
                <PlaceCard
                  key={place.placeId}
                  imageUrl={place.thumbnailUrl ?? null}
                  imageAlt={place.name}
                  placeholderVariant={getPlaceholderVariant(place.type)}
                  title={place.name}
                  subtitle={formatDistanceMeters(place.distanceM)}
                  {...(place.rating != null && { rating: place.rating })}
                  badges={[
                    { label: categoryLabel, tone: 'neutral', color: CATEGORY_COLOR[categoryIcon] },
                    ...(place.soloFriendlyBadge
                      ? [
                          {
                            label:
                              place.type === 'RESTAURANT' || place.type === 'CAFE'
                                ? '혼밥 추천'
                                : '혼행 추천',
                            tone: 'secondary' as const,
                          },
                        ]
                      : []),
                  ]}
                  onClick={() =>
                    navigate({
                      to: '/place/$placeId',
                      params: { placeId: place.placeId.toString() },
                    })
                  }
                />
              )
            })}
          </div>
        )}
      </main>

      {/* 새 장소 추천 모달 */}
      <CreatePlaceModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialMode={activeTab === 'dining' ? 'dining' : 'travel'}
      />
    </div>
  )
}
