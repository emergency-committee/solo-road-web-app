import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPlaceReview, getReviewTags } from '../api/place-api'
import type { CreatePlaceReviewRequest } from '../types/place.types'

export function useReviewTags(enabled: boolean, tagGroup?: 'dining' | 'travel') {
  return useQuery({
    queryKey: ['review-tags', tagGroup ?? 'all'],
    queryFn: () => getReviewTags(tagGroup),
    enabled,
    staleTime: 1000 * 60 * 30,
  })
}

export function useCreatePlaceReview(placeId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreatePlaceReviewRequest) => createPlaceReview(placeId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['places'] }),
        queryClient.invalidateQueries({ queryKey: ['places', 'detail', placeId] }),
        queryClient.invalidateQueries({ queryKey: ['places', 'reviews', placeId] }),
      ])
    },
  })
}
