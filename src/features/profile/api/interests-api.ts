import { apiRequest } from '@/shared/api/client'
import { API_PREFIX } from '@/shared/api/config'

export interface UpdateInterestRequest {
  foodStyle?: string
  hashtagList?: string[]
  preferredMood?: string
  preferredPriceLevel?: string
  soloPreferenceScore?: number
}

export interface InterestResponse {
  foodStyle: string | null
  hashtagList: string[]
  preferredMood: string | null
  preferredPriceLevel: string | null
  soloPreferenceScore: number | null
}

export function getMyInterests() {
  return apiRequest<InterestResponse>(`${API_PREFIX}/users/me/interests`)
}

export function updateMyInterests(req: UpdateInterestRequest) {
  return apiRequest<InterestResponse>(`${API_PREFIX}/users/me/interests`, {
    method: 'PUT',
    body: JSON.stringify(req),
  })
}
