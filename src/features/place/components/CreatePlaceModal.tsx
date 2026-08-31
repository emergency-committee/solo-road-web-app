import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Compass,
  MapPin,
  Plus,
  Sparkles,
  Utensils,
  X,
  Star,
  Check,
  Search,
} from 'lucide-react'
import { useCreatePlace } from '../hooks/use-create-place'
import { useReviewTags } from '../hooks/use-create-place-review'
import { loadKakaoMapsSdk } from '@/features/map/lib/load-kakao-maps'
import { cn } from '@/shared/lib/utils'

interface CreatePlaceModalProps {
  open: boolean
  onClose: () => void
  initialMode?: 'travel' | 'dining'
}

const CATEGORIES = [
  { value: 'ATTRACTION', label: '혼행 명소', mode: 'travel', icon: Compass },
  { value: 'NATURE', label: '자연/산책', mode: 'travel', icon: Compass },
  { value: 'CULTURE', label: '전시/문화', mode: 'travel', icon: Compass },
  { value: 'RESTAURANT', label: '혼밥 식당', mode: 'dining', icon: Utensils },
  { value: 'CAFE', label: '카페/디저트', mode: 'dining', icon: Sparkles },
  { value: 'STAY', label: '숙소', mode: 'travel', icon: MapPin },
]

const DINING_CATEGORIES = new Set(['RESTAURANT', 'CAFE'])

function defaultPlaceSummary(type: string) {
  switch (type) {
    case 'RESTAURANT':
      return '혼자 식사하기 좋은 사용자 추천 식당'
    case 'CAFE':
      return '혼자 머물기 좋은 사용자 추천 카페'
    case 'NATURE':
      return '혼자 걷기 좋은 사용자 추천 산책 장소'
    case 'CULTURE':
      return '혼자 둘러보기 좋은 사용자 추천 문화 공간'
    case 'STAY':
      return '혼자 쉬기 좋은 사용자 추천 숙소'
    default:
      return '사용자가 추천한 혼행 장소'
  }
}

function categoryFromKakao(place: kakao.maps.services.PlacesSearchResult) {
  if (place.category_group_code === 'FD6') return 'RESTAURANT'
  if (place.category_group_code === 'CE7') return 'CAFE'
  if (place.category_group_code === 'AD5') return 'STAY'
  if (place.category_group_code === 'CT1') return 'CULTURE'
  if (place.category_group_code === 'AT4') return 'ATTRACTION'
  if (place.category_name.includes('공원') || place.category_name.includes('산책')) return 'NATURE'
  if (place.category_name.includes('전시') || place.category_name.includes('박물관')) return 'CULTURE'
  return 'ATTRACTION'
}

