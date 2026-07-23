import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Heart, MapPin, Navigation, Save, Share2 } from 'lucide-react'
import { mockCourseDetails } from '@/features/course'
import { Timeline, TimelineItem } from '@/shared/components/Timeline'
import { EmptyState } from '@/shared/components/EmptyState'

export const Route = createFileRoute('/_shell/course/$courseId/')({
  component: CourseDetailPage,
})

function CourseDetailPage() {
  const { courseId } = Route.useParams()
  const router = useRouter()
  const course = mockCourseDetails[courseId] ?? Object.values(mockCourseDetails)[0]

  if (!course) {
    return (
      <main className="p-margin-mobile">
        <EmptyState icon={<MapPin className="size-6" />} title="코스를 찾을 수 없어요" />
      </main>
    )
  }

  return (
    <div className="font-body-md text-body-md pb-32">
      <header className="bg-surface px-margin-mobile py-base fixed inset-x-0 top-0 z-50 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.history.back()}
          className="hover:bg-surface-variant flex size-10 items-center justify-center rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft className="text-primary size-6" />
        </button>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
          코스 상세
        </h1>
        <div className="gap-xs flex">
          <button
            type="button"
            className="hover:bg-surface-variant flex size-10 items-center justify-center rounded-full transition-colors active:scale-95"
          >
            <Share2 className="text-primary size-5" />
          </button>
          <button
            type="button"
            className="hover:bg-surface-variant flex size-10 items-center justify-center rounded-full transition-colors active:scale-95"
          >
            <Heart className="text-primary size-5" />
          </button>
        </div>
      </header>

      <main className="pt-14">
        <section className="bg-surface-container-highest relative h-[280px] w-full overflow-hidden">
          <img
            src={course.mapImageUrl}
            alt={course.mapImageAlt}
            className="size-full object-cover"
          />
        </section>

        <div className="px-margin-mobile relative z-10 -mt-6">
          <div className="glass-effect p-md rounded-xl shadow-xl">
            <div className="mb-xs flex items-start justify-between">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-1">
                  {course.title}
                </h2>
                <p className="text-body-sm text-on-surface-variant">{course.dateLabel}</p>
              </div>
              <div className="font-label-md text-label-md bg-secondary-container px-xs text-on-secondary-fixed rounded-full py-1">
                {course.totalDistanceLabel}
              </div>
            </div>
            <div className="no-scrollbar gap-xs flex overflow-x-auto pb-1">
              {course.badges.map((badge) => (
                <span
                  key={badge}
                  className="font-label-md text-label-md px-xs rounded-lg bg-[#d1fadf] py-1 whitespace-nowrap text-[#027a48]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-lg px-margin-mobile">
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-md">
            일정 타임라인
          </h3>
          <Timeline>
            {course.stops.map((stop, i) => (
              <TimelineItem
                key={stop.id}
                index={i + 1}
                isLast={i === course.stops.length - 1}
                time={stop.time}
                durationLabel={stop.durationLabel}
                title={stop.title}
                subtitle={stop.subtitle}
                imageUrl={stop.imageUrl}
                imageAlt={stop.imageAlt}
                {...(stop.badges !== undefined && { badges: stop.badges })}
              />
            ))}
          </Timeline>
        </section>
      </main>

      <div className="gap-md border-outline-variant bg-surface/80 px-margin-mobile py-md fixed inset-x-0 bottom-0 z-40 flex border-t backdrop-blur-md">
        <button
          type="button"
          className="font-headline-lg-mobile text-headline-lg-mobile hover:bg-primary-fixed gap-xs border-primary bg-surface text-primary flex h-12 flex-1 items-center justify-center rounded-xl border transition-colors active:scale-95"
        >
          <Save className="size-5" />
          저장하기
        </button>
        <Link
          to="/course/$courseId/edit"
          params={{ courseId: course.id }}
          className="font-headline-lg-mobile text-headline-lg-mobile gap-xs bg-primary text-on-primary flex h-12 flex-[1.5] items-center justify-center rounded-xl shadow-lg transition-all hover:brightness-110 active:scale-95"
        >
          <Navigation className="size-5" />
          코스 시작하기
        </Link>
      </div>
    </div>
  )
}
