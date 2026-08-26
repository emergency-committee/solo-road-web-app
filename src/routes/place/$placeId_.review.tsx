import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlaceReviewForm, usePlaceDetail } from '@/features/place'
import { requireHomeAccess } from '@/shared/auth/route-guards'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/place/$placeId_/review')({
  beforeLoad: requireHomeAccess,
  component: PlaceReviewPage,
})

function PlaceReviewPage() {
  const { placeId } = Route.useParams()
  const placeIdNumber = Number(placeId)
  const navigate = useNavigate()
  const placeQuery = usePlaceDetail(placeIdNumber)

  return (
    <div className="bg-background min-h-screen">
      <TopAppBar title="혼밥 후기 작성" showBack />
      <main className="px-margin-mobile pt-lg mx-auto w-full max-w-[36rem]">
        {placeQuery.data ? (
          <PlaceReviewForm
            placeId={placeIdNumber}
            placeName={placeQuery.data.name}
            onSuccess={() => navigate({ to: '/place/$placeId', params: { placeId } })}
          />
        ) : (
          <p className="text-on-surface-variant py-10 text-center text-sm">
            장소 정보를 불러오는 중이에요...
          </p>
        )}
      </main>
    </div>
  )
}
