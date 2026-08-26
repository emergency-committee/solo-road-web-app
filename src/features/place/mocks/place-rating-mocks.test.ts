import { describe, expect, it } from 'vitest'
import { getMockPlaces } from './place-rating-mocks'

describe('혼밥지도 데모 장소 필터', () => {
  it('식당과 카페 타입을 각각 분리한다', () => {
    const restaurants = getMockPlaces({ type: 'RESTAURANT' }).content
    const cafes = getMockPlaces({ type: 'CAFE' }).content

    expect(restaurants).not.toHaveLength(0)
    expect(restaurants.every((place) => place.type === 'RESTAURANT')).toBe(true)
    expect(cafes).toHaveLength(1)
    expect(cafes[0]?.type).toBe('CAFE')
  })

  it('혼밥 편한 곳에는 검증 기준을 통과한 장소만 포함한다', () => {
    const places = getMockPlaces({ soloFriendlyOnly: true }).content

    expect(places).not.toHaveLength(0)
    expect(places.every((place) => place.soloFriendlyBadge)).toBe(true)
  })
})
