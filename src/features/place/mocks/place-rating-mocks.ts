import type { PageResponse } from '@/shared/api/types'
import type {
  ApiPlaceDetail,
  ApiPlaceSummary,
  ApiReview,
  ApiReviewTag,
  ApiPlacesParams,
  CreatePlaceRequest,
  CreatePlaceResponse,
  CreatePlaceReviewRequest,
  CreatePlaceReviewResponse,
} from '../types/place.types'

export const mockReviewTags: ApiReviewTag[] = [
  { reviewTagId: 1, tagName: '1인석 있음', tagType: 'SEAT' },
  { reviewTagId: 2, tagName: '바테이블 있음', tagType: 'SEAT' },
  { reviewTagId: 3, tagName: '1인 메뉴 있음', tagType: 'MENU' },
  { reviewTagId: 4, tagName: '조용해요', tagType: 'MOOD' },
  { reviewTagId: 5, tagName: '오래 있기 좋아요', tagType: 'STAY' },
  { reviewTagId: 6, tagName: '웨이팅 길어요', tagType: 'CROWD' },
  { reviewTagId: 101, tagName: '혼자 걷기 안전해요', tagType: 'SOLO_TRAVEL' },
  { reviewTagId: 102, tagName: '혼자 시간을 보내기 좋아요', tagType: 'SOLO_TRAVEL' },
  { reviewTagId: 103, tagName: '혼자 둘러보기 편해요', tagType: 'SOLO_TRAVEL' },
  { reviewTagId: 104, tagName: '조용하고 사색하기 좋아요', tagType: 'SOLO_TRAVEL' },
  { reviewTagId: 105, tagName: '대중교통으로 오기 편해요', tagType: 'SOLO_TRAVEL' },
  { reviewTagId: 106, tagName: '1인 입장 가능해요', tagType: 'SOLO_TRAVEL' },
  { reviewTagId: 107, tagName: '힐링이 돼요', tagType: 'SOLO_TRAVEL' },
  { reviewTagId: 108, tagName: '전시/문화 콘텐츠가 알차요', tagType: 'SOLO_TRAVEL' },
]

export function getMockReviewTags(tagGroup?: 'dining' | 'travel') {
  if (tagGroup === 'travel') {
    return mockReviewTags.filter((tag) => tag.tagType === 'SOLO_TRAVEL')
  }
  if (tagGroup === 'dining') {
    return mockReviewTags.filter((tag) => tag.tagType !== 'SOLO_TRAVEL')
  }
  return mockReviewTags
}

