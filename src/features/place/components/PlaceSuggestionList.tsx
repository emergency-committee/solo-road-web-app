import { Coffee, Utensils } from 'lucide-react'
import { formatDistanceMeters } from '@/shared/lib/format'
import type { ApiPlaceSummary } from '../types/place.types'

interface PlaceSuggestionListProps {
  suggestions: ApiPlaceSummary[]
  onSelect: (place: ApiPlaceSummary) => void
}

/** 검색창 아래에 뜨는 자동완성 목록. 결과가 없으면 아무것도 렌더링하지 않는다. */
export function PlaceSuggestionList({ suggestions, onSelect }: PlaceSuggestionListProps) {
  if (suggestions.length === 0) return null

  return (
    <ul className="border-outline-variant bg-surface-container-lowest absolute inset-x-0 top-full z-40 mt-2 max-h-72 overflow-y-auto rounded-xl border shadow-lg">
      {suggestions.map((place) => (
        <li key={place.placeId}>
          <button
            type="button"
            // input의 blur가 클릭보다 먼저 발생해 목록이 닫혀버리는 걸 막는다.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(place)}
            className="hover:bg-surface-container gap-sm px-md py-sm flex w-full items-center text-left"
          >
            {place.type.toUpperCase() === 'CAFE' ? (
              <Coffee className="text-outline size-4 shrink-0" />
            ) : (
              <Utensils className="text-outline size-4 shrink-0" />
            )}
            <span className="font-body-md text-body-md text-on-surface flex-1 truncate">
              {place.name}
            </span>
            {place.distanceM != null && (
              <span className="font-label-md text-label-md text-outline shrink-0">
                {formatDistanceMeters(place.distanceM)}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}
