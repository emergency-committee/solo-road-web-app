import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  copyCourse,
  createCourseReview,
  equipTitle,
  getCourseReviews,
  getCourseTags,
  getMyGamification,
  getPublicCourses,
  getTravelerProfile,
  getTravelerPublicCourses,
  getTravelerRanking,
  publishCourse,
  setCourseLike,
  unpublishCourse,
  type DiscoverCoursesParams,
} from '../api/course-api'
import type { CreateCourseReviewRequest, PublishCourseRequest } from '../types/course.types'

export function usePublicCourses(params: DiscoverCoursesParams = {}) {
  return useQuery({
    queryKey: ['courses', 'public', params],
    queryFn: () => getPublicCourses(params),
  })
}

export function useCourseTags() {
  return useQuery({ queryKey: ['courses', 'tags'], queryFn: getCourseTags, staleTime: Infinity })
}

export function usePublishCourse(courseId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: PublishCourseRequest) => publishCourse(courseId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses'] })
      void queryClient.invalidateQueries({ queryKey: ['gamification'] })
    },
  })
}

export function useUnpublishCourse(courseId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => unpublishCourse(courseId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['courses'] }),
  })
}

export function useToggleCourseLike(courseId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (liked: boolean) => setCourseLike(courseId, liked),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses', 'detail', courseId] })
      void queryClient.invalidateQueries({ queryKey: ['courses', 'public'] })
    },
  })
}

export function useCopyCourse(courseId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => copyCourse(courseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses', 'my'] })
      void queryClient.invalidateQueries({ queryKey: ['courses', 'public'] })
    },
  })
}

export function useCourseReviews(courseId: number) {
  return useQuery({
    queryKey: ['courses', 'reviews', courseId],
    queryFn: () => getCourseReviews(courseId),
  })
}

export function useCreateCourseReview(courseId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateCourseReviewRequest) => createCourseReview(courseId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses', 'reviews', courseId] })
      void queryClient.invalidateQueries({ queryKey: ['courses', 'detail', courseId] })
      void queryClient.invalidateQueries({ queryKey: ['gamification'] })
    },
  })
}

export function useMyGamification() {
  return useQuery({ queryKey: ['gamification', 'me'], queryFn: getMyGamification })
}

export function useTravelerRanking() {
  return useQuery({
    queryKey: ['gamification', 'ranking'],
    queryFn: () => getTravelerRanking(),
  })
}

export function useTravelerProfile(travelerId: number) {
  return useQuery({
    queryKey: ['travelers', travelerId, 'profile'],
    queryFn: () => getTravelerProfile(travelerId),
  })
}

export function useTravelerPublicCourses(travelerId: number) {
  return useQuery({
    queryKey: ['travelers', travelerId, 'courses'],
    queryFn: () => getTravelerPublicCourses(travelerId),
  })
}

export function useEquipTitle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (titleCode: string) => equipTitle(titleCode),
    onSuccess: (data) => queryClient.setQueryData(['gamification', 'me'], data),
  })
}
