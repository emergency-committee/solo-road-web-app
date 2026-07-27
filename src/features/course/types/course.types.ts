export interface GenerateCourseRequest {
  region: string
  startDate: string
  endDate: string
  startPointName?: string
  startLatitude?: number
  startLongitude?: number
  preferredMood?: string
  safetyPriority?: boolean
}

export interface GeneratedStop {
  stopOrder: number
  placeId: number
  stayDurationMinutes?: number
}

export interface GenerateCourseResponse {
  courseId: number
  title: string
  stops: GeneratedStop[]
}
