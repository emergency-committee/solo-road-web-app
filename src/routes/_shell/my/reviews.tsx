import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DeleteReviewDialog, ReviewCard, useDeleteReview, useMyReviews } from '@/features/review'
import { EmptyState } from '@/shared/components/EmptyState'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'
import { MessageSquare } from 'lucide-react'

export const Route = createFileRoute('/_shell/my/reviews')({
  component: ReviewsPage,
})

function ReviewsPage() {
  const { data, isLoading } = useMyReviews()
  const deleteReview = useDeleteReview()
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  const reviews = data?.content ?? []

  return (
    <div className="bg-surface min-h-screen pb-24">
      <TopAppBar title="내 리뷰" showBack />
      <main className="px-margin-mobile pt-lg mx-auto max-w-2xl">
        {isLoading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            리뷰를 불러오는 중이에요...
          </p>
        ) : reviews.length === 0 ? (
          <EmptyState icon={<MessageSquare className="size-6" />} title="아직 작성한 리뷰가 없어요" />
        ) : (
          <div className="gap-md flex flex-col">
            {reviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={{
                  id: review.reviewId.toString(),
                  placeId: review.placeId,
                  placeName: review.placeName,
                  rating: review.rating,
                  content: review.contents,
                }}
                onDelete={() => setPendingDeleteId(review.reviewId)}
              />
            ))}
          </div>
        )}
      </main>

      <DeleteReviewDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId !== null) deleteReview.mutate(pendingDeleteId)
        }}
      />
    </div>
  )
}
