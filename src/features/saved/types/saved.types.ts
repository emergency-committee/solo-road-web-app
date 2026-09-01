/** GET /api/v1/users/me/saved-places 응답 아이템. */
export interface ApiSavedPlace {
  placeId: number
  name: string
  type: string
  thumbnailUrl?: string
  soloFriendlyBadge: boolean
}
