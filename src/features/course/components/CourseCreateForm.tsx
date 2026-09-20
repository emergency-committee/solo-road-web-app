import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Building2,
  CalendarDays,
  Check,
  GripVertical,
  MapPin,
  MapPinned,
  Moon,
  PencilLine,
  Plus,
  Search,
  Sparkles,
  Trees,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { toIsoDateString } from '@/shared/lib/format'
import { loadKakaoMapsSdk } from '@/features/map/lib/load-kakao-maps'
import { CourseDateRangeCalendar, type DateRange } from './CourseDateRangeCalendar'
import { calculateTripDays, formatTripLength } from '../lib/course-schedule'

export interface CourseCreateFormData {
  creationMode: 'ai' | 'manual'
  title?: string
  region: string
  startDate: string
  endDate: string
  preferredMood: string
  safetyPriority: boolean
  stops?: ManualCourseStopInput[]
  startPointName?: string
  startLatitude?: number
  startLongitude?: number
}

export interface ManualCourseStopInput {
  id: string
  kakaoPlaceId: string
  name: string
  type: string
  address: string
  latitude: number
  longitude: number
  dayNumber: number
}

const QUICK_REGIONS = ['서울', '부산', '제주']

const VIBE_OPTIONS = [
  { value: 'quiet', label: '조용한', icon: Moon },
  { value: 'vibrant', label: '활기찬', icon: Zap },
  { value: 'nature', label: '자연과 함께', icon: Trees },
  { value: 'urban', label: '도심 속', icon: Building2 },
]

interface ManualCourseStop {
  id: string
  kakaoPlaceId: string
  name: string
  type: string
  address: string
  latitude: number
  longitude: number
  dayNumber: number
}

interface ManualPlacePreview {
  name: string
  address: string
  latitude: number
  longitude: number
}

function categoryFromKakao(place: kakao.maps.services.PlacesSearchResult) {
  if (place.category_group_code === 'FD6') return 'RESTAURANT'
  if (place.category_group_code === 'CE7') return 'CAFE'
  if (place.category_group_code === 'AD5') return 'STAY'
  if (place.category_group_code === 'CT1') return 'CULTURE'
  if (place.category_group_code === 'AT4') return 'ATTRACTION'
  if (place.category_name.includes('공원') || place.category_name.includes('산책')) return 'NATURE'
  if (place.category_name.includes('전시') || place.category_name.includes('박물관'))
    return 'CULTURE'
  return 'ATTRACTION'
}

interface CourseCreateFormProps {
  onSubmit: (data: CourseCreateFormData) => void
  submitting?: boolean
}

