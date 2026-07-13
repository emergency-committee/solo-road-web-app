import { PreferenceSettingsForm } from '@/shared/components/preference-settings-form/PreferenceSettingsForm'

export function OnboardingDetailStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div>
      <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xl">
        마지막으로, 세부 취향을 알려주세요
      </h2>
      <PreferenceSettingsForm mode="onboarding" onSubmit={onComplete} />
    </div>
  )
}
