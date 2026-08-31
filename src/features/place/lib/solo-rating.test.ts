import { describe, expect, it } from 'vitest'
import { hasDisplayableSoloRating, soloRatingMessage } from './solo-rating'

describe('solo rating presentation', () => {
  it('presents a public rating when a precomputed solo score exists', () => {
    expect(hasDisplayableSoloRating(5, 0)).toBe(true)
    expect(hasDisplayableSoloRating(null, 8)).toBe(false)
  })

  it('uses plain-language descriptions without exposing internal grades', () => {
    expect(soloRatingMessage(4.2, 8)).toBe('혼자 식사하기 편한 곳이에요')
    expect(soloRatingMessage(3.4, 8)).toBe('무난하게 혼밥할 수 있어요')
    expect(soloRatingMessage(2.7, 8)).toBe('방문 전 혼밥 후기를 확인해 보세요')
  })

  it('uses travel wording for non-dining places', () => {
    expect(soloRatingMessage(4.5, 8, 'travel')).toBe('혼자 둘러보기 좋은 곳이에요')
    expect(soloRatingMessage(3.4, 8, 'travel')).toBe('혼자 방문하기 무난해요')
  })
})
