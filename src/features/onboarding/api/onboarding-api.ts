import { apiRequest } from '@/shared/api/client'
import type { OnboardingSubmitPayload } from '../types/onboarding.types'

interface OnboardingRequestBody {
  nickname: string
  gender: 'M' | 'F' | null
  foodStyle: string | null
  hashtagList: string[]
  preferredMood: string | null
  soloPreferenceScore: number | null
}

interface OnboardingResponseBody {
  nickname: string
  foodStyle: string | null
  hashtagList: string[]
  preferredMood: string | null
}

function toGenderCode(gender: OnboardingSubmitPayload['gender']): 'M' | 'F' | null {
  if (gender === '남성') return 'M'
  if (gender === '여성') return 'F'
  return null
}

export async function submitOnboarding(
  payload: OnboardingSubmitPayload,
): Promise<OnboardingResponseBody> {
  if (import.meta.env.VITE_AUTH_MOCK === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      nickname: payload.nickname.trim(),
      foodStyle: payload.foodPreferences.join(',') || null,
      hashtagList: payload.interests,
      preferredMood: null,
    }
  }

  const body: OnboardingRequestBody = {
    nickname: payload.nickname.trim(),
    gender: toGenderCode(payload.gender),
    foodStyle: payload.foodPreferences.join(',') || null,
    hashtagList: payload.interests,
    preferredMood: payload.mood[0] ?? null,
    soloPreferenceScore: payload.soloPriority ? 1 : 0,
  }

  return apiRequest<OnboardingResponseBody>('/api/v1/users/me/onboarding', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
