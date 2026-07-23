import { createFileRoute } from '@tanstack/react-router'
import { MapPinPlus } from 'lucide-react'
import { useEffect } from 'react'
import { mockCourseDetails, useCourseEditStore } from '@/features/course'
import { Timeline, TimelineItem } from '@/shared/components/Timeline'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/course/$courseId/edit')({
  component: CourseEditPage,
})

function CourseEditPage() {
  const { courseId } = Route.useParams()
  const { stops, initialize, removeStop } = useCourseEditStore()

  useEffect(() => {
    const course = mockCourseDetails[courseId] ?? Object.values(mockCourseDetails)[0]
    if (course) initialize(course.stops)
  }, [courseId, initialize])

  return (
    <div className="bg-background min-h-screen pb-20">
      <TopAppBar
        title="코스 편집"
        showBack
        actions={
          <button
            type="button"
            className="font-label-md text-label-md bg-primary-container text-on-primary rounded-xl px-6 py-2 transition-opacity hover:opacity-90 active:scale-95"
          >
            저장
          </button>
        }
      />
      <main className="px-margin-mobile pt-lg pb-xl mx-auto max-w-2xl">
        <section className="border-outline-variant/30 mb-lg bg-surface-container-low p-md flex items-center justify-between rounded-xl border shadow-sm">
          <div>
            <p className="font-label-caps text-outline tracking-wider uppercase">Total Route</p>
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
              subtitle={stop.subtitle}
              imageUrl={stop.imageUrl}
              imageAlt={stop.imageAlt}
              editable
              onRemove={() => removeStop(stop.id)}
            />
          ))}
        </Timeline>

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
