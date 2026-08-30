import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { HiddenGemsGrid, MiniMapPreviewCard, SoloFriendlySection } from '@/features/home'
import type { HomePlaceCardData } from '@/features/home'
import { sortByImageFirst } from '@/features/home/lib/sort-by-image'
import { usePlaceRecommendations } from '@/features/place'
import { formatDistanceMeters } from '@/shared/lib/format'
import { useCurrentRegionLabel } from '@/shared/hooks/use-current-region-label'

export const Route = createFileRoute('/_shell/')({
  component: HomePage,
})

function HomePage() {
  const { data } = usePlaceRecommendations()
  const { label: regionLabel, status: regionStatus } = useCurrentRegionLabel()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  const goToSearch = () => {
    const trimmed = keyword.trim()
    if (!trimmed) return
    void navigate({ to: '/map', search: { keyword: trimmed } })
  }

  const soloDiningPlaces: HomePlaceCardData[] = sortByImageFirst(
    (data?.soloDining ?? []).map((place) => ({
      id: place.placeId.toString(),
      title: place.name,
      imageUrl: place.thumbnailUrl ?? null,
      imageAlt: place.name,
      subtitle:
        place.distanceM !== undefined
          ? formatDistanceMeters(place.distanceM)
          : '거리 정보 준비 중',
      badges: place.tags.map((tag) => ({ label: tag, tone: 'secondary' as const })),
      hasImage: place.thumbnailUrl != null,
    })),
  )

  const hiddenGems: HomePlaceCardData[] = sortByImageFirst(
    (data?.hiddenGems ?? []).map((place) => ({
      id: place.placeId.toString(),
      title: place.name,
      imageUrl: place.thumbnailUrl ?? null,
      imageAlt: place.name,
      subtitle: place.type,
      badges: [],
      hasImage: place.thumbnailUrl != null,
    })),
  )

  return (
    <div className="bg-background min-h-screen">
      <header className="px-margin-mobile py-base flex items-center justify-between">
        <div className="gap-xs flex items-center">
          <MapPin className="text-primary size-5" />
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
            {regionStatus === 'ready' && regionLabel
              ? regionLabel
              : regionStatus === 'error'
                ? '위치 정보 없음'
                : '위치 확인 중...'}
          </h1>
        </div>
      </header>
      <main className="space-y-xl px-margin-mobile pb-8">
        <section className="relative">
          <div className="border-outline-variant bg-surface-container-lowest px-md py-sm flex items-center rounded-xl border shadow-sm">
            <button
              type="button"
              aria-label="검색"
              onClick={goToSearch}
              className="mr-xs text-outline shrink-0"
            >
              <Search className="size-5" />
            </button>
            <input
              className="placeholder:text-outline-variant text-body-md w-full border-none bg-transparent focus:ring-0"
              placeholder="어디로 혼자 떠나볼까요?"
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') goToSearch()
              }}
            />
            <SlidersHorizontal className="ml-xs text-primary size-5" />
          </div>
        </section>

        <MiniMapPreviewCard />
        <SoloFriendlySection places={soloDiningPlaces} />
        <HiddenGemsGrid places={hiddenGems} />
      </main>
    </div>
  )
}
