import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useSessionStore } from '@/shared/auth/session-store'
import { withdrawAccountRequest } from '../api/auth-api'

export function useWithdrawAccount() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: withdrawAccountRequest,
    onSuccess: () => {
      queryClient.clear()
      useSessionStore.getState().clearSession()
      navigate({ to: '/login', replace: true })
    },
  })
}
