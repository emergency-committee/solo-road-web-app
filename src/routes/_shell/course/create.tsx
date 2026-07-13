import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CourseCreateForm } from '@/features/course'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/course/create')({
  component: CourseCreatePage,
})

function CourseCreatePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-surface min-h-screen">
      <TopAppBar title="코스 생성" showBack />
      <main className="px-margin-mobile mx-auto max-w-[28rem] pt-4 pb-16">
        <CourseCreateForm
          onSubmit={() =>
            navigate({ to: '/course/$courseId', params: { courseId: 'seongsu-art-walk' } })
          }
        />
      </main>
    </div>
  )
}
