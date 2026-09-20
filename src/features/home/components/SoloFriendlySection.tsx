import { useNavigate } from '@tanstack/react-router'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { PlaceCardSkeleton } from '@/shared/components/PlaceCardSkeleton'
import { SectionHeader } from '@/shared/components/SectionHeader'
import type { HomePlaceCardData } from '../types/home.types'

export function SoloFriendlySection({
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
        title="지금 혼밥하기 좋은 곳"
        actionLabel="전체보기"
        onAction={() => navigate({ to: '/recommend', search: { tab: 'dining' } })}
      />
      <div className="no-scrollbar -mx-margin-mobile gap-md px-margin-mobile pb-xs flex overflow-x-auto">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <PlaceCardSkeleton key={index} className="w-64 shrink-0" />
            ))
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
                className="w-64 shrink-0"
              />
            ))}
      </div>
    </section>
  )
}
