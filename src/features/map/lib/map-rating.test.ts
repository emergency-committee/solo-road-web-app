import { describe, expect, it } from 'vitest'
import type { MapMarkerData } from '../types/map.types'
import { getMapMarkerRating } from './map-rating'

const marker: MapMarkerData = {
  id: '1',
  name: '테스트 식당',
  icon: 'restaurant',
  lat: 37.5,
  lng: 127,
  imageUrl: '',
  imageAlt: '테스트 식당',
  distanceLabel: '100m',
  rating: 4.1,
  soloRating: 4.7,
  soloReviewCount: 8,
  tags: [],
}

describe('지도 마커 평점 표시', () => {
  it('혼밥 모드에서는 혼밥 평점을 표시한다', () => {
    expect(getMapMarkerRating(marker, 'solo')).toBe(4.7)
  })

  it('일반 모드에서는 일반 평점을 표시한다', () => {
    expect(getMapMarkerRating(marker, 'general')).toBe(4.1)
  })

  it('혼행 점수가 없으면 혼행 평점을 숨긴다', () => {
    expect(getMapMarkerRating({ ...marker, soloRating: null, soloReviewCount: 8 }, 'solo')).toBeNull()
  })
})