export function CourseCreateForm({ onSubmit, submitting = false }: CourseCreateFormProps) {
  const [creationMode, setCreationMode] = useState<'ai' | 'manual'>('ai')
  const [title, setTitle] = useState('')
  const [region, setRegion] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })
  const [vibe, setVibe] = useState<string[]>(['nature'])
  const [manualInput, setManualInput] = useState('')
  const [manualSearchError, setManualSearchError] = useState('')
  const [manualSearchResults, setManualSearchResults] = useState<
    kakao.maps.services.PlacesSearchResult[]
  >([])
  const [manualSearching, setManualSearching] = useState(false)
  const [manualStops, setManualStops] = useState<ManualCourseStop[]>([])
  const [selectedManualDay, setSelectedManualDay] = useState(1)
  const [previewPlace, setPreviewPlace] = useState<ManualPlacePreview | null>(null)
  const manualDragSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )
  const [startPointQuery, setStartPointQuery] = useState('')
  const [startPointResults, setStartPointResults] = useState<
    kakao.maps.services.PlacesSearchResult[]
  >([])
  const [startPointSearching, setStartPointSearching] = useState(false)
  const [startPointError, setStartPointError] = useState('')
  const [startPoint, setStartPoint] = useState<{
    name: string
    latitude: number
    longitude: number
  } | null>(null)

  const isValid =
    region.trim().length > 0 &&
    dateRange.start !== null &&
    dateRange.end !== null &&
    (creationMode === 'ai' ? startPoint !== null : title.trim().length > 0 && manualStops.length > 0)
  const selectedStartDate = dateRange.start ? toIsoDateString(dateRange.start) : undefined
  const selectedEndDate = dateRange.end ? toIsoDateString(dateRange.end) : undefined
  const selectedTripDays = calculateTripDays(selectedStartDate, selectedEndDate)
  const manualTripDays = selectedTripDays ?? 1
  const selectedKakaoPlaceIds = new Set(manualStops.map((stop) => stop.kakaoPlaceId))

  useEffect(() => {
    if (selectedManualDay > manualTripDays) {
      setSelectedManualDay(manualTripDays)
    }
  }, [manualTripDays, selectedManualDay])

  function changeRegion(nextRegion: string) {
    setRegion(nextRegion)
  }

  async function searchKakaoPlaces() {
    const query = manualInput.trim()
    if (!query) return
    setManualSearching(true)
    setManualSearchError('')

    try {
      const kakaoSdk = await loadKakaoMapsSdk()
      const places = new kakaoSdk.maps.services.Places()
      places.keywordSearch(
        query,
        (result, status) => {
          setManualSearching(false)
          if (status === kakaoSdk.maps.services.Status.OK) {
            setManualSearchResults(result.slice(0, 8))
            return
          }
          setManualSearchResults([])
          setManualSearchError(
            status === kakaoSdk.maps.services.Status.ZERO_RESULT
              ? '검색 결과가 없어요. 장소명을 조금 더 정확히 입력해 주세요.'
              : '장소 검색을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
          )
        },
        { size: 8 },
      )
    } catch {
      setManualSearching(false)
      setManualSearchResults([])
      setManualSearchError('장소 검색을 사용할 수 없어요. 잠시 후 다시 시도해 주세요.')
    }
  }

  async function searchStartPointPlaces() {
    const query = startPointQuery.trim()
    if (!query) return
    setStartPointSearching(true)
    setStartPointError('')

    try {
      const kakaoSdk = await loadKakaoMapsSdk()
      const places = new kakaoSdk.maps.services.Places()
      places.keywordSearch(
        query,
        (result, status) => {
          setStartPointSearching(false)
          if (status === kakaoSdk.maps.services.Status.OK) {
            setStartPointResults(result.slice(0, 8))
            return
          }
          setStartPointResults([])
          setStartPointError(
            status === kakaoSdk.maps.services.Status.ZERO_RESULT
              ? '검색 결과가 없어요. 장소명을 조금 더 정확히 입력해 주세요.'
              : '장소 검색을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
          )
        },
        { size: 8 },
      )
    } catch {
      setStartPointSearching(false)
      setStartPointResults([])
      setStartPointError('장소 검색을 사용할 수 없어요. 잠시 후 다시 시도해 주세요.')
    }
  }

  function selectStartPoint(place: kakao.maps.services.PlacesSearchResult) {
    setStartPoint({
      name: place.place_name,
      latitude: Number(place.y),
      longitude: Number(place.x),
    })
    setStartPointResults([])
    setStartPointQuery('')
  }

  function handleManualStopDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return

    setManualStops((currentStops) => {
      const fromIndex = currentStops.findIndex((stop) => stop.id === active.id)
      const toIndex = currentStops.findIndex((stop) => stop.id === over.id)
      if (fromIndex < 0 || toIndex < 0) return currentStops

      const nextStops = [...currentStops]
      const [movedStop] = nextStops.splice(fromIndex, 1)
      if (!movedStop) return currentStops
      const targetStop = currentStops[toIndex]
      nextStops.splice(toIndex, 0, {
        ...movedStop,
        dayNumber: targetStop?.dayNumber ?? movedStop.dayNumber,
      })
      return nextStops
    })
  }

  function changeManualStopDay(stopId: string, dayNumber: number) {
    setManualStops((currentStops) =>
      currentStops.map((stop) => (stop.id === stopId ? { ...stop, dayNumber } : stop)),
    )
  }

  function previewKakaoPlace(place: kakao.maps.services.PlacesSearchResult) {
    setPreviewPlace({
      name: place.place_name,
      address: place.road_address_name || place.address_name,
      latitude: Number(place.y),
      longitude: Number(place.x),
    })
  }

  return (
    <form
      className="space-y-xl"
      onSubmit={(e) => {
        e.preventDefault()
        if (!isValid || dateRange.start === null || dateRange.end === null) return

        onSubmit({
          creationMode,
          ...(creationMode === 'manual' && { title: title.trim() }),
          region,
          startDate: toIsoDateString(dateRange.start),
          endDate: toIsoDateString(dateRange.end),
          preferredMood: creationMode === 'ai' ? (vibe[0] ?? 'nature') : '',
          safetyPriority: false,
          ...(creationMode === 'ai' &&
            startPoint && {
              startPointName: startPoint.name,
              startLatitude: startPoint.latitude,
              startLongitude: startPoint.longitude,
            }),
          ...(creationMode === 'manual' && {
            stops: manualStops
              .map((stop, originalIndex) => ({ stop, originalIndex }))
              .sort(
                (a, b) => a.stop.dayNumber - b.stop.dayNumber || a.originalIndex - b.originalIndex,
              )
              .map(({ stop }) => ({
                id: stop.id,
                kakaoPlaceId: stop.kakaoPlaceId,
                name: stop.name,
                type: stop.type,
                address: stop.address,
                latitude: stop.latitude,
                longitude: stop.longitude,
                dayNumber: stop.dayNumber,
              })),
          }),
        })
      }}
    >
      <section className="space-y-md">
        <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
          생성 방식
        </label>
        <div className="bg-surface-container grid grid-cols-2 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setCreationMode('ai')}
            className={`flex min-h-14 items-center justify-center gap-2 rounded-lg text-sm font-bold transition-colors ${
              creationMode === 'ai'
                ? 'text-primary bg-white shadow-sm'
                : 'text-on-surface-variant hover:bg-white/60'
            }`}
          >
            <WandSparkles className="size-4" />
            AI 추천
          </button>
          <button
            type="button"
            onClick={() => setCreationMode('manual')}
            className={`flex min-h-14 items-center justify-center gap-2 rounded-lg text-sm font-bold transition-colors ${
              creationMode === 'manual'
                ? 'text-primary bg-white shadow-sm'
                : 'text-on-surface-variant hover:bg-white/60'
            }`}
          >
            <PencilLine className="size-4" />
            직접 만들기
          </button>
        </div>
        <p className="font-label-md text-label-md text-on-surface-variant">
          {creationMode === 'ai'
            ? '선호하는 분위기를 바탕으로 코스를 추천받아요.'
            : '원하는 장소를 찾아 나만의 일정을 직접 구성해요.'}
        </p>
      </section>

      {creationMode === 'manual' && (
        <section className="space-y-md">
          <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
            01. 코스 이름
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 40))}
            className="border-outline-variant text-body-md focus:ring-primary bg-surface-container-low px-md py-md placeholder:text-outline/60 w-full rounded-xl border focus:border-transparent focus:ring-2 focus:outline-none"
            placeholder="예: 혼자 걷기 좋은 제주 1일차"
            type="text"
            maxLength={40}
          />
          <p className="font-label-md text-label-md text-on-surface-variant text-right">
            {title.trim().length}/40
          </p>
        </section>
      )}

      <section className="space-y-md">
        <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
          {creationMode === 'manual' ? '02' : '01'}. 여행 지역
        </label>
        <div className="relative">
          <Search className="left-md text-outline absolute top-1/2 size-5 -translate-y-1/2" />
          <input
            value={region}
            onChange={(e) => changeRegion(e.target.value)}
            className="border-outline-variant text-body-md focus:ring-primary bg-surface-container-low py-md pr-md placeholder:text-outline/60 w-full rounded-xl border pl-11 focus:border-transparent focus:ring-2 focus:outline-none"
            placeholder="어디로 떠나시나요?"
            type="text"
          />
        </div>
        <div className="no-scrollbar gap-xs py-xs flex overflow-x-auto">
          {QUICK_REGIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => changeRegion(option)}
              className={`text-body-sm hover:border-primary px-md py-xs shrink-0 rounded-full border font-medium transition-colors ${region === option ? 'border-primary bg-primary text-white' : 'border-outline-variant bg-white'}`}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="font-label-md text-label-md text-on-surface-variant">
          다른 지역은 입력창에 지역명을 직접 적어주세요.
        </p>
      </section>

      <section className="space-y-md">
        <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
          {creationMode === 'manual' ? '03' : '02'}. 여행 기간
        </label>
        <CourseDateRangeCalendar range={dateRange} onRangeChange={setDateRange} />
        {dateRange.start && dateRange.end && (
          <div className="bg-primary/5 text-primary flex items-center justify-between rounded-lg px-4 py-3">
            <span className="text-sm font-semibold">선택한 여행 기간</span>
            <strong>
              {formatTripLength(selectedStartDate, selectedEndDate, selectedTripDays)}
            </strong>
          </div>
        )}
      </section>

      {creationMode === 'ai' && (
        <section className="space-y-md">
          <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
            03. 출발지
          </label>
          <p className="font-label-md text-label-md text-on-surface-variant">
            코스가 시작할 장소를 검색해서 선택해주세요.
          </p>
          {startPoint ? (
            <div className="border-primary/20 bg-primary/5 px-md py-sm flex items-center justify-between rounded-xl border">
              <div className="gap-sm flex min-w-0 items-center">
                <MapPin className="text-primary size-4 shrink-0" />
                <span className="truncate text-sm font-bold">{startPoint.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setStartPoint(null)}
                aria-label="출발지 다시 선택"
                className="text-on-surface-variant hover:bg-surface-container grid size-8 shrink-0 place-items-center rounded-full"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="gap-sm flex">
                <div className="relative min-w-0 flex-1">
                  <Search className="text-outline absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <input
                    type="search"
                    value={startPointQuery}
                    onChange={(event) => setStartPointQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        void searchStartPointPlaces()
                      }
                    }}
                    placeholder="출발할 장소 검색 (예: 서울역)"
                    className="border-outline-variant focus:border-primary h-11 w-full rounded-xl border bg-white pr-3 pl-10 outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void searchStartPointPlaces()}
                  disabled={!startPointQuery.trim() || startPointSearching}
                  className="bg-primary text-on-primary h-11 shrink-0 rounded-xl px-4 font-semibold disabled:opacity-50"
                >
                  {startPointSearching ? '검색 중' : '검색'}
                </button>
              </div>
              {startPointSearching ? (
                <p className="text-body-sm text-on-surface-variant py-sm text-center">
                  장소를 찾고 있어요...
                </p>
              ) : startPointError ? (
                <p className="text-body-sm text-error py-sm text-center">{startPointError}</p>
              ) : startPointResults.length > 0 ? (
                <ul className="border-outline-variant/30 bg-surface divide-outline-variant/30 max-h-60 divide-y overflow-y-auto rounded-xl border shadow-sm">
                  {startPointResults.map((place) => (
                    <li key={place.id}>
                      <button
                        type="button"
                        onClick={() => selectStartPoint(place)}
                        className="hover:bg-surface-container flex w-full items-center gap-3 px-3 py-3 text-left"
                      >
                        <div className="bg-primary/8 text-primary grid size-10 shrink-0 place-items-center rounded-lg">
                          <MapPin className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{place.place_name}</p>
                          <p className="text-body-sm text-on-surface-variant truncate">
                            {place.road_address_name || place.address_name}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </section>
      )}
      {creationMode === 'manual' && (
        <section className="space-y-md">
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
              04. 날짜별 장소 담기
            </label>
            <p className="text-on-surface-variant mt-1 text-xs">
              날짜를 고른 다음 장소를 검색해 담아주세요.
            </p>
          </div>

          <div className="bg-surface-container-low border-outline-variant/40 rounded-xl border p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-on-surface-variant mb-2 flex items-center gap-1.5 text-xs font-semibold">
                <CalendarDays className="size-4" /> 장소를 담을 날짜
              </p>
              <span className="bg-primary/10 text-primary shrink-0 rounded-full px-2.5 py-1 text-xs font-bold">
                지금 {selectedManualDay}일차에 담는 중
              </span>
            </div>
            {manualTripDays > 1 ? (
              <div className="no-scrollbar flex gap-1 overflow-x-auto">
                {Array.from({ length: manualTripDays }, (_, index) => index + 1).map(
                  (dayNumber) => (
                    <button
                      key={dayNumber}
                      type="button"
                      onClick={() => setSelectedManualDay(dayNumber)}
                      className={`h-9 shrink-0 rounded-lg px-3 text-xs font-bold ${
                        selectedManualDay === dayNumber
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {dayNumber}일차
                    </button>
                  ),
                )}
              </div>
            ) : (
              <p className="text-on-surface-variant text-xs">
                당일 코스라 선택한 장소는 1일차에 담겨요.
              </p>
            )}
          </div>

          <div className="gap-sm flex">
            <div className="relative min-w-0 flex-1">
              <Search className="text-outline absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                type="search"
                value={manualInput}
                onChange={(event) => setManualInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    void searchKakaoPlaces()
                  }
                }}
                placeholder="장소 이름 검색"
                className="border-outline-variant focus:border-primary h-11 w-full rounded-xl border bg-white pr-3 pl-10 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => void searchKakaoPlaces()}
              disabled={!manualInput.trim() || manualSearching}
              className="bg-primary text-on-primary h-11 shrink-0 rounded-xl px-4 font-semibold disabled:opacity-50"
            >
              {manualSearching ? '검색 중' : '검색'}
            </button>
          </div>

          <div className="border-outline-variant/30 bg-surface rounded-xl border shadow-sm">
            <div className="max-h-72 overflow-y-auto px-3 py-2">
              {manualSearching ? (
                <p className="text-body-sm text-on-surface-variant py-lg text-center">
                  장소를 찾고 있어요...
                </p>
              ) : manualSearchError ? (
                <p className="text-body-sm text-error py-lg text-center">{manualSearchError}</p>
              ) : manualSearchResults.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant py-lg text-center">
                  장소명을 검색하면 검색 결과가 여기에 표시돼요.
                </p>
              ) : (
                <ul className="divide-outline-variant/30 divide-y">
                  {manualSearchResults.map((place) => {
                    const added = selectedKakaoPlaceIds.has(place.id)
                    return (
                      <li key={place.id} className="gap-sm flex items-center py-3">
                        <div className="bg-primary/8 text-primary grid size-12 shrink-0 place-items-center rounded-lg">
                          <MapPin className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{place.place_name}</p>
                          <p className="text-body-sm text-on-surface-variant truncate">
                            {place.road_address_name || place.address_name}
                          </p>
                          <p className="text-outline truncate text-[11px]">
                            {place.category_name || categoryFromKakao(place)}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => previewKakaoPlace(place)}
                            className="border-outline-variant/60 text-on-surface-variant flex h-8 items-center justify-center gap-1 rounded-lg border bg-white px-2 text-xs font-bold"
                          >
                            <MapPinned className="size-3.5" />
                            위치
                          </button>
                          <button
                            type="button"
                            disabled={added}
                            aria-label={`${place.place_name} ${added ? '추가됨' : '추가'}`}
                            onClick={() =>
                              setManualStops((prev) => [
                                ...prev,
                                toManualCourseStop(place, selectedManualDay),
                              ])
                            }
                            className="disabled:bg-surface-container disabled:text-on-surface-variant flex h-8 items-center justify-center gap-1 rounded-lg bg-[#f05a47] px-2 text-xs font-bold text-white"
                          >
                            {added ? (
                              <>
                                <Check className="size-3.5" />
                                담김
                              </>
                            ) : (
                              <>
                                <Plus className="size-3.5" />
                                {selectedManualDay}일차에 담기
                              </>
                            )}
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          {manualStops.length > 0 ? (
            <DndContext
              sensors={manualDragSensors}
              collisionDetection={closestCenter}
              onDragEnd={handleManualStopDragEnd}
            >
              <SortableContext
                items={manualStops.map((stop) => stop.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {Array.from({ length: manualTripDays }, (_, index) => index + 1).map(
                    (dayNumber) => {
                      const dayStops = manualStops.filter((stop) => stop.dayNumber === dayNumber)
                      if (dayStops.length === 0) return null
                      return (
                        <div
                          key={dayNumber}
                          className="border-outline-variant/30 bg-surface rounded-xl border p-3"
                        >
                          <p className="text-primary mb-2 text-xs font-bold">
                            {dayNumber}일차에 담은 장소
                          </p>
                          <ul className="space-y-2">
                            {dayStops.map((stop, index) => (
                              <SortableManualStop
                                key={stop.id}
                                stop={stop}
                                index={index}
                                tripDays={manualTripDays}
                                onDayChange={(nextDayNumber) =>
                                  changeManualStopDay(stop.id, nextDayNumber)
                                }
                                onPreview={() => setPreviewPlace(stop)}
                                onRemove={() =>
                                  setManualStops((prev) =>
                                    prev.filter((item) => item.id !== stop.id),
                                  )
                                }
                              />
                            ))}
                          </ul>
                        </div>
                      )
                    },
                  )}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="text-error text-xs">
              직접 만들기는 장소를 1개 이상 추가해야 저장할 수 있어요.
            </p>
          )}
        </section>
      )}

      {creationMode === 'ai' && (
        <section className="space-y-md">
          <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
            04. 선호하는 분위기
          </label>
          <FilterChipGroup
            options={VIBE_OPTIONS.map(({ value, label }) => ({ value, label }))}
            value={vibe}
            onChange={setVibe}
          />
        </section>
      )}

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="font-headline-lg-mobile text-headline-lg-mobile gap-xs bg-primary-container py-lg text-on-primary flex w-full items-center justify-center rounded-xl font-bold shadow-lg transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting
          ? creationMode === 'ai'
            ? 'AI가 코스를 만들고 있어요...'
            : '코스를 만들고 있어요...'
          : creationMode === 'ai'
            ? 'AI 코스 생성하기'
            : '직접 만들기 시작'}
        {creationMode === 'ai' ? (
          <Sparkles className="size-5" />
        ) : (
          <PencilLine className="size-5" />
        )}
      </button>
      {previewPlace && (
        <ManualPlaceMapPreview place={previewPlace} onClose={() => setPreviewPlace(null)} />
      )}
    </form>
  )
}

function SortableManualStop({
  stop,
  index,
  tripDays,
  onDayChange,
  onPreview,
  onRemove,
}: {
  stop: ManualCourseStop
  index: number
  tripDays: number
  onDayChange: (dayNumber: number) => void
  onPreview: () => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stop.id,
  })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-2 rounded-lg ${
        isDragging ? 'bg-surface-container-high relative z-20 shadow-md' : ''
      }`}
    >
      <button
        type="button"
        data-no-drag-scroll
        aria-label={`${stop.name} 순서 변경`}
        className="text-outline hover:bg-surface-container flex min-h-14 w-11 touch-none items-center justify-center rounded-lg active:cursor-grabbing active:bg-surface-container"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <span className="bg-primary/10 text-primary grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{stop.name}</p>
        <p className="text-on-surface-variant truncate text-xs">{stop.address}</p>
        {tripDays > 1 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {Array.from({ length: tripDays }, (_, index) => index + 1).map((dayNumber) => (
              <button
                key={dayNumber}
                type="button"
                onClick={() => onDayChange(dayNumber)}
                className={`h-7 rounded-full px-2.5 text-[11px] font-bold ${
                  stop.dayNumber === dayNumber
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {dayNumber}일차
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onPreview}
        aria-label={`${stop.name} 위치 확인`}
        className="text-on-surface-variant hover:bg-surface-container grid size-8 shrink-0 place-items-center rounded-full"
      >
        <MapPinned className="size-4" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${stop.name} 삭제`}
        className="text-outline hover:bg-surface-container grid size-8 place-items-center rounded-full"
      >
        <X className="size-4" />
      </button>
    </li>
  )
}

function ManualPlaceMapPreview({
  place,
  onClose,
}: {
  place: ManualPlacePreview
  onClose: () => void
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [mapError, setMapError] = useState('')

  useEffect(() => {
    let marker: kakao.maps.Marker | null = null
    let cancelled = false

    async function renderMap() {
      try {
        const kakaoSdk = await loadKakaoMapsSdk()
        if (cancelled || !mapContainerRef.current) return
        const center = new kakaoSdk.maps.LatLng(place.latitude, place.longitude)
        const map = new kakaoSdk.maps.Map(mapContainerRef.current, {
          center,
          level: 3,
        })
        marker = new kakaoSdk.maps.Marker({ map, position: center })
        window.setTimeout(() => {
          map.relayout()
          map.setCenter(center)
        }, 0)
      } catch {
        if (!cancelled) {
          setMapError('지도를 불러오지 못했어요.')
        }
      }
    }

    void renderMap()

    return () => {
      cancelled = true
      marker?.setMap(null)
    }
  }, [place.latitude, place.longitude])

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/50 p-0 backdrop-blur-xs sm:items-center sm:p-4">
      <div
        className="bg-surface border-outline-variant/30 flex max-h-[90dvh] flex-col overflow-hidden rounded-t-[28px] border shadow-2xl sm:rounded-[24px]"
        style={{ width: 'min(100vw, 430px)' }}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold">{place.name}</p>
            <p className="text-on-surface-variant mt-1 truncate text-sm">{place.address}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="위치 지도 닫기"
            className="text-on-surface-variant hover:bg-surface-container grid size-9 shrink-0 place-items-center rounded-full"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="bg-surface-container-low mx-5 mb-5 min-h-72 overflow-hidden rounded-xl">
          {mapError ? (
            <div className="text-on-surface-variant grid h-72 place-items-center text-sm">
              {mapError}
            </div>
          ) : (
            <div ref={mapContainerRef} style={{ width: '100%', height: 288 }} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function toManualCourseStop(
  place: kakao.maps.services.PlacesSearchResult,
  dayNumber: number,
): ManualCourseStop {
  const address = place.road_address_name || place.address_name
  return {
    id: `${place.id}-${crypto.randomUUID()}`,
    kakaoPlaceId: place.id,
    name: place.place_name,
    type: categoryFromKakao(place),
    address,
    latitude: Number(place.y),
    longitude: Number(place.x),
    dayNumber,
  }
}
