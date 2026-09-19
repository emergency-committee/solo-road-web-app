import { useQuery } from '@tanstack/react-query'
import { getMyProfile } from '../api/profile-api'

export const MY_PROFILE_QUERY_KEY = ['profile', 'me'] as const

export function useMyProfile() {
  return useQuery({
    queryKey: MY_PROFILE_QUERY_KEY,
    queryFn: getMyProfile,
  })
}
