import { hasDisplayableSoloRating } from '@/features/place/lib/solo-rating'
import type { MapMarkerData, MapRatingMode } from '../types/map.types'

export function getMapMarkerRating(marker: MapMarkerData, mode: MapRatingMode) {
  if (mode === 'general') return marker.rating ?? null
  return hasDisplayableSoloRating(marker.soloRating, marker.soloReviewCount)
    ? marker.soloRating!
    : null
}
