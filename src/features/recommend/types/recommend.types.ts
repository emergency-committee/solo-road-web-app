export interface RecommendRequest {
  location: string
  preferences?: string[]
  travel_style?: string
  budget_level?: '저예산' | '중간' | '고급'
  count?: number
}

export interface PlaceItem {
  name: string
  category: string
  description: string
  address: string
  tip: string
}

export interface RecommendResponse {
  location: string
  places: PlaceItem[]
  total: number
}
