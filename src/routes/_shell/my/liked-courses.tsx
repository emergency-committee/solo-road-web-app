import { createFileRoute } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { PublicCourseCard, useLikedCourses } from '@/features/course'
import { EmptyState } from '@/shared/components/EmptyState'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/my/liked-courses')({
  component: LikedCoursesPage,
})

function LikedCoursesPage() {
  const { data, isLoading, isError } = useLikedCourses()
  const courses = data?.content ?? []

  return (
    <div className="bg-surface min-h-screen pb-24">
      <TopAppBar title="좋아요한 코스" showBack />
      <main className="px-margin-mobile pt-4">
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">
          다른 여행자의 공개 코스 중 마음에 담아둔 일정을 모아볼 수 있어요.
        </p>

        {isLoading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            좋아요한 코스를 불러오는 중이에요...
          </p>
        ) : isError ? (
          <p className="font-body-sm text-body-sm text-error text-center">
            좋아요한 코스를 불러오지 못했어요.
          </p>
        ) : courses.length === 0 ? (
          <EmptyState icon={<Heart className="size-6" />} title="아직 좋아요한 코스가 없어요" />
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <PublicCourseCard key={course.courseId} course={course} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
