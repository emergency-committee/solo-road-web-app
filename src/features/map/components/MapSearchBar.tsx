import { MapPin, Search } from 'lucide-react'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { MAP_FILTERS } from '../types/map.types'

interface MapSearchBarProps {
  filterValue: string[]
  onFilterChange: (value: string[]) => void
}

export function MapSearchBar({ filterValue, onFilterChange }: MapSearchBarProps) {
  return (
    <header className="px-margin-mobile pt-sm pb-base fixed inset-x-0 top-0 z-30">
      <div className="border-outline-variant bg-surface-container-lowest px-md py-sm flex items-center rounded-xl border shadow-sm">
        <Search className="mr-sm text-primary size-5" />
        <input
          className="text-body-md placeholder:text-outline-variant flex-1 border-none bg-transparent p-0 focus:ring-0"
          placeholder="어디로 떠나볼까요?"
          type="text"
        />
        <div className="bg-outline-variant mx-sm h-6 w-px" />
        <MapPin className="text-outline size-5" />
      </div>
      <FilterChipGroup
        options={MAP_FILTERS}
        value={filterValue}
        onChange={onFilterChange}
        className="pb-base mt-sm"
      />
    </header>
  )
}
