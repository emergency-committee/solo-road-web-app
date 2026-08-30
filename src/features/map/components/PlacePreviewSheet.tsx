import { Link } from '@tanstack/react-router'
import { Footprints, Heart, Share2, Star, Utensils } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle } from '@/shared/components/ui/sheet'
import { PlaceImagePlaceholder } from '@/shared/components/PlaceImagePlaceholder'
import { StatBadge } from '@/shared/components/StatBadge'
import { hasDisplayableSoloRating } from '@/features/place/lib/solo-rating'
import type { MapMarkerData } from '../types/map.types'

interface PlacePreviewSheetProps {
  marker: MapMarkerData | null
  onOpenChange: (open: boolean) => void
}

export function PlacePreviewSheet({ marker, onOpenChange }: PlacePreviewSheetProps) {
  return (
    <Sheet open={marker !== null} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="px-margin-mobile pt-base pb-lg bottom-16 max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-t-[24px]"
      >
        {marker && (
          <>
            <SheetTitle className="sr-only">{marker.name}</SheetTitle>
            <div className="mb-sm mt-sm bg-surface-container-highest mx-auto h-1.5 w-12 rounded-full" />
            <div className="gap-md flex">
              <div className="size-24 shrink-0 overflow-hidden rounded-xl">
                {marker.imageUrl ? (
                  <img
                    src={marker.imageUrl}
                    alt={marker.imageAlt}
                    className="size-full object-cover"
                  />
                ) : (
                  <PlaceImagePlaceholder />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
                    {marker.name}
                  </h2>
                  <button
                    type="button"
                    aria-label="찜하기"
                    className="text-outline hover:text-error"
                  >
                    <Heart className="size-5" />
                  </button>
                </div>
                <div className="mt-base gap-xs flex flex-wrap">
                  {marker.tags.map((tag) => (
                    <StatBadge key={tag.label} label={tag.label} tone={tag.tone} />
                  ))}
                </div>
                <div className="text-outline font-label-md mt-sm flex items-center gap-1.5">
                  <Footprints className="size-4" />
                  <span>현재 위치에서 {marker.distanceLabel}</span>
                </div>
              </div>
            </div>
            <div className="bg-primary/6 border-primary/10 mt-base flex items-center justify-between rounded-lg border px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="bg-primary grid size-10 place-items-center rounded-full text-white">
                  <Utensils className="size-5" />
                </span>
                <div>
                  <p className="text-on-surface-variant text-xs">혼밥 평점</p>
                  {hasDisplayableSoloRating(marker.soloRating, marker.soloReviewCount) ? (
                    <p className="text-primary text-lg font-bold">
                      {marker.soloRating!.toFixed(1)}
                      <span className="text-on-surface-variant ml-1 text-xs font-medium">
                        · 혼자 방문 {marker.soloReviewCount}명
                      </span>
                    </p>
                  ) : (
                    <p className="text-on-surface text-sm font-semibold">
                      {marker.soloReviewCount > 0
                        ? '평가가 모이고 있어요'
                        : '첫 혼밥 평가를 기다리고 있어요'}
                    </p>
                  )}
                </div>
              </div>
              {marker.rating != null && (
                <span className="text-on-surface-variant text-xs">
                  <Star className="text-secondary mr-1 inline size-3.5 fill-current" />
                  일반 {marker.rating.toFixed(1)}
                </span>
              )}
            </div>
            <div className="mt-lg gap-sm flex">
              <button
                type="button"
                className="font-label-md gap-xs bg-surface-container-high py-md text-on-surface flex flex-1 items-center justify-center rounded-xl transition-transform active:scale-95"
              >
                <Share2 className="size-5" />
                공유하기
              </button>
              <Link
                to="/place/$placeId"
                params={{ placeId: marker.id }}
                className="font-label-md gap-xs bg-primary py-md text-on-primary flex flex-[2] items-center justify-center rounded-xl shadow-md transition-transform active:scale-95"
              >
                <Star className="size-5" />
                혼밥 후기 보기
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
