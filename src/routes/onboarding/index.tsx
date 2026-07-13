import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import {
  OnboardingDetailStep,
  OnboardingLayout,
  OnboardingProfileStep,
  OnboardingWelcomeStep,
  useOnboardingStore,
} from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/')({
  component: OnboardingPage,
})

function OnboardingPage() {
  const navigate = useNavigate()
  const { step, goToStep } = useOnboardingStore()

  function handleSkip() {
    navigate({ to: '/' })
  }

  function handleComplete() {
    navigate({ to: '/' })
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
