import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useCourseRecommendations } from '@/features/course'
import { EmptyState } from '@/shared/components/EmptyState'
import { formatDurationMinutes } from '@/shared/lib/format'

export const Route = createFileRoute('/_shell/course/recommendations')({
  component: CourseRecommendationsPage,
})

function CourseRecommendationsPage() {
  const navigate = useNavigate()
  const recommendationsQuery = useCourseRecommendations({ size: 30 })
  const recommendations = recommendationsQuery.data?.content ?? []

  return (
    <main className="px-margin-mobile mx-auto min-h-screen max-w-2xl pb-10">
      <header className="py-md flex items-center gap-3">
        <button
          type="button"
          aria-label="이전 화면"
          onClick={() => void navigate({ to: '/course' })}
          className="hover:bg-surface-container grid size-10 place-items-center rounded-full"
        >
          <ArrowLeft className="text-primary size-6" />
        </button>
        <div>
          <h1 className="text-on-surface text-xl font-bold">AI 추천 코스</h1>
          <p className="text-on-surface-variant text-sm">취향에 맞춰 골라본 코스예요.</p>
        </div>
      </header>

      {recommendationsQuery.isLoading ? (
        <div className="text-on-surface-variant py-16 text-center text-sm">
          추천 코스를 불러오는 중이에요...
        </div>
      ) : recommendations.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="size-6" />}
          title="아직 추천할 코스가 없어요"
          description="관심사를 더 알려주시면 추천을 채워드릴게요."
        />
      ) : (
        <div className="space-y-3">
          {recommendations.map((course) => (
            <Link
              key={course.courseId}
              to="/course/$courseId"
              params={{ courseId: course.courseId.toString() }}
              className="border-outline-variant/30 bg-surface flex items-center gap-3 rounded-lg border p-4 shadow-sm transition-transform active:scale-[0.99]"
            >
              <div className="min-w-0 flex-1">
                <span className="bg-primary/10 text-primary mb-2 inline-block rounded-md px-2 py-1 text-xs font-bold">
                  추천 코스
                </span>
                <h4 className="text-on-surface line-clamp-2 text-base leading-snug font-bold break-keep">
                  {course.title}
                </h4>
                <p className="text-on-surface-variant mt-2 text-xs">
                  {course.region ?? '지역 정보 없음'}
                  {course.totalDurationMinutes != null &&
                    ` · ${formatDurationMinutes(course.totalDurationMinutes)}`}
                </p>
                {course.badges.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {course.badges.slice(0, 3).map((label) => (
                      <span
                        key={label}
                        className="bg-surface-container text-on-surface-variant rounded-md px-2 py-1 text-xs"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ChevronRight className="text-on-surface-variant size-5 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
