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
}

function SavedPlaceCard({ place }: { place: ApiSavedPlace }) {
  const navigate = useNavigate()
  const toggleSave = useTogglePlaceSave(place.placeId)

  return (
    <PlaceCard
      imageUrl={place.thumbnailUrl ?? null}
      imageAlt={place.name}
      title={place.name}
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
