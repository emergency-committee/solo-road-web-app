export interface HomePlaceCardData {
  id: string
  title: string
  imageUrl: string
  imageAlt: string
  subtitle: string
  badges: { label: string; tone: 'primary' | 'secondary' }[]
}
