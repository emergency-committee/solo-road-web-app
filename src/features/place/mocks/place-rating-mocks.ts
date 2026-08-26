import type { PageResponse } from '@/shared/api/types'
import type {
  ApiPlaceDetail,
  ApiPlaceSummary,
  ApiReview,
  ApiReviewTag,
  ApiPlacesParams,
  CreatePlaceReviewRequest,
  CreatePlaceReviewResponse,
} from '../types/place.types'

export const mockReviewTags: ApiReviewTag[] = [
  { reviewTagId: 1, tagName: '1인석 있음', tagType: 'SEAT' },
  { reviewTagId: 2, tagName: '바테이블 있음', tagType: 'SEAT' },
  { reviewTagId: 3, tagName: '1인 메뉴 있음', tagType: 'MENU' },
  { reviewTagId: 4, tagName: '조용해요', tagType: 'MOOD' },
  { reviewTagId: 5, tagName: '오래 있기 좋아요', tagType: 'STAY' },
]

const mockPlaces: ApiPlaceSummary[] = [
  {
    placeId: 980001,
    name: '오롯이 한상',
    type: 'RESTAURANT',
    rating: 4.3,
    soloRating: 4.6,
    soloReviewCount: 18,
    summary: '바 좌석과 1인 한상이 준비된 식당',
    latitude: 37.49835,
    longitude: 127.02745,
    soloFriendlyBadge: true,
    thumbnailUrl: 'https://picsum.photos/seed/solo-dining-oroti/480/480',
    distanceM: 120,
    isLiked: false,
  },
  {
    placeId: 980002,
    name: '바자리 키친',
    type: 'RESTAURANT',
    rating: 4.1,
    soloRating: 4.2,
    soloReviewCount: 7,
    summary: '혼자 앉기 편한 오픈 키친',
    latitude: 37.49685,
    longitude: 127.0292,
    soloFriendlyBadge: true,
    thumbnailUrl: 'https://picsum.photos/seed/solo-dining-bar-seat/480/480',
    distanceM: 260,
    isLiked: false,
  },
  {
    placeId: 980003,
    name: '오늘의 덮밥',
    type: 'RESTAURANT',
    rating: 4,
    soloRating: 5,
    soloReviewCount: 2,
    summary: '혼밥 평가가 모이는 식당',
    latitude: 37.4994,
    longitude: 127.0248,
    soloFriendlyBadge: false,
    thumbnailUrl: 'https://picsum.photos/seed/solo-dining-donburi/480/480',
    distanceM: 340,
    isLiked: false,
  },
  {
    placeId: 980004,
    name: '느린 오후 베이크샵',
    type: 'CAFE',
    rating: 4.4,
    soloRating: 4.5,
    soloReviewCount: 11,
    summary: '창가 1인석이 있는 조용한 베이크샵',
    latitude: 37.4957,
    longitude: 127.0258,
    soloFriendlyBadge: true,
    thumbnailUrl: 'https://picsum.photos/seed/solo-dining-bakeshop/480/480',
    distanceM: 310,
    isLiked: false,
  },
]

const mockDetails: Record<number, ApiPlaceDetail> = {
  980001: {
    placeId: 980001,
    name: '오롯이 한상',
    type: '한식',
    rating: 4.3,
    address: '서울특별시 강남구 강남대로94길 12',
    priceLevel: '₩₩',
    businessVerified: true,
    soloFriendlyBadge: true,
    soloScore: {
      soloScore: 89.1,
      grade: 'HIGH',
      soloRating: 4.6,
      soloReviewCount: 18,
    },
    soloInfo: {
      hasSoloSeat: true,
      hasSoloMenu: true,
      hasBarTable: true,
      quietLevel: '0.72',
      soloSeatStatus: 'VERIFIED',
    },
    soloTagSummaries: [
      { tagId: 1, name: '1인석 있음', positiveCount: 15, negativeCount: 1 },
      { tagId: 3, name: '1인 메뉴 있음', positiveCount: 13, negativeCount: 0 },
      { tagId: 4, name: '조용해요', positiveCount: 9, negativeCount: 2 },
    ],
    analysisTags: ['1인석 있음', '1인 메뉴 있음', '조용해요'],
    isLiked: false,
  },
  980004: {
    placeId: 980004,
    name: '느린 오후 베이크샵',
    type: '카페/베이커리',
    rating: 4.4,
    address: '서울특별시 강남구 봉은사로4길 19',
    priceLevel: '₩₩',
    businessVerified: true,
    soloFriendlyBadge: true,
    soloScore: {
      soloScore: 86.5,
      grade: 'HIGH',
      soloRating: 4.5,
      soloReviewCount: 11,
    },
    soloInfo: {
      hasSoloSeat: true,
      hasSoloMenu: true,
      hasBarTable: false,
      quietLevel: '0.81',
      soloSeatStatus: 'VERIFIED',
    },
    soloTagSummaries: [
      { tagId: 1, name: '1인석 있음', positiveCount: 9, negativeCount: 0 },
      { tagId: 4, name: '조용해요', positiveCount: 8, negativeCount: 1 },
      { tagId: 5, name: '오래 있기 좋아요', positiveCount: 6, negativeCount: 1 },
    ],
    analysisTags: ['1인석 있음', '조용해요', '오래 있기 좋아요'],
    isLiked: false,
  },
}

