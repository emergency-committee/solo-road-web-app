import { Footprints, Heart, Share2, Star } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle } from '@/shared/components/ui/sheet'
import { StatBadge } from '@/shared/components/StatBadge'
import type { MapMarkerData } from '../types/map.types'

interface PlacePreviewSheetProps {
  marker: MapMarkerData | null
  onOpenChange: (open: boolean) => void
}

export function PlacePreviewSheet({ marker, onOpenChange }: PlacePreviewSheetProps) {
  return (
    <Sheet open={marker !== null} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="px-margin-mobile pt-base pb-lg rounded-t-[24px]">
        {marker && (
          <>
            <SheetTitle className="sr-only">{marker.name}</SheetTitle>
            <div className="mb-sm mt-sm bg-surface-container-highest mx-auto h-1.5 w-12 rounded-full" />
            <div className="gap-md flex">
              <div className="size-24 shrink-0 overflow-hidden rounded-xl">
                <img
                  src={marker.imageUrl}
                  alt={marker.imageAlt}
                  className="size-full object-cover"
                />
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
                <div className="text-outline font-label-md mt-sm gap-base flex items-center">
                  <Footprints className="size-4" />
                  <span>
                    현재 위치에서 {marker.distanceLabel} •{' '}
                    <Star className="text-secondary inline size-3.5 fill-current" /> {marker.rating}{' '}
                    ({marker.reviewCount})
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-lg gap-sm flex">
              <button
                type="button"
                className="font-label-md gap-xs bg-surface-container-high py-md text-on-surface flex flex-1 items-center justify-center rounded-xl transition-transform active:scale-95"
              >
                <Share2 className="size-5" />
                공유하기
              </button>
              <button
                type="button"
                className="font-label-md gap-xs bg-primary py-md text-on-primary flex flex-[2] items-center justify-center rounded-xl shadow-md transition-transform active:scale-95"
              >
                <Star className="size-5" />
                리뷰 보기
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
