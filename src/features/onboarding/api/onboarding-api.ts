import { apiRequest } from '@/shared/api/client'
import type { OnboardingSubmitPayload } from '../types/onboarding.types'

interface OnboardingRequestBody {
  nickname: string
  gender: 'M' | 'F' | null
  foodStyle: string | null
  hashtagList: string[]
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

// 백엔드(/api/v1/users/me/onboarding)는 nickname/gender/foodStyle/hashtagList(최대 3개)만 받는다.
// mood/soloPriority/food(음식 관심사)는 대응하는 필드가 없어 아직 전송하지 않는다.
export async function submitOnboarding(
  payload: OnboardingSubmitPayload,
): Promise<OnboardingResponseBody> {
  if (import.meta.env.VITE_AUTH_MOCK === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      nickname: payload.nickname.trim(),
      foodStyle: payload.foodPreference,
      hashtagList: payload.interests,
      preferredMood: null,
    }
  }

  const body: OnboardingRequestBody = {
    nickname: payload.nickname.trim(),
    gender: toGenderCode(payload.gender),
    foodStyle: payload.foodPreference,
    hashtagList: payload.interests,
  }

  return apiRequest<OnboardingResponseBody>('/api/v1/users/me/onboarding', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
