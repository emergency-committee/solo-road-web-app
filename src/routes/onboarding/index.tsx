import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import {
  OnboardingDetailStep,
  OnboardingLayout,
  OnboardingProfileStep,
  OnboardingWelcomeStep,
  useOnboardingStore,
  useSubmitOnboarding,
} from '@/features/onboarding'
import type { PreferenceSettingsSubmitData } from '@/shared/components/preference-settings-form/PreferenceSettingsForm'
import { useSessionStore } from '@/shared/auth/session-store'

export const Route = createFileRoute('/onboarding/')({
  component: OnboardingPage,
})

function OnboardingPage() {
  const navigate = useNavigate()
  const { step, goToStep, gender, foodPreference, interests } = useOnboardingStore()
  const { mutate: submitOnboarding } = useSubmitOnboarding()

  function handleSkip() {
    // 건너뛰기도 온보딩 완료로 취급하고 로그인 화면으로 넘어간다(온보딩 → 로그인 순서).
    useSessionStore.getState().setOnboarded()
    navigate({ to: '/login' })
  }

  function handleComplete(detail: PreferenceSettingsSubmitData) {
    submitOnboarding({ gender, foodPreference, interests, ...detail })
  }

  return (
    <OnboardingLayout
      step={step}
      totalSteps={3}
      onSkip={handleSkip}
      footer={
        step < 3 ? (
          <button
            type="button"
            onClick={() => goToStep((step + 1) as 1 | 2 | 3)}
            className="font-headline-lg-mobile text-headline-lg-mobile gap-md bg-primary text-on-primary flex h-14 w-full items-center justify-center rounded-full shadow-lg transition-transform duration-150 active:scale-95"
          >
            다음으로
            <ArrowRight className="size-5" />
          </button>
        ) : null
      }
    >
      {step === 1 && <OnboardingWelcomeStep />}
      {step === 2 && <OnboardingProfileStep />}
      {step === 3 && <OnboardingDetailStep onComplete={handleComplete} />}
    </OnboardingLayout>
  )
}
