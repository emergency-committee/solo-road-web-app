import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CourseCreateForm, type CourseCreateFormData, useGenerateCourse } from '@/features/course'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/course/create')({
  component: CourseCreatePage,
})

function CourseCreatePage() {
  const navigate = useNavigate()
  const generateCourse = useGenerateCourse()

  function handleSubmit(data: CourseCreateFormData) {
    generateCourse.mutate(data, {
      onSuccess: (result) => {
        void navigate({
          to: '/course/$courseId',
          params: { courseId: result.courseId.toString() },
        })
      },
    })
  }

  return (
    <div className="bg-surface min-h-screen">
      <TopAppBar title="코스 생성" showBack />
      <main className="px-margin-mobile mx-auto max-w-[28rem] pt-4 pb-16">
        {generateCourse.isError && (
          <p className="text-error font-label-md mb-md">
            코스를 생성하지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}
        <CourseCreateForm onSubmit={handleSubmit} submitting={generateCourse.isPending} />
      </main>
    </div>
  )
}
