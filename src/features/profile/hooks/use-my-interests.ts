import { useQuery } from '@tanstack/react-query'
import { getMyInterests } from '../api/interests-api'

export const MY_INTERESTS_QUERY_KEY = ['profile', 'interests'] as const

export function useMyInterests() {
  return useQuery({
    queryKey: MY_INTERESTS_QUERY_KEY,
    queryFn: getMyInterests,
  })
}
