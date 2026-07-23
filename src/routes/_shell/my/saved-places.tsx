import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { mockSavedPlaces, SavedPlaceGrid, SAVED_PLACE_FILTERS } from '@/features/saved'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/my/saved-places')({
  component: SavedPlacesPage,
})

function SavedPlacesPage() {
  const [filter, setFilter] = useState<string[]>(['all'])

  return (
    <div className="bg-surface min-h-screen pb-24">
      <TopAppBar title="Saved Places" showBack />
      <main className="px-margin-mobile pt-lg">
        <FilterChipGroup
          options={SAVED_PLACE_FILTERS}
          value={filter}
          onChange={setFilter}
          className="mb-lg"
        />
        <SavedPlaceGrid places={mockSavedPlaces} />
      </main>
    </div>
  )
}
