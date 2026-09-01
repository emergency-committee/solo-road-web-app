import { createFileRoute } from '@tanstack/react-router'
import { Bookmark } from 'lucide-react'
import { useState } from 'react'
import { SavedPlaceGrid, useSavedPlaces } from '@/features/saved'
import { EmptyState } from '@/shared/components/EmptyState'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/my/saved-places')({
  component: SavedPlacesPage,
})

const SAVED_PLACE_FILTERS = [
  { value: undefined, label: '전체' },
  { value: 'RESTAURANT', label: '식당' },
  { value: 'CAFE', label: '카페' },
  { value: 'WELLNESS', label: '웰니스' },
  { value: 'STUDY', label: '스터디' },
  { value: 'EXHIBITION', label: '전시·문화' },
  { value: 'NATURE', label: '자연' },
  { value: 'ACTIVITY', label: '체험·활동' },
  { value: 'SHOPPING', label: '쇼핑' },
] as const

function SavedPlacesPage() {
  const [selectedType, setSelectedType] = useState<string | undefined>()
  const { data, isLoading } = useSavedPlaces(0, 20, selectedType)
  const places = data?.content ?? []

  return (
    <div className="bg-surface min-h-screen pb-24">
      <TopAppBar title="저장한 장소" showBack />
      <main className="px-margin-mobile pt-lg">
        <div className="-mx-margin-mobile mb-lg overflow-x-auto px-margin-mobile [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {SAVED_PLACE_FILTERS.map((filter) => {
              const selected = selectedType === filter.value
              return (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setSelectedType(filter.value)}
                  aria-pressed={selected}
                  className={`h-9 rounded-full border px-4 text-sm font-semibold transition-colors ${
                    selected
                      ? 'border-primary bg-primary text-white'
                      : 'border-outline-variant/50 bg-surface text-on-surface-variant'
                  }`}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>
        {isLoading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            저장한 장소를 불러오는 중이에요...
          </p>
        ) : places.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="size-6" />}
            title={selectedType ? '이 카테고리에 저장한 장소가 없어요' : '아직 저장한 장소가 없어요'}
          />
        ) : (
          <SavedPlaceGrid places={places} />
        )}
      </main>
    </div>
  )
}
