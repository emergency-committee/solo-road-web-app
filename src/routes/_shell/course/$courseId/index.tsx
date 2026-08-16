import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Heart, MapPin, Navigation, Save, Share2 } from 'lucide-react'
import { useState } from 'react'
import {
  CourseLegButton,
  mockCourseDetails,
  useCourseDetail,
  type CourseDetail,
  type DemoCourseStop,
} from '@/features/course'
import { CourseRouteViewer } from '@/features/course-route'
import { EmptyState } from '@/shared/components/EmptyState'
import { Timeline, TimelineItem } from '@/shared/components/Timeline'
import { formatDistanceMeters, formatDurationMinutes } from '@/shared/lib/format'

export const Route = createFileRoute('/_shell/course/$courseId/')({
  component: CourseDetailPage,
})

function CourseDetailPage() {
  const { courseId } = Route.useParams()
  const router = useRouter()
  const demoCourse = mockCourseDetails[courseId]
  const courseIdNumber = Number(courseId)
  const { data: course, isLoading, isError } = useCourseDetail(courseIdNumber)

  if (demoCourse) {
    return <DemoCourseDetailPage course={demoCourse} onBack={() => router.history.back()} />
  }

  if (isLoading) {
    return (
      <main className="min-h-screen p-margin-mobile">
        <p className="font-body-md text-on-surface-variant text-center">
          코스를 불러오는 중이에요...
        </p>
      </main>
    )
  }

  if (isError || !course) {
    return (
      <main className="min-h-screen p-margin-mobile">
        <EmptyState icon={<MapPin className="size-6" />} title="코스를 찾을 수 없어요" />
      </main>
    )
  }

  return (
    <div className="font-body-md text-body-md min-h-screen pb-32">
      <CourseHeader onBack={() => router.history.back()} />

      <main className="pt-14">
        <section className="from-primary/20 to-primary/5 relative flex h-[160px] w-full items-center justify-center bg-gradient-to-br">
          <MapPin className="text-primary/40 size-12" />
        </section>

        <div className="px-margin-mobile relative z-10 -mt-6">
          <div className="glass-effect p-md rounded-xl shadow-xl">
            <div className="mb-xs flex items-start justify-between">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-1">
                  {course.title}
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  {formatDurationMinutes(course.totalDurationMinutes)} 코스
                </p>
              </div>
              <div className="font-label-md text-label-md bg-secondary-container px-xs text-on-secondary-fixed rounded-full py-1">
                {formatDistanceMeters(course.totalDistanceM)}
              </div>
            </div>
            {course.safetyPriority && (
              <div className="no-scrollbar gap-xs flex overflow-x-auto pb-1">
                <span className="font-label-md text-label-md px-xs rounded-lg bg-[#d1fadf] py-1 whitespace-nowrap text-[#027a48]">
                  안전 우선 경로
                </span>
              </div>
            )}
          </div>
        </div>

        <section className="mt-lg px-margin-mobile">
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-md">
            일정 타임라인
          </h3>
          <Timeline>
            {course.stops.map((stop, index) => (
              <TimelineItem
                key={stop.courseStopId}
                index={index + 1}
                isLast={index === course.stops.length - 1}
                title={stop.name}
                imageUrl={
                  stop.thumbnailUrl ??
                  `https://picsum.photos/seed/place-${stop.placeId.toString()}/240/240`
                }
                imageAlt={stop.name}
                {...(stop.stayDurationMinutes !== undefined && {
                  durationLabel: `${formatDurationMinutes(stop.stayDurationMinutes)} 체류 예정`,
                })}
              />
            ))}
          </Timeline>
        </section>
      </main>

      <div className="gap-md border-outline-variant bg-surface/80 px-margin-mobile py-md fixed inset-x-0 bottom-0 z-40 flex border-t backdrop-blur-md">
        <Link
          to="/course/$courseId/edit"
          params={{ courseId }}
          className="font-headline-lg-mobile text-headline-lg-mobile hover:bg-primary-fixed gap-xs border-primary bg-surface text-primary flex h-12 flex-1 items-center justify-center rounded-xl border transition-colors active:scale-95"
        >
          편집하기
        </Link>
        <Link
          to="/map"
          className="font-headline-lg-mobile text-headline-lg-mobile gap-xs bg-primary text-on-primary flex h-12 flex-[1.5] items-center justify-center rounded-xl shadow-lg transition-all hover:brightness-110 active:scale-95"
        >
          <Navigation className="size-5" />
          지도에서 보기
        </Link>
      </div>
    </div>
  )
}

function DemoCourseDetailPage({ course, onBack }: { course: CourseDetail; onBack: () => void }) {
  const [selectedLeg, setSelectedLeg] = useState<{
    origin: DemoCourseStop
    destination: DemoCourseStop
  } | null>(null)

  return (
    <div className="font-body-md text-body-md min-h-screen pb-32">
      <CourseHeader onBack={onBack} />

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
            {course.stops.map((stop, index) => {
              const nextStop = course.stops[index + 1]
              return (
                <TimelineItem
                  key={stop.id}
                  index={index + 1}
                  isLast={index === course.stops.length - 1}
                  time={stop.time}
                  durationLabel={stop.durationLabel}
                  title={stop.title}
                  subtitle={stop.subtitle}
                  imageUrl={stop.imageUrl}
                  imageAlt={stop.imageAlt}
                  {...(stop.badges !== undefined && { badges: stop.badges })}
                  {...(nextStop
                    ? {
                        after: (
                          <CourseLegButton
                            originName={stop.title}
                            destinationName={nextStop.title}
                            onClick={() =>
                              setSelectedLeg({ origin: stop, destination: nextStop })
                            }
                          />
                        ),
                      }
                    : {})}
                />
              )
            })}
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
        <button
          type="button"
          onClick={() => {
            const firstStop = course.stops[0]
            const secondStop = course.stops[1]
            if (firstStop && secondStop) {
              setSelectedLeg({ origin: firstStop, destination: secondStop })
            }
          }}
          className="font-headline-lg-mobile text-headline-lg-mobile gap-xs bg-primary text-on-primary flex h-12 flex-[1.5] items-center justify-center rounded-xl shadow-lg transition-all hover:brightness-110 active:scale-95"
        >
          <Navigation className="size-5" />
          코스 시작하기
        </button>
      </div>

      {selectedLeg && (
        <CourseRouteViewer
          originName={selectedLeg.origin.title}
          destinationName={selectedLeg.destination.title}
          origin={{ lat: selectedLeg.origin.latitude, lng: selectedLeg.origin.longitude }}
          destination={{
            lat: selectedLeg.destination.latitude,
            lng: selectedLeg.destination.longitude,
          }}
          onClose={() => setSelectedLeg(null)}
        />
      )}
    </div>
  )
}

function CourseHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="bg-surface px-margin-mobile py-base fixed inset-x-0 top-0 z-50 flex items-center justify-between">
      <button
        type="button"
        aria-label="이전 화면"
        onClick={onBack}
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
          aria-label="공유"
          className="hover:bg-surface-variant flex size-10 items-center justify-center rounded-full transition-colors active:scale-95"
        >
          <Share2 className="text-primary size-5" />
        </button>
        <button
          type="button"
          aria-label="좋아요"
          className="hover:bg-surface-variant flex size-10 items-center justify-center rounded-full transition-colors active:scale-95"
        >
          <Heart className="text-primary size-5" />
        </button>
      </div>
    </header>
  )
}
