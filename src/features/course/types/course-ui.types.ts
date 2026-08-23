export interface CourseStop {
  id: string
  placeId: number
  dayNumber: number
  stayDurationMinutes?: number
  time?: string
  durationLabel: string
  title: string
  subtitle?: string
  memo?: string
  latitude?: number
  longitude?: number
  imageUrl: string
  imageAlt: string
  badges?: { label: string; tone: 'primary' | 'success' }[]
}

export interface DemoCourseStop {
  id: string
  time: string
  durationLabel: string
  title: string
  subtitle: string
  latitude: number
  longitude: number
  imageUrl: string
  imageAlt: string
  badges?: { label: string; tone: 'primary' | 'success' }[]
}

export interface CourseDetail {
  id: string
  title: string
  dateLabel: string
  totalDistanceLabel: string
  mapImageUrl: string
  mapImageAlt: string
  badges: string[]
  stops: DemoCourseStop[]
}

export interface RecommendedCourse {
  id: string
  title: string
  location: string
  imageUrl: string
  imageAlt: string
  durationLabel: string
  badges: { label: string; tone: 'primary' | 'secondary' }[]
  saved: boolean
}

export interface SavedCourseRow {
  id: string
  title: string
  location: string
  imageUrl: string
  imageAlt: string
}
