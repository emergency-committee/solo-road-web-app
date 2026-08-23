import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Copy, Globe2, Heart, MapPin, Navigation, Share2, UserRound } from 'lucide-react'
import { useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  CourseLegButton,
  CourseOverviewMap,
  CourseReviewsSection,
  PublishCourseDialog,
  mockCourseDetails,
  formatCourseDayDate,
  formatTripLength,
  paceLabel,
  soloImpressionLabel,
  useCopyCourse,
  useCourseDetail,
  useCourseEditStore,
  useToggleCourseLike,
  useUnpublishCourse,
  type CourseDetail,
  type CourseDetailStop,
  type DemoCourseStop,
} from '@/features/course'
import { CourseRouteViewer } from '@/features/course-route'
import { EmptyState } from '@/shared/components/EmptyState'
import { Timeline, TimelineItem } from '@/shared/components/Timeline'
import { getAppFrameElement } from '@/shared/lib/app-frame'
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
  const [publishOpen, setPublishOpen] = useState(false)
  const toggleLike = useToggleCourseLike(courseIdNumber)
  const copyCourse = useCopyCourse(courseIdNumber)
  const unpublish = useUnpublishCourse(courseIdNumber)

  const overviewStops = useMemo(
    () =>
      (course?.stops ?? []).map((stop, index) => ({
        id: stop.courseStopId.toString(),
        order: index + 1,
        dayNumber: stop.dayNumber,
        name: stop.name,
        latitude: stop.latitude,
        longitude: stop.longitude,
      })),
    [course?.stops],
  )

  useLayoutEffect(() => {
    getAppFrameElement()?.scrollTo(0, 0)
    window.scrollTo(0, 0)
  }, [courseId])

  if (demoCourse) {
    return <DemoCourseDetailPage course={demoCourse} onBack={() => router.history.back()} />
  }

  if (isLoading) {
    return (
      <main className="p-margin-mobile min-h-screen">
        <p className="font-body-md text-on-surface-variant text-center">
          코스를 불러오는 중이에요...
        </p>
      </main>
    )
  }

  if (isError || !course) {
    return (
      <main className="p-margin-mobile min-h-screen">
        <EmptyState icon={<MapPin className="size-6" />} title="코스를 찾을 수 없어요" />
      </main>
    )
  }

  const stopsByDay = Array.from(
    course.stops.reduce((groups, stop) => {
      const dayStops = groups.get(stop.dayNumber) ?? []
      dayStops.push(stop)
      groups.set(stop.dayNumber, dayStops)
      return groups
    }, new Map<number, CourseDetailStop[]>()),
  ).sort(([a], [b]) => a - b)

  return (
    <div className="font-body-md text-body-md min-h-screen pb-32">
      <CourseHeader
        onBack={() => router.history.back()}
        liked={course.liked}
        likeDisabled={course.owner || course.visibility !== 'PUBLIC' || toggleLike.isPending}
        onLike={() => toggleLike.mutate(!course.liked)}
        onShare={() => {
          if (navigator.share) {
            void navigator.share({ title: course.title, url: window.location.href })
          } else {
            void navigator.clipboard.writeText(window.location.href)
          }
        }}
      />

      <main className="pt-14">
        <section className="bg-surface-container-high relative h-[210px] w-full overflow-hidden">
          {course.stops[0] ? (
            <img
              src={
                course.stops[0].thumbnailUrl ??
                `https://picsum.photos/seed/course-${course.courseId.toString()}/720/420`
              }
              alt={course.title}
              className="size-full object-cover"
            />
          ) : (
            <MapPin className="text-primary/40 absolute inset-0 m-auto size-12" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </section>

        <div className="px-margin-mobile relative z-10 -mt-6">
          <div className="glass-effect p-md rounded-lg shadow-xl">
            <div className="mb-xs flex items-start justify-between">
              <div className="min-w-0 pr-3">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 break-keep">
                  {course.title}
                </h2>
                <p className="text-body-sm text-on-surface-variant flex flex-wrap items-center gap-1.5">
                  {course.region ?? '지역 미정'}
                  <span aria-hidden>·</span>
                  {formatTripLength(course.startDate, course.endDate, course.tripDays)}
                  <span aria-hidden>·</span>
                  {formatDurationMinutes(course.totalDurationMinutes)}
                </p>
              </div>
              <div className="font-label-md text-label-md bg-secondary-container px-xs text-on-secondary-fixed shrink-0 rounded-full py-1">
                {formatDistanceMeters(course.totalDistanceM)}
              </div>
            </div>

            <div className="border-outline-variant/30 mt-4 flex items-center justify-between border-t pt-3">
              <Link
                to="/travelers/$travelerId"
                params={{ travelerId: course.authorId.toString() }}
                className="flex min-w-0 items-center gap-2"
              >
                <div className="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-full">
                  <UserRound className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{course.authorName}</p>
                  <p className="text-on-surface-variant truncate text-xs">
                    Lv.{course.authorLevel}
                    {course.authorTitle ? ` · ${course.authorTitle}` : ''}
                  </p>
                </div>
              </Link>
              <div className="text-on-surface-variant flex shrink-0 items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <Heart className="size-3.5" />
                  {course.likeCount}
                </span>
                <span className="flex items-center gap-1">
                  <Copy className="size-3.5" />
                  {course.copyCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {(course.description ||
          course.soloImpression ||
          course.paceType ||
          course.tags.length > 0) && (
          <section className="mt-lg px-margin-mobile space-y-4">
            {course.copiedFromCourseId && (
              <Link
                to="/course/$courseId"
                params={{ courseId: course.copiedFromCourseId.toString() }}
                className="bg-surface-container-low text-on-surface-variant block rounded-lg px-4 py-3 text-sm"
              >
                <Copy className="mr-2 inline size-4" />
                <strong className="text-on-surface">{course.copiedFromCourseTitle}</strong>에서
                시작한 일정이에요.
              </Link>
            )}
            {course.description && (
              <p className="text-on-surface-variant leading-relaxed break-keep whitespace-pre-wrap">
                {course.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {soloImpressionLabel(course.soloImpression) && (
                <span className="bg-primary/10 text-primary rounded-md px-3 py-2 text-sm font-semibold">
                  {soloImpressionLabel(course.soloImpression)}
                </span>
              )}
              {paceLabel(course.paceType) && (
                <span className="bg-secondary-container text-on-secondary-container rounded-md px-3 py-2 text-sm font-semibold">
                  {paceLabel(course.paceType)}
                </span>
              )}
              {course.safetyPriority && (
                <span className="rounded-md bg-[#d1fadf] px-3 py-2 text-sm font-semibold text-[#027a48]">
                  안심경로 포함
                </span>
              )}
            </div>
            {course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag.tagId}
                    className={`rounded-full border px-3 py-1.5 text-xs ${tag.category === 'CAUTION' ? 'border-[#dc765f]/40 bg-[#fff3ef] text-[#a43d2b]' : 'border-outline-variant text-on-surface-variant bg-white'}`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            {course.authorComment && (
              <blockquote className="border-primary text-on-surface-variant border-l-2 py-1 pl-4 text-sm italic">
                “{course.authorComment}”
              </blockquote>
            )}
          </section>
        )}

        {course.owner && (
          <section className="mt-lg px-margin-mobile">
            <div className="bg-surface-container-low flex items-center justify-between gap-3 rounded-lg p-4">
              <div>
                <p className="font-bold">
                  {course.visibility === 'PUBLIC' ? '여행자들에게 공개 중' : '나만 볼 수 있는 코스'}
                </p>
                <p className="text-on-surface-variant text-xs">
                  {course.visibility === 'PUBLIC'
                    ? '공개 정보는 언제든 수정할 수 있어요.'
                    : '혼행 경험을 더하면 코스를 공개할 수 있어요.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPublishOpen(true)}
                className="border-primary text-primary flex h-10 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold"
              >
                <Globe2 className="size-4" />{' '}
                {course.visibility === 'PUBLIC' ? '정보 수정' : '공개하기'}
              </button>
            </div>
            {course.visibility === 'PUBLIC' && (
              <button
                type="button"
                disabled={unpublish.isPending}
                onClick={() => unpublish.mutate()}
                className="text-on-surface-variant mt-2 w-full py-2 text-xs underline underline-offset-4"
              >
                공개를 중단하고 나만 보기
              </button>
            )}
          </section>
        )}

        {overviewStops.length > 0 && (
          <section className="mt-lg px-margin-mobile">
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-md">
              코스 한눈에 보기
            </h3>
            <div className="h-[220px] w-full overflow-hidden rounded-xl">
              <CourseOverviewMap stops={overviewStops} />
            </div>
          </section>
        )}

        <section className="mt-lg px-margin-mobile">
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-md">
            일정 타임라인
          </h3>
          <div className="space-y-2">
            {stopsByDay.map(([dayNumber, dayStops]) => (
              <section key={dayNumber}>
                <div className="text-primary mb-3 flex items-center gap-2 font-bold">
                  <span className="bg-primary text-on-primary rounded-md px-2.5 py-1 text-xs">
                    {dayNumber}일차
                  </span>
                  {formatCourseDayDate(course.startDate, dayNumber)}
                </div>
                <Timeline>
                  {dayStops.map((stop, index) => (
                    <TimelineItem
                      key={stop.courseStopId}
                      index={index + 1}
                      isLast={index === dayStops.length - 1}
                      title={stop.name}
                      imageUrl={
                        stop.thumbnailUrl ??
                        `https://picsum.photos/seed/place-${stop.placeId.toString()}/240/240`
                      }
                      imageAlt={stop.name}
                      {...(stop.address && { subtitle: stop.address })}
                      {...(stop.memo && { note: stop.memo })}
                      {...(stop.stayDurationMinutes !== undefined && {
                        durationLabel: `${formatDurationMinutes(stop.stayDurationMinutes)} 체류 예정`,
                      })}
                    />
                  ))}
                </Timeline>
              </section>
            ))}
          </div>
        </section>

        {course.visibility === 'PUBLIC' && (
          <div className="px-margin-mobile">
            <CourseReviewsSection courseId={course.courseId} owner={course.owner} />
          </div>
        )}
      </main>

      <CourseBottomActionBar>
        {course.owner ? (
          <>
            <Link
              to="/course/$courseId/edit"
              params={{ courseId }}
              className="font-headline-lg-mobile text-headline-lg-mobile hover:bg-primary-fixed border-primary bg-surface text-primary flex h-12 flex-1 items-center justify-center rounded-xl border transition-colors active:scale-95"
            >
              편집하기
            </Link>
            <Link
              to="/course/$courseId/map"
              params={{ courseId }}
              className="font-headline-lg-mobile text-headline-lg-mobile gap-xs bg-primary text-on-primary flex h-12 flex-[1.5] items-center justify-center rounded-xl shadow-lg active:scale-95"
            >
              <Navigation className="size-5" />
              코스 한눈에 보기
            </Link>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={toggleLike.isPending}
              onClick={() => toggleLike.mutate(!course.liked)}
              className="border-primary text-primary grid size-12 shrink-0 place-items-center rounded-xl border"
              aria-label={course.liked ? '좋아요 취소' : '좋아요'}
            >
              <Heart className={`size-5 ${course.liked ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              disabled={copyCourse.isPending}
              onClick={() =>
                copyCourse.mutate(undefined, {
                  onSuccess: (copied) =>
                    void router.navigate({
                      to: '/course/$courseId/edit',
                      params: { courseId: copied.courseId.toString() },
                    }),
                })
              }
              className="font-headline-lg-mobile text-headline-lg-mobile bg-primary text-on-primary flex h-12 flex-1 items-center justify-center gap-2 rounded-xl font-bold shadow-lg disabled:opacity-50"
            >
              <Copy className="size-5" />
              {copyCourse.isPending ? '가져오는 중...' : '내 일정으로 가져오기'}
            </button>
          </>
        )}
      </CourseBottomActionBar>

      <PublishCourseDialog course={course} open={publishOpen} onOpenChange={setPublishOpen} />
    </div>
  )
}

function DemoCourseDetailPage({ course, onBack }: { course: CourseDetail; onBack: () => void }) {
  const editedStops = useCourseEditStore((state) => state.demoStopsByCourseId[course.id])
  const stops: DemoCourseStop[] = editedStops
    ? editedStops.flatMap((stop) =>
        stop.latitude !== undefined && stop.longitude !== undefined
          ? [
              {
                id: stop.id,
                time: stop.time ?? '시간 미정',
                durationLabel: stop.durationLabel,
                title: stop.title,
                subtitle: stop.subtitle ?? '',
                latitude: stop.latitude,
                longitude: stop.longitude,
                imageUrl: stop.imageUrl,
                imageAlt: stop.imageAlt,
                ...(stop.badges !== undefined && { badges: stop.badges }),
              },
            ]
          : [],
      )
    : course.stops
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
            {stops.map((stop, index) => {
              const nextStop = stops[index + 1]
              return (
                <TimelineItem
                  key={stop.id}
                  index={index + 1}
                  isLast={index === stops.length - 1}
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
                            onClick={() => setSelectedLeg({ origin: stop, destination: nextStop })}
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

      <CourseBottomActionBar>
        <Link
          to="/course/$courseId/edit"
          params={{ courseId: course.id }}
          className="font-headline-lg-mobile text-headline-lg-mobile hover:bg-primary-fixed gap-xs border-primary bg-surface text-primary flex h-12 flex-1 items-center justify-center rounded-xl border transition-colors active:scale-95"
        >
          편집하기
        </Link>
        <Link
          to="/course/$courseId/map"
          params={{ courseId: course.id }}
          className="font-headline-lg-mobile text-headline-lg-mobile gap-xs bg-primary text-on-primary flex h-12 flex-[1.5] items-center justify-center rounded-xl shadow-lg transition-all hover:brightness-110 active:scale-95"
        >
          <Navigation className="size-5" />
          코스 한눈에 보기
        </Link>
      </CourseBottomActionBar>

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

function CourseBottomActionBar({ children }: { children: ReactNode }) {
  return createPortal(
    <div className="gap-md border-outline-variant bg-surface/90 px-margin-mobile py-md fixed bottom-0 left-1/2 z-40 flex w-full max-w-[430px] -translate-x-1/2 border-t backdrop-blur-md">
      {children}
    </div>,
    document.body,
  )
}

function CourseHeader({
  onBack,
  liked = false,
  likeDisabled = false,
  onLike,
  onShare,
}: {
  onBack: () => void
  liked?: boolean
  likeDisabled?: boolean
  onLike?: () => void
  onShare?: () => void
}) {
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
          onClick={onShare}
          className="hover:bg-surface-variant flex size-10 items-center justify-center rounded-full transition-colors active:scale-95"
        >
          <Share2 className="text-primary size-5" />
        </button>
        <button
          type="button"
          aria-label={liked ? '좋아요 취소' : '좋아요'}
          disabled={likeDisabled}
          onClick={onLike}
          className="hover:bg-surface-variant flex size-10 items-center justify-center rounded-full transition-colors active:scale-95"
        >
          <Heart className={`text-primary size-5 ${liked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </header>
  )
}
