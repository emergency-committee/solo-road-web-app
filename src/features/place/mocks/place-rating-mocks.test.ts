import { describe, expect, it } from 'vitest'
import { createMockPlace, getMockPlaces, getMockReviewTags } from './place-rating-mocks'

describe('혼행/혼밥 지도 장소 필터 및 장소 등록', () => {
  it('식당, 카페, 명소, 자연, 문화 카테고리를 올바르게 필터링한다', () => {
    const restaurants = getMockPlaces({ type: 'RESTAURANT' }).content
    const cafes = getMockPlaces({ type: 'CAFE' }).content
    const attractions = getMockPlaces({ type: 'ATTRACTION' }).content
    const nature = getMockPlaces({ type: 'NATURE' }).content
    const culture = getMockPlaces({ type: 'CULTURE' }).content

    expect(restaurants.length).toBeGreaterThan(0)
    expect(restaurants.every((p) => p.type === 'RESTAURANT')).toBe(true)

    expect(cafes.length).toBeGreaterThan(0)
    expect(cafes.every((p) => p.type === 'CAFE')).toBe(true)

    expect(attractions.length).toBeGreaterThan(0)
    expect(attractions.every((p) => p.type === 'ATTRACTION')).toBe(true)

    expect(nature.length).toBeGreaterThan(0)
    expect(nature.every((p) => p.type === 'NATURE')).toBe(true)

    expect(culture.length).toBeGreaterThan(0)
    expect(culture.every((p) => p.type === 'CULTURE')).toBe(true)
  })

  it('혼밥/혼행 편한 곳 필터링 시 뱃지가 있는 장소만 반환한다', () => {
    const places = getMockPlaces({ soloFriendlyOnly: true }).content

    expect(places).not.toHaveLength(0)
    expect(places.every((place) => place.soloFriendlyBadge)).toBe(true)
  })

  it('장소 유형에 맞춰 혼밥 태그와 혼행 태그를 나눠 제공한다', () => {
    const diningTags = getMockReviewTags('dining')
    const travelTags = getMockReviewTags('travel')

    expect(diningTags).not.toHaveLength(0)
    expect(travelTags).not.toHaveLength(0)
    expect(diningTags.every((tag) => tag.tagType !== 'SOLO_TRAVEL')).toBe(true)
    expect(travelTags.every((tag) => tag.tagType === 'SOLO_TRAVEL')).toBe(true)
  })

  it('새로운 혼행/혼밥 장소를 추천 등록하면 목록 최상단에 추가된다', () => {
    const created = createMockPlace({
      name: '나만의 비밀 힐링숲',
      type: 'NATURE',
      address: '서울특별시 강남구 테헤란로 123',
      latitude: 37.5012,
      longitude: 127.0398,
      soloTip: '혼자 조용히 산책하기 최고예요',
    })

    expect(created.placeId).toBeDefined()
    expect(created.name).toBe('나만의 비밀 힐링숲')

    const allPlaces = getMockPlaces().content
    expect(allPlaces[0]?.name).toBe('나만의 비밀 힐링숲')
  })
})
