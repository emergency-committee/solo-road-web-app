import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { MapPinPlus, MessageSquarePlus, Navigation, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { EmptyState } from '@/shared/components/EmptyState'
import {
  type ApiSoloInfoSummary,
  KeyHighlightsList,
  PlaceDetailHero,
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

const DINING_TYPES = ['RESTAURANT', 'CAFE', '식당', '카페', '맛집', '한식', '일식', '중식', '베이커리']

function isDiningPlace(type: string) {
  const upper = type.toUpperCase()
  return DINING_TYPES.some((candidate) => upper.includes(candidate))
}

function PlaceDetailPage() {
  const { placeId } = Route.useParams()
  const placeIdNumber = Number(placeId)
  const { data: place, isLoading, isError } = usePlaceDetail(placeIdNumber)
  const { data: reviewPage } = usePlaceReviews(placeIdNumber, 0, 5)
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
  const isDining = isDiningPlace(place.type)

  return (
    <div className="bg-background min-h-screen">
      <PlaceDetailHero
        imageUrl={imageUrl}
        imageAlt={place.name}
        liked={place.isLiked}
        onToggleLike={() => toggleLike.mutate(place.isLiked)}
      />
      <main className="bg-surface px-margin-mobile pt-lg relative -mt-8 min-h-[calc(100vh-365px)] rounded-t-[32px] pb-28 shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
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
          {place.summary && (
            <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">{place.summary}</p>
          )}
        </section>

        <SoloAnalysisCard
          scoreStatus={place.soloScore?.scoreStatus}
          soloRating={place.soloScore?.soloRating}
          reviewCount={place.soloScore?.soloReviewCount ?? 0}
          tags={place.soloTagSummaries ?? []}
          context={isDining ? 'dining' : 'travel'}
          tip={place.soloInfo?.cautionNote}
        />
        <KeyHighlightsList highlights={toHighlights(place.soloInfo)} />

        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">방문 후기</h2>
              <p className="text-on-surface-variant text-xs">
                {reviewPage?.totalElements ?? 0}명이 경험을 나눴어요
              </p>
            </div>
            <Link
              to="/place/$placeId/review"
              params={{ placeId }}
              className="border-primary text-primary flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-bold"
            >
              <MessageSquarePlus className="size-4" />
              후기 남기기
            </Link>
          </div>

          {(reviewPage?.content ?? []).length > 0 ? (
            <div className="divide-outline-variant/20 divide-y">
              {(reviewPage?.content ?? []).map((review) => (
                <article key={review.reviewId} className="py-4 first:pt-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      <Star className="text-secondary size-4 fill-current" />
                      {review.rating.toFixed(1)}
                    </span>
                    {review.visitedAlone && review.soloRating != null && (
                      <span className="bg-primary/8 text-primary rounded-full px-2 py-1 text-xs font-semibold">
                        {isDining ? '혼밥' : '혼행'} {review.soloRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <p className="text-on-surface text-sm leading-relaxed">{review.contents}</p>
                  {review.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {review.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-surface-container text-on-surface-variant rounded-full px-2.5 py-1 text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <Link
              to="/place/$placeId/review"
              params={{ placeId }}
              className="border-outline-variant/40 text-on-surface-variant flex w-full items-center justify-center rounded-lg border border-dashed py-8 text-sm"
            >
              첫 방문 후기를 남겨주세요
            </Link>
          )}
        </section>
      </main>

      <PlaceBottomActionBar>
        <div className="gap-md flex w-full">
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
      </PlaceBottomActionBar>
    </div>
  )
}

function PlaceBottomActionBar({ children }: { children: ReactNode }) {
  return createPortal(
    <div className="border-outline-variant bg-surface/95 px-margin-mobile py-md fixed bottom-0 left-1/2 z-50 flex w-full max-w-[430px] -translate-x-1/2 border-t backdrop-blur-md">
      {children}
    </div>,
    document.body,
  )
}
