export interface CourseStop {
  id: string
  time: string
  durationLabel: string
  title: string
  subtitle: string
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
  stops: CourseStop[]
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
