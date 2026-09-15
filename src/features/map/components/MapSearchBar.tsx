import { useNavigate } from '@tanstack/react-router'
import { Map, MapPin, Search, Utensils, X } from 'lucide-react'
import { useState } from 'react'
import {
  PlaceSuggestionList,
  SearchSuggestionsPanel,
  usePlaceAutocomplete,
  usePlaceRecommendations,
} from '@/features/place'
import type { ApiPlaceSummary } from '@/features/place'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { useRecentSearches } from '@/shared/hooks/use-recent-searches'
import { cn } from '@/shared/lib/utils'
import {
  ALL_MAP_FILTERS,
  SOLO_DINING_MAP_FILTERS,
  type MapMode,
} from '../types/map.types'

interface MapSearchBarProps {
  mapMode: MapMode
  onMapModeChange: (mode: MapMode) => void
  filterValue: string[]
  onFilterChange: (value: string[]) => void
  keyword: string
  onKeywordChange: (value: string) => void
  onSelectPlace: (place: ApiPlaceSummary) => void
  filters?: { value: string; label: string }[]
}

export function MapSearchBar({
  mapMode,
  onMapModeChange,
  filterValue,
  onFilterChange,
  keyword,
  onKeywordChange,
  onSelectPlace,
  filters,
}: MapSearchBarProps) {
  const navigate = useNavigate()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { suggestions } = usePlaceAutocomplete(keyword)
  const { recentSearches, addRecentSearch, removeRecentSearch } = useRecentSearches()
  const { data: recommendationsData } = usePlaceRecommendations()
  const currentFilters =
    filters ?? (mapMode === 'solo_dining' ? SOLO_DINING_MAP_FILTERS : ALL_MAP_FILTERS)
  const isSoloDining = mapMode === 'solo_dining'

  return (
    <header className="px-margin-mobile pt-sm pb-base fixed inset-x-0 top-0 z-30 flex flex-col gap-2">
      <div className="bg-surface/90 border-outline-variant/60 flex items-center rounded-2xl border p-1 shadow-md backdrop-blur-md">
        <button
          type="button"
          onClick={() => onMapModeChange('all')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all',
            !isSoloDining
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface',
          )}
        >
          <Map className="size-4" />
          <span>전체 지도</span>
        </button>
        <button
          type="button"
          onClick={() => onMapModeChange('solo_dining')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all',
            isSoloDining
              ? 'bg-[#ff6b4a] text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface',
          )}
        >
          <Utensils className="size-4" />
          <span>혼밥 지도</span>
        </button>
      </div>

      <div className="relative">
        <div className="border-outline-variant bg-surface-container-lowest px-md py-sm flex items-center rounded-xl border shadow-sm">
          <Search className="mr-sm text-primary size-5" />
          <input
            className="text-body-md placeholder:text-outline-variant flex-1 border-none bg-transparent p-0 focus:ring-0"
            placeholder={
              isSoloDining
                ? '혼밥 맛집, 1인석 식당, 카페 검색'
                : '맛집, 카페, 명소, 숙소 검색'
            }
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
        {isSearchFocused && keyword.trim() === '' && (
          <SearchSuggestionsPanel
            recentSearches={recentSearches}
            onSelectRecentSearch={(term) => {
              addRecentSearch(term)
              setIsSearchFocused(false)
              onKeywordChange(term)
            }}
            onRemoveRecentSearch={removeRecentSearch}
            recommendedPlaces={(recommendationsData?.soloDining ?? []).slice(0, 5)}
            onSelectPlace={(placeId) => {
              setIsSearchFocused(false)
              void navigate({ to: '/place/$placeId', params: { placeId: placeId.toString() } })
            }}
          />
        )}
        {isSearchFocused && keyword.trim() !== '' && (
          <PlaceSuggestionList
            suggestions={suggestions}
            onSelect={(place) => {
              addRecentSearch(place.name)
              setIsSearchFocused(false)
              onSelectPlace(place)
            }}
          />
        )}
      </div>

      <FilterChipGroup
        options={currentFilters}
        value={filterValue}
        onChange={onFilterChange}
        className="pb-base"
      />
    </header>
  )
}
