import { MapPin, Search, X } from 'lucide-react'
import { useState } from 'react'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { PlaceSuggestionList, usePlaceAutocomplete } from '@/features/place'
import type { ApiPlaceSummary } from '@/features/place'
import { MAP_FILTERS } from '../types/map.types'

interface MapSearchBarProps {
  filterValue: string[]
  onFilterChange: (value: string[]) => void
  keyword: string
  onKeywordChange: (value: string) => void
  onSelectPlace: (place: ApiPlaceSummary) => void
}

export function MapSearchBar({
  filterValue,
  onFilterChange,
  keyword,
  onKeywordChange,
  onSelectPlace,
}: MapSearchBarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { suggestions } = usePlaceAutocomplete(keyword)

  return (
    <header className="px-margin-mobile pt-sm pb-base fixed inset-x-0 top-0 z-30">
      <div className="relative">
        <div className="border-outline-variant bg-surface-container-lowest px-md py-sm flex items-center rounded-xl border shadow-sm">
          <Search className="mr-sm text-primary size-5" />
          <input
            className="text-body-md placeholder:text-outline-variant flex-1 border-none bg-transparent p-0 focus:ring-0"
            placeholder="어디로 떠나볼까요?"
            type="text"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {keyword && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => onKeywordChange('')}
              className="text-outline mr-sm"
            >
              <X className="size-4" />
            </button>
          )}
          <div className="bg-outline-variant mx-sm h-6 w-px" />
          <MapPin className="text-outline size-5" />
        </div>
        {isSearchFocused && (
          <PlaceSuggestionList
            suggestions={suggestions}
            onSelect={(place) => {
              setIsSearchFocused(false)
              onSelectPlace(place)
            }}
          />
        )}
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
