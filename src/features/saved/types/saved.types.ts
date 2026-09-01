/** GET /api/v1/users/me/saved-places 응답 아이템. */
export interface ApiSavedPlace {
  placeId: number
  name: string
  type: string
  rating?: number | null
  soloScore?: number | null
  scoreStatus?: 'PENDING' | 'DONE' | null
  soloRating?: number | null
  soloReviewCount: number
  summary?: string
  latitude: number
  longitude: number
  thumbnailUrl?: string
  soloFriendlyBadge: boolean
}
