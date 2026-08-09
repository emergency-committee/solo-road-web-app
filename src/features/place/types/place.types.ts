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
  rating?: number
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

export interface ApiPlaceDetail {
  placeId: number
  name: string
  type: string
  rating?: number
  address?: string
  priceLevel?: string
  businessVerified: boolean
  soloFriendlyBadge: boolean
  soloScore?: ApiSoloScoreSummary
  soloInfo?: ApiSoloInfoSummary
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
  contents: string
  tags: string[]
  createdAt: string
}
