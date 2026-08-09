import { createFileRoute } from '@tanstack/react-router'
import { Bookmark } from 'lucide-react'
import { SavedPlaceGrid, useSavedPlaces } from '@/features/saved'
import { EmptyState } from '@/shared/components/EmptyState'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/my/saved-places')({
  component: SavedPlacesPage,
})

function SavedPlacesPage() {
  const { data, isLoading } = useSavedPlaces()
  const places = data?.content ?? []

  return (
    <div className="bg-surface min-h-screen pb-24">
      <TopAppBar title="저장한 장소" showBack />
      <main className="px-margin-mobile pt-lg">
        {isLoading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            저장한 장소를 불러오는 중이에요...
          </p>
        ) : places.length === 0 ? (
          <EmptyState icon={<Bookmark className="size-6" />} title="아직 저장한 장소가 없어요" />
        ) : (
          <SavedPlaceGrid places={places} />
        )}
      </main>
    </div>
  )
}
