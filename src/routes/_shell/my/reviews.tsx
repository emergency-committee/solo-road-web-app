import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DeleteReviewDialog, mockReviews, ReviewCard } from '@/features/review'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

const REVIEW_FILTERS = [
  { value: 'all', label: 'All Reviews' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'recent', label: 'Recent' },
  { value: 'with-photos', label: 'With Photos' },
]

export const Route = createFileRoute('/_shell/my/reviews')({
  component: ReviewsPage,
})

function ReviewsPage() {
  const [filter, setFilter] = useState<string[]>(['all'])
  const [reviews, setReviews] = useState(mockReviews)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  return (
    <div className="bg-surface min-h-screen pb-24">
      <TopAppBar title="My Reviews" showBack />
      <main className="px-margin-mobile pt-lg mx-auto max-w-2xl">
        <FilterChipGroup
          options={REVIEW_FILTERS}
          value={filter}
          onChange={setFilter}
          className="mb-lg"
        />
        <div className="gap-md flex flex-col">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={() => setPendingDeleteId(review.id)}
            />
          ))}
        </div>
      </main>

      <DeleteReviewDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        onConfirm={() => setReviews((prev) => prev.filter((r) => r.id !== pendingDeleteId))}
      />
    </div>
  )
}
