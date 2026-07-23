import { useNavigate } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { EmptyState } from '@/shared/components/EmptyState'
import type { SavedPlaceMock } from '../mocks/saved-places-mocks'

export function SavedPlaceGrid({ places }: { places: SavedPlaceMock[] }) {
  const navigate = useNavigate()

  return (
    <div className="gap-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          imageUrl={place.imageUrl}
          imageAlt={place.imageAlt}
          title={place.title}
          subtitle={place.address}
          rating={place.rating}
          badges={place.tags}
          saved
          onToggleSave={() => {}}
          onClick={() => navigate({ to: '/place/$placeId', params: { placeId: place.id } })}
        />
      ))}
      <EmptyState
        icon={<PlusCircle className="size-6" />}
        title="Discover more"
        description="Explore safe routes near you"
        actionLabel="둘러보기"
        onAction={() => navigate({ to: '/map' })}
      />
    </div>
  )
}
