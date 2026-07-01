export interface CourseRequest {
  location: string
  date: string
  theme?: string
  start_time?: string
  transport?: '대중교통' | '렌터카' | '도보'
  places?: string[]
}

export interface SSEMessageData {
  content: string
  done: boolean
}
