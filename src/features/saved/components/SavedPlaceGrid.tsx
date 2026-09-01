import { useNavigate } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { EmptyState } from '@/shared/components/EmptyState'
import { useTogglePlaceSave } from '@/features/place'
import type { ApiSavedPlace } from '../types/saved.types'

const CATEGORY_LABELS: Record<string, string> = {
  RESTAURANT: '식당',
  CAFE: '카페',
  WELLNESS: '웰니스',
  STUDY: '스터디',
  EXHIBITION: '전시·문화',
  NATURE: '자연',
  ACTIVITY: '체험·활동',
  SHOPPING: '쇼핑',
  ATTRACTION: '명소',
  CULTURE: '전시·문화',
  STAY: '숙소',
  SPOT: '명소',
}

function SavedPlaceCard({ place }: { place: ApiSavedPlace }) {
  const navigate = useNavigate()
  const toggleSave = useTogglePlaceSave(place.placeId)

  return (
    <PlaceCard
      imageUrl={place.thumbnailUrl ?? null}
      imageAlt={place.name}
      title={place.name}
      imageAspect="compact"
      badges={[
        { label: CATEGORY_LABELS[place.type] ?? place.type, tone: 'neutral' },
        ...(place.soloFriendlyBadge
          ? [{ label: '혼행 친화', tone: 'secondary' as const }]
          : []),
      ]}
      saved
      onToggleSave={() => toggleSave.mutate(true)}
      onClick={() => navigate({ to: '/place/$placeId', params: { placeId: place.placeId.toString() } })}
    />
  )
}

export function SavedPlaceGrid({ places }: { places: ApiSavedPlace[] }) {
  const navigate = useNavigate()

  return (
    <div className="gap-md grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
      {places.map((place) => (
        <SavedPlaceCard key={place.placeId} place={place} />
      ))}
      <EmptyState
        icon={<PlusCircle className="size-6" />}
        title="더 둘러보기"
        description="내 주변의 안전한 장소를 찾아보세요"
        actionLabel="둘러보기"
        onAction={() => navigate({ to: '/map' })}
        className="min-h-64 justify-center [&_p]:break-keep"
      />
    </div>
  )
}
