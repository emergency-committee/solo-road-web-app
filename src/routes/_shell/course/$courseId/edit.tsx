import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  CalendarDays,
  Check,
  GripVertical,
  MapPin,
  MapPinPlus,
  MapPinned,
  Plus,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  mockCourseDetails,
  formatTripLength,
  useCopyCourseWithEdits,
  useCourseDetail,
  useCourseEditStore,
  useUpdateCourse,
  type CourseStop,
} from '@/features/course'
import { useCreatePlace } from '@/features/place'
import { Timeline, TimelineItem } from '@/shared/components/Timeline'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'
import { loadKakaoMapsSdk } from '@/features/map/lib/load-kakao-maps'
import { formatDurationMinutes } from '@/shared/lib/format'
import { Switch } from '@/shared/components/ui/switch'

export const Route = createFileRoute('/_shell/course/$courseId/edit')({
  validateSearch: (search: Record<string, unknown>): { copy?: true } => ({
    ...((search.copy === true || search.copy === 'true') && { copy: true }),
  }),
  component: CourseEditPage,
})

const MAX_COURSE_TITLE_LENGTH = 40

interface PlacePreview {
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

function CourseEditPage() {
  const { courseId } = Route.useParams()
  const { copy: copyMode } = Route.useSearch()
  const courseIdNumber = Number(courseId)
  const demoCourse = mockCourseDetails[courseId]
  const navigate = useNavigate()
  const { data: course } = useCourseDetail(courseIdNumber)
  const {
    title,
    stops,
    demoStopsByCourseId,
    initialize,
    updateTitle,
    addStop,
    removeStop,
    moveStop,
    updateStopMemo,
    updateStopDay,
    saveDemoStops,
  } = useCourseEditStore()
  const updateCourseMutation = useUpdateCourse(courseIdNumber)
  const copyCourseMutation = useCopyCourseWithEdits(courseIdNumber)
  const createPlace = useCreatePlace()
  const isCopyDraft = copyMode && course !== undefined && !course.owner
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    if (demoCourse) {
      const savedStops = demoStopsByCourseId[courseId]
      initialize(
        demoCourse.title,
        savedStops ??
          demoCourse.stops.map((stop, index) => ({
            id: stop.id,
            placeId: -(index + 1),
            dayNumber: 1,
            time: stop.time,
            durationLabel: stop.durationLabel,
            title: stop.title,
            subtitle: stop.subtitle,
            latitude: stop.latitude,
            longitude: stop.longitude,
            imageUrl: stop.imageUrl,
            imageAlt: stop.imageAlt,
            ...(stop.badges !== undefined && { badges: stop.badges }),
          })),
      )
      return
    }

    if (!course) return
    initialize(
      isCopyDraft ? `${course.title} 나의 일정` : course.title,
      course.stops.map((stop) => ({
        id: stop.courseStopId.toString(),
        placeId: stop.placeId,
        dayNumber: stop.dayNumber,
        durationLabel:
          stop.stayDurationMinutes !== undefined
            ? `${formatDurationMinutes(stop.stayDurationMinutes)} 체류 예정`
            : '체류 시간 미정',
        title: stop.name,
        ...(stop.address !== undefined && { address: stop.address }),
        ...(stop.memo !== undefined && { memo: stop.memo }),
        latitude: stop.latitude,
        longitude: stop.longitude,
        ...(stop.thumbnailUrl ? { imageUrl: stop.thumbnailUrl } : {}),
        imageAlt: stop.name,
        ...(stop.stayDurationMinutes !== undefined && {
          stayDurationMinutes: stop.stayDurationMinutes,
        }),
      })),
    )
  }, [course, courseId, demoCourse, demoStopsByCourseId, initialize, isCopyDraft])

  const tripDays = demoCourse ? 1 : (course?.tripDays ?? 1)
  const trimmedTitle = title.trim()
  const isTitleInvalid = trimmedTitle.length === 0 || title.length > MAX_COURSE_TITLE_LENGTH

  async function handleSave() {
    if (demoCourse) {
      saveDemoStops(courseId)
      void navigate({ to: '/course/$courseId', params: { courseId } })
      return
    }

    const orderedStops = stops
      .map((stop, originalIndex) => ({ stop, originalIndex }))
      .sort((a, b) => a.stop.dayNumber - b.stop.dayNumber || a.originalIndex - b.originalIndex)
      .map(({ stop }) => stop)

    const resolvedStops = await Promise.all(
      orderedStops.map(async (stop) => {
        if (stop.placeId > 0) return stop
        const createdPlace = await createPlace.mutateAsync({
          name: stop.title,
          type: stop.type ?? 'ATTRACTION',
          address: stop.address ?? stop.subtitle ?? '',
          latitude: stop.latitude ?? 37.5665,
          longitude: stop.longitude ?? 126.978,
          summary: defaultPlaceSummary(stop),
          soloFriendlyBadge: false,
          visibility: stop.visibility ?? 'PRIVATE',
        })
        return { ...stop, placeId: createdPlace.placeId }
      }),
    )

    const payload = {
      title: trimmedTitle,
      stops: resolvedStops.map((stop, i) => ({
        placeId: stop.placeId,
        stopOrder: i,
        dayNumber: stop.dayNumber,
        ...(stop.stayDurationMinutes !== undefined && {
          stayDurationMinutes: stop.stayDurationMinutes,
        }),
        ...(stop.memo?.trim() && { memo: stop.memo.trim() }),
      })),
    }

    if (isCopyDraft) {
      copyCourseMutation.mutate(payload, {
        onSuccess: (copied) => {
          void navigate({
            to: '/course/$courseId',
            params: { courseId: copied.courseId.toString() },
          })
        },
      })
      return
    }

    updateCourseMutation.mutate(payload, {
      onSuccess: () => {
        void navigate({ to: '/course/$courseId', params: { courseId } })
      },
    })
  }

  const saveMutation = isCopyDraft ? copyCourseMutation : updateCourseMutation

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
      moveStop(String(active.id), String(over.id))
    }
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <TopAppBar
        title="코스 편집"
        showBack
        actions={
          <button
            type="button"
            onClick={handleSave}
            disabled={
              isTitleInvalid ||
              (!demoCourse && (saveMutation.isPending || createPlace.isPending))
            }
            className="font-label-md text-label-md bg-primary-container text-on-primary rounded-xl px-6 py-2 transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {!demoCourse && (saveMutation.isPending || createPlace.isPending)
              ? '저장 중...'
              : '저장'}
          </button>
        }
      />
      <main className="px-margin-mobile pt-lg pb-xl mx-auto max-w-2xl">
        {!demoCourse && (saveMutation.isError || createPlace.isError) && (
          <p className="text-error font-label-md mb-md">
            저장하지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}
        {isCopyDraft && (
          <p className="bg-primary/5 text-primary border-primary/20 font-label-md mb-md rounded-xl border px-4 py-3">
            저장하기 전까지는 내 코스에 추가되지 않아요.
          </p>
        )}
        {!demoCourse && (
          <section className="mb-lg">
            <div className="mb-2 flex items-center justify-between gap-4">
              <label htmlFor="course-title" className="font-label-md text-on-surface">
                코스 이름
              </label>
              <span
                className={`text-xs ${isTitleInvalid ? 'text-error' : 'text-on-surface-variant'}`}
                aria-live="polite"
              >
                {title.length}/{MAX_COURSE_TITLE_LENGTH}
              </span>
            </div>
            <input
              id="course-title"
              type="text"
              value={title}
              onChange={(event) =>
                updateTitle(event.target.value.slice(0, MAX_COURSE_TITLE_LENGTH))
              }
              maxLength={MAX_COURSE_TITLE_LENGTH}
              placeholder="코스 이름을 입력해주세요"
              aria-invalid={isTitleInvalid}
              className="border-outline-variant bg-surface text-on-surface placeholder:text-outline focus:border-primary focus:ring-primary/20 h-12 w-full rounded-xl border px-4 text-base transition outline-none focus:ring-2"
            />
            {trimmedTitle.length === 0 && (
              <p className="text-error mt-2 text-xs">코스 이름을 입력해주세요.</p>
            )}
          </section>
        )}
        <section className="border-outline-variant/30 mb-lg bg-surface-container-low p-md flex items-center justify-between rounded-xl border shadow-sm">
          <div>
            <p className="font-label-caps text-outline tracking-wider uppercase">전체 경로</p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                {stops.length}개 장소
              </span>
              <span className="text-on-surface-variant text-sm">
                · {formatTripLength(course?.startDate, course?.endDate, tripDays)}
              </span>
            </div>
          </div>
        </section>

        <p className="text-body-sm text-on-surface-variant mb-sm">
          손잡이를 끌어 방문 순서를 변경할 수 있어요.
        </p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={stops.map((stop) => stop.id)}
            strategy={verticalListSortingStrategy}
          >
            <Timeline>
              {stops.map((stop, i) => (
                <SortableCourseStop
                  key={stop.id}
                  stop={stop}
                  index={i}
                  total={stops.length}
                  tripDays={tripDays}
                  onRemove={() => removeStop(stop.id)}
                  onMemoChange={(memo) => updateStopMemo(stop.id, memo)}
                  onDayChange={(dayNumber) => updateStopDay(stop.id, dayNumber)}
                />
              ))}
            </Timeline>
          </SortableContext>
        </DndContext>

        <PlaceSearchPanel stops={stops} tripDays={tripDays} onAdd={addStop} />
      </main>
    </div>
  )
}

