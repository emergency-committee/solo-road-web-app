import { MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import {
  useCourseReviews,
  useCreateCourseReview,
  useCourseTags,
} from '../hooks/use-course-community'

export function CourseReviewsSection({ courseId, owner }: { courseId: number; owner: boolean }) {
  const reviewsQuery = useCourseReviews(courseId)
  const tagsQuery = useCourseTags()
  const createReview = useCreateCourseReview(courseId)
  const [writing, setWriting] = useState(false)
  const [experienceType, setExperienceType] = useState<'FOLLOWED' | 'ADAPTED'>('FOLLOWED')
  const [contents, setContents] = useState('')
  const [tagIds, setTagIds] = useState<number[]>([])
  const reviews = reviewsQuery.data?.content ?? []

  return (
    <section className="border-outline-variant/30 mt-8 border-t pt-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">다녀온 이야기</h3>
          <p className="text-on-surface-variant text-sm">이 코스를 참고한 여행자들의 경험이에요.</p>
        </div>
        {!owner && !writing && (
          <button
            type="button"
            onClick={() => setWriting(true)}
            className="text-primary text-sm font-semibold"
          >
            후기 남기기
          </button>
        )}
      </div>

      {writing && (
        <div className="bg-surface-container-low mb-5 space-y-3 rounded-lg p-4">
          <div className="bg-surface-container grid grid-cols-2 rounded-md p-1">
            {(
              [
                ['FOLLOWED', '그대로 다녀왔어요'],
                ['ADAPTED', '내 취향대로 바꿨어요'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setExperienceType(value)}
                className={`h-9 rounded text-xs font-semibold ${experienceType === value ? 'text-primary bg-white shadow-sm' : 'text-on-surface-variant'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            value={contents}
            onChange={(event) => setContents(event.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="혼자 다녀보니 어땠는지 알려주세요."
            className="border-outline-variant focus:border-primary w-full resize-none rounded-lg border bg-white p-3 text-sm outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {(tagsQuery.data ?? [])
              .filter((tag) => tag.category === 'HIGHLIGHT')
              .map((tag) => (
                <button
                  key={tag.tagId}
                  type="button"
                  onClick={() =>
                    setTagIds((current) =>
                      current.includes(tag.tagId)
                        ? current.filter((id) => id !== tag.tagId)
                        : current.length < 3
                          ? [...current, tag.tagId]
                          : current,
                    )
                  }
                  className={`rounded-full border px-2.5 py-1.5 text-xs ${tagIds.includes(tag.tagId) ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant bg-white'}`}
                >
                  {tag.name}
                </button>
              ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setWriting(false)}
              className="text-on-surface-variant h-10 px-3 text-sm"
            >
              취소
            </button>
            <button
              type="button"
              disabled={contents.trim().length < 5 || createReview.isPending}
              onClick={() =>
                createReview.mutate(
                  { experienceType, contents: contents.trim(), tagIds },
                  {
                    onSuccess: () => {
                      setWriting(false)
                      setContents('')
                      setTagIds([])
                    },
                  },
                )
              }
              className="bg-primary text-on-primary flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:opacity-40"
            >
              <Send className="size-4" /> 남기기
            </button>
          </div>
          {createReview.isError && (
            <p className="text-error text-xs">
              후기를 남기지 못했어요. 이미 작성한 후기가 있는지 확인해 주세요.
            </p>
          )}
        </div>
      )}

      {reviewsQuery.isLoading ? (
        <p className="text-on-surface-variant py-5 text-center text-sm">
          이야기를 불러오는 중이에요...
        </p>
      ) : reviews.length === 0 ? (
        <div className="text-on-surface-variant flex flex-col items-center py-7 text-center text-sm">
          <MessageCircle className="mb-2 size-5" /> 아직 남겨진 이야기가 없어요.
        </div>
      ) : (
        <div className="divide-outline-variant/30 divide-y">
          {reviews.map((review) => (
            <article key={review.reviewId} className="py-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-bold">
                  {review.userName}
                  {review.userTitle && (
                    <span className="text-primary ml-1 font-medium">· {review.userTitle}</span>
                  )}
                </p>
                <span className="bg-surface-container text-on-surface-variant rounded px-2 py-1 text-[11px]">
                  {review.experienceType === 'FOLLOWED' ? '그대로 다녀옴' : '취향대로 변경'}
                </span>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">
                {review.contents}
              </p>
              {review.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {review.tags.map((tag) => (
                    <span
                      key={tag.tagId}
                      className="bg-primary/5 text-primary rounded px-2 py-1 text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
