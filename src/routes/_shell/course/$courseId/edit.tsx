import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MapPinPlus } from 'lucide-react'
import { useEffect } from 'react'
import { useCourseDetail, useCourseEditStore, useUpdateCourse } from '@/features/course'
import { Timeline, TimelineItem } from '@/shared/components/Timeline'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'
import { formatDurationMinutes } from '@/shared/lib/format'

export const Route = createFileRoute('/_shell/course/$courseId/edit')({
  component: CourseEditPage,
})

function CourseEditPage() {
  const { courseId } = Route.useParams()
  const courseIdNumber = Number(courseId)
  const navigate = useNavigate()
  const { data: course } = useCourseDetail(courseIdNumber)
  const { title, stops, initialize, removeStop } = useCourseEditStore()
  const updateCourse = useUpdateCourse(courseIdNumber)

  useEffect(() => {
    if (!course) return
    initialize(
      course.title,
      course.stops.map((stop) => ({
        id: stop.courseStopId.toString(),
        placeId: stop.placeId,
        durationLabel:
          stop.stayDurationMinutes !== undefined
            ? `${formatDurationMinutes(stop.stayDurationMinutes)} 체류 예정`
            : '체류 시간 미정',
        title: stop.name,
        imageUrl: stop.thumbnailUrl ?? `https://picsum.photos/seed/place-${stop.placeId.toString()}/240/240`,
        imageAlt: stop.name,
        ...(stop.stayDurationMinutes !== undefined && {
          stayDurationMinutes: stop.stayDurationMinutes,
        }),
      })),
    )
  }, [course, initialize])

  function handleSave() {
    updateCourse.mutate(
      {
        title,
        stops: stops.map((stop, i) => ({
          placeId: stop.placeId,
          stopOrder: i + 1,
          ...(stop.stayDurationMinutes !== undefined && {
            stayDurationMinutes: stop.stayDurationMinutes,
          }),
        })),
      },
      {
        onSuccess: () => {
          void navigate({ to: '/course/$courseId', params: { courseId } })
        },
      },
    )
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
            disabled={updateCourse.isPending}
            className="font-label-md text-label-md bg-primary-container text-on-primary rounded-xl px-6 py-2 transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {updateCourse.isPending ? '저장 중...' : '저장'}
          </button>
        }
      />
      <main className="px-margin-mobile pt-lg pb-xl mx-auto max-w-2xl">
        {updateCourse.isError && (
          <p className="text-error font-label-md mb-md">
            저장하지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}
        <section className="border-outline-variant/30 mb-lg bg-surface-container-low p-md flex items-center justify-between rounded-xl border shadow-sm">
          <div>
            <p className="font-label-caps text-outline tracking-wider uppercase">전체 경로</p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                {stops.length}개 장소
              </span>
            </div>
          </div>
        </section>

        <Timeline>
          {stops.map((stop, i) => (
            <TimelineItem
              key={stop.id}
              index={i + 1}
              isLast={i === stops.length - 1}
              durationLabel={stop.durationLabel}
              title={stop.title}
              imageUrl={stop.imageUrl}
              imageAlt={stop.imageAlt}
              editable
              onRemove={() => removeStop(stop.id)}
            />
          ))}
        </Timeline>

        {/* TODO: 장소 검색/추가 UI는 후속 작업에서 연결한다 (PUT /courses/{id}에 stops로 새 placeId를 포함해 전달하면 된다). */}
        <button
          type="button"
          className="group mt-xl border-primary/30 py-lg hover:bg-primary/5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors active:scale-[0.98]"
        >
          <div className="bg-primary-container flex size-12 items-center justify-center rounded-full transition-transform group-hover:scale-110">
            <MapPinPlus className="text-on-primary-container size-7" />
          </div>
          <span className="font-headline-lg-mobile text-primary">장소 추가</span>
          <p className="font-body-sm text-on-surface-variant">나만의 여정을 확장해보세요</p>
        </button>
      </main>
    </div>
  )
}
