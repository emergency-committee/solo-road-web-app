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
  const placeType = placeQuery.data?.type?.toUpperCase() ?? ''
  const isDining = ['RESTAURANT', 'CAFE', '식당', '카페', '맛집', '한식', '일식', '중식', '베이커리']
    .some((candidate) => placeType.includes(candidate))

  return (
    <div className="bg-background min-h-screen">
      <TopAppBar title={isDining ? '혼밥 후기 작성' : '혼행 후기 작성'} showBack />
      <main className="px-margin-mobile pt-lg mx-auto w-full max-w-[36rem]">
        {placeQuery.data ? (
          <PlaceReviewForm
            placeId={placeIdNumber}
            placeName={placeQuery.data.name}
            placeType={placeQuery.data.type}
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
