import { useNavigate } from '@tanstack/react-router'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { PlaceCardSkeleton } from '@/shared/components/PlaceCardSkeleton'
import { SectionHeader } from '@/shared/components/SectionHeader'
import type { HomePlaceCardData } from '../types/home.types'

export function HiddenGemsGrid({
  places,
  isLoading = false,
}: {
  places: HomePlaceCardData[]
  isLoading?: boolean
}) {
  const navigate = useNavigate()

  return (
    <section className="space-y-md">
      <SectionHeader
        title="여유로운 숨은 명소"
        actionLabel="더 보기"
        onAction={() => navigate({ to: '/recommend' })}
      />
      <div className="gap-md grid grid-cols-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <PlaceCardSkeleton key={index} />)
          : places.map((place) => (
              <PlaceCard
                key={place.id}
                imageUrl={place.imageUrl}
                imageAlt={place.imageAlt}
                {...(place.placeholderVariant ? { placeholderVariant: place.placeholderVariant } : {})}
                title={place.title}
                subtitle={place.subtitle}
                badges={place.badges}
                onClick={() => navigate({ to: '/place/$placeId', params: { placeId: place.id } })}
              />
            ))}
      </div>
    </section>
  )
}
