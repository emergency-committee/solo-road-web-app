import { createFileRoute } from '@tanstack/react-router'
import { MapPinPlus, Navigation } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'
import {
  KeyHighlightsList,
  mockPlaceDetails,
  PlaceDetailHero,
  ReviewSummaryBanner,
  SoloAnalysisCard,
} from '@/features/place'

export const Route = createFileRoute('/place/$placeId')({
  component: PlaceDetailPage,
})

function PlaceDetailPage() {
  const { placeId } = Route.useParams()
  const place = mockPlaceDetails[placeId] ?? Object.values(mockPlaceDetails)[0]

  if (!place) {
    return (
      <main className="p-margin-mobile">
        <EmptyState icon={<MapPinPlus className="size-6" />} title="장소를 찾을 수 없어요" />
      </main>
    )
  }

  return (
    <div className="bg-background min-h-screen pb-32">
      <PlaceDetailHero imageUrl={place.imageUrl} imageAlt={place.imageAlt} />
      <main className="bg-surface px-margin-mobile pt-lg relative -mt-8 min-h-screen rounded-t-[32px] pb-32 shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
        <section className="mb-lg">
          <div className="mb-base flex items-start justify-between">
            <span className="font-label-md text-label-md bg-secondary-fixed px-sm text-on-secondary-fixed rounded-full py-1">
              {place.category}
            </span>
            <div className="text-outline flex items-center gap-1">
              <span className="text-body-sm">{place.address}</span>
            </div>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">{place.name}</h1>
          <p className="text-body-md text-on-surface-variant gap-base flex items-center">
            현재 위치에서 <span className="text-primary font-bold">{place.distanceLabel}</span>{' '}
            떨어짐
          </p>
        </section>

        <SoloAnalysisCard soloFriendliness={place.soloFriendliness} hashtags={place.hashtags} />
        <KeyHighlightsList highlights={place.highlights} />
        <ReviewSummaryBanner recommenderCount={place.recommenderCount} />

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
            className="border-outline-variant/30 gap-xs bg-surface-container-highest px-lg text-on-surface-variant flex h-14 items-center justify-center rounded-xl border font-bold active:scale-95"
          >
            <MapPinPlus className="size-5" />
            <span>추가</span>
          </button>
        </div>
      </main>
    </div>
  )
}
