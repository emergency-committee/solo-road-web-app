import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Compass, Plus, Search, Utensils } from 'lucide-react'
import { useState } from 'react'
import { CreatePlaceModal, usePlaces } from '@/features/place'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { EmptyState } from '@/shared/components/EmptyState'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { formatDistanceMeters } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'

type RecommendTab = 'all' | 'travel' | 'dining'

const TRAVEL_FILTERS = [
  { value: 'all', label: '전체 혼행' },
  { value: 'attraction', label: '명소/랜드마크' },
  { value: 'nature', label: '자연/산책' },
  { value: 'culture', label: '전시/문화' },
  { value: 'cafe', label: '조용한 카페' },
  { value: 'stay', label: '숙소' },
]

const DINING_FILTERS = [
  { value: 'solo-friendly', label: '혼밥 편한 곳' },
  { value: 'restaurant', label: '혼밥 맛집' },
  { value: 'cafe', label: '카페/디저트' },
  { value: 'all', label: '전체' },
]

const ALL_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'attraction', label: '혼행 명소' },
  { value: 'nature', label: '자연/힐링' },
  { value: 'culture', label: '전시/문화' },
  { value: 'restaurant', label: '혼밥 맛집' },
  { value: 'cafe', label: '카페' },
]

export const Route = createFileRoute('/recommend/')({
  component: RecommendPage,
})

function toPlacesParams(tab: RecommendTab, filter: string) {
  if (tab === 'travel') {
    if (filter === 'attraction') return { type: 'ATTRACTION' }
    if (filter === 'nature') return { type: 'NATURE' }
    if (filter === 'culture') return { type: 'CULTURE' }
    if (filter === 'cafe') return { type: 'CAFE' }
    if (filter === 'stay') return { type: 'STAY' }
    return {}
  }
  if (tab === 'dining') {
    if (filter === 'solo-friendly') return { soloFriendlyOnly: true, sort: 'SOLO_SCORE' }
    if (filter === 'restaurant') return { type: 'RESTAURANT' }
    if (filter === 'cafe') return { type: 'CAFE' }
    return { soloFriendlyOnly: true }
  }
  // all
  if (filter === 'attraction') return { type: 'ATTRACTION' }
  if (filter === 'nature') return { type: 'NATURE' }
  if (filter === 'culture') return { type: 'CULTURE' }
  if (filter === 'restaurant') return { type: 'RESTAURANT' }
  if (filter === 'cafe') return { type: 'CAFE' }
  return {}
}

function RecommendPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<RecommendTab>('all')
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState<string[]>(['all'])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const currentFilters =
    activeTab === 'travel'
      ? TRAVEL_FILTERS
      : activeTab === 'dining'
        ? DINING_FILTERS
        : ALL_FILTERS

  const handleTabChange = (tab: RecommendTab) => {
    setActiveTab(tab)
    if (tab === 'dining') {
      setFilter(['solo-friendly'])
    } else {
      setFilter(['all'])
    }
  }

  const placesQuery = usePlaces({
    ...(keyword.trim() && { keyword: keyword.trim() }),
    ...toPlacesParams(activeTab, filter[0] ?? 'all'),
  })
  const places = placesQuery.data?.content ?? []

  return (
    <div className="bg-surface min-h-screen">
      <TopAppBar
        title="장소 추천 & 탐색"
        showBack
        actions={
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>장소 추천</span>
          </button>
        }
      />

      <main className="px-margin-mobile pt-4 pb-20">
        {/* 상단 추천 탭 (전체 vs 혼행 vs 혼밥) */}
        <div className="bg-surface-container-high p-1 rounded-2xl flex items-center mb-4">
          <button
            type="button"
            onClick={() => handleTabChange('all')}
            className={cn(
              'flex-1 py-2 text-xs font-bold rounded-xl transition-all',
              activeTab === 'all'
                ? 'bg-surface text-on-surface shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            전체 추천
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('travel')}
            className={cn(
              'flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1',
              activeTab === 'travel'
                ? 'bg-primary text-white shadow-xs font-bold'
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
              'flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1',
              activeTab === 'dining'
                ? 'bg-[#ff6b4a] text-white shadow-xs font-bold'
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
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center py-10">
            추천 장소를 불러오는 중이에요...
          </p>
        ) : places.length === 0 ? (
          <EmptyState
            icon={<Search className="size-6" />}
            title="조건에 맞는 추천 장소가 없어요"
            description="새로운 혼행이나 혼밥 장소를 직접 추천해보세요!"
            actionLabel="+ 새 장소 추천하기"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="gap-4 grid grid-cols-1">
            {places.map((place) => (
              <PlaceCard
                key={place.placeId}
                imageUrl={place.thumbnailUrl ?? `https://picsum.photos/seed/place-${place.placeId.toString()}/480/270`}
                imageAlt={place.name}
                title={place.name}
                subtitle={`${place.type} • ${place.distanceM != null ? formatDistanceMeters(place.distanceM) : place.summary ?? '추천 장소'}`}
                {...(place.rating !== undefined && { rating: place.rating })}
                badges={
                  place.soloFriendlyBadge
                    ? [
                        {
                          label:
                            place.type === 'RESTAURANT' || place.type === 'CAFE'
                              ? '혼밥 추천'
                              : '혼행 추천',
                          tone: 'secondary',
                        },
                      ]
                    : []
                }
                onClick={() =>
                  navigate({ to: '/place/$placeId', params: { placeId: place.placeId.toString() } })
                }
              />
            ))}
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
