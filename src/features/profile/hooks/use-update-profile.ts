import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSessionStore } from '@/shared/auth/session-store'
import { updateMyProfile } from '../api/profile-api'
import { MY_PROFILE_QUERY_KEY } from './use-my-profile'

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(MY_PROFILE_QUERY_KEY, profile)

      const session = useSessionStore.getState()
      if (!session.user) return

      session.setSession({
        user: {
          ...session.user,
          ...(profile.nickname ? { nickname: profile.nickname } : {}),
        },
      })
    },
  })
}
