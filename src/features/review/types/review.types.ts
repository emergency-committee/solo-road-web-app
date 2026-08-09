export interface Review {
  id: string
  placeId: number
  placeName: string
  rating: number
  content: string
  location?: string
  dateLabel?: string
  tag?: { label: string; tone: 'primary' | 'secondary' }
  imageUrl?: string
  imageAlt?: string
}

/** GET /api/v1/users/me/reviews 응답 아이템. */
export interface ApiMyReview {
  reviewId: number
  placeId: number
  placeName: string
  rating: number
  contents: string
}