export function CreatePlaceModal({ open, onClose, initialMode = 'travel' }: CreatePlaceModalProps) {
  const [recommendType, setRecommendType] = useState<'travel' | 'dining'>(initialMode)
  const [name, setName] = useState('')
  const [category, setCategory] = useState(initialMode === 'travel' ? 'ATTRACTION' : 'RESTAURANT')
  const [address, setAddress] = useState('서울특별시 강남구')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<kakao.maps.services.PlacesSearchResult[]>([])
  const [searchError, setSearchError] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [firstReviewContent, setFirstReviewContent] = useState('')
  const [hasSoloSeat, setHasSoloSeat] = useState(true)
  const [hasSoloMenu, setHasSoloMenu] = useState(true)
  const [rating, setRating] = useState(5)
  const [soloRating, setSoloRating] = useState(5)
  const [tagIds, setTagIds] = useState<number[]>([])
  const [isSuccess, setIsSuccess] = useState(false)

  const createPlaceMutation = useCreatePlace()
  const isDining = DINING_CATEGORIES.has(category)
  const soloLabel = isDining ? '혼밥' : '혼행'
  const tagQuery = useReviewTags(open, isDining ? 'dining' : 'travel')

  useEffect(() => {
    if (!open) return
    setRecommendType(initialMode)
    setCategory(initialMode === 'travel' ? 'ATTRACTION' : 'RESTAURANT')
  }, [initialMode, open])

  if (!open) return null

  const filteredCategories = CATEGORIES.filter(
    (cat) => cat.mode === 'both' || cat.mode === recommendType,
  )

  const handleSearch = async () => {
    const query = keyword.trim()
    if (!query) return
    setIsSearching(true)
    setSearchError('')

    try {
      const kakaoSdk = await loadKakaoMapsSdk()
      const places = new kakaoSdk.maps.services.Places()
      places.keywordSearch(
        query,
        (result, status) => {
          setIsSearching(false)
          if (status === kakaoSdk.maps.services.Status.OK) {
            setSearchResults(result.slice(0, 5))
            return
          }
          setSearchResults([])
          setSearchError(
            status === kakaoSdk.maps.services.Status.ZERO_RESULT
              ? '검색 결과가 없어요. 장소명을 조금 더 정확히 입력해 주세요.'
              : '장소 검색을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
          )
        },
        { size: 5 },
      )
    } catch {
      setIsSearching(false)
      setSearchResults([])
      setSearchError('카카오 장소 검색을 사용할 수 없어요. JavaScript 키 설정을 확인해 주세요.')
    }
  }

  const handleSelectPlace = (place: kakao.maps.services.PlacesSearchResult) => {
    const nextCategory = categoryFromKakao(place)
    setName(place.place_name)
    setCategory(nextCategory)
    setRecommendType(DINING_CATEGORIES.has(nextCategory) ? 'dining' : 'travel')
    setAddress(place.road_address_name || place.address_name)
    setLatitude(Number(place.y))
    setLongitude(Number(place.x))
    setKeyword(place.place_name)
    setSearchResults([])
    setTagIds([])
    setSearchError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || latitude == null || longitude == null) {
      setSearchError('카카오 장소 검색 결과에서 등록할 장소를 선택해 주세요.')
      return
    }

    createPlaceMutation.mutate(
      {
        name: name.trim(),
        type: category,
        address: address.trim() || '서울특별시 강남구',
        latitude,
        longitude,
        summary: defaultPlaceSummary(category),
        firstReviewSoloRating: soloRating,
        firstReviewContent:
          firstReviewContent.trim() || `${soloLabel}하기 좋아서 추천해요.`,
        firstReviewTagIds: tagIds,
        rating,
        soloFriendlyBadge: true,
        ...(isDining ? { hasSoloSeat, hasSoloMenu } : {}),
      },
      {
        onSuccess: () => {
          setIsSuccess(true)
          setTimeout(() => {
            setIsSuccess(false)
            onClose()
            setName('')
            setKeyword('')
            setAddress('서울특별시 강남구')
            setLatitude(null)
            setLongitude(null)
            setFirstReviewContent('')
            setTagIds([])
            setRating(5)
            setSoloRating(5)
          }, 1200)
        },
      },
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-0 backdrop-blur-xs transition-opacity sm:items-center sm:p-4">
      <div className="bg-surface flex max-h-[90vh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[28px] border border-outline-variant/30 shadow-2xl animate-in slide-in-from-bottom duration-200 sm:rounded-[24px]">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Plus className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">새로운 장소 추천하기</h2>
              <p className="text-xs text-on-surface-variant">나만 알기 아까운 혼행·혼밥 스팟을 공유해보세요</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 폼 본문 */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="size-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="size-8" />
              </div>
              <h3 className="text-lg font-bold text-on-surface">장소 추천이 등록되었습니다!</h3>
              <p className="text-xs text-on-surface-variant">
                첫 후기는 바로 등록되고, 혼행점수는 반영까지 시간이 걸릴 수 있어요.
              </p>
            </div>
          ) : (
            <>
              {/* 추천 유형 선택 (혼행 vs 혼밥) */}
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-2">추천 유형</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRecommendType('travel')
                      setCategory('ATTRACTION')
                      setTagIds([])
                    }}
                    className={cn(
                      'py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all',
                      recommendType === 'travel'
                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                        : 'border-outline-variant/60 text-on-surface-variant hover:bg-surface-container',
                    )}
                  >
                    <Compass className="size-4" />
                    <span>혼행 장소 추천</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecommendType('dining')
                      setCategory('RESTAURANT')
                      setTagIds([])
                    }}
                    className={cn(
                      'py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all',
                      recommendType === 'dining'
                        ? 'border-[#ff6b4a] bg-[#ff6b4a]/10 text-[#ff6b4a] shadow-xs'
                        : 'border-outline-variant/60 text-on-surface-variant hover:bg-surface-container',
                    )}
                  >
                    <Utensils className="size-4" />
                    <span>혼밥 맛집 추천</span>
                  </button>
                </div>
              </div>

              {/* 카카오 장소 검색 */}
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1.5">
                  카카오에서 장소 찾기 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-outline" />
                    <input
                      type="search"
                      value={keyword}
                      onChange={(e) => {
                        setKeyword(e.target.value)
                        if (name) {
                          setName('')
                          setLatitude(null)
                          setLongitude(null)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          void handleSearch()
                        }
                      }}
                      placeholder="장소명을 검색해 주세요"
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2.5 pl-9 pr-3.5 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSearch()}
                    disabled={!keyword.trim() || isSearching}
                    className="rounded-xl bg-primary px-4 text-xs font-bold text-white transition-colors disabled:opacity-50"
                  >
                    {isSearching ? '검색 중' : '검색'}
                  </button>
                </div>
                {searchError && <p className="text-error mt-1 text-[11px]">{searchError}</p>}
                {searchResults.length > 0 && (
                  <div className="border-outline-variant/70 mt-2 overflow-hidden rounded-xl border bg-white">
                    {searchResults.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => handleSelectPlace(place)}
                        className="hover:bg-surface-container-low flex w-full flex-col items-start border-b border-outline-variant/40 px-3 py-2.5 text-left last:border-b-0"
                      >
                        <span className="text-on-surface text-sm font-bold">{place.place_name}</span>
                        <span className="text-on-surface-variant mt-0.5 line-clamp-1 text-xs">
                          {place.road_address_name || place.address_name}
                        </span>
                        {place.category_name && (
                          <span className="text-outline mt-0.5 line-clamp-1 text-[11px]">
                            {place.category_name}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {name && (
                  <div className="border-primary/20 bg-primary/6 mt-2 rounded-xl border px-3 py-2">
                    <p className="text-primary text-xs font-bold">선택한 장소</p>
                    <p className="text-on-surface mt-0.5 text-sm font-bold">{name}</p>
                    <p className="text-on-surface-variant mt-0.5 line-clamp-1 text-xs">{address}</p>
                  </div>
                )}
              </div>

              {/* 카테고리 */}
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1.5">카테고리</label>
                <div className="flex flex-wrap gap-1.5">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        setCategory(cat.value)
                        setTagIds([])
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                        category === cat.value
                          ? 'border-primary bg-primary text-white font-bold'
                          : 'border-outline-variant/60 text-on-surface-variant hover:bg-surface-container',
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 첫 후기 태그 */}
              <div>
                <p className="mb-1 text-xs font-bold text-on-surface-variant">
                  {soloLabel} 포인트
                </p>
                <p className="text-on-surface-variant mb-2 text-[11px]">
                  선택한 태그는 첫 후기의 근거로 같이 보여요.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(tagQuery.data?.tags ?? []).map((tag) => {
                    const selected = tagIds.includes(tag.reviewTagId)
                    return (
                      <button
                        key={tag.reviewTagId}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setTagIds((current) =>
                            selected
                              ? current.filter((id) => id !== tag.reviewTagId)
                              : [...current, tag.reviewTagId],
                          )
                        }
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                          selected
                            ? 'border-primary bg-primary text-white'
                            : 'border-outline-variant/60 text-on-surface-variant bg-white',
                        )}
                      >
                        {tag.tagName}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 첫 후기 */}
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1.5">첫 후기</label>
                <textarea
                  rows={2}
                  value={firstReviewContent}
                  onChange={(e) => setFirstReviewContent(e.target.value)}
                  placeholder="혼자 가봤을 때 어땠는지 짧게 남겨주세요."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:border-primary bg-surface-container-lowest resize-none"
                />
                <p className="text-on-surface-variant mt-1 text-[11px]">
                  장소를 추천한 사람의 첫 리뷰로 등록돼요.
                </p>
              </div>

              {isDining && (
                <div className="bg-surface-container-high flex items-center justify-around rounded-xl p-3 text-xs">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasSoloSeat}
                      onChange={(e) => setHasSoloSeat(e.target.checked)}
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span>혼자 앉기 편한 좌석</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasSoloMenu}
                      onChange={(e) => setHasSoloMenu(e.target.checked)}
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span>1인 주문이 편해요</span>
                  </label>
                </div>
              )}

              {/* 평점 선택 */}
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1.5">
                  전체적으로 어땠나요?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setRating(score)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          'size-6',
                          score <= rating ? 'fill-amber-400 text-amber-400' : 'text-outline-variant',
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-on-surface ml-1">{rating}.0점</span>
                </div>
                <p className="text-on-surface-variant mt-1 text-[11px]">
                  장소의 일반 평점으로 반영돼요.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1.5">
                  {isDining ? '혼자 식사하기는 어땠나요?' : '혼자 방문하기는 어땠나요?'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setSoloRating(score)}
                      className="p-1 text-secondary hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          'size-6',
                          score <= soloRating ? 'fill-secondary text-secondary' : 'text-outline-variant',
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-on-surface ml-1">{soloRating}.0점</span>
                </div>
                <p className="text-on-surface-variant mt-1 text-[11px]">
                  첫 후기에는 바로 남고, {soloLabel} 점수는 별도 산정 후 반영돼요.
                </p>
              </div>
            </>
          )}

          {/* 등록 버튼 */}
          {!isSuccess && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={!name.trim() || latitude == null || longitude == null || createPlaceMutation.isPending}
                className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {createPlaceMutation.isPending ? (
                  <span>장소 등록 중...</span>
                ) : (
                  <>
                    <Plus className="size-4" />
                    <span>추천 장소 등록하기</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>,
    document.body,
  )
}
