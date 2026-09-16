import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  copyCourse,
  createCourseReview,
  equipTitle,
  getCourseReviews,
  getCourseTags,
  getLikedCourses,
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
import type {
  CourseDetailResponse,
  CreateCourseReviewRequest,
  PublicCourseItem,
  PublishCourseRequest,
} from '../types/course.types'
import type { PageResponse } from '@/shared/api/types'

export function usePublicCourses(params: DiscoverCoursesParams = {}) {
  return useQuery({
    queryKey: ['courses', 'public', params],
    queryFn: () => getPublicCourses(params),
  })
}

export function useLikedCourses() {
  return useQuery({
    queryKey: ['courses', 'liked'],
    queryFn: () => getLikedCourses(),
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
    onMutate: async (liked) => {
      await queryClient.cancelQueries({ queryKey: ['courses', 'detail', courseId] })
      await queryClient.cancelQueries({ queryKey: ['courses', 'public'] })
      await queryClient.cancelQueries({ queryKey: ['courses', 'liked'] })

      const previousDetail = queryClient.getQueryData<CourseDetailResponse>([
        'courses',
        'detail',
        courseId,
      ])
      const previousPublicQueries = queryClient.getQueriesData<PageResponse<PublicCourseItem>>({
        queryKey: ['courses', 'public'],
      })
      const previousLikedQueries = queryClient.getQueriesData<PageResponse<PublicCourseItem>>({
        queryKey: ['courses', 'liked'],
      })

      queryClient.setQueryData<CourseDetailResponse>(['courses', 'detail', courseId], (current) =>
        current ? applyDetailLike(current, liked) : current,
      )
      updatePublicCoursePages(queryClient, ['courses', 'public'], courseId, liked)
      updatePublicCoursePages(queryClient, ['courses', 'liked'], courseId, liked)

      return { previousDetail, previousPublicQueries, previousLikedQueries }
    },
    onError: (_error, _liked, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(['courses', 'detail', courseId], context.previousDetail)
      }
      context?.previousPublicQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
      context?.previousLikedQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSuccess: (data) => {
      queryClient.setQueryData<CourseDetailResponse>(['courses', 'detail', courseId], (current) =>
        current ? { ...current, liked: data.liked, likeCount: data.likeCount } : current,
      )
      void queryClient.invalidateQueries({ queryKey: ['courses', 'public'] })
      void queryClient.invalidateQueries({ queryKey: ['courses', 'liked'] })
    },
  })
}

function applyDetailLike(course: CourseDetailResponse, liked: boolean): CourseDetailResponse {
  if (course.liked === liked) return course
  return {
    ...course,
    liked,
    likeCount: Math.max(0, course.likeCount + (liked ? 1 : -1)),
  }
}

function updatePublicCoursePages(
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: readonly unknown[],
  courseId: number,
  liked: boolean,
) {
  queryClient.setQueriesData<PageResponse<PublicCourseItem>>({ queryKey }, (current) => {
    if (!current) return current
    return {
      ...current,
      content: current.content.map((course) =>
        course.courseId === courseId
          ? { ...course, likeCount: Math.max(0, course.likeCount + (liked ? 1 : -1)) }
          : course,
      ),
    }
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
