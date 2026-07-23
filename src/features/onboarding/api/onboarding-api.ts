import { apiRequest } from '@/shared/api/client'
import type { OnboardingSubmitPayload } from '../types/onboarding.types'

export async function submitOnboarding(payload: OnboardingSubmitPayload): Promise<void> {
  if (import.meta.env.VITE_AUTH_MOCK === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return
  }

  // TODO: 백엔드 온보딩 저장 엔드포인트 확정 후 경로/응답 스키마 교체.
  // 예상(미확정): POST /api/v1/onboarding 또는 PATCH /api/v1/users/me/preferences
  await apiRequest<void>('/api/v1/onboarding', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
