import { useMutation } from '@tanstack/react-query'
import { useSessionStore } from '@/shared/auth/session-store'
import { updateMyProfile } from '../api/profile-api'

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (profile) => {
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
