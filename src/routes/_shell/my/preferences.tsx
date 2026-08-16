import { createFileRoute, useRouter } from '@tanstack/react-router'
import {
  PreferenceSettingsForm,
  type PreferenceSettingsSubmitData,
} from '@/shared/components/preference-settings-form/PreferenceSettingsForm'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'
import { useUpdateInterests } from '@/features/profile'

export const Route = createFileRoute('/_shell/my/preferences')({
  component: PreferencesPage,
})

function PreferencesPage() {
  const router = useRouter()
  const updateInterests = useUpdateInterests()

  function handleSubmit(data: PreferenceSettingsSubmitData) {
    updateInterests.mutate(
      {
        preferredMood: data.mood[0] ?? '조용한',
        foodStyle: data.food.join(','),
        soloPreferenceScore: data.soloPriority ? 90 : 50,
      },
      { onSuccess: () => router.history.back() },
    )
  }

  return (
    <div className="bg-surface min-h-screen pb-24">
      <TopAppBar title="여행 취향 설정" showBack />
      <main className="px-margin-mobile pt-lg mx-auto max-w-2xl">
        <PreferenceSettingsForm mode="settings" onSubmit={handleSubmit} />
      </main>
    </div>
  )
}
