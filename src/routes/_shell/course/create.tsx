import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  CourseCreateForm,
  type CourseCreateFormData,
  type ManualCourseStopInput,
  useCreateCourse,
  useGenerateCourse,
} from '@/features/course'
import { useCreatePlace } from '@/features/place'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/course/create')({
  component: CourseCreatePage,
})

function CourseCreatePage() {
  const navigate = useNavigate()
  const generateCourse = useGenerateCourse()
  const createCourse = useCreateCourse()
  const createPlace = useCreatePlace()
  const submitting = generateCourse.isPending || createCourse.isPending || createPlace.isPending
  const isError = generateCourse.isError || createCourse.isError || createPlace.isError

  async function handleSubmit(data: CourseCreateFormData) {
    if (data.creationMode === 'manual') {
      const manualStops = data.stops ?? []
      const createdPlaces = await Promise.all(
        manualStops.map((stop) =>
          createPlace.mutateAsync({
            name: stop.name,
            type: stop.type,
            address: stop.address,
            latitude: stop.latitude,
            longitude: stop.longitude,
            summary: defaultPlaceSummary(stop),
            soloFriendlyBadge: false,
            visibility: stop.visibility ?? 'PRIVATE',
          }),
        ),
      )
      createCourse.mutate(
        {
          title: data.title ?? `${data.region} 여행 코스`,
          region: data.region,
          startDate: data.startDate,
          endDate: data.endDate,
          ...(data.preferredMood && { preferredMood: data.preferredMood }),
          safetyPriority: data.safetyPriority,
          stops: manualStops.map((stop, index) => ({
            placeId: createdPlaces[index]?.placeId ?? 0,
            stopOrder: index,
            dayNumber: stop.dayNumber,
          })),
        },
        {
          onSuccess: (result) => {
            void navigate({
              to: '/course/$courseId',
              params: { courseId: result.courseId.toString() },
            })
          },
        },
      )
      return
    }

    generateCourse.mutate(
      {
        region: data.region,
        startDate: data.startDate,
        endDate: data.endDate,
        preferredMood: data.preferredMood,
        safetyPriority: data.safetyPriority,
      },
      {
        onSuccess: (result) => {
          void navigate({
            to: '/course/$courseId',
            params: { courseId: result.courseId.toString() },
          })
        },
      },
    )
  }

  return (
    <div className="bg-surface min-h-screen">
      <TopAppBar title="코스 생성" showBack />
      <main className="px-margin-mobile mx-auto max-w-[28rem] pt-4 pb-16">
        {isError && (
          <p className="text-error font-label-md mb-md">
            코스를 생성하지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}
        <CourseCreateForm onSubmit={handleSubmit} submitting={submitting} />
      </main>
    </div>
  )
}

function defaultPlaceSummary(stop: ManualCourseStopInput) {
  if (stop.type === 'RESTAURANT') return '코스에 추가한 식당'
  if (stop.type === 'CAFE') return '코스에 추가한 카페'
  if (stop.type === 'STAY') return '코스에 추가한 숙소'
  if (stop.type === 'NATURE') return '코스에 추가한 자연/산책 장소'
  if (stop.type === 'CULTURE') return '코스에 추가한 문화 공간'
  return '코스에 추가한 여행 장소'
}
