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
import { CalendarDays, Check, GripVertical, MapPinPlus, Plus, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  mockCourseDetails,
  formatTripLength,
  useCourseDetail,
  useCourseEditStore,
  useUpdateCourse,
  type CourseStop,
} from '@/features/course'
import { usePlaces, type ApiPlaceSummary } from '@/features/place'
import { Timeline, TimelineItem } from '@/shared/components/Timeline'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'
import { formatDurationMinutes } from '@/shared/lib/format'

export const Route = createFileRoute('/_shell/course/$courseId/edit')({
  component: CourseEditPage,
})

const MAX_COURSE_TITLE_LENGTH = 40

function CourseEditPage() {
  const { courseId } = Route.useParams()
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
  const updateCourse = useUpdateCourse(courseIdNumber)
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
      course.title,
      course.stops.map((stop) => ({
        id: stop.courseStopId.toString(),
        placeId: stop.placeId,
        dayNumber: stop.dayNumber,
        durationLabel:
          stop.stayDurationMinutes !== undefined
            ? `${formatDurationMinutes(stop.stayDurationMinutes)} 체류 예정`
            : '체류 시간 미정',
        title: stop.name,
        ...(stop.memo !== undefined && { memo: stop.memo }),
        latitude: stop.latitude,
        longitude: stop.longitude,
        imageUrl:
          stop.thumbnailUrl ??
          `https://picsum.photos/seed/place-${stop.placeId.toString()}/240/240`,
        imageAlt: stop.name,
        ...(stop.stayDurationMinutes !== undefined && {
          stayDurationMinutes: stop.stayDurationMinutes,
        }),
      })),
    )
  }, [course, courseId, demoCourse, demoStopsByCourseId, initialize])

  const tripDays = demoCourse ? 1 : (course?.tripDays ?? 1)
  const trimmedTitle = title.trim()
  const isTitleInvalid =
    trimmedTitle.length === 0 || title.length > MAX_COURSE_TITLE_LENGTH

  function handleSave() {
    if (demoCourse) {
      saveDemoStops(courseId)
      void navigate({ to: '/course/$courseId', params: { courseId } })
      return
    }

    const orderedStops = stops
      .map((stop, originalIndex) => ({ stop, originalIndex }))
      .sort((a, b) => a.stop.dayNumber - b.stop.dayNumber || a.originalIndex - b.originalIndex)
      .map(({ stop }) => stop)

    updateCourse.mutate(
      {
        title: trimmedTitle,
        stops: orderedStops.map((stop, i) => ({
          placeId: stop.placeId,
          stopOrder: i,
          dayNumber: stop.dayNumber,
          ...(stop.stayDurationMinutes !== undefined && {
            stayDurationMinutes: stop.stayDurationMinutes,
          }),
          ...(stop.memo?.trim() && { memo: stop.memo.trim() }),
        })),
      },
      {
        onSuccess: () => {
          void navigate({ to: '/course/$courseId', params: { courseId } })
        },
      },
    )
  }

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
            disabled={isTitleInvalid || (!demoCourse && updateCourse.isPending)}
            className="font-label-md text-label-md bg-primary-container text-on-primary rounded-xl px-6 py-2 transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {!demoCourse && updateCourse.isPending ? '저장 중...' : '저장'}
          </button>
        }
      />
      <main className="px-margin-mobile pt-lg pb-xl mx-auto max-w-2xl">
        {!demoCourse && updateCourse.isError && (
          <p className="text-error font-label-md mb-md">
            저장하지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}
        {!demoCourse && (
          <section className="mb-lg">
            <div className="mb-2 flex items-center justify-between gap-4">
              <label htmlFor="course-title" className="font-label-md text-on-surface">
                코스 이름
              </label>
              <span
                className={`text-xs ${
                  isTitleInvalid ? 'text-error' : 'text-on-surface-variant'
                }`}
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
              className="border-outline-variant bg-surface text-on-surface placeholder:text-outline focus:border-primary focus:ring-primary/20 h-12 w-full rounded-xl border px-4 text-base outline-none transition focus:ring-2"
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

        <PlaceSearchPanel stops={stops} onAdd={addStop} />
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

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'relative z-30 opacity-80' : undefined}
    >
      <TimelineItem
        index={index + 1}
        isLast={index === total - 1}
        durationLabel={stop.durationLabel}
        title={stop.title}
        imageUrl={stop.imageUrl}
        imageAlt={stop.imageAlt}
        editable
        onEdit={() => setEditingMemo((open) => !open)}
        onRemove={onRemove}
        dragHandle={
          <button
            type="button"
            aria-label={`${stop.title} 순서 변경`}
            className="text-outline hover:bg-surface-container touch-none self-center rounded-lg p-2 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-5" />
          </button>
        }
      />
      {tripDays > 1 && (
        <div className="border-outline-variant/30 bg-surface mb-3 -mt-4 ml-10 flex items-center gap-3 rounded-lg border px-3 py-2">
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
  onAdd,
}: {
  stops: CourseStop[]
  onAdd: (stop: CourseStop) => void
}) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [keyword, setKeyword] = useState('')

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
      onInputChange={setInput}
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
  onInputChange,
  onSearch,
  onAdd,
  onClose,
}: {
  input: string
  keyword: string
  stops: CourseStop[]
  onInputChange: (value: string) => void
  onSearch: () => void
  onAdd: (stop: CourseStop) => void
  onClose: () => void
}) {
  const placesQuery = usePlaces({ ...(keyword && { keyword }), size: 10 })
  const places = placesQuery.data?.content ?? []
  const existingPlaceIds = new Set(stops.map((stop) => stop.placeId))

  return (
    <section className="border-outline-variant/30 bg-surface mt-xl rounded-xl border shadow-sm">
      <div className="border-outline-variant/30 p-md flex items-center justify-between border-b">
        <div>
          <h3 className="text-headline-lg-mobile font-bold">장소 추가</h3>
          <p className="text-body-sm text-on-surface-variant">
            추가한 장소는 일정 마지막에 배치돼요.
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

      <div className="max-h-80 overflow-y-auto px-4 pb-4">
        {placesQuery.isLoading ? (
          <p className="text-body-sm text-on-surface-variant py-lg text-center">
            장소를 찾고 있어요...
          </p>
        ) : placesQuery.isError ? (
          <p className="text-body-sm text-error py-lg text-center">장소를 불러오지 못했어요.</p>
        ) : places.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant py-lg text-center">
            검색 결과가 없어요.
          </p>
        ) : (
          <ul className="divide-outline-variant/30 divide-y">
            {places.map((place) => {
              const added = existingPlaceIds.has(place.placeId)
              return (
                <li key={place.placeId} className="gap-sm flex items-center py-3">
                  <img
                    src={
                      place.thumbnailUrl ??
                      `https://picsum.photos/seed/place-${place.placeId.toString()}/160/160`
                    }
                    alt=""
                    className="size-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{place.name}</p>
                    <p className="text-body-sm text-on-surface-variant truncate">{place.type}</p>
                  </div>
                  <button
                    type="button"
                    disabled={added}
                    aria-label={`${place.name} ${added ? '추가됨' : '추가'}`}
                    onClick={() => onAdd(toCourseStop(place))}
                    className="disabled:bg-surface-container disabled:text-on-surface-variant bg-primary-container text-primary grid size-10 shrink-0 place-items-center rounded-full"
                  >
                    {added ? <Check className="size-5" /> : <Plus className="size-5" />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

function toCourseStop(place: ApiPlaceSummary): CourseStop {
  return {
    id: `place-${place.placeId.toString()}`,
    placeId: place.placeId,
    dayNumber: 1,
    durationLabel: '체류 시간 미정',
    title: place.name,
    subtitle: place.type,
    latitude: place.latitude,
    longitude: place.longitude,
    imageUrl:
      place.thumbnailUrl ?? `https://picsum.photos/seed/place-${place.placeId.toString()}/240/240`,
    imageAlt: place.name,
  }
}
