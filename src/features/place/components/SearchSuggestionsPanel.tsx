import { Clock, Sparkles, X } from 'lucide-react'
import type { ApiSoloDiningItem } from '../types/place.types'

interface SearchSuggestionsPanelProps {
  recentSearches: string[]
  onSelectRecentSearch: (term: string) => void
  onRemoveRecentSearch: (term: string) => void
  recommendedPlaces: ApiSoloDiningItem[]
  onSelectPlace: (placeId: number) => void
}

/**
 * 검색창을 포커스했지만 아직 아무것도 입력하지 않았을 때 보여주는 패널.
 * 최근 검색어(로컬 저장)와 메인 추천 장소를 재사용해 "무엇을 검색할지" 힌트를 준다.
 * `PlaceSuggestionList`(키워드 입력 후 자동완성)와는 다른 시점에 쓰인다.
 */
export function SearchSuggestionsPanel({
  recentSearches,
  onSelectRecentSearch,
  onRemoveRecentSearch,
  recommendedPlaces,
  onSelectPlace,
}: SearchSuggestionsPanelProps) {
  if (recentSearches.length === 0 && recommendedPlaces.length === 0) return null

  return (
    <div className="border-outline-variant bg-surface-container-lowest px-md py-sm absolute inset-x-0 top-full z-40 mt-2 max-h-96 overflow-y-auto rounded-xl border shadow-lg">
      {recentSearches.length > 0 && (
        <div className="pb-sm">
          <p className="text-label-md text-outline mb-xs font-bold">최근 검색어</p>
          <div className="gap-xs flex flex-wrap">
            {recentSearches.map((term) => (
              <span
                key={term}
                className="bg-surface-container gap-xs pl-sm text-body-sm text-on-surface flex items-center rounded-full py-1 pr-1"
              >
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSelectRecentSearch(term)}
                  className="flex items-center gap-1"
                >
                  <Clock className="text-outline size-3" />
                  {term}
                </button>
                <button
                  type="button"
                  aria-label={`${term} 최근 검색어 삭제`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onRemoveRecentSearch(term)}
                  className="text-outline hover:text-on-surface flex size-5 items-center justify-center rounded-full"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {recommendedPlaces.length > 0 && (
        <div>
          <p className="text-label-md text-outline mb-xs gap-1 flex items-center font-bold">
            <Sparkles className="size-3.5" />
            추천 장소
          </p>
          <ul>
            {recommendedPlaces.map((place) => (
              <li key={place.placeId}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSelectPlace(place.placeId)}
                  className="hover:bg-surface-container gap-sm py-sm flex w-full items-center text-left"
                >
                  {place.thumbnailUrl ? (
                    <img
                      src={place.thumbnailUrl}
                      alt={place.name}
                      className="size-9 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="bg-surface-container-high size-9 shrink-0 rounded-lg" />
                  )}
                  <span className="font-body-md text-body-md text-on-surface flex-1 truncate">
                    {place.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
