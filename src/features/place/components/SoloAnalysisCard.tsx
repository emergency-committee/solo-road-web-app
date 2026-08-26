import { Utensils } from 'lucide-react'
import type { ApiSoloTagSummary } from '../types/place.types'
import { hasDisplayableSoloRating, soloRatingMessage } from '../lib/solo-rating'

interface SoloAnalysisCardProps {
  soloRating: number | null | undefined
  reviewCount: number
  tags: ApiSoloTagSummary[]
}

export function SoloAnalysisCard({ soloRating, reviewCount, tags }: SoloAnalysisCardProps) {
  return (
    <section className="mb-lg">
      <h2 className="font-headline-lg-mobile text-headline-lg-mobile mb-3">혼밥 평점</h2>
      <div className="bg-primary/6 border-primary/10 p-md rounded-lg border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary flex size-12 items-center justify-center rounded-full text-white">
              <Utensils className="size-6" />
            </div>
            <div>
              <p className="text-on-surface text-base font-bold">
                {soloRatingMessage(soloRating, reviewCount)}
              </p>
              <p className="text-on-surface-variant mt-0.5 text-xs">
                {reviewCount > 0
                  ? `혼자 방문한 ${reviewCount}명의 경험을 반영했어요`
                  : '첫 혼밥 후기를 기다리고 있어요'}
              </p>
            </div>
          </div>
          {hasDisplayableSoloRating(soloRating, reviewCount) && (
            <div className="text-right">
              <p className="text-primary text-3xl font-bold tabular-nums">
                {soloRating!.toFixed(1)}
              </p>
              <p className="text-outline text-xs">5점 만점</p>
            </div>
          )}
        </div>
      </div>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.tagId}
              className="border-outline-variant/30 text-on-surface-variant rounded-full border bg-white px-3 py-1.5 text-xs"
            >
              {tag.name} <strong className="text-primary ml-0.5">{tag.positiveCount}</strong>
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
