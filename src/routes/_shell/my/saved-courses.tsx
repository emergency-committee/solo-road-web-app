import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { mockSavedCourses, SAVED_COURSE_FILTERS, SavedCourseGrid } from '@/features/saved'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/my/saved-courses')({
  component: SavedCoursesPage,
})

function SavedCoursesPage() {
  const [filter, setFilter] = useState<string[]>(['all'])

  return (
    <div className="bg-surface min-h-screen pb-24">
      <TopAppBar title="Saved Courses" showBack />
      <main className="px-margin-mobile pt-4">
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">
          Explore your curated collection of walking routes and solo-travel journeys.
        </p>
        <FilterChipGroup
          options={SAVED_COURSE_FILTERS}
          value={filter}
          onChange={setFilter}
          className="mb-lg"
        />
        <SavedCourseGrid courses={mockSavedCourses} />
      </main>
    </div>
  )
}
