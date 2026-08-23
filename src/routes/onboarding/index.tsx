import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
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
import { onboardingPageGuard } from '@/shared/auth/route-guards'

export const Route = createFileRoute('/onboarding/')({
  beforeLoad: onboardingPageGuard,
  component: OnboardingPage,
})

function OnboardingPage() {
  const navigate = useNavigate()
  const { step, goToStep, nickname, setNickname, gender, foodPreference, interests } =
    useOnboardingStore()
  const user = useSessionStore((state) => state.user)
  const {
    mutate: submitOnboarding,
    isPending: isSubmitting,
    error: submitError,
  } = useSubmitOnboarding()
  const isNicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 12

  useEffect(() => {
    if (!nickname && user?.nickname) {
      setNickname(user.nickname.slice(0, 12))
    }
  }, [nickname, setNickname, user?.nickname])

  function handleSkip() {
    // 건너뛰기도 온보딩 완료로 취급하고 홈으로 넘어간다(로그인 → 온보딩 순서).
    useSessionStore.getState().setOnboarded()
    navigate({ to: '/' })
  }

  function handleComplete(detail: PreferenceSettingsSubmitData) {
    if (!isNicknameValid || isSubmitting) return
    submitOnboarding({ nickname: nickname.trim(), gender, foodPreference, interests, ...detail })
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
            disabled={step === 2 && !isNicknameValid}
            className="font-headline-lg-mobile text-headline-lg-mobile gap-md bg-primary text-on-primary flex h-14 w-full items-center justify-center rounded-full shadow-lg transition-transform duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음으로
            <ArrowRight className="size-5" />
          </button>
        ) : null
      }
    >
      {step === 1 && <OnboardingWelcomeStep />}
      {step === 2 && <OnboardingProfileStep />}
      {step === 3 && (
        <>
          <OnboardingDetailStep onComplete={handleComplete} />
          {submitError && (
            <p className="text-error mt-md text-center text-sm" role="alert">
              {submitError instanceof Error
                ? submitError.message
                : '온보딩 정보를 저장하지 못했어요.'}
            </p>
          )}
        </>
      )}
    </OnboardingLayout>
  )
}
