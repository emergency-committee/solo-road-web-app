import { useNavigate } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { EmptyState } from '@/shared/components/EmptyState'
import { useTogglePlaceLike } from '@/features/place'
import type { ApiSavedPlace } from '../types/saved.types'

function SavedPlaceCard({ place }: { place: ApiSavedPlace }) {
  const navigate = useNavigate()
  const toggleLike = useTogglePlaceLike(place.placeId)

  return (
    <PlaceCard
      imageUrl={place.thumbnailUrl ?? `https://picsum.photos/seed/place-${place.placeId.toString()}/480/270`}
      imageAlt={place.name}
      title={place.name}
      badges={place.soloFriendlyBadge ? [{ label: '혼행 친화', tone: 'secondary' }] : []}
      saved
      onToggleSave={() => toggleLike.mutate(true)}
      onClick={() => navigate({ to: '/place/$placeId', params: { placeId: place.placeId.toString() } })}
    />
  )
}

export function SavedPlaceGrid({ places }: { places: ApiSavedPlace[] }) {
  const navigate = useNavigate()

  return (
    <div className="gap-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <SavedPlaceCard key={place.placeId} place={place} />
      ))}
      <EmptyState
        icon={<PlusCircle className="size-6" />}
        title="더 둘러보기"
        description="내 주변의 안전한 장소를 찾아보세요"
        actionLabel="둘러보기"
        onAction={() => navigate({ to: '/map' })}
      />
    </div>
  )
}
