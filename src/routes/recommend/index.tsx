import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { usePlaces } from '@/features/place'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { EmptyState } from '@/shared/components/EmptyState'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { formatDistanceMeters } from '@/shared/lib/format'

const RECOMMEND_FILTERS = [
  { value: 'solo-friendly', label: '혼행 친화' },
  { value: 'all', label: '전체' },
]

export const Route = createFileRoute('/recommend/')({
  component: RecommendPage,
})

function RecommendPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState<string[]>(['solo-friendly'])

  const placesQuery = usePlaces({
    ...(keyword.trim() && { keyword: keyword.trim() }),
    soloFriendlyOnly: filter[0] === 'solo-friendly',
  })
  const places = placesQuery.data?.content ?? []

  return (
    <div className="bg-surface min-h-screen">
      <TopAppBar title="여행지 추천" showBack />
      <main className="px-margin-mobile pt-lg pb-16">
        <div className="border-outline-variant bg-surface-container-lowest px-md py-sm mb-md flex items-center rounded-xl border shadow-sm">
          <Search className="mr-xs text-outline size-5" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="placeholder:text-outline-variant text-body-md w-full border-none bg-transparent focus:ring-0"
            placeholder="장소, 지역, 분위기로 검색해보세요"
            type="text"
          />
        </div>
        <FilterChipGroup
          options={RECOMMEND_FILTERS}
          value={filter}
          onChange={setFilter}
          className="mb-lg"
        />

        {placesQuery.isLoading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            추천 장소를 불러오는 중이에요...
          </p>
        ) : places.length === 0 ? (
          <EmptyState icon={<Search className="size-6" />} title="조건에 맞는 장소가 없어요" />
        ) : (
          <div className="gap-md grid grid-cols-1">
            {places.map((place) => (
              <PlaceCard
                key={place.placeId}
                imageUrl={place.thumbnailUrl ?? `https://picsum.photos/seed/place-${place.placeId.toString()}/480/270`}
                imageAlt={place.name}
                title={place.name}
                subtitle={`${place.type} • ${formatDistanceMeters(place.distanceM)}`}
                {...(place.rating != null && { rating: place.rating })}
                badges={place.soloFriendlyBadge ? [{ label: '혼행 친화', tone: 'secondary' }] : []}
                onClick={() =>
                  navigate({ to: '/place/$placeId', params: { placeId: place.placeId.toString() } })
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
