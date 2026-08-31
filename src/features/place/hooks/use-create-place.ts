import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlace } from '../api/place-api'
import type { CreatePlaceRequest } from '../types/place.types'

export function useCreatePlace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreatePlaceRequest) => createPlace(request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['places'] }),
        queryClient.invalidateQueries({ queryKey: ['place-recommendations'] }),
      ])
    },
  })
}
