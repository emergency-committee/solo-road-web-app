export interface Review {
  id: string
  placeName: string
  location: string
  dateLabel: string
  rating: number
  tag: { label: string; tone: 'primary' | 'secondary' }
  content: string
  imageUrl?: string
  imageAlt?: string
}
