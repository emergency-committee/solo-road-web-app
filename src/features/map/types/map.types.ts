export interface MapMarkerData {
  id: string
  name: string
  icon: 'coffee' | 'park'
  top: string
  left: string
  imageUrl: string
  imageAlt: string
  distanceLabel: string
  rating: number
  reviewCount: number
  tags: { label: string; tone: 'primary' | 'secondary' }[]
}