function SortableCourseStop({
  stop,
  index,
  total,
  tripDays,
  onRemove,
  onMemoChange,
  onDayChange,
}: {
  stop: CourseStop
  index: number
  total: number
  tripDays: number
  onRemove: () => void
  onMemoChange: (memo: string) => void
  onDayChange: (dayNumber: number) => void
}) {
  const [editingMemo, setEditingMemo] = useState(false)
  const [memoDraft, setMemoDraft] = useState(stop.memo ?? '')
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stop.id,
  })
  const verticalTransform = transform ? { ...transform, x: 0 } : null

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(verticalTransform), transition }}
      className={
        isDragging
          ? 'bg-background relative z-30 opacity-90 shadow-md will-change-transform'
          : undefined
      }
    >
      <TimelineItem
        index={index + 1}
        isLast={index === total - 1}
        durationLabel={stop.durationLabel}
        title={stop.title}
        {...(stop.imageUrl ? { imageUrl: stop.imageUrl } : {})}
        imageAlt={stop.imageAlt}
        editable
        onEdit={() => setEditingMemo((open) => !open)}
        onRemove={onRemove}
        dragHandle={
          <button
            type="button"
            data-no-drag-scroll
            aria-label={`${stop.title} 순서 변경`}
            className="text-outline hover:bg-surface-container flex min-h-16 w-12 touch-none items-center justify-center self-stretch rounded-lg active:cursor-grabbing active:bg-surface-container"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-5" />
          </button>
        }
      />
      {tripDays > 1 && (
        <div className="border-outline-variant/30 bg-surface -mt-4 mb-3 ml-10 flex items-center gap-3 rounded-lg border px-3 py-2">
          <span className="text-on-surface-variant flex shrink-0 items-center gap-1.5 text-xs font-semibold">
            <CalendarDays className="size-4" /> 방문일
          </span>
          <div className="no-scrollbar flex min-w-0 gap-1 overflow-x-auto">
            {Array.from({ length: tripDays }, (_, index) => index + 1).map((dayNumber) => (
              <button
                key={dayNumber}
                type="button"
                onClick={() => onDayChange(dayNumber)}
                className={`h-8 shrink-0 rounded-md px-3 text-xs font-semibold ${stop.dayNumber === dayNumber ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}
              >
                {dayNumber}일차
              </button>
            ))}
          </div>
        </div>
      )}
      {editingMemo && (
        <div className="border-outline-variant/30 bg-surface mb-lg -mt-4 ml-10 rounded-lg border p-3 shadow-sm">
          <label className="mb-2 block text-xs font-semibold">이 장소에서 기억할 메모</label>
          <textarea
            value={memoDraft}
            onChange={(event) => setMemoDraft(event.target.value)}
            maxLength={500}
            rows={2}
            placeholder="예약 시간, 주문할 메뉴처럼 나에게 필요한 내용을 적어보세요."
            className="border-outline-variant focus:border-primary w-full resize-none rounded-lg border p-2 text-sm outline-none"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setMemoDraft(stop.memo ?? '')
                setEditingMemo(false)
              }}
              className="text-on-surface-variant h-9 px-3 text-sm"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => {
                onMemoChange(memoDraft.trim())
                setEditingMemo(false)
              }}
              className="bg-primary text-on-primary h-9 rounded-lg px-4 text-sm font-semibold"
            >
              메모 저장
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PlaceSearchPanel({
  stops,
  tripDays,
  onAdd,
}: {
  stops: CourseStop[]
  tripDays: number
  onAdd: (stop: CourseStop) => void
}) {
  const [open, setOpen] = useState(stops.length === 0)
  const [input, setInput] = useState('')
  const [keyword, setKeyword] = useState('')
  const [selectedDay, setSelectedDay] = useState(1)

  useEffect(() => {
    if (stops.length === 0) setOpen(true)
  }, [stops.length])

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-xl border-primary/30 py-lg hover:bg-primary/5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors active:scale-[0.98]"
      >
        <div className="bg-primary-container flex size-12 items-center justify-center rounded-full transition-transform group-hover:scale-110">
          <MapPinPlus className="text-on-primary-container size-7" />
        </div>
        <span className="font-headline-lg-mobile text-primary">장소 추가</span>
        <p className="font-body-sm text-on-surface-variant">나만의 여정을 확장해보세요</p>
      </button>
    )
  }

  return (
    <PlaceSearchResults
      input={input}
      keyword={keyword}
      stops={stops}
      tripDays={tripDays}
      selectedDay={selectedDay}
      onInputChange={setInput}
      onDayChange={setSelectedDay}
      onSearch={() => setKeyword(input.trim())}
      onAdd={onAdd}
      onClose={() => setOpen(false)}
    />
  )
}

function PlaceSearchResults({
  input,
  keyword,
  stops,
  tripDays,
  selectedDay,
  onInputChange,
  onDayChange,
  onSearch,
  onAdd,
  onClose,
}: {
  input: string
  keyword: string
  stops: CourseStop[]
  tripDays: number
  selectedDay: number
  onInputChange: (value: string) => void
  onDayChange: (dayNumber: number) => void
  onSearch: () => void
  onAdd: (stop: CourseStop) => void
  onClose: () => void
}) {
  const [places, setPlaces] = useState<kakao.maps.services.PlacesSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [previewPlace, setPreviewPlace] = useState<PlacePreview | null>(null)
  const [shareOnMap, setShareOnMap] = useState(false)
  const existingKakaoPlaceIds = new Set(
    stops.map((stop) => stop.kakaoPlaceId).filter((id): id is string => Boolean(id)),
  )

  useEffect(() => {
    if (!keyword) {
      setPlaces([])
      setSearchError('')
      return
    }

    let cancelled = false
    setSearching(true)
    setSearchError('')

    async function searchKakaoPlaces() {
      try {
        const kakaoSdk = await loadKakaoMapsSdk()
        const kakaoPlaces = new kakaoSdk.maps.services.Places()
        kakaoPlaces.keywordSearch(
          keyword,
          (result, status) => {
            if (cancelled) return
            setSearching(false)
            if (status === kakaoSdk.maps.services.Status.OK) {
              setPlaces(result.slice(0, 10))
              return
            }
            setPlaces([])
            setSearchError(
              status === kakaoSdk.maps.services.Status.ZERO_RESULT
                ? '검색 결과가 없어요. 장소명을 조금 더 정확히 입력해 주세요.'
                : '장소 검색을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
            )
          },
          { size: 10 },
        )
      } catch {
        if (!cancelled) {
          setSearching(false)
          setPlaces([])
          setSearchError('장소 검색을 사용할 수 없어요. 잠시 후 다시 시도해 주세요.')
        }
      }
    }

    void searchKakaoPlaces()

    return () => {
      cancelled = true
    }
  }, [keyword])

  return (
    <section className="border-outline-variant/30 bg-surface mt-xl rounded-xl border shadow-sm">
      <div className="border-outline-variant/30 p-md flex items-center justify-between border-b">
        <div>
          <h3 className="text-headline-lg-mobile font-bold">장소 추가</h3>
          <p className="text-body-sm text-on-surface-variant">
            장소를 담은 뒤 아래 일정에서 순서를 조정해요.
          </p>
        </div>
        <button
          type="button"
          aria-label="장소 검색 닫기"
          onClick={onClose}
          className="hover:bg-surface-container grid size-10 place-items-center rounded-full"
        >
          <X className="size-5" />
        </button>
      </div>

      <form
        className="p-md gap-sm flex"
        onSubmit={(event) => {
          event.preventDefault()
          onSearch()
        }}
      >
        <div className="relative min-w-0 flex-1">
          <Search className="text-outline absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            type="search"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="장소 이름 검색"
            className="border-outline-variant focus:border-primary h-11 w-full rounded-xl border bg-white pr-3 pl-10 outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-on-primary h-11 shrink-0 rounded-xl px-4 font-semibold"
        >
          검색
        </button>
      </form>

      {tripDays > 1 && (
        <div className="px-md pb-sm">
          <p className="text-on-surface-variant mb-2 text-xs font-semibold">담을 일차</p>
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            {Array.from({ length: tripDays }, (_, index) => index + 1).map((dayNumber) => (
              <button
                key={dayNumber}
                type="button"
                onClick={() => onDayChange(dayNumber)}
                className={`h-9 shrink-0 rounded-lg px-3 text-xs font-bold ${
                  selectedDay === dayNumber
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {dayNumber}일차
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-md pb-sm">
        <div className="border-outline-variant/40 bg-surface-container-low flex items-center justify-between rounded-xl border px-4 py-3">
          <span className="text-sm font-bold text-on-surface">공유 지도에 공개하기</span>
          <Switch checked={shareOnMap} onCheckedChange={setShareOnMap} />
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto px-4 pb-4">
        {!keyword ? (
          <p className="text-body-sm text-on-surface-variant py-lg text-center">
            장소명을 검색하면 검색 결과가 여기에 표시돼요.
          </p>
        ) : searching ? (
          <p className="text-body-sm text-on-surface-variant py-lg text-center">
            장소를 찾고 있어요...
          </p>
        ) : searchError ? (
          <p className="text-body-sm text-error py-lg text-center">{searchError}</p>
        ) : places.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant py-lg text-center">
            검색 결과가 없어요.
          </p>
        ) : (
          <ul className="divide-outline-variant/30 divide-y">
            {places.map((place) => {
              const added = existingKakaoPlaceIds.has(place.id)
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
                      onClick={() =>
                        setPreviewPlace({
                          name: place.place_name,
                          address: place.road_address_name || place.address_name,
                          latitude: Number(place.y),
                          longitude: Number(place.x),
                        })
                      }
                      className="border-outline-variant/60 text-on-surface-variant flex h-8 items-center justify-center gap-1 rounded-lg border bg-white px-2 text-xs font-bold"
                    >
                      <MapPinned className="size-3.5" />
                      위치
                    </button>
                    <button
                      type="button"
                      disabled={added}
                      aria-label={`${place.place_name} ${added ? '추가됨' : '추가'}`}
                      onClick={() => onAdd(toCourseStop(place, selectedDay, shareOnMap))}
                      className="disabled:bg-surface-container disabled:text-on-surface-variant flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#f05a47] px-2 text-xs font-bold text-white"
                    >
                      {added ? (
                        <>
                          <Check className="size-3.5" />
                          담김
                        </>
                      ) : (
                        <>
                          <Plus className="size-3.5" />
                          {selectedDay}일차에 담기
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
      {previewPlace && (
        <PlaceMapPreview place={previewPlace} onClose={() => setPreviewPlace(null)} />
      )}
    </section>
  )
}

function PlaceMapPreview({ place, onClose }: { place: PlacePreview; onClose: () => void }) {
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

function toCourseStop(
  place: kakao.maps.services.PlacesSearchResult,
  dayNumber: number,
  shareOnMap: boolean,
): CourseStop {
  const type = categoryFromKakao(place)
  const address = place.road_address_name || place.address_name
  return {
    id: `kakao-${place.id}`,
    placeId: Number.isFinite(Number(place.id)) ? -Number(place.id) : -Date.now(),
    kakaoPlaceId: place.id,
    dayNumber,
    durationLabel: '체류 시간 미정',
    title: place.place_name,
    subtitle: address,
    type,
    address,
    visibility: shareOnMap ? 'PUBLIC' : 'PRIVATE',
    latitude: Number(place.y),
    longitude: Number(place.x),
    imageAlt: place.place_name,
  }
}

function defaultPlaceSummary(stop: CourseStop) {
  if (stop.type === 'RESTAURANT') return '코스에 추가한 식당'
  if (stop.type === 'CAFE') return '코스에 추가한 카페'
  if (stop.type === 'STAY') return '코스에 추가한 숙소'
  if (stop.type === 'NATURE') return '코스에 추가한 자연/산책 장소'
  if (stop.type === 'CULTURE') return '코스에 추가한 문화 공간'
  return '코스에 추가한 여행 장소'
}
