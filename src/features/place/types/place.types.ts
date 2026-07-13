export interface PlaceSummary {
  id: string
  name: string
  category: string
  imageUrl: string
  imageAlt: string
  address: string
  tags: string[]
}

export interface PlaceHighlight {
  icon: 'seat' | 'menu' | 'quiet'
  label: string
}

export interface PlaceDetail extends PlaceSummary {
  distanceLabel: string
  soloFriendliness: 'High' | 'Medium' | 'Low'
  hashtags: string[]
  highlights: PlaceHighlight[]
  recommenderCount: number
}
