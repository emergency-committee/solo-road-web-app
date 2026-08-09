export interface CourseStop {
  id: string
  placeId: number
  stayDurationMinutes?: number
  time?: string
  durationLabel: string
  title: string
  subtitle?: string
  imageUrl: string
  imageAlt: string
  badges?: { label: string; tone: 'primary' | 'success' }[]
}