const mockReviews: Record<number, ApiReview[]> = {
  980001: [
    {
      reviewId: 990001,
      userId: 101,
      rating: 5,
      visitedAlone: true,
      soloRating: 5,
      contents: '바 좌석이 넉넉하고 주문도 키오스크로 할 수 있어서 혼자 편하게 먹었어요.',
      tags: ['1인석 있음', '1인 메뉴 있음'],
      createdAt: '2026-08-21T12:30:00',
    },
    {
      reviewId: 990002,
      userId: 102,
      rating: 4,
      visitedAlone: true,
      soloRating: 4,
      contents: '점심시간을 조금 피하면 조용하고 오래 기다리지 않아도 됐어요.',
      tags: ['조용해요'],
      createdAt: '2026-08-18T18:10:00',
    },
  ],
  980004: [
    {
      reviewId: 990004,
      userId: 104,
      rating: 5,
      visitedAlone: true,
      soloRating: 5,
      contents: '창가 자리가 분리되어 있고 매장이 조용해서 혼자 커피 마시기 편했어요.',
      tags: ['1인석 있음', '조용해요', '오래 있기 좋아요'],
      createdAt: '2026-08-20T15:20:00',
    },
  ],
}

function page<T>(content: T[]): PageResponse<T> {
  return {
    content,
    page: 0,
    size: content.length,
    totalElements: content.length,
    hasNext: false,
  }
}

export function getMockPlaces(params: ApiPlacesParams = {}) {
  const normalizedType = params.type?.toLowerCase()
  const requestedType =
    normalizedType && ['식당', '맛집', '한식'].includes(normalizedType)
      ? 'restaurant'
      : normalizedType
  const normalizedKeyword = params.keyword?.trim().toLowerCase()
  const content = mockPlaces.filter((place) => {
    if (params.soloFriendlyOnly && !place.soloFriendlyBadge) return false
    if (requestedType && place.type.toLowerCase() !== requestedType) {
      return false
    }
    if (
      normalizedKeyword &&
      !`${place.name} ${place.summary ?? ''}`.toLowerCase().includes(normalizedKeyword)
    ) {
      return false
    }
    return true
  })
  return page(content)
}

export function getMockPlaceDetail(placeId: number) {
  return mockDetails[placeId]
}

export function isMockPlace(placeId: number) {
  return placeId in mockDetails
}

export function getMockPlaceReviews(placeId: number) {
  return page(mockReviews[placeId] ?? [])
}

export function createMockPlaceReview(
  placeId: number,
  request: CreatePlaceReviewRequest,
): CreatePlaceReviewResponse {
  const review: ApiReview = {
    reviewId: Date.now(),
    userId: 999,
    rating: request.rating,
    visitedAlone: request.visitedAlone ?? null,
    soloRating: request.soloRating ?? null,
    contents: request.contents,
    tags: mockReviewTags
      .filter((tag) => request.tagIds.includes(tag.reviewTagId))
      .map((tag) => tag.tagName),
    createdAt: new Date().toISOString(),
  }
  mockReviews[placeId] = [review, ...(mockReviews[placeId] ?? [])]

  const detail = mockDetails[placeId]
  const summary = mockPlaces.find((place) => place.placeId === placeId)
  if (detail?.soloScore && request.visitedAlone && request.soloRating !== undefined) {
    const previousCount = detail.soloScore.soloReviewCount
    const previousRating = detail.soloScore.soloRating ?? 0
    const nextCount = previousCount + 1
    const nextRating = (previousRating * previousCount + request.soloRating) / nextCount
    detail.soloScore.soloReviewCount = nextCount
    detail.soloScore.soloRating = nextRating
    if (summary) {
      summary.soloReviewCount = nextCount
      summary.soloRating = nextRating
    }
  }

  return {
    reviewId: review.reviewId,
    placeId,
    rating: review.rating,
    visitedAlone: review.visitedAlone,
    soloRating: review.soloRating,
    contents: review.contents,
    createdAt: review.createdAt,
  }
}

export function setMockPlaceLiked(placeId: number, isLiked: boolean) {
  const detail = mockDetails[placeId]
  const summary = mockPlaces.find((place) => place.placeId === placeId)
  if (detail) detail.isLiked = isLiked
  if (summary) summary.isLiked = isLiked
  return { placeId, isLiked }
}
