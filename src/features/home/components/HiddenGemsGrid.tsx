import { useNavigate } from '@tanstack/react-router'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { SectionHeader } from '@/shared/components/SectionHeader'
import type { HomePlaceCardData } from '../mocks/home-mocks'

export function HiddenGemsGrid({ places }: { places: HomePlaceCardData[] }) {
  const navigate = useNavigate()

  return (
    <section className="space-y-md">
      <SectionHeader title="여유로운 숨은 명소" actionLabel="더 보기" />
      <div className="gap-md grid grid-cols-2">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            imageUrl={place.imageUrl}
            imageAlt={place.imageAlt}
            title={place.title}
            subtitle={place.subtitle}
            onClick={() => navigate({ to: '/place/$placeId', params: { placeId: place.id } })}
          />
        ))}
      </div>
    </section>
  )
}
