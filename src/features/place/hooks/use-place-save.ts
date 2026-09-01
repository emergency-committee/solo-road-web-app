import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPlaceSaveStatus, savePlace, unsavePlace } from '../api/place-api'
import type { ApiPlaceSaveResponse } from '../types/place.types'

const saveStatusKey = (placeId: number) => ['places', 'save-status', placeId] as const

export function usePlaceSaveStatus(placeId: number, enabled = true) {
  return useQuery({
    queryKey: saveStatusKey(placeId),
    queryFn: () => getPlaceSaveStatus(placeId),
    enabled: enabled && Number.isFinite(placeId) && placeId > 0,
  })
}

export function useTogglePlaceSave(placeId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (currentlySaved: boolean) =>
      currentlySaved ? unsavePlace(placeId) : savePlace(placeId),
    onMutate: async (currentlySaved) => {
      await queryClient.cancelQueries({ queryKey: saveStatusKey(placeId) })
      const previous = queryClient.getQueryData<ApiPlaceSaveResponse>(saveStatusKey(placeId))
      queryClient.setQueryData<ApiPlaceSaveResponse>(saveStatusKey(placeId), {
        placeId,
        saved: !currentlySaved,
      })
      return { previous }
    },
    onError: (_error, _currentlySaved, context) => {
      if (context?.previous) {
        queryClient.setQueryData(saveStatusKey(placeId), context.previous)
      }
    },
    onSuccess: (response) => {
      queryClient.setQueryData(saveStatusKey(placeId), response)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['places', 'saved'] })
    },
  })
}