const mockPlaces: ApiPlaceSummary[] = [
  {
    placeId: 980001,
    name: '오롯이 한상',
    type: 'RESTAURANT',
    rating: 4.3,
    soloScore: 89.1,
    scoreStatus: 'DONE',
    soloRating: 4.6,
    soloReviewCount: 18,
    summary: '바 좌석과 1인 한상이 준비된 식당',
    latitude: 37.49835,
    longitude: 127.02745,
    soloFriendlyBadge: true,
    thumbnailUrl: 'https://picsum.photos/seed/solo-dining-oroti/480/480',
    distanceM: 120,
    isLiked: true,
  },
  {
    placeId: 980002,
    name: '바자리 키친',
    type: 'RESTAURANT',
    rating: 4.1,
    soloScore: 84.0,
    scoreStatus: 'DONE',
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
    name: '소담한 1인 샤브',
    type: 'RESTAURANT',
    rating: 4.6,
    soloScore: 93.0,
    scoreStatus: 'DONE',
    soloRating: 4.8,
    soloReviewCount: 24,
    summary: '개인 인덕션과 1인 좌석 완비 샤브 전문점',
    latitude: 37.4994,
    longitude: 127.0248,
    soloFriendlyBadge: true,
    thumbnailUrl: 'https://picsum.photos/seed/solo-dining-shabu/480/480',
    distanceM: 340,
    isLiked: false,
  },
  {
    placeId: 980004,
    name: '느린 오후 베이크샵',
    type: 'CAFE',
    rating: 4.4,
    soloScore: 86.5,
    scoreStatus: 'DONE',
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
  {
    placeId: 980005,
    name: '선릉과 정릉 산책로',
    type: 'NATURE',
    rating: 4.8,
    soloScore: 94.2,
    scoreStatus: 'DONE',
    soloRating: 4.9,
    soloReviewCount: 35,
    summary: '도심 속 울창한 숲길과 고즈넉한 힐링 산책',
    latitude: 37.5055,
    longitude: 127.0485,
    soloFriendlyBadge: true,
    thumbnailUrl: 'https://picsum.photos/seed/solo-travel-seonjeongneung/480/480',
    distanceM: 650,
    isLiked: false,
  },
  {
    placeId: 980006,
    name: '별마당 도서관',
    type: 'ATTRACTION',
    rating: 4.7,
    soloScore: 92.0,
    scoreStatus: 'DONE',
    soloRating: 4.6,
    soloReviewCount: 42,
    summary: '웅장한 서가와 혼자 사색하기 좋은 도심 랜드마크',
    latitude: 37.5101,
    longitude: 127.0594,
    soloFriendlyBadge: true,
    thumbnailUrl: 'https://picsum.photos/seed/solo-travel-byeolmadang/480/480',
    distanceM: 880,
    isLiked: true,
  },
  {
    placeId: 980007,
    name: '봉은사 템플 숲길',
    type: 'NATURE',
    rating: 4.7,
    soloScore: 91.3,
    scoreStatus: 'DONE',
    soloRating: 4.8,
    soloReviewCount: 29,
    summary: '천년 고찰의 평온함과 도심 속 조용한 힐링 쉼터',
    latitude: 37.5144,
    longitude: 127.0573,
    soloFriendlyBadge: true,
    thumbnailUrl: 'https://picsum.photos/seed/solo-travel-bongeunsa/480/480',
    distanceM: 920,
    isLiked: false,
  },
  {
    placeId: 980008,
    name: '마이아트뮤지엄',
    type: 'CULTURE',
    rating: 4.6,
    soloScore: 90.2,
    scoreStatus: 'DONE',
    soloRating: 4.7,
    soloReviewCount: 19,
    summary: '혼자만의 시선으로 여유롭게 감상하는 기획 전시관',
    latitude: 37.5082,
    longitude: 127.0611,
    soloFriendlyBadge: true,
    thumbnailUrl: 'https://picsum.photos/seed/solo-travel-myartmuseum/480/480',
    distanceM: 950,
    isLiked: false,
  },
  {
    placeId: 980009,
    name: '북앤레스트 사색공간',
    type: 'CAFE',
    rating: 4.5,
    soloScore: 88.4,
    scoreStatus: 'DONE',
    soloRating: 4.8,
    soloReviewCount: 16,
    summary: '1인 독서 부스와 조용한 음악이 흐르는 북카페',
    latitude: 37.5098,
    longitude: 127.0552,
    soloFriendlyBadge: true,
    thumbnailUrl: 'https://picsum.photos/seed/solo-travel-bookcafe/480/480',
    distanceM: 780,
    isLiked: false,
  },
]

const mockDetails: Record<number, ApiPlaceDetail> = {
  980001: {
    placeId: 980001,
    name: '오롯이 한상',
    type: '한식',
    rating: 4.3,
    summary: '바 좌석과 1인 한상이 준비된 식당',
    address: '서울특별시 강남구 강남대로94길 12',
    priceLevel: '₩₩',
    businessVerified: true,
    soloFriendlyBadge: true,
    soloScore: {
      soloScore: 89.1,
      scoreStatus: 'DONE',
      soloRating: 4.6,
      soloReviewCount: 18,
    },
    soloInfo: {
      hasSoloSeat: true,
      hasSoloMenu: true,
      hasBarTable: true,
      quietLevel: '0.72',
      soloSeatStatus: 'VERIFIED',
      cautionNote: '점심 피크만 피하면 혼자 앉기 더 편해요.',
    },
    soloTagSummaries: [
      { tagId: 1, name: '1인석 있음', positiveCount: 15, negativeCount: 1 },
      { tagId: 3, name: '1인 메뉴 있음', positiveCount: 13, negativeCount: 0 },
      { tagId: 4, name: '조용해요', positiveCount: 9, negativeCount: 2 },
    ],
    analysisTags: ['1인석 있음', '1인 메뉴 있음', '조용해요'],
    isLiked: true,
  },
  980004: {
    placeId: 980004,
    name: '느린 오후 베이크샵',
    type: '카페/베이커리',
    rating: 4.4,
    summary: '창가 1인석이 있는 조용한 베이크샵',
    address: '서울특별시 강남구 봉은사로4길 19',
    priceLevel: '₩₩',
    businessVerified: true,
    soloFriendlyBadge: true,
    soloScore: {
      soloScore: 86.5,
      scoreStatus: 'DONE',
      soloRating: 4.5,
      soloReviewCount: 11,
    },
    soloInfo: {
      hasSoloSeat: true,
      hasSoloMenu: true,
      hasBarTable: false,
      quietLevel: '0.81',
      soloSeatStatus: 'VERIFIED',
      cautionNote: '오후 늦게 방문하면 창가 자리가 비교적 여유로워요.',
    },
    soloTagSummaries: [
      { tagId: 1, name: '1인석 있음', positiveCount: 9, negativeCount: 0 },
      { tagId: 4, name: '조용해요', positiveCount: 8, negativeCount: 1 },
      { tagId: 5, name: '오래 있기 좋아요', positiveCount: 6, negativeCount: 1 },
    ],
    analysisTags: ['1인석 있음', '조용해요', '오래 있기 좋아요'],
    isLiked: false,
  },
  980005: {
    placeId: 980005,
    name: '선릉과 정릉 산책로',
    type: '자연/산책',
    rating: 4.8,
    summary: '도심 속 울창한 숲길과 고즈넉한 힐링 산책',
    address: '서울특별시 강남구 선릉로100길 1',
    priceLevel: '₩',
    businessVerified: true,
    soloFriendlyBadge: true,
    soloScore: {
      soloScore: 94.2,
      scoreStatus: 'DONE',
      soloRating: 4.9,
      soloReviewCount: 35,
    },
    soloInfo: {
      hasSoloSeat: true,
      hasSoloMenu: false,
      hasBarTable: false,
      quietLevel: '0.95',
      soloSeatStatus: 'VERIFIED',
      cautionNote: '해가 지기 전 천천히 둘러보는 코스로 추천해요.',
    },
    soloTagSummaries: [
      { tagId: 101, name: '혼자 걷기 안전해요', positiveCount: 32, negativeCount: 0 },
      { tagId: 107, name: '힐링이 돼요', positiveCount: 28, negativeCount: 0 },
      { tagId: 104, name: '조용하고 사색하기 좋아요', positiveCount: 25, negativeCount: 1 },
    ],
    analysisTags: ['혼자 걷기 안전해요', '힐링이 돼요', '조용하고 사색하기 좋아요'],
    isLiked: false,
  },
  980006: {
    placeId: 980006,
    name: '별마당 도서관',
    type: '혼행 명소',
    rating: 4.7,
    summary: '웅장한 서가와 혼자 사색하기 좋은 도심 랜드마크',
    address: '서울특별시 강남구 영동대로 513 코엑스몰 B1',
    priceLevel: '무료',
    businessVerified: true,
    soloFriendlyBadge: true,
    soloScore: {
      soloScore: 92.0,
      scoreStatus: 'DONE',
      soloRating: 4.6,
      soloReviewCount: 42,
    },
    soloInfo: {
      hasSoloSeat: true,
      hasSoloMenu: false,
      hasBarTable: true,
      quietLevel: '0.65',
      soloSeatStatus: 'VERIFIED',
      cautionNote: '주말 오후에는 사람이 많아서 오전 방문이 좋아요.',
    },
    soloTagSummaries: [
      { tagId: 102, name: '혼자 시간을 보내기 좋아요', positiveCount: 38, negativeCount: 1 },
      { tagId: 103, name: '혼자 둘러보기 편해요', positiveCount: 31, negativeCount: 2 },
    ],
    analysisTags: ['혼자 시간을 보내기 좋아요', '혼자 둘러보기 편해요', '혼행 추천 코스'],
    isLiked: true,
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
  980005: [
    {
      reviewId: 990005,
      userId: 105,
      rating: 5,
      visitedAlone: true,
      soloRating: 5,
      contents: '혼자 이어폰 끼고 천천히 숲길을 걷기에 최고의 장소입니다. 도심 한복판에 이런 곳이 있네요.',
      tags: ['혼자 걷기 안전해요', '힐링이 돼요'],
      createdAt: '2026-08-22T10:15:00',
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

const TYPE_SYNONYMS: Record<string, string[]> = {
  restaurant: ['restaurant', '식당', '맛집', '한식', '일식', '중식', '양식'],
  cafe: ['cafe', '카페', '카페/베이커리', '베이커리', '디저트'],
  attraction: ['attraction', '명소', '혼행 명소', '관광', '관광지', '랜드마크'],
  nature: ['nature', '자연', '자연/산책', '산책', '힐링', '공원', '숲길'],
  culture: ['culture', '문화', '전시', '전시/문화', '미술관', '박물관', '도서관'],
  stay: ['stay', '숙소', '게스트하우스', '호텔'],
}

export function getMockPlaces(params: ApiPlacesParams = {}) {
  const normalizedType = params.type?.toLowerCase()
  const normalizedKeyword = params.keyword?.trim().toLowerCase()

  const content = mockPlaces.filter((place) => {
    if (params.diningOnly && !['RESTAURANT', 'CAFE'].includes(place.type.toUpperCase())) {
      return false
    }
    if (params.soloFriendlyOnly && place.scoreStatus !== 'DONE') return false

    if (normalizedType && normalizedType !== 'all') {
      const targetTypes = TYPE_SYNONYMS[normalizedType] ?? [normalizedType]
      const placeTypeLower = place.type.toLowerCase()
      const matches = targetTypes.some(
        (t) => placeTypeLower === t.toLowerCase() || placeTypeLower.includes(t.toLowerCase()),
      )
      if (!matches) return false
    }

    if (
      normalizedKeyword &&
      !`${place.name} ${place.summary ?? ''} ${place.type}`.toLowerCase().includes(normalizedKeyword)
    ) {
      return false
    }
    return true
  })
  if (params.sort?.toUpperCase() === 'SOLO_SCORE') {
    content.sort((a, b) => (b.soloScore ?? 0) - (a.soloScore ?? 0))
  }
  return page(content)
}

export function getMockPlaceDetail(placeId: number) {
  return (
    mockDetails[placeId] ?? {
      placeId,
      name: mockPlaces.find((p) => p.placeId === placeId)?.name ?? '추천 장소',
      type: mockPlaces.find((p) => p.placeId === placeId)?.type ?? '혼행 스팟',
      rating: 4.5,
      summary: mockPlaces.find((p) => p.placeId === placeId)?.summary ?? '혼자 방문하기 좋은 추천 장소',
      address: '서울특별시 강남구',
      priceLevel: '₩₩',
      businessVerified: true,
      soloFriendlyBadge: true,
      soloScore: {
        soloScore: 88.0,
        scoreStatus: 'DONE' as const,
        soloRating: 4.5,
        soloReviewCount: 5,
      },
      soloInfo: {
        hasSoloSeat: true,
        hasSoloMenu: true,
        hasBarTable: true,
        quietLevel: '0.80',
        soloSeatStatus: 'VERIFIED',
        cautionNote: null,
      },
      soloTagSummaries: [],
      analysisTags: ['혼자 가기 좋은 곳'],
      isLiked: false,
    }
  )
}

export function isMockPlace(placeId: number) {
  return placeId in mockDetails || mockPlaces.some((p) => p.placeId === placeId)
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
  if (request.visitedAlone && request.soloRating !== undefined) {
    const soloRatings = (mockReviews[placeId] ?? [])
      .map((item) => item.soloRating)
      .filter((rating): rating is number => rating != null)
    const nextCount = soloRatings.length
    const nextRating =
      nextCount > 0 ? soloRatings.reduce((sum, rating) => sum + rating, 0) / nextCount : null
    if (detail?.soloScore) {
      detail.soloScore.soloReviewCount = nextCount
      detail.soloScore.soloRating = nextRating
    }
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

function defaultPlaceSummary(type: string) {
  switch (type) {
    case 'RESTAURANT':
      return '혼자 식사하기 좋은 사용자 추천 식당'
    case 'CAFE':
      return '혼자 머물기 좋은 사용자 추천 카페'
    case 'NATURE':
      return '혼자 걷기 좋은 사용자 추천 산책 장소'
    case 'CULTURE':
      return '혼자 둘러보기 좋은 사용자 추천 문화 공간'
    case 'STAY':
      return '혼자 쉬기 좋은 사용자 추천 숙소'
    default:
      return '사용자가 추천한 혼행 장소'
  }
}

export function createMockPlace(request: CreatePlaceRequest): CreatePlaceResponse {
  const newPlaceId = Date.now()
  const typeUpper = (request.type || 'ATTRACTION').toUpperCase()
  const rating = request.rating ?? 4.5
  const firstSoloRating = request.firstReviewSoloRating ?? rating
  const firstReviewContent =
    request.firstReviewContent || request.soloTip || '혼자 방문하기 좋아서 추천해요.'
  const selectedTags = mockReviewTags.filter((tag) =>
    (request.firstReviewTagIds ?? []).includes(tag.reviewTagId),
  )

  const summary: ApiPlaceSummary = {
    placeId: newPlaceId,
    name: request.name,
    type: typeUpper,
    rating,
    soloScore: 0,
    scoreStatus: 'PENDING',
    soloRating: firstSoloRating,
    soloReviewCount: 1,
    summary: request.summary ?? defaultPlaceSummary(typeUpper),
    latitude: request.latitude,
    longitude: request.longitude,
    soloFriendlyBadge: request.soloFriendlyBadge ?? true,
    thumbnailUrl:
      request.thumbnailUrl ||
      `https://picsum.photos/seed/user-place-${newPlaceId.toString()}/480/480`,
    distanceM: 200,
    isLiked: false,
  }

  // 최상단에 새 장소 추가
  mockPlaces.unshift(summary)

  mockDetails[newPlaceId] = {
    placeId: newPlaceId,
    name: request.name,
    type: typeUpper,
    rating,
    summary: summary.summary,
    address: request.address,
    priceLevel: request.priceLevel ?? '₩₩',
    businessVerified: false,
    soloFriendlyBadge: request.soloFriendlyBadge ?? true,
    soloScore: {
      soloScore: 0,
      scoreStatus: 'PENDING',
      soloRating: firstSoloRating,
      soloReviewCount: 1,
    },
    soloInfo: {
      hasSoloSeat: request.hasSoloSeat ?? true,
      hasSoloMenu: request.hasSoloMenu ?? true,
      hasBarTable: false,
      quietLevel: '0.80',
      soloSeatStatus: 'UNVERIFIED',
      cautionNote: request.soloTip || null,
    },
    soloTagSummaries: selectedTags.map((tag) => ({
      tagId: tag.reviewTagId,
      name: tag.tagName,
      positiveCount: 1,
      negativeCount: 0,
    })),
    analysisTags: selectedTags.length > 0 ? selectedTags.map((tag) => tag.tagName) : ['사용자 추천 장소'],
    isLiked: false,
  }

  mockReviews[newPlaceId] = [
    {
      reviewId: Date.now() + 1,
      userId: 999,
      rating,
      visitedAlone: true,
      soloRating: firstSoloRating,
      contents: firstReviewContent,
      tags: selectedTags.map((tag) => tag.tagName),
      createdAt: new Date().toISOString(),
    },
  ]

  return {
    placeId: newPlaceId,
    name: request.name,
    type: typeUpper,
    address: request.address,
    latitude: request.latitude,
    longitude: request.longitude,
    summary: summary.summary,
    rating: summary.rating ?? undefined,
    soloFriendlyBadge: summary.soloFriendlyBadge,
    thumbnailUrl: summary.thumbnailUrl ?? undefined,
    createdAt: new Date().toISOString(),
  }
}

export function setMockPlaceLiked(placeId: number, isLiked: boolean) {
  const detail = mockDetails[placeId]
  const summary = mockPlaces.find((place) => place.placeId === placeId)
  if (detail) detail.isLiked = isLiked
  if (summary) summary.isLiked = isLiked
  return { placeId, isLiked }
}
