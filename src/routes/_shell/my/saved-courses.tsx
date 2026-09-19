import { createFileRoute } from '@tanstack/react-router'
import { Route as RouteIcon } from 'lucide-react'
import { useDeleteCourse, useMyCourses } from '@/features/course'
import { SavedCourseGrid } from '@/features/saved'
import { EmptyState } from '@/shared/components/EmptyState'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/my/saved-courses')({
  component: SavedCoursesPage,
})

function SavedCoursesPage() {
  const { data, isLoading } = useMyCourses()
  const deleteCourse = useDeleteCourse()
  const courses = data?.content ?? []

  return (
    <div className="bg-surface min-h-screen pb-24">
      <TopAppBar title="저장한 코스" showBack />
      <main className="px-margin-mobile pt-4">
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">
          나만의 도보 코스와 혼행 여정 모음을 둘러보세요.
        </p>
        {isLoading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            코스를 불러오는 중이에요...
          </p>
        ) : courses.length === 0 ? (
          <EmptyState icon={<RouteIcon className="size-6" />} title="아직 만든 코스가 없어요" />
        ) : (
          <SavedCourseGrid
            courses={courses}
            deletingCourseId={deleteCourse.variables ?? null}
            onDelete={(course) => {
              if (!window.confirm(`'${course.title}' 코스를 삭제할까요?`)) return
              deleteCourse.mutate(course.courseId)
            }}
          />
        )}
        {deleteCourse.isError && (
          <p className="text-error mt-3 text-center text-xs">코스를 삭제하지 못했어요.</p>
        )}
      </main>
    </div>
  )
}
