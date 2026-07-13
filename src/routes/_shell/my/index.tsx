import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Bookmark,
  MessageSquare,
  Route as RouteIcon,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import {
  mockUserProfile,
  ProfileHeader,
  ProfileMenuList,
  ProfileStatsGrid,
} from '@/features/profile'

export const Route = createFileRoute('/_shell/my/')({
  component: MyPage,
})

function MyPage() {
  const navigate = useNavigate()

  return (
    <main className="px-margin-mobile pt-lg mx-auto max-w-2xl pb-8">
      <h2 className="font-headline-xl text-headline-xl text-on-surface mb-xl mt-lg">마이페이지</h2>

      <ProfileHeader
        name={mockUserProfile.name}
        avatarUrl={mockUserProfile.avatarUrl}
        avatarAlt={mockUserProfile.avatarAlt}
      />
      <ProfileStatsGrid stats={mockUserProfile.stats} />

      <ProfileMenuList
        items={[
          {
            icon: <Bookmark className="size-5" />,
            label: 'Saved Places',
            onClick: () => navigate({ to: '/my/saved-places' }),
          },
          {
            icon: <RouteIcon className="size-5" />,
            label: 'Saved Courses',
            onClick: () => navigate({ to: '/my/saved-courses' }),
          },
          {
            icon: <MessageSquare className="size-5" />,
            label: 'My Reviews',
            onClick: () => navigate({ to: '/my/reviews' }),
          },
        ]}
      />

      <ProfileMenuList
        title="SETTINGS"
        items={[
          {
            icon: <SlidersHorizontal className="size-5" />,
            label: 'Travel Preference Settings',
            onClick: () => navigate({ to: '/my/preferences' }),
          },
          {
            icon: <ShieldCheck className="size-5" />,
            label: 'Permissions',
            onClick: () => navigate({ to: '/my/permissions' }),
          },
        ]}
      />

      <div className="mt-xl flex justify-center">
        <button
          type="button"
          className="font-label-md text-label-md hover:bg-error-container/20 border-error-container px-lg py-sm text-error rounded-full border transition-colors"
        >
          Sign Out
        </button>
      </div>
    </main>
  )
}
