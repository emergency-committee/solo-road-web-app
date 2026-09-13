import { apiRequest } from '@/shared/api/client'
import { API_PREFIX } from '@/shared/api/config'

export interface UserProfileResponse {
  userId: number
  nickname: string | null
  profileImageUrl: string | null
  gender: string | null
  provider: string
  createdAt: string
}

export interface UpdateProfileRequest {
  nickname?: string
}

export function updateMyProfile(req: UpdateProfileRequest) {
  return apiRequest<UserProfileResponse>(`${API_PREFIX}/users/me/profile`, {
    method: 'PATCH',
    body: JSON.stringify(req),
  })
}
