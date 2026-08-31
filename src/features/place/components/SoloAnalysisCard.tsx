import { Compass, Utensils } from 'lucide-react'
import type { ApiSoloTagSummary } from '../types/place.types'
import { hasDisplayableSoloRating, soloRatingMessage } from '../lib/solo-rating'

interface SoloAnalysisCardProps {
  scoreStatus: 'PENDING' | 'DONE' | null | undefined
  soloRating: number | null | undefined
  reviewCount: number
  tags: ApiSoloTagSummary[]
  context?: 'dining' | 'travel'
  tip?: string | null | undefined
}

export function SoloAnalysisCard({
  scoreStatus,
  soloRating,
  reviewCount,
  tags,
  context = 'dining',
  tip,
}: SoloAnalysisCardProps) {
  const isDining = context === 'dining'
  const Icon = isDining ? Utensils : Compass
  const title = isDining ? '혼밥 평점' : '혼행 평점'

  return (
    <section className="mb-lg">
      <h2 className="font-headline-lg-mobile text-headline-lg-mobile mb-3">{title}</h2>
      <div className="bg-primary/6 border-primary/10 p-md rounded-lg border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary flex size-12 items-center justify-center rounded-full text-white">
              <Icon className="size-6" />
            </div>
            <div>
              <p className="text-on-surface text-base font-bold">
                {soloRatingMessage(soloRating, reviewCount, context)}
              </p>
              <p className="text-on-surface-variant mt-0.5 text-xs">
                {hasDisplayableSoloRating(soloRating, reviewCount)
                  ? reviewCount > 0
                    ? `혼자 방문 후기 ${reviewCount}개도 함께 볼 수 있어요`
                    : '장소 정보와 혼행 기준으로 산정했어요'
                  : `첫 ${isDining ? '혼밥' : '혼행'} 후기를 기다리고 있어요`}
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
      {scoreStatus === 'PENDING' && (
        <p className="text-on-surface-variant mt-2 px-1 text-xs">
          혼행 적합도를 분석하고 있어요
        </p>
      )}
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
      {tip && (
        <p className="border-outline-variant/30 text-on-surface-variant mt-3 rounded-lg border bg-white px-3 py-2 text-xs leading-relaxed">
          {tip}
        </p>
      )}
    </section>
  )
}
