import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likePlace, unlikePlace } from '../api/place-api'

export function useTogglePlaceLike(placeId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (currentlyLiked: boolean) =>
      currentlyLiked ? unlikePlace(placeId) : likePlace(placeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['places', 'detail', placeId] })
    },
  })
}
