import { Map, MapPin, Search, Utensils } from 'lucide-react'
import { FilterChipGroup } from '@/shared/components/FilterChip'
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
  keyword?: string
  onKeywordChange?: (keyword: string) => void
  /** 외부에서 필터 목록을 주입할 수 있도록. 없으면 mapMode에서 자동 결정. */
  filters?: { value: string; label: string }[]
}

export function MapSearchBar({
  mapMode,
  onMapModeChange,
  filterValue,
  onFilterChange,
  keyword = '',
  onKeywordChange,
  filters,
}: MapSearchBarProps) {
  const currentFilters =
    filters ?? (mapMode === 'solo_dining' ? SOLO_DINING_MAP_FILTERS : ALL_MAP_FILTERS)

  const isSoloDining = mapMode === 'solo_dining'

  return (
    <header className="px-margin-mobile pt-sm pb-base fixed inset-x-0 top-0 z-30 flex flex-col gap-2">
      {/* 모드 전환 세그먼트 탭 */}
      <div className="bg-surface/90 backdrop-blur-md p-1 border-outline-variant/60 flex items-center rounded-2xl border shadow-md">
        <button
          type="button"
          onClick={() => onMapModeChange('all')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-bold transition-all rounded-xl',
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
            'flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-bold transition-all rounded-xl',
            isSoloDining
              ? 'bg-[#ff6b4a] text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface',
          )}
        >
          <Utensils className="size-4" />
          <span>혼밥 지도</span>
        </button>
      </div>

      {/* 검색창 */}
      <div className="border-outline-variant bg-surface-container-lowest px-md py-sm flex items-center rounded-xl border shadow-sm">
        <Search className="mr-sm text-primary size-5" />
        <input
          value={keyword}
          onChange={(e) => onKeywordChange?.(e.target.value)}
          className="text-body-md placeholder:text-outline-variant flex-1 border-none bg-transparent p-0 focus:ring-0"
          placeholder={
            isSoloDining
              ? '혼밥 맛집, 1인석 식당, 카페 검색'
              : '맛집, 카페, 명소, 숙소 검색'
          }
          type="text"
        />
        <div className="bg-outline-variant mx-sm h-6 w-px" />
        <MapPin className="text-outline size-5" />
      </div>

      {/* 카테고리 필터칩 */}
      <FilterChipGroup
        options={currentFilters}
        value={filterValue}
        onChange={onFilterChange}
        className="pb-base"
      />
    </header>
  )
}
