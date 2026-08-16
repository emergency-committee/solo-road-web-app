import { createFileRoute } from '@tanstack/react-router'
import { MapPinPlus, Navigation } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'
import {
  type ApiSoloInfoSummary,
  KeyHighlightsList,
  PlaceDetailHero,
  ReviewSummaryBanner,
  SoloAnalysisCard,
  usePlaceDetail,
  usePlaceReviews,
  useTogglePlaceLike,
  type PlaceHighlight,
} from '@/features/place'

export const Route = createFileRoute('/place/$placeId')({
  component: PlaceDetailPage,
})

function toHighlights(soloInfo: ApiSoloInfoSummary | undefined): PlaceHighlight[] {
  if (!soloInfo) return []
  const highlights: PlaceHighlight[] = []
  if (soloInfo.hasSoloSeat) highlights.push({ icon: 'seat', label: '1인 좌석 완비' })
  if (soloInfo.hasSoloMenu) highlights.push({ icon: 'menu', label: '1인 메뉴 제공' })
  if (soloInfo.quietLevel) highlights.push({ icon: 'quiet', label: '조용한 구역' })
  return highlights
}

function PlaceDetailPage() {
  const { placeId } = Route.useParams()
  const placeIdNumber = Number(placeId)
  const { data: place, isLoading, isError } = usePlaceDetail(placeIdNumber)
  const { data: reviewPage } = usePlaceReviews(placeIdNumber, 0, 1)
  const toggleLike = useTogglePlaceLike(placeIdNumber)

  if (isLoading) {
    return (
      <main className="p-margin-mobile">
        <p className="font-body-md text-on-surface-variant text-center">
          장소 정보를 불러오는 중이에요...
        </p>
      </main>
    )
  }

  if (isError || !place) {
    return (
      <main className="p-margin-mobile">
        <EmptyState icon={<MapPinPlus className="size-6" />} title="장소를 찾을 수 없어요" />
      </main>
    )
  }

  const imageUrl = `https://picsum.photos/seed/place-${placeId}/800/600`

  return (
    <div className="bg-background min-h-screen pb-32">
      <PlaceDetailHero
        imageUrl={imageUrl}
        imageAlt={place.name}
        liked={place.isLiked}
        onToggleLike={() => toggleLike.mutate(place.isLiked)}
      />
      <main className="bg-surface px-margin-mobile pt-lg relative -mt-8 min-h-screen rounded-t-[32px] pb-32 shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
        <section className="mb-lg">
          <div className="mb-base flex items-start justify-between">
            <span className="font-label-md text-label-md bg-secondary-fixed px-sm text-on-secondary-fixed rounded-full py-1">
              {place.type}
            </span>
            {place.address && (
              <div className="text-outline flex items-center gap-1">
                <span className="text-body-sm">{place.address}</span>
              </div>
            )}
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">{place.name}</h1>
        </section>

        <SoloAnalysisCard
          soloFriendliness={place.soloScore?.grade ?? 'LOW'}
          hashtags={place.analysisTags}
        />
        <KeyHighlightsList highlights={toHighlights(place.soloInfo)} />
        <ReviewSummaryBanner reviewCount={reviewPage?.totalElements ?? 0} />

        <div className="gap-md flex">
          <button
            type="button"
            className="gap-xs bg-primary shadow-primary/20 flex h-14 flex-1 items-center justify-center rounded-xl font-bold text-white shadow-lg"
          >
            <Navigation className="size-5" />
            <span>경로 확인</span>
          </button>
          <button
            type="button"
            onClick={() => toggleLike.mutate(place.isLiked)}
            className="border-outline-variant/30 gap-xs bg-surface-container-highest px-lg text-on-surface-variant flex h-14 items-center justify-center rounded-xl border font-bold active:scale-95"
          >
            <MapPinPlus className="size-5" />
            <span>{place.isLiked ? '저장됨' : '추가'}</span>
          </button>
        </div>
      </main>
    </div>
  )
}
