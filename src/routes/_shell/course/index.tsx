import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, PlusCircle, Route as RouteIcon } from 'lucide-react'
import { useCourseRecommendations, useMyCourses } from '@/features/course'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { EmptyState } from '@/shared/components/EmptyState'
import { formatDurationMinutes } from '@/shared/lib/format'

export const Route = createFileRoute('/_shell/course/')({
  component: CoursePage,
})

function CoursePage() {
  const recommendationsQuery = useCourseRecommendations()
  const myCoursesQuery = useMyCourses()

  const recommendations = recommendationsQuery.data?.content ?? []
  const myCourses = myCoursesQuery.data?.content ?? []

  return (
    <main className="min-h-screen space-y-xl px-margin-mobile pt-lg mx-auto max-w-4xl pb-8">
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
                imageUrl={course.thumbnailUrl ?? `https://picsum.photos/seed/course-${course.courseId.toString()}/480/270`}
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
        <SectionHeader title="내가 만든 코스" />
        {myCourses.length === 0 ? (
          <EmptyState
            icon={<RouteIcon className="size-6" />}
            title="아직 만든 코스가 없어요"
            description="새 코스를 만들어 나만의 여정을 시작해보세요."
          />
        ) : (
          <div className="gap-md grid grid-cols-1 md:grid-cols-2">
            {myCourses.map((course) => (
              <Link
                key={course.courseId}
                to="/course/$courseId"
                params={{ courseId: course.courseId.toString() }}
                className="group border-outline-variant/20 hover:bg-surface-container-high bg-surface-container flex overflow-hidden rounded-xl border transition-colors"
              >
                <div className="h-full w-24 shrink-0">
                  <img
                    src={`https://picsum.photos/seed/course-${course.courseId.toString()}/240/240`}
                    alt={course.title}
                    className="size-full object-cover"
                  />
                </div>
                <div className="p-md flex flex-1 flex-col justify-between">
                  <div>
                    <h6 className="font-label-md text-label-md mb-xs text-primary tracking-widest uppercase">
                      내 일정
                    </h6>
                    <h5 className="font-body-md text-body-md text-on-surface font-bold">
                      {course.title}
                    </h5>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {course.region ?? '지역 정보 없음'}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <ChevronRight className="text-on-surface-variant group-hover:text-primary size-5 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
