import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMyInterests } from '../api/interests-api'
import { MY_INTERESTS_QUERY_KEY } from './use-my-interests'

export function useUpdateInterests() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMyInterests,
    onSuccess: (interests) => {
      queryClient.setQueryData(MY_INTERESTS_QUERY_KEY, interests)
    },
  })
}
