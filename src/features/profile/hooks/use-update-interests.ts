import { useMutation } from '@tanstack/react-query'
import { updateMyInterests } from '../api/interests-api'

export function useUpdateInterests() {
  return useMutation({
    mutationFn: updateMyInterests,
  })
}
