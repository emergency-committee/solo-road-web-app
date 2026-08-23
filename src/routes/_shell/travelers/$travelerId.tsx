import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Copy, Heart, Map, Route as RouteIcon } from 'lucide-react'
import { useLayoutEffect, type ReactNode } from 'react'
import {
  PublicCourseCard,
  useTravelerProfile,
  useTravelerPublicCourses,
} from '@/features/course'
import { EmptyState } from '@/shared/components/EmptyState'

export const Route = createFileRoute('/_shell/travelers/$travelerId')({
  component: TravelerProfilePage,
})

function TravelerProfilePage() {
  const { travelerId } = Route.useParams()
  const id = Number(travelerId)
  const navigate = useNavigate()
  const profileQuery = useTravelerProfile(id)
  const coursesQuery = useTravelerPublicCourses(id)
  const profile = profileQuery.data
  const courses = coursesQuery.data?.content ?? []

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [travelerId])

  return (
    <main className="mx-auto min-h-screen max-w-2xl pb-10">
      <header className="px-margin-mobile py-md flex items-center gap-3">
        <button
          type="button"
          aria-label="이전 화면"
          onClick={() => void navigate({ to: '/my/ranking' })}
          className="hover:bg-surface-container grid size-10 place-items-center rounded-full"
        >
          <ArrowLeft className="text-primary size-6" />
        </button>
        <h1 className="text-xl font-bold">여행자 프로필</h1>
      </header>

      {profileQuery.isError ? (
        <div className="px-margin-mobile">
          <EmptyState icon={<Map className="size-6" />} title="여행자를 찾지 못했어요" />
        </div>
      ) : (
        <>
          <section className="bg-primary text-on-primary px-margin-mobile py-6">
            <div className="flex items-center gap-4">
              <img
                src={
                  profile?.profileImageUrl ??
                  `https://picsum.photos/seed/traveler-${travelerId}/160/160`
                }
                alt={`${profile?.nickname ?? '여행자'} 프로필`}
                className="size-20 rounded-full border-2 border-white/60 object-cover"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-2xl font-bold">{profile?.nickname ?? '여행자'}</h2>
                  {profile?.me && (
                    <span className="bg-on-primary text-primary rounded px-2 py-0.5 text-xs">나</span>
                  )}
                </div>
                <p className="mt-1 text-sm opacity-85">
                  Lv.{profile?.level ?? 1} {profile?.levelName ?? '여행의 첫발'}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {profile?.equippedTitleName ?? '혼행 기록을 쌓는 중'}
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 border-t border-white/20 pt-4 text-center">
              <ProfileStat label="공개 코스" value={profile?.publicCourseCount ?? 0} icon={<Map />} />
              <ProfileStat label="받은 좋아요" value={profile?.receivedLikeCount ?? 0} icon={<Heart />} />
              <ProfileStat label="담긴 횟수" value={profile?.receivedCopyCount ?? 0} icon={<Copy />} />
            </div>
          </section>

          <section className="px-margin-mobile pt-6">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">공개한 코스</h3>
                <p className="text-on-surface-variant mt-1 text-sm">
                  이 여행자가 나눈 혼행 코스예요.
                </p>
              </div>
              <span className="text-primary text-sm font-bold">{courses.length}개</span>
            </div>

            {coursesQuery.isLoading ? (
              <p className="text-on-surface-variant py-14 text-center text-sm">
                공개 코스를 불러오고 있어요...
              </p>
            ) : coursesQuery.isError ? (
              <EmptyState icon={<RouteIcon className="size-6" />} title="코스를 불러오지 못했어요" />
            ) : courses.length === 0 ? (
              <EmptyState icon={<RouteIcon className="size-6" />} title="공개한 코스가 없어요" />
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <PublicCourseCard key={course.courseId} course={course} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}

function ProfileStat({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="border-r border-white/20 px-1 last:border-r-0">
      <div className="mx-auto mb-1 size-4 [&>svg]:size-4">{icon}</div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[11px] opacity-80">{label}</p>
    </div>
  )
}
