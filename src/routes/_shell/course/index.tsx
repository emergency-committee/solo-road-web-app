import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, PlusCircle } from 'lucide-react'
import { mockRecommendedCourses, mockSavedCourseRows } from '@/features/course'
import { PlaceCard } from '@/shared/components/PlaceCard'
import { SectionHeader } from '@/shared/components/SectionHeader'

export const Route = createFileRoute('/_shell/course/')({
  component: CoursePage,
})

function CoursePage() {
  return (
    <main className="space-y-xl px-margin-mobile pt-lg mx-auto max-w-4xl pb-8">
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
        <div className="no-scrollbar -mx-margin-mobile gap-md px-margin-mobile pb-xs flex overflow-x-auto">
          {mockRecommendedCourses.map((course) => (
            <PlaceCard
              key={course.id}
              imageUrl={course.imageUrl}
              imageAlt={course.imageAlt}
              title={course.title}
              subtitle={`${course.location} • ${course.durationLabel}`}
              badges={course.badges}
              saved={course.saved}
              onToggleSave={() => {}}
              className="w-70 shrink-0"
            />
          ))}
        </div>
      </section>

      <section className="space-y-md">
        <SectionHeader title="저장된 코스" />
        <div className="gap-md grid grid-cols-1 md:grid-cols-2">
          {mockSavedCourseRows.map((course) => (
            <Link
              key={course.id}
              to="/course/$courseId"
              params={{ courseId: 'seongsu-art-walk' }}
              className="group border-outline-variant/20 hover:bg-surface-container-high bg-surface-container flex overflow-hidden rounded-xl border transition-colors"
            >
              <div className="h-full w-24 shrink-0">
                <img
                  src={course.imageUrl}
                  alt={course.imageAlt}
                  className="size-full object-cover"
                />
              </div>
              <div className="p-md flex flex-1 flex-col justify-between">
                <div>
                  <h6 className="font-label-md text-label-md mb-xs text-primary tracking-widest uppercase">
                    My Plan
                  </h6>
                  <h5 className="font-body-md text-body-md text-on-surface font-bold">
                    {course.title}
                  </h5>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {course.location}
                  </p>
                </div>
                <div className="flex justify-end">
                  <ChevronRight className="text-on-surface-variant group-hover:text-primary size-5 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
