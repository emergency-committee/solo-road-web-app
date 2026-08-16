import { useNavigate } from '@tanstack/react-router'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { SectionHeader } from '@/shared/components/SectionHeader'
import type { HomePlaceCardData } from '../types/home.types'

export function SoloFriendlySection({ places }: { places: HomePlaceCardData[] }) {
  const navigate = useNavigate()

  return (
    <section className="space-y-md">
      <SectionHeader
        title="지금 혼밥하기 좋은 곳"
        actionLabel="전체보기"
        onAction={() => navigate({ to: '/recommend' })}
      />
      <div className="no-scrollbar -mx-margin-mobile gap-md px-margin-mobile pb-xs flex overflow-x-auto">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            imageUrl={place.imageUrl}
            imageAlt={place.imageAlt}
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
