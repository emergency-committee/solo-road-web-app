import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarDays, ChevronRight, Flame, PlusCircle, Route as RouteIcon } from 'lucide-react'
import {
  PublicCourseCard,
  formatCourseDateRange,
  mockSavedCourseRows,
  useCourseRecommendations,
  useMyCourses,
  usePublicCourses,
} from '@/features/course'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { formatDurationMinutes } from '@/shared/lib/format'

export const Route = createFileRoute('/_shell/course/')({
  component: CoursePage,
})

function CoursePage() {
  const recommendationsQuery = useCourseRecommendations()
  const myCoursesQuery = useMyCourses()
  const hotCoursesQuery = usePublicCourses({ sort: 'HOT', size: 2 })

  const recommendations = recommendationsQuery.data?.content ?? []
  const myCourses = myCoursesQuery.data?.content ?? []
  const hotCourses = hotCoursesQuery.data?.content ?? []

  return (
    <main className="space-y-xl px-margin-mobile pt-lg mx-auto min-h-screen max-w-4xl pb-8">
      <section className="space-y-sm">
        <h2 className="font-headline-xl text-headline-xl text-on-surface">코스 메인</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          나만을 위한 특별한 여정을 계획해보세요.
        </p>
      </section>

      <Link
        to="/course/create"
        className="group bg-primary px-lg text-on-primary flex h-16 items-center justify-between rounded-xl shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
      >
        <div className="gap-md flex items-center">
          <PlusCircle className="size-6" fill="currentColor" />
          <span className="font-headline-lg-mobile text-headline-lg-mobile">새 코스 만들기</span>
        </div>
        <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
      </Link>

      <section className="space-y-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="size-5 text-[#d94b35]" />
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
              지금 많이 담는 코스
            </h3>
          </div>
          <Link to="/course/discover" className="font-label-md text-label-md text-primary">
            다른 코스 보기
          </Link>
        </div>
        {hotCourses.length > 0 ? (
          <div className="space-y-2">
            {hotCourses.map((course, index) => (
              <PublicCourseCard
                key={course.courseId}
                course={course}
                rank={index + 1}
                variant="compact"
              />
            ))}
          </div>
        ) : (
          <Link
            to="/course/discover"
            className="border-outline-variant/40 bg-surface-container-low text-on-surface-variant flex min-h-24 items-center justify-center rounded-lg border border-dashed px-5 text-center text-sm break-keep"
          >
            {hotCoursesQuery.isLoading
              ? '여행자들의 코스를 모아보고 있어요...'
              : '공개된 코스를 둘러보거나 내 코스를 먼저 공유해 보세요.'}
          </Link>
        )}
      </section>

      <section className="space-y-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            내 코스
          </h3>
          {myCourses.length > 2 && (
            <Link to="/my/saved-courses" className="font-label-md text-label-md text-primary">
              전체보기
            </Link>
          )}
        </div>
        {myCourses.length === 0 ? (
          <Link
            to="/course/create"
            className="border-outline-variant/40 bg-surface-container-low flex min-h-22 items-center gap-3 rounded-lg border border-dashed px-4"
          >
            <div className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-full">
              <RouteIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold">아직 만든 코스가 없어요</p>
              <p className="text-on-surface-variant mt-0.5 text-xs">
                첫 번째 나만의 일정을 만들어보세요.
              </p>
            </div>
            <ChevronRight className="text-on-surface-variant ml-auto size-5 shrink-0" />
          </Link>
        ) : (
          <div className="space-y-2">
            {myCourses.slice(0, 2).map((course) => (
              <Link
                key={course.courseId}
                to="/course/$courseId"
                params={{ courseId: course.courseId.toString() }}
                className="border-outline-variant/30 bg-surface flex min-h-20 items-center gap-3 rounded-lg border p-3 shadow-sm transition-transform active:scale-[0.99]"
              >
                <img
                  src={`https://picsum.photos/seed/course-${course.courseId.toString()}/160/160`}
                  alt={course.title}
                  className="size-14 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-bold">{course.title}</p>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${course.visibility === 'PUBLIC' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'}`}
                    >
                      {course.visibility === 'PUBLIC' ? '공개' : '나만 보기'}
                    </span>
                  </div>
                  <p className="text-on-surface-variant mt-1 flex items-center gap-1 text-xs">
                    <CalendarDays className="size-3.5 shrink-0" />
                    <span className="truncate">
                      {formatCourseDateRange(course.startDate, course.endDate)}
                    </span>
                  </p>
                  <p className="text-outline mt-0.5 truncate text-[11px]">
                    {course.region ?? '지역 정보 없음'} ·{' '}
                    {course.totalDistanceM > 0
                      ? `${(course.totalDistanceM / 1000).toFixed(1)}km`
                      : '거리 계산 전'}
                  </p>
                </div>
                <ChevronRight className="text-on-surface-variant size-5 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-md">
        <SectionHeader title="추천 코스" actionLabel="전체보기" />
        {recommendations.length === 0 ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {recommendationsQuery.isLoading
              ? '추천 코스를 불러오는 중이에요...'
              : '아직 추천할 코스가 없어요.'}
          </p>
        ) : (
          <div className="no-scrollbar -mx-margin-mobile gap-md px-margin-mobile pb-xs flex overflow-x-auto">
            {recommendations.map((course) => (
              <PlaceCard
                key={course.courseId}
                imageUrl={
                  course.thumbnailUrl ??
                  `https://picsum.photos/seed/course-${course.courseId.toString()}/480/270`
                }
                imageAlt={course.title}
                title={course.title}
                subtitle={`${course.region ?? '지역 정보 없음'} • ${formatDurationMinutes(course.totalDurationMinutes)}`}
                badges={course.badges.map((label) => ({ label, tone: 'primary' as const }))}
                className="w-70 shrink-0"
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-md">
        <SectionHeader title="안심경로 검증 코스" />
        <div className="gap-md grid grid-cols-1">
          {mockSavedCourseRows.map((course) => (
            <Link
              key={course.id}
              to="/course/$courseId"
              params={{ courseId: course.id }}
              className="group border-outline-variant/20 hover:bg-surface-container-high bg-surface-container flex min-h-28 overflow-hidden rounded-xl border transition-colors"
            >
              <div className="w-28 shrink-0">
                <img
                  src={course.imageUrl}
                  alt={course.imageAlt}
                  className="size-full object-cover"
                />
              </div>
              <div className="p-md min-w-0 flex-1">
                <h6 className="font-label-md text-label-md mb-xs text-primary tracking-widest uppercase">
                  Safety Demo
                </h6>
                <h5 className="font-body-md text-body-md text-on-surface font-bold break-keep">
                  {course.title}
                </h5>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 break-keep">
                  {course.location}
                </p>
              </div>
              <ChevronRight className="text-on-surface-variant group-hover:text-primary mr-md size-5 shrink-0 self-center transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
