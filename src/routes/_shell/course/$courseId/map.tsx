import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeft, MapPin } from 'lucide-react'
import { useLayoutEffect } from 'react'
import {
  CourseOverviewMap,
  mockCourseDetails,
  useCourseDetail,
  useCourseEditStore,
} from '@/features/course'
import { EmptyState } from '@/shared/components/EmptyState'
import { getAppFrameElement } from '@/shared/lib/app-frame'

export const Route = createFileRoute('/_shell/course/$courseId/map')({
  component: CourseMapPage,
})

function CourseMapPage() {
  const { courseId } = Route.useParams()
  const router = useRouter()
  const demoCourse = mockCourseDetails[courseId]
  const editedDemoStops = useCourseEditStore((state) => state.demoStopsByCourseId[courseId])
  const { data: course, isLoading, isError } = useCourseDetail(Number(courseId))

  useLayoutEffect(() => {
    getAppFrameElement()?.scrollTo(0, 0)
    window.scrollTo(0, 0)
  }, [courseId])

  if (!demoCourse && isLoading) {
    return (
      <main className="bg-surface-container grid min-h-screen place-items-center">
        <p className="text-body-sm text-on-surface-variant">코스 지도를 불러오는 중이에요...</p>
      </main>
    )
  }

  if (!demoCourse && (isError || !course)) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <EmptyState icon={<MapPin className="size-6" />} title="코스 지도를 불러올 수 없어요" />
      </main>
    )
  }

  const title = demoCourse?.title ?? course?.title ?? ''
  const stops = demoCourse
    ? (editedDemoStops ?? demoCourse.stops).flatMap((stop, index) =>
        stop.latitude !== undefined && stop.longitude !== undefined
          ? [
              {
                id: stop.id,
                order: index + 1,
                dayNumber: 1,
                name: stop.title,
                latitude: stop.latitude,
                longitude: stop.longitude,
              },
            ]
          : [],
      )
    : (course?.stops ?? []).map((stop, index) => ({
        id: stop.courseStopId.toString(),
        order: index + 1,
        dayNumber: stop.dayNumber,
        name: stop.name,
        latitude: stop.latitude,
        longitude: stop.longitude,
      }))

  if (stops.length === 0) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <EmptyState icon={<MapPin className="size-6" />} title="코스에 등록된 장소가 없어요" />
      </main>
    )
  }

  return (
    <main className="bg-surface-container relative h-[100dvh] w-full overflow-hidden">
      <CourseOverviewMap stops={stops} />

      <header className="px-margin-mobile py-md absolute inset-x-0 top-0 z-20">
        <div className="bg-surface/95 gap-md flex items-center rounded-xl px-3 py-2 shadow-lg backdrop-blur-md">
          <button
            type="button"
            aria-label="코스 상세로 돌아가기"
            onClick={() => router.history.back()}
            className="hover:bg-surface-container grid size-10 shrink-0 place-items-center rounded-full"
          >
            <ArrowLeft className="text-primary size-6" />
          </button>
          <div className="min-w-0">
            <p className="text-label-md text-on-surface-variant">전체 코스</p>
            <h1 className="text-headline-lg-mobile truncate font-bold">{title}</h1>
          </div>
        </div>
      </header>

      <section className="bg-surface/95 px-margin-mobile pt-md absolute inset-x-0 bottom-0 z-20 max-h-44 overflow-y-auto rounded-t-xl pb-6 shadow-2xl backdrop-blur-md">
        <ol className="space-y-sm">
          {stops.map((stop) => (
            <li key={stop.id} className="gap-sm flex items-center">
              <span className="bg-primary text-on-primary grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold">
                {stop.order}
              </span>
              <span className="text-body-sm min-w-0 truncate font-semibold">
                {stop.dayNumber ? `${stop.dayNumber.toString()}일차 · ` : ''}
                {stop.name}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
