export type SavedFilterCategory = 'all' | 'urban' | 'nature' | 'night-safety'

export const SAVED_COURSE_FILTERS: { value: SavedFilterCategory; label: string }[] = [
  { value: 'all', label: 'All Courses' },
  { value: 'urban', label: 'Urban Walks' },
  { value: 'nature', label: 'Nature Paths' },
  { value: 'night-safety', label: 'Night Safety' },
]

export const SAVED_PLACE_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'cafe', label: 'Cafes' },
  { value: 'culture', label: 'Culture' },
  { value: 'safety-hub', label: 'Safety Hubs' },
]
