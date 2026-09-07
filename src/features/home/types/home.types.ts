import type { PlaceImagePlaceholderVariant } from '@/shared/components/PlaceImagePlaceholder'

export interface HomePlaceCardData {
  id: string
  title: string
  /** 등록된 이미지가 없으면 null. */
  imageUrl: string | null
  imageAlt: string
  placeholderVariant?: PlaceImagePlaceholderVariant
  subtitle: string
  badges: { label: string; tone: 'primary' | 'secondary' }[]
  hasImage: boolean
}
