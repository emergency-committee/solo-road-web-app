import { useState } from 'react'
import { Compass, Star, Utensils } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useCreatePlaceReview, useReviewTags } from '../hooks/use-create-place-review'

interface PlaceReviewFormProps {
  placeId: number
  placeName: string
  placeType: string
  onSuccess: () => void
}

const DINING_TYPES = ['RESTAURANT', 'CAFE', '식당', '카페', '맛집', '한식', '일식', '중식', '베이커리']

function isDiningPlace(type: string) {
  const upper = type.toUpperCase()
  return DINING_TYPES.some((candidate) => upper.includes(candidate))
}

function RatingInput({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (value: number) => void
  label: string
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <div className="flex justify-center gap-1" role="radiogroup" aria-label={label}>
        {Array.from({ length: 5 }, (_, index) => index + 1).map((rating) => (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${label} ${rating}점`}
            onClick={() => onChange(rating)}
            className="grid size-11 place-items-center"
          >
            <Star
              className={cn(
                'size-8 transition-transform active:scale-90',
                rating <= value ? 'text-secondary fill-current' : 'text-outline-variant',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export function PlaceReviewForm({ placeId, placeName, placeType, onSuccess }: PlaceReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [soloRating, setSoloRating] = useState(0)
  const [tagIds, setTagIds] = useState<number[]>([])
  const [contents, setContents] = useState('')
  const isDining = isDiningPlace(placeType)
  const soloLabel = isDining ? '혼밥' : '혼행'
  const soloQuestion = isDining ? '혼자 식사하기는 어땠나요?' : '혼자 방문하기는 어땠나요?'
  const SoloIcon = isDining ? Utensils : Compass
  const tagQuery = useReviewTags(true, isDining ? 'dining' : 'travel')
  const createReview = useCreatePlaceReview(placeId)

  const canSubmit =
    rating > 0 &&
    soloRating > 0 &&
    contents.trim().length >= 5 &&
    !createReview.isPending

  const submit = () => {
    if (!canSubmit) return
    createReview.mutate(
      {
        rating,
        contents: contents.trim(),
        visitedAlone: true,
        soloRating,
        tagIds,
      },
      { onSuccess },
    )
  }

  return (
    <div className="space-y-7 pb-8">
      <section>
        <p className="text-on-surface-variant mb-1 text-xs">{placeName}</p>
        <RatingInput value={rating} onChange={setRating} label="전체적으로 만족했나요?" />
      </section>

      <section className="bg-primary/6 border-primary/10 rounded-lg border p-4">
        <div className="mb-3 flex items-center gap-2">
          <SoloIcon className="text-primary size-5" />
          <p className="text-sm font-bold">{soloQuestion}</p>
        </div>
        <RatingInput value={soloRating} onChange={setSoloRating} label={`${soloLabel} 평점`} />
        <div className="text-outline mt-1 flex justify-between px-1 text-[11px]">
          <span>조금 부담스러웠어요</span>
          <span>아주 편했어요</span>
        </div>
      </section>

      <section>
        <p className="mb-1 text-sm font-semibold">어떤 점이 기억에 남았나요?</p>
        <p className="text-on-surface-variant mb-3 text-xs">
          선택한 내용은 평점의 이유로 다른 여행자에게 보여요.
        </p>
        <div className="flex flex-wrap gap-2">
          {(tagQuery.data?.tags ?? []).map((tag) => {
            const selected = tagIds.includes(tag.reviewTagId)
            return (
              <button
                key={tag.reviewTagId}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  setTagIds((current) =>
                    selected
                      ? current.filter((id) => id !== tag.reviewTagId)
                      : [...current, tag.reviewTagId],
                  )
                }
                className={cn(
                  'rounded-full border px-3 py-2 text-xs font-medium transition-colors',
                  selected
                    ? 'border-primary bg-primary text-white'
                    : 'border-outline-variant text-on-surface-variant bg-white',
                )}
              >
                {tag.tagName}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <label htmlFor="place-review-contents" className="mb-2 block text-sm font-semibold">
          방문 후기를 남겨주세요
        </label>
        <textarea
          id="place-review-contents"
          value={contents}
          maxLength={2000}
          rows={5}
          onChange={(event) => setContents(event.target.value)}
          placeholder={
            isDining
              ? '메뉴, 좌석, 주문 분위기처럼 직접 경험한 내용을 적어주세요.'
              : '동선, 분위기, 혼자 머물기 편했던 점을 적어주세요.'
          }
          className="border-outline-variant bg-surface-container-low focus:border-primary w-full resize-none rounded-lg border p-3 text-sm outline-none"
        />
        <p className="text-outline mt-1 text-right text-xs">{contents.length}/2000</p>
      </section>

      {createReview.isError && (
        <p className="bg-error/8 text-error rounded-md px-3 py-2 text-sm">
          후기를 저장하지 못했어요. 로그인 상태와 입력 내용을 확인해 주세요.
        </p>
      )}

      <button
        type="button"
        disabled={!canSubmit}
        onClick={submit}
        className="bg-primary text-on-primary disabled:bg-outline-variant h-12 w-full rounded-lg text-sm font-bold transition-transform active:scale-[0.99] disabled:cursor-not-allowed"
      >
        {createReview.isPending ? '후기를 반영하고 있어요...' : `${soloLabel} 후기 남기기`}
      </button>
    </div>
  )
}
