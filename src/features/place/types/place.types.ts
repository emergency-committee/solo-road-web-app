export interface PlaceHighlight {
  icon: 'seat' | 'menu' | 'quiet'
  label: string
}

// --- solo_road_server 응답 DTO (GET /api/v1/places*) ---

export interface ApiSoloDiningItem {
  placeId: number
  name: string
  distanceM?: number
  soloFriendlyBadge: boolean
  tags: string[]
}

export interface ApiHiddenGemItem {
  placeId: number
  name: string
  type: string
}

export interface ApiPlaceRecommendations {
  soloDining: ApiSoloDiningItem[]
  hiddenGems: ApiHiddenGemItem[]
}

export interface ApiPlaceSummary {
  placeId: number
  name: string
  type: string
  /** 아직 리뷰가 없는 장소는 백엔드가 null로 내려준다(필드 자체가 빠지지 않음). */
  rating?: number | null
  soloRating?: number | null
  soloReviewCount: number
  summary?: string
  latitude: number
  longitude: number
  soloFriendlyBadge: boolean
  thumbnailUrl?: string | null
  distanceM?: number | null
  isLiked?: boolean
}

export interface ApiPlacesParams {
  type?: string
  keyword?: string
  bbox?: string
  lat?: number
  lng?: number
  radius?: number
  soloFriendlyOnly?: boolean
  sort?: string
  page?: number
  size?: number
}

export interface ApiSoloScoreSummary {
  soloScore?: number
  grade: 'HIGH' | 'MEDIUM' | 'LOW'
  soloRating?: number | null
  seatScore?: number
  safetyScore?: number
  soloReviewCount: number
}

export interface ApiSoloInfoSummary {
  hasSoloSeat?: boolean
  hasSoloMenu?: boolean
  hasBarTable?: boolean
  quietLevel?: string
  soloSeatStatus?: string
}

export interface ApiSoloTagSummary {
  tagId: number
  name: string
  positiveCount: number
  negativeCount: number
}

export interface ApiPlaceDetail {
  placeId: number
  name: string
  type: string
  /** 아직 리뷰가 없는 장소는 백엔드가 null로 내려준다(필드 자체가 빠지지 않음). */
  rating?: number | null
  address?: string
  priceLevel?: string
  businessVerified: boolean
  soloFriendlyBadge: boolean
  soloScore?: ApiSoloScoreSummary
  soloInfo?: ApiSoloInfoSummary
  soloTagSummaries: ApiSoloTagSummary[]
  analysisTags: string[]
  isLiked: boolean
}

export interface ApiLikeResponse {
  placeId: number
  isLiked: boolean
}

export interface ApiReview {
  reviewId: number
  userId: number
  rating: number
  visitedAlone: boolean | null
  soloRating: number | null
  contents: string
  tags: string[]
  createdAt: string
}

export interface ApiReviewTag {
  reviewTagId: number
  tagName: string
  tagType: string
  description?: string | null
}

export interface CreatePlaceReviewRequest {
  rating: number
  contents: string
  visitedAlone?: boolean
  soloRating?: number
  tagIds: number[]
}

export interface CreatePlaceReviewResponse {
  reviewId: number
  placeId: number
  rating: number
  visitedAlone: boolean | null
  soloRating: number | null
  contents: string
  createdAt: string
}
