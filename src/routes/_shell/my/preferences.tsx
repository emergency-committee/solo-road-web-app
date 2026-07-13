import { createFileRoute, useRouter } from '@tanstack/react-router'
import { PreferenceSettingsForm } from '@/shared/components/preference-settings-form/PreferenceSettingsForm'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/my/preferences')({
  component: PreferencesPage,
})

function PreferencesPage() {
  const router = useRouter()

  return (
    <div className="bg-surface min-h-screen pb-24">
      <TopAppBar title="Travel Preferences" showBack />
      <main className="px-margin-mobile pt-lg mx-auto max-w-2xl">
        <PreferenceSettingsForm mode="settings" onSubmit={() => router.history.back()} />
      </main>
    </div>
  )
}
