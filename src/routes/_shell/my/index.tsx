import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Bookmark,
  Database,
  MessageSquare,
  Route as RouteIcon,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import { ProfileHeader, ProfileMenuList, ProfileStatsGrid } from '@/features/profile'
import { useLogout } from '@/features/auth'
import { useSessionStore } from '@/shared/auth/session-store'
import { useSavedPlaces } from '@/features/saved'
import { useMyReviews } from '@/features/review'

export const Route = createFileRoute('/_shell/my/')({
  component: MyPage,
})

function MyPage() {
  const navigate = useNavigate()
  const logout = useLogout()
  const user = useSessionStore((state) => state.user)
  const savedPlacesQuery = useSavedPlaces(0, 1)
  const myReviewsQuery = useMyReviews(0, 1)

  return (
    <main className="px-margin-mobile pt-lg mx-auto min-h-screen max-w-2xl pb-8">
      <h2 className="font-headline-xl text-headline-xl text-on-surface mb-xl mt-lg">마이페이지</h2>

      <ProfileHeader
        name={user?.nickname ?? '솔로더 여행자'}
        avatarUrl={user?.profileImageUrl ?? 'https://picsum.photos/seed/solo-road-profile/160/160'}
        avatarAlt="프로필 사진"
      />
      <ProfileStatsGrid
        stats={[
          { label: '저장한 장소', value: savedPlacesQuery.data?.totalElements ?? 0 },
          { label: '내 리뷰', value: myReviewsQuery.data?.totalElements ?? 0 },
        ]}
      />

      <ProfileMenuList
        items={[
          {
            icon: <Bookmark className="size-5" />,
            label: '저장한 장소',
            onClick: () => navigate({ to: '/my/saved-places' }),
          },
          {
            icon: <RouteIcon className="size-5" />,
            label: '저장한 코스',
            onClick: () => navigate({ to: '/my/saved-courses' }),
          },
          {
            icon: <MessageSquare className="size-5" />,
            label: '내 리뷰',
            onClick: () => navigate({ to: '/my/reviews' }),
          },
        ]}
      />

      <ProfileMenuList
        title="설정"
        items={[
          {
            icon: <SlidersHorizontal className="size-5" />,
            label: '여행 취향 설정',
            onClick: () => navigate({ to: '/my/preferences' }),
          },
          {
            icon: <ShieldCheck className="size-5" />,
            label: '권한 설정',
            onClick: () => navigate({ to: '/my/permissions' }),
          },
        ]}
      />

      <ProfileMenuList
        title="서비스 정보"
        items={[
          {
            icon: <Database className="size-5" />,
            label: '데이터 출처 및 이용 기준',
            onClick: () => navigate({ to: '/my/data-sources' }),
          },
        ]}
      />

      <div className="mt-xl flex justify-center">
        <button
          type="button"
          onClick={() => void logout()}
          className="font-label-md text-label-md hover:bg-error-container/20 border-error-container px-lg py-sm text-error rounded-full border transition-colors"
        >
          로그아웃
        </button>
      </div>
    </main>
  )
}
