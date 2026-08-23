import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useSessionStore } from '@/shared/auth/session-store'
import { submitOnboarding } from '../api/onboarding-api'
import type { OnboardingSubmitPayload } from '../types/onboarding.types'

export function useSubmitOnboarding() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: OnboardingSubmitPayload) => submitOnboarding(payload),
    onSuccess: (response) => {
      const session = useSessionStore.getState()
      if (session.user) {
        session.setSession({ user: { ...session.user, nickname: response.nickname } })
      }
      session.setOnboarded()
      navigate({ to: '/' })
    },
  })
}
